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

## Stage 5: the panel board, in solder order

The panel board hangs behind the lid and carries the toggle-switch chip (MCP23017), the knob filters, the buzzer and the display header. Same method as the main board: low parts first, wiring last. Mark the rows and columns first, as in 4.1.

[![Panel board, component side](/media/picofarm/revb/panel/board-top.svg)](/media/picofarm/revb/panel/board-top.svg)

### 5.1 Three wires first

Lay these three insulated wires on the solder side now. The bodies of R7, R8 and R9 lie across their path, so they are easier to place first.

| Wire | Colour | Carries | From → to |
| --- | --- | --- | --- |
| W61 | blue | I2C SDA | T40 → AF40 |
| W62 | white | display reset | V41 → AF41 |
| W63 | yellow | I2C SCL | S42 → AF42 |

### 5.2 Resistors (22 × 10 kΩ, 2 × 1 kΩ)

| Value | Refs and holes |
| --- | --- |
| 10 kΩ, switch pull-ups | R10 P6–P10, R11 Q9–Q13, R12 R12–R16, R13 S15–S19, R14 P18–P22, R15 Q21–Q25, R16 R24–R28, R20 R19–R23, R21 Q16–Q20, R22 P13–P17, R23 S10–S14, R24 R7–R11, R25 Q4–Q8, R26 P1–P5 |
| 10 kΩ, other | R1 Q31–Q35, R2 R35–R31, R3 P34–P30, R4 AB34–X34, R5 AC35–Y35, R8 AB39–AB43, R9 AE39–AE43, R17 Y38–AC38 |
| 1 kΩ | R6 O48–K48, R7 Z39–Z43 |

### 5.3 Diode, capacitors, transistor, buzzer

| Ref | Part | Holes | Watch |
| --- | --- | --- | --- |
| D1 | BAT85 (a 1N5819 also works here) | band in E51, other end H51 | glass: bend beyond pliers |
| C1, C2 | 100 nF, 2.54 mm leads | C1 V39–W39, C2 P42–Q42 | |
| C3, C4 | 10 nF, 2.54 mm leads | C3 AB44–AC44, C4 AD43–AC43 | |
| C5 | **1 nF** (marked 102), 2.54 mm leads | Z50–AC50 | spread its leads to the 7.62 mm gap (two empty holes between); not 10 nF: the knob's push switch shares a boot pin with the chip |
| Q1 | S8050 | E J47, B J48, C J49 | flat face as drawn |
| BZ1 | 5 V buzzer | + in E48, − in H48 | fit it after the resistors; it is tall |

### 5.4 Socket and headers

1. **MCP23017 socket (DIP-28):** pins 1-14 in H39 to U39, pins 15-28 in U36 back to H36, with the notch at the row-H end. Pin 1 is H39.
2. **Ribbon headers (straight male pins):** a 15-pin strip in column 52 from P52 to AD52 (TO MAIN A), a 10-pin strip in row AE from AE25 to AE34 (TO MAIN B), and one single pin in AE44 (A16).
3. **Display header J2 (1×14, right-angle male):** along the bottom edge, pin 1 in AF51, then AF50, … pin 14 in AF38, pins pointing off the board's edge.

### 5.5 Bare runs and the other wires

All on the solder side, from the panel wire list: the 89 bare runs B1-B89, then the other 63 insulated wires (W1-W60 and W64-W66). The rail along the bottom edge and the ground row above it are bare runs; keep them straight, because the toggle leads join them in Stage 6. Beep each group of ten as on the main board.

[![Panel board, solder side: every bare run (B) and insulated wire (W) numbered](/media/picofarm/revb/panel/board-bottom-guide.svg)](/media/picofarm/revb/panel/board-bottom-guide.svg)

Leave these holes empty: they take the lid leads in Stage 6.

- **Toggle groups SW1-SW7:** five holes each, in columns 6, 9, 12, 15, 18, 21 and 24, rows AF (R), AE (O), AD (G), AC (A) and AB (H). SW1 is pH up and SW7 is drain, the firmware's order.
- **Knob group:** X36 (C), AA36 (S2), AE36 (MP), Z37 (S1), AB37 (A), AE37 (B).

### 5.6 Clean and check (no power)

| Between | Expect | If not |
| --- | --- | --- |
| TO MAIN A pin 1, 5 V (P52) and pin 2, ground (AC52) | no beep | a bridge on the 5 V line |
| Pin 3, 3.3 V (R52) and pin 2, ground (AC52) | no beep | a bridge on the 3.3 V line |
| TO MAIN B pin 17, rail (AE26) and ground (AC52) | open | the rail run touches the ground row |
| Rail (AE26) and each toggle group's R hole | beep | a break in the rail run |
| 3.3 V (R52) and each toggle group's A hole, then each H hole | about 10 kΩ | that pull-up is missing or open |
| 3.3 V (R52) and knob A (AB37), then knob B (AE37) | about 10 kΩ | R4 or R5 |
| 3.3 V (R52) and knob S1 (Z37) | **open** | something pulls the push switch up: find and remove it, or the controller won't boot |

**Done when** every row passes. Leave the MCP23017 out of its socket until Stage 7.

## Stage 6: the lid

Every lid lead is stranded wire, about 15 cm long, so the lid opens without breaking anything. Put a 10 mm piece of heat-shrink over each lead before you solder it to a lug, then slide it over the lug and shrink it.

[![Lid wiring: the ribbon leads, a toggle and its five leads, the knob, the E-stop and the display](/media/picofarm/revb/lid-wiring.svg)](/media/picofarm/revb/lid-wiring.svg)

### 6.1 Mount the parts in the lid

The printed box isn't drawn yet (see Stage 9); until then, a flat plastic plate works for the bench. Take the hole sizes and spacing from the lid layout table below: toggles 19 mm apart in a row, 6.2-6.5 mm holes; knob 7.2 mm with its anti-rotation notch; E-stop 22.3 mm; buzzer 3-4 mm. The table's positions are for the printed panel board; on the bench, place each part where its 15 cm leads reach, the toggles in pump order.

- **Seven toggles** in a row, 19 mm apart, levers moving up and down: **down = AUTO, centre = OFF, up = HAND**. Labels under them, left to right: pH UP, pH DN, NUTR A, NUTR B, REFILL, CIRC, DRAIN.
- **Knob (EC11)** with its anti-rotation tab in the notch; push the cap on last.
- **E-stop** in a 22.3 mm hole, contact block behind.
- **Display** behind its window, held by its own mounting holes.
- **Buzzer sound hole** (3-4 mm) over the buzzer.

**Lid layout for the printed panel board.** The panel board hangs behind the lid on its four standoffs with its parts toward the lid, so looking at the lid from outside is looking at the board's component side. Positions are in the board's own frame, millimetres from the board's top-left corner, x to the right, y down, the top edge being the hinge side.

| Lid part | Centre (x, y) | Hole | Notes |
| --- | --- | --- | --- |
| standoffs, M3 | (4, 4), (116, 4), (4, 66), (116, 66) | 3.2 | 25 mm long, nut on the board side |
| display window | (47, 39) | ~73.4 × 49 window | 3.5" module ~98 × 56 (measure it): lies over about x −6…92, y 11…67 with its 14-pin header end past the board's **left** edge, pins pointing back; locate the window by the module's own mounting holes. Its top edge stays at y ≥ 11 so it clears the ribbon plug on J1 (x 69-111, y 0-10). Nothing taller than 10 mm is under it. |
| display leads | | | from the module's header to J2 at the board's left edge (x 0, y 17-50), whose pins point off the edge: the housings lie flat past the edge. 10-15 cm leads. |
| knob, EC11 | (103, 28) | 7.2 + anti-rotation notch | over the ENC1 group (x 95-108, y 15); lid ≤ 4 mm there; body 7-9 mm behind the lid |
| buzzer sound hole | (108.8, 47) | 3-4 | over BZ1 |
| toggles, 7 × MTS-203 | x = 3, 22, 41, 60, 79, 98, 117; y = 82 | 6.2-6.5 with lock-ring flats | 19 mm pitch, 12 mm below the board's bottom edge, levers moving up/down (up HAND, centre OFF, down AUTO); the wire groups are centred at x = 8, 22, 41, 60, 79, 98, 112, y = 60 (the end ones pulled 5 mm in from the corner holes); lid ≤ 4 mm there; bodies 20 mm behind the lid, clear of the board and its standoffs |
| E-stop, 22 mm | (−37, 39) | 22.3 | head 40 mm (x −57…−17), clear of the display module's header end; 45-50 mm deep behind the lid, so the enclosure must put it beside the main board or over its low sensor edge (plugs 12 mm + standoffs), never over the capacitors, K1 or the ribbon |
| ribbon | | | J1 on the board's top edge, x 69-111; the cable folds over the top edge to J22 on the main board's top edge; both on the hinge side |
| labels | | | pump names under the toggles (pH UP, pH DN, NUTR A, NUTR B, REFILL, CIRC, DRAIN, left to right, the same order as on the board) |

The lid is at least 180 × 105 mm around these (E-stop head to the last toggle, hinge margin to the toggle labels), which the 190 × 160 mm floor covers.

### 6.2 Wire each toggle (× 7)

Each toggle has two poles (two rows of three lugs). Pole 1 switches the pump's power; pole 2 tells the chip which position the lever is in.

1. Find pole 2's middle lug. With the lever **down (AUTO)**, find the outer lug that beeps to it: that one is **A**. With the lever **up (HAND)**, the other outer lug beeps: that is **H**.
2. Join pole 1's two outer lugs with a short bare link.
3. Solder five leads and run them to that toggle's group of five holes on the panel board:

    | Lead | From the toggle | To the hole |
    | --- | --- | --- |
    | R (rail) | pole 1 middle lug | row AF |
    | O (out to the pump) | pole 1 link | row AE |
    | G (ground) | pole 2 middle lug | row AD |
    | A (auto) | pole 2 lug A | row AC |
    | H (hand) | pole 2 lug H | row AB |

4. Check from the panel board: R to O beeps at AUTO and at HAND but not at OFF; G to A beeps only at AUTO; G to H only at HAND.

### 6.3 Knob

Six leads from the knob's tabs to the panel board's knob holes: A to AB37, C to X36, B to AE37 (the three-tab side), S1 to Z37 and S2 to AA36 (the two-tab side), and MP, either metal body tab, to AE36. Bundle them with a cable tie. If the knob later turns the wrong way, that is one setting in the firmware, not a rewire.

### 6.4 E-stop

Two stranded 22 AWG leads, twisted together, from the E-stop's two contact screws to a 2-pin plug for the main board's E-STOP header (J3). Leave a service loop near the hinge.

### 6.5 Display and the ribbon

1. **Display:** 14 female-female jumper leads, pin for pin: display pin 1 (VCC) to header J2 pin 1 (AF51), and so on to pin 14 (SD_CS). SDO (pin 9) and CTP_INT (pin 13) are joined to nothing on the board; connect their leads anyway, it does no harm.
2. **Ribbon:** peel a 15-wide strip, a 10-wide strip and one single lead off the 40-way female-female jumper ribbon. Each lead joins the two pins with the same number (the lid wiring drawing above).
    - The 15-wide strip: panel TO MAIN A to the main board's header A (column 24).
    - The single lead: panel A16 (AE44) to the main board's pin A17 (backlight).
    - The 10-wide strip: panel TO MAIN B to the main board's single pins: 25 (X21), 23 (X25), 22 (X33), 21 (X37), 20 (X41), 19 (X45), the 3-pin piece 17-18-24 (X47-X49) and 26 (P26).
3. Don't plug the ribbon into the main board yet: the ESP32 has to be flashed first (Stage 7), and the ribbon blocks its USB ports.

**Done when** every toggle passes the check in 6.2, knob A and B each beep to C in turn as you turn it, and S1 beeps to S2 when you press it.

## Stage 7: first power-up, flashing, fitting the chips

Power the bare board first, so a wiring fault can only damage solder and wire, not the chips. Then flash the ESP32 off the board, and fit the chips one step at a time.

### 7.1 Make the two supply leads

Each supply is a certified USB charger, a short USB cable, and a USB-C to 2-pin adapter whose two screws go into a 2-pin plug. Pump supply: the 5 V 3 A USB-C charger into PUMP IN. Logic supply: the 5 V USB-A charger, through a USB-A to USB-C cable, into LOGIC IN. Mark each plug's + side with red marker.

The two leads need different cables: USB-C to USB-C for the pump charger (both ends are USB-C), USB-A to USB-C for the logic charger. Check which kind your 0.25 m cables are; any short cable of the missing kind works.

### 7.2 Power the bare board (no chips, no modules)

Meter on DC volts. Plug the E-stop into E-STOP, released.

1. **Logic charger only.** Black probe on LOGIC IN − (O53).
    - LOGIC IN + (M53): 4.9 to 5.3 V. A reading of −5 V means the lead is backwards: unplug at once.
    - ESP32 socket L21 (the dev board's 5 V pin): 4.5 to 5.2 V.
    - Unplug.
2. **Pump charger only.** Black probe on PUMP IN − (Q53).
    - E-STOP pin 1 (U53): 4.9 to 5.3 V.
    - E-STOP pin 2 (W53): the same with the button released, 0 V with it pressed.
    - CIRC pin 1 (Z53, the pump rail): 0 V. The relay is off, because nothing drives it yet.
    - Unplug.

Anything else: unplug and go to Troubleshooting before fitting a chip.

### 7.3 Flash the ESP32 off the board

The ribbon's header stands in front of the ESP32's USB ports, so flash it now, on the bench. To flash it again later (a display setting, a new version), unplug the 15-wide strip from header A; if the USB plug still doesn't reach, lift the ESP32 out of its sockets. That is only for a first flash or a changed partition table: once the controller is on the server, new firmware goes over Wi-Fi from the dashboard (Manage page, Control tab, "Firmware": pick the build's `firmware.bin` and press Update). The pumps stop, the controller downloads the file, checks it and restarts, and falls back to the old firmware if the new one doesn't come back online.

The controller runs the PicoFarm firmware, built and flashed with PlatformIO using its `esp32s3` environment.

1. Plug the ESP32 into the computer with a USB-C cable, on the port marked UART (or COM), not the one marked USB.
2. In a terminal, from the firmware folder:

    ```
    pio run -e esp32s3 -t upload
    pio device monitor -b 115200
    ```

    If the upload can't connect, hold the board's BOOT button, tap RST, release BOOT and try again.
3. In the monitor, type one line at a time. After `wifi`, and again after `mqtt`, the board restarts by itself: wait for its boot text before typing the next line.
    - `wifi <your Wi-Fi name> <password>`. A name or password with a space in it needs the JSON form that `help` shows: `{"op":"wifi","ssid":"..","pass":".."}`.
    - `mqtt <server address> 1884 pf-device <device password>` (the device password is the server's `PF_DEVICE_MQTT_PASS` setting).
    - `name <a name for this controller>`
    - `status` prints one line of JSON. `"wifi":"<an IP address>"` means it joined; `"ads":false` and `"temp_probe":false` are expected while nothing is fitted.
4. Unplug the ESP32 from the computer.

Until the server runs the revision B version, the controller runs on its own panel.

### 7.4 Fit the chips and modules (both chargers unplugged)

1. **ULN2803A** into its socket, notch at the column-20 end. Check that no leg folded under.
2. **ESP32-S3 board** into its sockets: antenna end at the left edge (column 1), USB ports toward header A.
3. **ADS1115 modules** into their two sockets, VDD at row A, components up. Either module goes in either socket: the board sets their addresses.

[![Main board, component side, assembled](/media/picofarm/revb/main/board-top.svg)](/media/picofarm/revb/main/board-top.svg)

### 7.5 Power up with the chips (still no panel)

The ribbon isn't plugged in, so you can still reach the ESP32's UART port. First check that the ESP32 board can't push the charger's power back into the computer. Plug a USB-A to USB-C cable into its UART port with nothing on the other end, and plug in the logic charger. Then measure the free USB-A plug's two outer pins (pin 1 to pin 4).

- **0 V:** the board has a diode on that port. Unplug the charger, connect the computer, open the monitor, then plug the charger back in.
- **About 5 V:** the board has no diode there, or its USB-OTG ("IN-OUT") jumper is bridged. Never connect the computer and the logic charger at the same time. Do this stage on the computer's power alone; the pH and level boards stay unpowered, which is fine here.

1. The monitor shows the boot, including `[sensors] ADS1115 found` and `[panel] power monitor (ADS1115 0x49) found`. `[panel] no MCP23017 at 0x20 ...` is expected until the panel is connected. The relay stays off.
2. Plug in the pump charger. Within a few seconds of the first sensor reading, the relay clicks on and CIRC pin 1 shows 5 V.
3. Press the E-stop: the relay drops at once and CIRC pin 1 goes to 0 V. `status` lists `estop` under `alarms`, with `"estop_src":"hardware"`.
4. Release it. Nothing restarts. Type `restart`: the relay clicks back on.

### 7.6 Connect the panel (both chargers unplugged)

1. Fit the **MCP23017** in its socket, notch at the row-H end.
2. Plug the ribbon onto the main board's header A and single pins, exactly as numbered.
3. Plug in the logic charger: the display lights and shows the Overview page. Move each toggle and watch its pump change between AUTO, OFF and HAND on the screen. (Before the panel was plugged in, every switch read as AUTO.)

**Done when** 7.5 and 7.6 behave as written. If the screen stays white or shows mirrored colours, it is one setting in the firmware's board settings file, `board.h` (colour inversion, red/blue order, rotation, touch axes).

## Stage 8: bench checks

These prove the safety features before any water is near the box. Connect one pump to its plug for the run checks (pH UP is easiest), with its tube in an empty cup. Run every check; tick it off.

| # | Check | How | Expect | If not |
| --- | --- | --- | --- | --- |
| 1 | Display backlight current | Power off. Unplug the display's LED lead (pin 8) and put the meter, on its mA range, between header pin 8 and the display's LED pin. Power on. | 10 mA or less | over 10 mA: the backlight needs its own transistor: an S8050 low-side switch for the LED pin on the panel board (GPIO47 → 1k → base) |
| 2 | 3.3 V under Wi-Fi | Meter between the ESP32 socket's 3V3 (L1) and GND (B1) while it connects to Wi-Fi after a restart. | stays at 3.2 V or more | swap D8 for a spare 1N5822: drill U22 and X22 to 1.6 mm and stand it on end, band in U22, as for D1 |
| 3 | Relay at boot | Unplug and replug both chargers. | relay off at power-up, then on after the first reading | stop: don't connect pumps until this is right |
| 4 | Hardware E-stop | Press it while a pump runs. | pump stops at once, `estop` latched, source hardware | |
| 5 | Restart needed | Release the E-stop. | nothing runs until RESTART (Alarms page, confirm) | |
| 6 | Software E-stop | Touch E-STOP on the screen while a pump runs. | pump stops, relay drops a moment later | |
| 7 | OFF cuts power | Toggle at OFF, then ask for a run from the Pumps page. | refused, reason `switch_off`; the pump never moves | the toggle's pole 1 is mis-wired |
| 8 | HAND | Toggle to HAND. | pump runs, stops after its `max_s`, alarm `hand_timeout` until the toggle leaves HAND | |
| 9 | Pump budget | Three dosing toggles to HAND together. | two run, the third waits ("waiting: two pumps already running") and starts when one stops | |
| 10 | Both throws closed | Briefly join a toggle group's A and H holes with a clip lead. | alarm `switch_fault`, that pump treated as OFF | |
| 11 | Pump supply lost | Unplug the pump charger while a pump runs. | alarm `pump_power` | |
| 12 | Stuck relay | All toggles OFF. Press the E-stop, release it, and don't RESTART. Clip a lead across the relay's COM and NO. | alarm `relay_fault` | |
| 13 | Knob | Turn and press it. Meter from R8's far end, hole AB43 on the panel board (the GPIO20 line), to GND, with the knob resting on a click. | focus moves, push presses; AB43 reads under 0.3 V in the positions where the contact is closed | stays near 3 V: GPIO20's USB pull-up is still on (a firmware fix) |
| 14 | Pump current | Meter on 10 A in series with each pump at its plug; run it, then pinch its outlet tube for a second. | 0.3 A or less running | that pump needs its own driver module, like circulation |
| 15 | Relay chatter | Watch the alarm list during checks 3-5. | no `relay_open` alarm when the relay closes normally | |

After check 12, remove the clip lead, press CLEAR on the Alarms page (`relay_fault` stays latched; RESTART clears only the E-stop), then RESTART. **Done when** all fifteen pass.

## Stage 9: sensors, pumps and calibration

Wire everything with both chargers unplugged. Every sensor ships as "not installed": after wiring one, switch it on in the dashboard's Manage page (inputs, pumps, level source), or the controller ignores it.

### 9.1 What plugs in where

| Device | Plug | Pin 1 | Pin 2 | Pin 3 | Pin 4 |
| --- | --- | --- | --- | --- | --- |
| Low level switch (XKC-Y21) | LOW (J5) | 5 V, brown | signal, yellow | ground, blue | |
| High level switch | HIGH (J6) | 5 V, brown | signal, yellow | ground, blue | |
| Emergency level switch | EMERG (J7) | 5 V, brown | signal, yellow | ground, blue | |
| Leak pads (two stainless screws 5 mm apart) | LEAK (J4) | pad A | pad B | | |
| Temperature probe (DS18B20) | TEMP (J8) | 3.3 V, red | ground, black | data, yellow | |
| Ultrasonic board (JSN-SR04T) | JSN (J9), Dupont | 5V | Trig | Echo | GND |
| pH board (pH-4502C) | pH (J10), Dupont | V+ | G (either of its two) | Po | |
| TDS board | TDS (J11), Dupont | + | − | A | |
| pH up, pH down, nutrient A, nutrient B pumps | J14-J17 | pump + (red) | pump − | | |
| Emergency float switch | FLOAT (J18) | either wire | either wire | | |
| Refill pump | REFILL (J19) | pump + | pump − | | |
| Drain pump | DRAIN (J20) | pump + | pump − | | |
| Circulation module (D4184) | CIRC (J21), two 2-pin plugs | DC+ | DC− | PWM | signal GND |

Notes:

- **Check the level switch's colours on its label or listing first.** If yours has a fourth wire, leave it unconnected until you know what it does.
- **Solder a 100 nF capacitor across each brushed pump's two terminals,** at the motor (dosing, refill and drain pumps). It stops the motors' noise reaching the pH probe.
- **The float switch** goes above the high level switch. Fitted as in Stage 2, it is closed with the float down and opens when the water lifts it, cutting the refill pump's power whatever the firmware does.
- **The circulation pump** goes on the D4184 module's output terminals, not on the board.
- **The leak pads** sit at the lowest point of the tray under the tank.
- **Probe leads** (BNC, TDS, temperature) stay apart from the pump leads, and the pH and TDS boards sit together on the sensor side of the box.

### 9.2 Check each input

For each level switch, hold water against the tank wall at its height, then take it away, and watch the screen. If a switch reads the wrong way round, flip its `alarm` setting in Manage ("open" or "closed"); no rewiring is needed. Wet the leak pads with a damp finger: `leak` latches and the relay drops. Clear it from the Alarms page.

### 9.3 Calibrate

Calibrate with the circulation pump running, as it will be in use. Rinse the probes in clean water between buffers.

1. **pH offset (once):** probe in the pH 7.00 buffer. Turn the pH board's offset trimmer (the one nearest the BNC socket) until the Calibration page shows about 1.67 V.
2. **pH supply sensitivity:** still in pH 7.00, note the page's voltage and the voltage at LOGIC IN +. Swap the logic charger for another 5 V supply and read both again. More than about 10 mV of change on the page for every 100 mV of supply difference needs a firmware correction (compensation from the power monitor's logic 5 V reading, a follow-up).
3. **pH points:** on the Calibration page, store pH 7, then pH 4, then pH 10, each once the reading has been steady for a minute.
4. **EC:** TDS probe in the 1413 µS/cm standard at room temperature; store EC 1413.
5. **Level:** with the tank empty, type `cal level empty` on the serial monitor; fill it to its working level, then `cal level full`.
6. **Pump flow:** for each dosing pump, run it 30 s into a measuring cup and enter the result: `cal flow ph_up 30 <ml>`.
7. Store the pH probe in its cap with a few drops of the KCl storage solution, never dry and never in plain water.

### 9.4 The box

The printed enclosure isn't drawn yet. Its requirements are settled:

- inner floor at least 190 × 160 mm, 70 mm inside height;
- plastic, with no metal within 15 mm of the ESP32's antenna end;
- cable glands on the bottom and lower sides only, with a drip loop under each;
- a lid that hinges on the ribbon edge;
- the box mounted above the reservoir rim.

Until it is drawn, run the controller on the bench.

### 9.5 Final checklist

- [ ] Both boards passed their resistance checks (4.12, 5.6)
- [ ] Supplies, relay and E-stop behaved as in 7.2 and 7.5
- [ ] All fifteen bench checks passed (Stage 8)
- [ ] Every sensor is switched on in Manage and reads right (9.2)
- [ ] pH, EC, level and pump flow are calibrated (9.3)
- [ ] Every plug is labelled, and every lead is strain-relieved at its gland
- [ ] The controller shows on the dashboard and the app, and a setpoint changed on the panel appears there (after the server update)

## Troubleshooting

Unplug both chargers before you touch a joint. Most faults in a hand-wired board are a bridge, a dry joint or a part the wrong way round, in that order.

| Symptom | Likely cause | What to do |
| --- | --- | --- |
| −5 V at a supply input | the 2-pin adapter's leads are swapped | swap them at the plug; the clamp diode has protected the board |
| 0 V at a supply input | the USB-C adapter has no CC resistors, so the charger never switches on; or a fuse has tripped | measure CC (Stage 2); unplug for a minute to reset the fuse, then look for a short |
| A fuse gets hot, or the supply keeps cutting out | a short on that supply | unplug; beep that supply's + to its − and find the bridge |
| The relay never clicks | E-stop pressed or unplugged; `estop` still latched; Q2 the wrong way round | release it and RESTART; check Q2's flat face |
| Relay on, but a pump doesn't run | its toggle at OFF; low water blocks dosing; two pumps already running; ULN2803A not seated | read the refusal reason on the Pumps page |
| A pump runs backwards | its leads are swapped | swap them at its plug |
| The ESP32 won't boot, or reboots in a loop | something pulls the knob's push line (GPIO45) high; 3.3 V sags | redo the last row of 5.6; Stage 8 check 2 |
| An ADS1115 isn't found | module in backwards; a dry header joint; a bridge on SDA or SCL | VDD at row A; reflow its header |
| Display white or colours wrong | panel settings | one setting in the firmware's `board.h` |
| Touch doesn't respond | CTP leads (display pins 10-12) | check those three leads and W61-W63 |
| A toggle shows HAND at AUTO | its A and H leads swapped | swap the two leads at the toggle |
| `switch_fault` | A and H both closed: a bridge in that toggle's group | look at its five holes |
| The knob turns the wrong way | normal for some knobs | one setting in `board.h` |
| pH jumps while a pump runs | expected for dosing pumps: the controller pauses pH readings then | if it jumps with circulation only, move the probe lead away from the pump leads |
| pH stuck near 7.0 | probe unplugged or dry; an old probe | reseat the BNC; soak the probe in KCl for an hour; recalibrate |
| Leak alarm with no water | condensation or dirt between the pads | clean and dry them; raise them off the tray floor slightly |
| `relay_open` when the relay closes | the rail reading arrives late | note it; the firmware's margin may need raising |

## Parts

The parts for a controller are the ones named through this guide: the ESP32-S3 dev board, two ADS1115 modules, the MCP23017, the ULN2803A, the SRD-05VDC-SL-C relay, the D4184 module, the 3.5" ST7796 display, the EC11 knob, seven MTS-203 toggles, the 22 mm NC E-stop, the buzzer, the PTC fuses, the diodes, capacitors and resistors listed in Stages 4 and 5, the pluggable terminals and headers, two 9 × 15 cm double-sided protoboards (plus spares to practise on), and the sensors and pumps in 9.1. Buy two certified 5 V 3 A USB-C chargers (CSA or UL mark) locally for the pumps; 5 V USB-A chargers do the logic side unless Stage 8 check 2 fails.
