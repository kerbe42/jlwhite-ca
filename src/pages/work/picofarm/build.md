---
layout: ../../../layouts/Doc.astro
title: "PicoFarm revision B: build instructions"
description: "A step-by-step build of one revision B controller on two 9 × 15 cm protoboards, from the first solder joint to a calibrated controller, written for a first build. Nine stages, each ending with a meter check."
---

The circuit is described on the [PicoFarm page](/work/picofarm). The drawings and the [wire lists](/work/picofarm/wire-lists) used here are generated from the same netlists as the printed boards, and the tool that draws them refuses to unless every pin is on its net.

## How to use this guide

You build one controller in nine stages, about six evenings for a first build. Every stage ends with a check. Don't start the next stage, and don't power anything, until that check passes. Build the second controller only after the first passes all of them.

| Stage | Section | Rough time | Done when |
| --- | --- | --- | --- |
| 1 | Tools and workspace | 30 min | everything on the list is on the bench |
| 2 | Check the parts | 1 h | every part passes its meter check |
| 3 | Soldering practice | 30 min | ten good joints and one clean bare run on a spare board |
| 4 | Main board | 2-3 evenings | the resistance checks pass with nothing plugged in |
| 5 | Panel board | 1 evening | its resistance checks pass |
| 6 | Lid | 1 evening | each toggle and the knob read right on the meter |
| 7 | First power-up, flashing, fitting the chips | 1 evening | the controller boots, finds its chips and closes the relay |
| 8 | Bench checks | 1 evening | E-stop, toggles, alarms and supplies behave as listed |
| 9 | Sensors, pumps and calibration, then the box | 1-2 evenings | pH, EC, level and pumps read right; the box is closed |

**Keep these open beside you** (every drawing is also shown in the stage that uses it):

- The [wire lists](/work/picofarm/wire-lists), printed so you can tick off each line: one for the main board and one for the panel board.
- The board drawings: main board [top](/media/picofarm/revb/main/board-top.svg), [top with the modules lifted](/media/picofarm/revb/main/board-top-open.svg), [bottom](/media/picofarm/revb/main/board-bottom.svg) and [bottom guide](/media/picofarm/revb/main/board-bottom-guide.svg); panel board [top](/media/picofarm/revb/panel/board-top.svg), [top with the modules lifted](/media/picofarm/revb/panel/board-top-open.svg), [bottom](/media/picofarm/revb/panel/board-bottom.svg) and [bottom guide](/media/picofarm/revb/panel/board-bottom-guide.svg). Open a drawing on its own to zoom in on the hole labels.
- The [lid wiring drawing](/media/picofarm/revb/lid-wiring.svg): every lead between the boards, the toggles, the knob, the E-stop and the display.

**How holes are named.** A hole is its row letter plus its column number, seen from the component side: L4 is row L, column 4. Hole A1 is the top-left corner. The main board uses columns 1-53 and rows A-AG; the panel board uses columns 1-52 and rows A-AF. When you flip a board over, column 1 is on your right. The bottom drawings are already mirrored to match.

**Words used in this guide:**

- **Component side:** the side the parts stand on. **Solder side:** the other side, where the wiring goes.
- **Bare run (B1, B2…):** a tinned wire with no insulation, laid along a line of holes on the solder side.
- **Insulated wire (W1, W2…):** a coloured 22 AWG wire on the solder side. It may cross a bare run.
- **Hidden wire (T1, T2):** a wire on the component side, under a module.
- **Pin 1:** in the wire list, a diode's pin 1 is its banded end (cathode), an electrolytic capacitor's pin 1 is its + lead, and a chip's pin 1 is next to its notch or dot.

The values in this guide include the 29 October review: fuse F2 is 1.6 A and panel capacitor C5 is 1 nF.

## Stage 1: tools and a safe bench

You need a temperature-controlled iron and a multimeter with a continuity beep; everything else makes the job easier.

| Tool | What to get | Why |
| --- | --- | --- |
| Soldering iron | temperature-controlled, 60 W or more, a 2 mm chisel tip | set 340 °C for leaded solder, 370 °C for lead-free |
| Solder | 0.8 mm rosin-core; 63/37 leaded is the easiest to learn with | thin solder makes small joints, and the boards have many close neighbours |
| Flux pen | no-clean rosin flux | makes solder flow; rescues a dull joint |
| Tip cleaner | brass wool in a holder | keeps the tip shiny; a wet sponge cools it |
| Multimeter | with a continuity beep and a 200 mA range | every check in this guide uses it |
| Flush cutters | small, sharp | cut leads close to the joint |
| Wire strippers | sized for 22 AWG | strips the hook-up wire without nicking it |
| Needle-nose pliers | small | bends leads and straightens wire |
| Board holder | helping hands or a PCB vise | holds the board while both hands work |
| Desoldering braid and a solder sucker | 2 mm braid | removes a bridge or a part in the wrong place |
| Drill bit 1.6 mm | in a pin vise or a hand drill | opens four holes for the big diodes |
| Fine marker, masking tape | | marks the row and column numbers on the board |
| Isopropyl alcohol (90 % or more), old toothbrush | | cleans flux off when a board is done |
| Heat gun or lighter | | shrinks the heat-shrink tubing |
| Epoxy or hot glue, cable ties | | holds the relay and strain-relieves the lid leads |

**Safety:**

- Work by an open window or with a small fan blowing the smoke away from your face.
- Wear safety glasses when you cut leads; the offcuts fly.
- Always put the iron back in its stand, and switch it off when you leave the bench.
- Wash your hands after using leaded solder, and keep food and drink off the bench.
- Touch a metal tap or a grounded case before you handle the ESP32 board and the chips. Store them in their bags until you fit them.
- Nothing in this build runs on mains voltage. The two USB chargers are the only things that plug into a wall socket, and they stay outside the box.

## Stage 2: check the parts before you solder anything

A wrong part found now costs nothing; found after soldering, it costs an evening. Sort the parts for one controller into a tray, then run these checks. "Beep" means the meter's continuity mode beeps (under about 30 Ω); "open" means it stays silent.

| Part | Check | Pass | If it fails |
| --- | --- | --- | --- |
| ESP32-S3 dev board | Read the pin labels down both rows. Left row from the antenna end: 3V3 3V3 RST 4 5 6 7 15 16 17 18 8 3 46 9 10 11 12 13 14 5V G. Right row: G 43 44 1 2 42 41 40 39 38 37 36 35 0 45 48 47 21 20 19 G G. | every label matches, and pin 15 of the right row is 45 | stop: the board needs a different layout |
| ESP32-S3 dev board | Stand it in the protoboard without soldering. | its two rows land exactly ten holes apart | a narrow-row board does not fit this layout |
| Relay K1 (SRD-05VDC-SL-C) | Meter on beep, no power on the coil. Find the lone offset pin (COM). Test COM to each of the two far pins. | one far pin beeps (that is NC), the other stays open (that is NO) | mark the pins with a marker now; if neither or both beep, use another relay |
| Relay K1 | Touch 5 V from a USB lead across the two pins nearest COM (the coil). | it clicks, and COM to NO now beeps | try another relay |
| D4184 module (circulation) | Module unpowered. Meter on its highest resistance range: the module's signal GND pin to DC−, and PWM to DC+. | both read open (over 1 MΩ) | don't use that module for circulation: a different module is needed |
| Display (3.5" ST7796) | Look at the back for a small 3- or 5-legged regulator marked 662K, XC6206 or AMS1117. Read the 14 header labels. | a regulator is there; pins read VCC GND CS RST DC SDI SCK LED SDO CTP_SCL CTP_RST CTP_SDA CTP_INT SD_CS | no regulator: don't connect it to 5 V; header pin 1 must move to 3.3 V first |
| E-stop (22 mm, NC) | Beep across its two contact screws, button released, then pressed. | released beeps, pressed is open | the contact block is the wrong type (NO); swap the block |
| Toggles (MTS-203) × 7 | For each lever position, find which outer lugs beep to each middle lug. | centre: nothing beeps; each end: each middle lug beeps to one outer lug | note the lug pattern; Stage 6 uses it |
| USB-C to 2-pin adapters × 2 | Meter on resistance: each CC pin (or the two tiny pads marked CC1, CC2) to GND. | about 5.1 kΩ each | without them a USB-C charger won't switch on: use USB-C breakouts that have them |
| Float switch | Hang it by its thread. Beep its two wires with the float down, then lifted. | it beeps with the float down and goes open when lifted | pull the clip, flip the float over on its stem, refit, test again |
| ADS1115 modules × 2 | Read the header: VDD GND SCL SDA ADDR ALRT A0 A1 A2 A3. | same order | the socket wiring would need to change |
| Protoboards | Count the holes along a long and a short edge. | 53 × 33 or more, plated on both sides | use a larger board and line it up on the top-left hole |
| 2-pin red/black wire | Cut the end and look. | many fine strands (stranded) | solid wire breaks in the lid hinge: use stranded 22 AWG for the lid leads |
| Resistors | Measure each value before you fit it (Stage 4 says which goes where). | within 1 % of its value | sort it back into the right bag |

**Pump current, if you have time now** (otherwise in Stage 8): run each pump from a USB lead through the meter on its 10 A range, then pinch its outlet tube for a second. A pump that draws more than 0.3 A while running must go on its own driver module, like circulation.

## Stage 3: soldering basics and a practice board

Spend 30 minutes on a spare protoboard first. Practice until your joints look like the good ones below.

**Making a joint:**

1. Push the lead through the hole and bend it out about 30° on the solder side so the part can't fall out.
2. Wipe the tip on the brass wool. Touch a little solder to it so it shines.
3. Hold the tip against both the pad and the lead for one second.
4. Feed solder into the joint on the side away from the tip, not onto the tip. Stop when the pad is covered (about 1 s).
5. Take the solder away, then the iron. Don't move the part for two seconds.
6. Cut the lead just above the solder with the flush cutters. Keep the longer offcuts: they make good short bare runs.

**What a good joint looks like:** a small shiny cone that wets both the pad and the lead, with the lead's outline visible. **Bad joints:** a dull grey blob (cold: add flux and reheat), a ball sitting on the lead without touching the pad (reheat the pad), or solder joining two neighbouring holes (a bridge: put braid on it, press the iron on the braid, lift both together).

**Making a bare run:**

1. Cut a length of the 22 AWG solid wire 10 mm longer than the run, strip all its insulation off, and pull it straight with two pliers.
2. Lay it along the holes named in the wire list, on the solder side. Bend it down into the end holes or around the end leads.
3. Solder one end, then the other, then every hole along the way where a part's lead or another run joins it.
4. Holes the run only passes over, with nothing joining there, need no solder.
5. Beep from end to end. Then beep the run against each neighbouring run: those must stay silent.

The wire lists warn that on the main board 103 pairs of different signals run bare in neighbouring holes. Keep every joint small and look at each one with a magnifier or your phone camera. A bridge there is the most common fault in this build.

**Polarity:** five kinds of part only work one way round. Check each against the drawing before you solder its second lead.

| Part | Mark on the part | Goes to |
| --- | --- | --- |
| Diodes (1N5822, 1N5819, BAT85) | a band at one end (the cathode) | the hole listed as pin 1 |
| Electrolytic capacitors (1000 µF) | a stripe of − signs down the can; the long lead is + | + (the long lead) into pin 1 |
| Chips in sockets (ULN2803A, MCP23017) | a notch or dot at one end of the socket and the chip | pin 1 as listed; the notch faces the same way |
| S8050 transistors | a flat face with the writing | flat face toward you, legs left to right: E, B, C = pins 1, 2, 3 |
| Buzzer | a + on the top, or the longer lead | pin 1 |

**Practice board, done when:** you have ten shiny joints, a 10-hole bare run that beeps end to end, and you have cleared one deliberate bridge with braid.

## Stage 4: the main board, in solder order

Work from the lowest parts to the tallest, so the board lies flat while you solder. Then lay the wiring on the solder side, where every joint is still in reach. Fit no module and no chip in this stage: only their sockets.

[![Main board, component side, with the modules lifted: every part, socket and hidden wire](/media/picofarm/revb/main/board-top-open.svg)](/media/picofarm/revb/main/board-top-open.svg)

### 4.1 Prepare the board

1. Component side up, hole A1 at the top left. Write the column numbers every five holes along the top and bottom edges, and the row letters every five rows down both sides. Do the same on the solder side, mirrored.
2. Drill four holes out to 1.6 mm for the big 1N5822 diodes, whose leads are too thick for normal holes: U48, R48, M47 and P47. Turn the bit by hand in a pin vise; don't tear the copper ring.
3. Solder a right-angle 1×10 male header onto each ADS1115 module, pins pointing away from the components. The module must lie flat on its socket with its components facing up.

### 4.2 Hidden wires (component side)

These two run under the ADS1115 modules, so they go first. Lay them flat against the board.

| Wire | Colour | Carries | From → to |
| --- | --- | --- | --- |
| T1 | yellow | 3.3 V | K28 → A28 |
| T2 | black | logic ground | J32 → B32 |

### 4.3 Resistors

Fit all of one value at a time. Measure each resistor first; the colours are a hint only (five bands, then a brown 1 % band). Resistors fit either way round. Bend the leads to the spacing, push the body flat on the board, then solder and cut.

| Value | Bands | Refs and holes |
| --- | --- | --- |
| 10 kΩ | brown black black red | R1 J33–F33, R21 G42–N42, R23 H40–N40, R25 I38–N38, R27 J36–N36, R35 W30–W26 |
| 20 kΩ | red black black red | R2 F31–J31, R20 O43–G43, R22 O41–H41, R24 O39–I39, R26 O37–J37 |
| 22 kΩ | red red black red | R28 U24–P24 |
| 33 kΩ | orange orange black red | R29 P25–U25 |
| 2.2 kΩ | red red black brown | R3 AA11–W11 |
| 3.3 kΩ | orange orange black brown | R4 U10–Y10 |
| 4.7 kΩ | yellow violet black brown | R5 E47–A47 |
| 220 kΩ | red red black orange | R6 Q1–M1 |
| 1 kΩ | brown black black brown | R10 U4–Q4, R34 S31–W31 |
| 100 Ω | brown black black black | R9 F48–F52, R11 A48–A52 |
| 33 Ω | orange orange black gold | R30 I7–I11, R31 H8–H12, R32 G9–G13, R33 F10–F14 (these sit under the ESP32 board) |

### 4.4 Diodes

The banded end goes in the first hole listed. Check every band before you solder the second lead.

**D1 and D2 stand on end.** Their holes are only 7.62 mm apart, less than the 1N5822's body. Stand the diode up over its band hole, banded end down, with that lead straight into the band hole. Bend the top lead over and down into the other hole, starting the bend at least 2 mm from the body. Leave about 3 mm under the body: they get warm if a supply is ever wired backwards.

| Ref | Type | Band (cathode) | Other end |
| --- | --- | --- | --- |
| D1 | 1N5822 (large, black) | U48 | R48 |
| D2 | 1N5822 | M47 | P47 |
| D4 | BAT85 (small, glass) | Z5 | W5 |
| D5 | BAT85 | AE6 | AB6 |
| D6 | BAT85 | AE7 | AB7 |
| D3 | 1N5819 | AD29 | AD32 |
| D8 | 1N5819 | U22 | X22 |
| D9 | 1N5819 | W37 | W34 |
| D10 | 1N5819 | AD45 | AD48 |
| D11 | 1N5819 | AD41 | AD44 |
| D12 | 1N5819 | AD37 | AD40 |
| D13 | 1N5819 | AD33 | AD36 |
| D14 | 1N5819 | AD21 | AD24 |

The BAT85 is glass and cracks if you bend its leads at the body. Hold the lead with pliers next to the body and bend beyond them.

### 4.5 Small capacitors (100 nF, either way round)

Use the 2.54 mm-lead ones where the two holes are side by side, and the 5 mm ones where there is a hole between them.

| Lead spacing | Refs and holes |
| --- | --- |
| 2.54 mm | C3 V24–W24, C4 Z51–AA51, C7 V7–V8, C9 P4–P3 |
| 5 mm | C5 V5–V3, C6 T6–T8, C8 B51–D51 |

### 4.6 Sockets

1. **ESP32 sockets:** two 1×22 female strips cut from the 40-way strips, in L1-L22 and B1-B22. To keep them straight, push both strips onto the ESP32 board's pins, set the whole thing into the holes, and solder only the two end pins of each strip. Lift the ESP32 board off, then solder the other pins.
2. **ADS1115 sockets:** two 1×10 female strips in A27-J27 and A35-J35. Line them up with a module the same way.
3. **ULN2803A socket (DIP-18):** pins in U12-U20 and X12-X20, with its notch at the column-20 end. Pin 1 is U20.

### 4.7 Fuses, big capacitors and the transistor

| Ref | Part | Holes | Watch |
| --- | --- | --- | --- |
| F1 | 2.5 A PTC (marked 250) | S51, U51 | either way round |
| F2 | 1.6 A PTC (marked 160) | M51, M49 | either way round; don't swap it with F1 |
| C1 | 1000 µF 16 V | + in U45, − in S45 | stripe away from U45 |
| C2 | 1000 µF 16 V | + in K49, − in I49 | stripe away from K49 |
| Q2 | S8050 | E X30, B X31, C X32 | flat face as in the drawing |

### 4.8 Headers and plugs

1. **Dupont headers** (straight male pins, cut from a 40-way strip):

    | Ref | For | Holes, pin 1 first |
    | --- | --- | --- |
    | J9 | ultrasonic (JSN-SR04T board) | AC10, AB10, AA10, Z10 |
    | J10 | pH board | M35, M34, M33 |
    | J11 | TDS board | M32, M31, M30 |
    | J12 | I2C spare | A43, B43, C43, D43 |
    | J13 | analog level spare | M27, M28, M29 |

2. **Panel header A:** a 15-pin straight male strip in column 24, rows A to O (A24-O24). Column 23, between it and the ESP32 sockets, stays empty.
3. **Panel single pins:** one male pin each in A17, X21, X25, X33, X37, X41, X45, P26, and a 3-pin strip in X47-X49.
4. **Pluggable terminal headers (5.08 mm, right-angle):** the opening where the plug goes in faces off the nearest board edge. Push each one flat before soldering; the plugs get pulled hard.

    | Ref | Label | Holes, pin 1 first |
    | --- | --- | --- |
    | J1 | PUMP IN | S53 (+), Q53 (−) |
    | J2 | LOGIC IN | M53 (+), O53 (−) |
    | J3 | E-STOP | U53, W53 |
    | J4 | LEAK | U1, S1 |
    | J5 | LOW | AA1, Y1, W1 |
    | J6 | HIGH | AC1, AE1, AG1 |
    | J7 | EMERG | AF9, AF7, AF5 |
    | J8 | TEMP | B53, D53, F53 |
    | J14 | pH UP | AF45, AF47 |
    | J15 | pH DN | AF41, AF43 |
    | J16 | NUTR A | AF37, AF39 |
    | J17 | NUTR B | AF33, AF35 |
    | J18 | FLOAT | AF25, AF27 |
    | J19 | REFILL | AF29, AF31 |
    | J20 | DRAIN | AF21, AF23 |
    | J21 | CIRC: two 2-pin headers butted together | Z53, AB53 and AD53, AF53 |

### 4.9 Bare runs (solder side)

The wire list has 117 bare runs, B1 to B117, each with its holes and length. Work down the list ten at a time. After each ten, beep every run end to end and against its neighbours, and tick them off on the printout. Lay the long ones (B21 is 124 mm) first in each group, so the short ones go on top where they join.

[![Main board, solder side: every bare run (B) and insulated wire (W) numbered](/media/picofarm/revb/main/board-bottom-guide.svg)](/media/picofarm/revb/main/board-bottom-guide.svg)

### 4.10 Insulated wires (solder side)

The wire list has 44 insulated wires, W1 to W44, each with its colour and holes. Lay them flat with square bends; strip 3 mm at each end. A wire may cross a bare run but never lies along one or over a joint. Fit **W32, the black star wire from I50 to P50, last**: it is the only join between the logic ground and the pump ground.

### 4.11 The relay K1, legs up

1. Solder four short stranded 22 AWG leads to the relay's COM, NO and two coil pins, each with a small loop.
2. Glue the relay on its back inside the outline on the drawing (body over columns 34-41, rows P-V).
3. From the solder side, solder COM into S33, NO into W42 and the two coil leads into Q33 and W33.
4. Run a cable tie through the free holes P33 and P42, over the relay's back, and put a dab of epoxy under it.

### 4.12 Clean and check (no power, nothing plugged in)

Scrub the solder side with isopropyl alcohol and the toothbrush, let it dry, then look at every joint under a light. Then, with the meter:

| Between | Expect | If not |
| --- | --- | --- |
| PUMP IN + (S53) and PUMP IN − (Q53) | no beep; the reading climbs above 100 Ω as C1 charges | a short: look for a bridge near C1, D1 or the rail |
| LOGIC IN + (M53) and LOGIC IN − (O53) | the same | look near C2, D2 and the left-edge ground columns |
| PUMP IN + (S53) and LOGIC IN + (M53) | open | the two supplies are joined: find the bridge |
| PUMP IN + (S53) and E-STOP pin 1 (U53) | beep (through F1) | F1 or its runs |
| PUMP IN − (Q53) and TEMP pin 2 (D53) | beep (through the star wire) | W32 missing or not soldered |
| Each pump plug's pin 1 and PUMP IN − | open | a bridge on that pump's runs |
| ESP32 socket pins L1 (3V3) and B1 (GND) | no beep | a bridge on the 3.3 V lines |

**Done when** every row of that table passes. Nothing gets power until Stage 7.
