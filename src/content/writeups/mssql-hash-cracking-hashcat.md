---
title: 'Cracking an MSSQL Hash with Hashcat, and Why Your GPU Vanishes Inside a VM'
date: 2026-05-09
summary: 'A captured MSSQL login hash, a wordlist that runs dry, and the methodical climb from rockyou to rules to masks to a length-bounded brute force, plus the VMware gotcha that drops you to CPU-only and triples your crack time.'
platform: TryHackMe
difficulty: Medium
tags: ['password-cracking', 'hashcat', 'mssql', 'gpu', 'fundamentals']
draft: false
---

## TL;DR

You've pulled a SQL Server login hash out of a lab box and you want the plaintext. Two things decide whether this goes well: **identifying the hash correctly** so Hashcat uses the right mode, and **having a real GPU** so you can iterate. Both have a sharp edge.

The hash mode is keyed off the value's prefix. An MSSQL hash starting `0x0200` is SQL Server 2012-or-later and cracks under **`-m 1731`**. Get that wrong and Hashcat runs happily and never cracks anything. Then, when `rockyou.txt` runs dry, "exhausted" means "not a common password" rather than "uncrackable," and you climb a ladder: rules, masks, hybrid, bigger lists, a target-specific wordlist, and finally a length-bounded brute force when you know roughly how long the password is.

The trap underneath all of it: I was running Kali inside **VMware Workstation**, and `hashcat -I` showed no real GPU. Workstation doesn't pass your physical card through. You get a virtual display adapter, not CUDA. Everything was crawling on CPU. The fix was to stop fighting the hypervisor and run the crack on the host with the actual GPU.

> **Authorized use only.** This is methodology from authorized lab and CTF practice. Every hash and plaintext here is redacted or a placeholder. Don't run password attacks against systems you don't own or aren't explicitly permitted to test.

---

## Identify before you attack

The single most common way to waste an evening is to point Hashcat at a hash with the wrong mode. It won't error. It'll churn through the whole keyspace and crack nothing, because it's hashing candidates with the wrong algorithm.

MSSQL hashes announce themselves by prefix:

- `0x0100…` is SQL Server **2000/2005** (SHA-1, with the salt). Hashcat mode **`-m 132`** (or `-m 131` for the older uppercased variant).
- `0x0200…` is SQL Server **2012 and later** (SHA-512). Hashcat mode **`-m 1731`**.

The hash in front of me started `0x0200`, so this was a modern SHA-512 MSSQL hash → `-m 1731`. When in doubt, let Hashcat show you the canonical shape:

```bash
attacker@kali$ hashcat --example-hashes | grep -i mssql -A 5
```

If your hash file pairs a username with the hash, the natural `sa:0x0200…` shape you get from dumping logins, tell Hashcat so it doesn't try to crack the username as part of the hash:

```bash
attacker@kali$ hashcat -m 1731 hash.txt rockyou.txt --username
```

And before committing hours to any attack, confirm Hashcat actually parsed the line. `--left` lists hashes that loaded but aren't cracked yet, so it proves the format parses:

```bash
attacker@kali$ hashcat -m 1731 hash.txt --left
```

If the hash loads without a token-length or parse error, the format is good. (`--show` only prints hashes already cracked into the potfile, so on an uncracked hash it shows nothing.) If Hashcat complains the line won't parse, fix the file before you burn a single GPU-hour.

---

## "Exhausted" is a starting point, not a verdict

The first pass is always the same:

```bash
attacker@kali$ hashcat -m 1731 hash.txt /usr/share/wordlists/rockyou.txt
...
Status...........: Exhausted
```

`Exhausted` on rockyou tells you one thing: the password isn't a straight dictionary word from the most famous leaked list. That rules out the easy 90% and points you at the climb. Each rung adds keyspace in the direction real passwords tend to live.

### Rung 1: rules

Rules mutate every dictionary word (capitalise, append digits, leetspeak) on the fly. `best64` is the cheap, high-yield default; `OneRuleToRuleThemAll` and `dive` are heavier and broader:

```bash
attacker@kali$ hashcat -m 1731 hash.txt rockyou.txt -r /usr/share/hashcat/rules/best64.rule
attacker@kali$ hashcat -m 1731 hash.txt rockyou.txt -r /usr/share/hashcat/rules/rockyou-30000.rule
attacker@kali$ hashcat -m 1731 hash.txt rockyou.txt -r /usr/share/hashcat/rules/dive.rule
```

### Rung 2: masks for the corporate shape

So many real passwords are `Capital + lowercase + digits + symbol` that it's worth a dedicated mask attack. `Summer123!` fits this pattern:

```bash
# Capital, five lowercase, three digits, bang, the Summer123! shape
attacker@kali$ hashcat -m 1731 hash.txt -a 3 '?u?l?l?l?l?l?d?d?d!'
```

### Rung 3: hybrid

Hybrid attacks bolt a mask onto each dictionary word, the "word plus year plus symbol" habit:

```bash
attacker@kali$ hashcat -m 1731 hash.txt -a 6 rockyou.txt '?d?d?d?d!'   # word + 2025!
attacker@kali$ hashcat -m 1731 hash.txt -a 7 '?u' rockyou.txt          # Capital + word
```

### Rung 4: better and more targeted wordlists

rockyou is one leaked list. SecLists ships much larger and better-ranked ones:

```bash
attacker@kali$ sudo apt install seclists
attacker@kali$ hashcat -m 1731 hash.txt \
    /usr/share/seclists/Passwords/Common-Credentials/10-million-password-list-top-1000000.txt \
    -r /usr/share/hashcat/rules/best64.rule
```

The highest-yield list of all is the one you build from the target. Pull usernames, the company name, hostnames, database names, and words off the app's own pages into a custom file, then mutate it:

```bash
attacker@kali$ hashcat -m 1731 hash.txt custom.txt -r /usr/share/hashcat/rules/best64.rule
```

### Rung 5: length-bounded brute force

Sometimes you learn the length from a policy hint, a leaked mask, or a password manager that shows the field length. Here I had reason to believe the secret was **10–13 lowercase characters**. That's a finite keyspace you can grind directly, walking the lengths with `--increment` instead of running four separate masks:

```bash
attacker@kali$ hashcat -m 1731 hash.txt -a 3 '?l?l?l?l?l?l?l?l?l?l?l?l?l' \
    --increment --increment-min 10 --increment-max 13 -w 3
```

`-w 3` turns the workload up. Add `--status --status-timer=10` for periodic progress (or press `s` in the running session); `hashcat -m 1731 hash.txt --show` prints the plaintext once it falls. And this is exactly the rung where the next problem bit me, because brute force over four lengths of `?l` is only tolerable on a GPU.

---

## The real wall: no GPU inside VMware Workstation

A length-10-to-13 lowercase brute force is a vast keyspace, on the order of a quintillion candidates (26^10 alone is ~140 trillion). That's a run you only attempt on a GPU; on CPU it's a different unit of time entirely. Mine was crawling, so I checked what Hashcat could actually see:

```bash
attacker@kali$ hashcat -I
...
Backend Device ID #1
  Type...........: CPU
  Name...........: ...
# no NVIDIA device listed
```

No GPU. The Kali VM was running under **VMware Workstation Pro**, and Workstation does **not** do PCIe passthrough. It exposes a *virtual* SVGA display adapter for desktop 3D, but it never hands the guest your physical NVIDIA card for CUDA/OpenCL compute. You can tick "Accelerate 3D graphics" and install `mesa-utils` all day; `hashcat -I` will still only ever show CPU and a virtual adapter. That's a design limit of the hypervisor, not a missing driver.

Three ways out, easiest first:

1. **Crack on the host.** Keep Kali for recon and just move the hash over. Install the NVIDIA driver and Hashcat for Windows, confirm the card with `hashcat.exe -I`, and run the attack natively on the real GPU. This is the fast, low-friction answer and the one I took.
2. **Dual-boot Linux on bare metal.** `sudo apt install nvidia-driver nvidia-cuda-toolkit`, reboot, verify with `nvidia-smi` and `hashcat -I`. The GPU is owned directly, no hypervisor in the way.
3. **Use a hypervisor that *does* pass GPUs through.** This is the home-lab answer. Proxmox or ESXi support VMDirectPath / PCIe passthrough, so a VM can take full ownership of the card. For GPU compute you want a Type-1 hypervisor, not Workstation. (It's the kind of thing the [home lab](/lab/home-lab-overview) exists to let you try.)

This applies past Hashcat. Any GPU-bound workload, whether model inference, transcoding, or CUDA anything, runs CPU-only inside Workstation. Always run `hashcat -I` (or `nvidia-smi`) and confirm the accelerator is *there* before you conclude a job is slow. Half the time "slow" is really "running on the wrong processor."

---

## Detect and prevent

The crack only works because the password was guessable inside a finite keyspace. Defence is about pushing the password out of reach and not leaking the hash in the first place.

- **Length beats everything.** Every rung above (rules, masks, increment) collapses the moment the secret is long and random. A 16-character random `sa` password makes a `?l`-style brute force computationally pointless; a 9-character one is an afternoon. If you set one control, set a length floor.
- **Prefer Windows/AD authentication over SQL logins.** Mixed-mode SQL auth with a weak `sa` password is the classic foothold. Integrated auth removes the standalone hash entirely.
- **Treat the `sa` account as radioactive.** Rename or disable it, give it a long random secret, and don't reuse it across instances. A cracked `sa` is usually game over for the database, and frequently the host, via `xp_cmdshell`.
- **Don't expose 1433.** TCP 1433 reachable from anywhere untrusted turns an offline cracking exercise into an online one against your production server. Firewall it to the app tier.
- **Detection:** alert on dumps of `sys.sql_logins`/`master..syslogins`, on `xp_cmdshell` being enabled, and on bursts of failed `sa` logins. The hash leaving the database is the event that makes everything in this writeup possible, so that's the thing to catch.

---

## Takeaways

- **Identify the hash before you attack it.** `0x0200` → MSSQL 2012+ → `-m 1731`; `0x0100` → 2005 → `-m 132`. Wrong mode means a clean run that cracks nothing.
- **Prove the format with `--show` first**, and use `--username` when the file is `user:hash`. Five seconds here saves hours of a misparse running silently.
- **"Exhausted" just means keep climbing.** Climb deliberately: rules → masks → hybrid → bigger lists → a target-specific list → length-bounded brute force.
- **Confirm the GPU is real.** `hashcat -I`. VMware Workstation gives you a virtual adapter, not your card. GPU compute belongs on the host, on bare metal, or on a passthrough-capable hypervisor like Proxmox.
- **On the defensive side, length is the control that makes all of this moot.** Long random secrets turn a tractable keyspace into an intractable one.
