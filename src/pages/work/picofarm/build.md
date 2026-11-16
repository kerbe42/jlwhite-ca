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
| 2 | Check the parts | 1-2 h | every part passes its meter check |
| 3 | Soldering practice | 30 min | ten good joints and one clean bare run on a spare board |
| 4 | Main board | 2-3 evenings | the resistance checks pass with nothing plugged in |
| 5 | Panel board | 1 evening | its resistance checks pass |
| 6 | Lid | 1 evening | each toggle and the knob read right on the meter |
| 7 | First power-up, flashing, fitting the chips | 1 evening | the controller boots, finds its chips and closes the relay |
| 8 | Bench checks | 1 evening | every toggle feeds its own pump; E-stop, toggles, alarms and supplies behave as listed |
| 9 | Sensors, pumps and calibration, then the box | 1-2 evenings | pH, EC, level and pumps read right; the box is closed |

**Keep these open beside you** (every drawing is also shown in the stage that uses it):

- The [wire lists](/work/picofarm/wire-lists), printed so you can tick off each line: one for the main board and one for the panel board.
- The board drawings: main board [top](/media/picofarm/revb/main/board-top.svg), [top with the modules lifted](/media/picofarm/revb/main/board-top-open.svg), [bottom](/media/picofarm/revb/main/board-bottom.svg) and [bottom guide](/media/picofarm/revb/main/board-bottom-guide.svg); panel board [top](/media/picofarm/revb/panel/board-top.svg), [top with the modules lifted](/media/picofarm/revb/panel/board-top-open.svg), [bottom](/media/picofarm/revb/panel/board-bottom.svg) and [bottom guide](/media/picofarm/revb/panel/board-bottom-guide.svg). Open a drawing on its own to zoom in on the hole labels.
- The [lid wiring drawing](/media/picofarm/revb/lid-wiring.svg): every lead between the boards, the toggles, the knob, the E-stop and the display.

**How holes are named.** A hole is its row letter plus its column number, seen from the component side: L4 is row L, column 4. Hole A1 is the top-left corner. The main board uses columns 1-53 and rows A-AG; the panel board uses columns 1-52 and rows A-AF. When you flip a board over, column 1 is on your right. The bottom drawings are already mirrored to match.

**A name in brackets after a hole** is the name of the line that hole is on in the circuit: `O24 (L5V)` is hole O24, on the logic 5 V line. The check tables use these names so every one can be tested against the layout. You only need the hole. The names you will meet most: `L5V` logic 5 V, `V33` 3.3 V, `GNDL` logic ground, `GNDP` pump ground, `PIN` and `LIN` the two supply inputs, `PFUSE` the pump supply after its fuse, `ESN` the same after the E-stop, `RAIL` the pump rail after the relay, `PSW1` to `PSW7` each pump's feed from its toggle, `OUT1` to `OUT7` each pump's switched return.

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
| Paint pens or nail varnish, three colours | | marks pin 1 and the plugs that look alike |
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

Several checks need 5 V or 3.3 V on the bench. Use the ESP32 board itself, loose on the table on a USB lead from a charger, once its own rows have passed: its 5V and G pins give 5 V, its 3V3 and G pins give 3.3 V. Take them off with female jumper leads, and don't let two loose ends touch.

**Keep the bag of 5.1 V zener diodes (BZX55C5V1) off the bench, in another room.** They are small glass diodes like the BAT85s and this build uses none of them. A zener in a BAT85's place passes the eye and fails in use.

| Part | Check | Pass | If it fails |
| --- | --- | --- | --- |
| ESP32-S3 dev board | Hold it components up, antenna away from you, and read the pin labels down both rows. Left row from the antenna end: 3V3 3V3 RST 4 5 6 7 15 16 17 18 8 3 46 9 10 11 12 13 14 5V G. Right row: G 43 44 1 2 42 41 40 39 38 37 36 35 0 45 48 47 21 20 19 G G. | every label matches, and pin 15 of the right row is 45 | stop: the board needs a different layout |
| ESP32-S3 dev board | Stand it in the protoboard without soldering. | its two rows land exactly ten holes apart | a narrow-row board does not fit this layout |
| ESP32-S3 dev board | Unpowered, meter on resistance: the pin labelled 45 to a pin labelled 3V3. | over 100 kΩ | something on the board pulls the knob's push line up, and the controller would not boot: use another board |
| ESP32-S3 dev board | Read the marking on its 3.3 V regulator: the small part with three legs and a tab, near the USB ports. | anything but AMS1117 (or just 1117) | AMS1117: it needs more voltage to spare. Use a 5 V 2 A charger and a short, thick lead on LOGIC IN from the first power-up (7.1); Stage 8 check 2 then measures it |
| ESP32-S3 dev board | Plug a USB-A to USB-C cable into its UART port, nothing on the other end. Meter on beep. One outer pin of the free USB-A plug beeps to a G pin: that is ground. Beep the other outer pin (the USB 5 V) to the board's 5V pin. Repeat on the other port. | no beep (on diode test: 0.15 to 0.7 V with red on the plug, open with the leads swapped) | the board has no diode on that port, so a charger on LOGIC IN would feed the computer: never connect the computer and the logic charger together. Write that on the box. 7.5 tests it again with power |
| Relay K1 (SRD-05VDC-SL-C) | Meter on beep, no power on the coil. Find the lone offset pin (COM). Test COM to each of the two far pins. | one far pin beeps (that is NC), the other stays open (that is NO) | mark the pins with a marker now; if neither or both beep, use another relay |
| Relay K1 | Touch 5 V from a USB lead across the two pins nearest COM (the coil). | it clicks, and COM to NO now beeps | try another relay |
| Relay K1 | Meter on resistance across the two coil pins. | 60 to 80 Ω | about 25 Ω is a 3 V coil, about 400 Ω a 12 V coil: the wrong relay was shipped, don't fit it |
| S8050 transistors × 2 | Meter on diode test. Hold it flat face toward you, legs down. Red lead on the middle leg, black on each outer leg in turn; then swap the leads. | about 0.6-0.7 V to each outer leg with red on the middle; open with the leads swapped | it isn't an NPN with its base in the middle: use another |
| S8050 transistors × 2 | Find which outer leg is which. Put it in the meter's hFE socket (NPN side), flat face toward you, legs in E, B, C from left to right. No hFE socket: take 5 V from a USB lead, + to one relay coil pin, the other coil pin to the transistor's right leg, its left leg to −, then touch a 1 kΩ resistor from + to the middle leg. | hFE over 80; or the relay clicks | hFE under 20, or no click: this part's outer legs are the other way round. Mark it, and fit it turned round (flat face the other way) in 4.7 and 5.3 |
| D4184 modules × 3 (circulation, refill, drain) | Module unpowered. Meter on its highest resistance range: the module's signal GND pin to DC−, and PWM to DC+. | both read open (over 1 MΩ) on each module | don't use that module: its input isn't isolated, and its pump would run whenever the relay is closed |
| D4184 modules × 3 | 5 V across the input: + through the meter (200 mA range) to PWM, − to signal GND. Nothing on the other terminals. | 2 to 10 mA | 0 mA: the input is dead. Over 10 mA: more than a toggle lead and the driver chip should carry. Use another module |
| Display (3.5" ST7796) | Look at the back for a small 3- or 5-legged regulator marked 662K, XC6206 or AMS1117. Read the 14 header labels. | a regulator is there; pins read VCC GND CS RST DC SDI SCK LED SDO CTP_SCL CTP_RST CTP_SDA CTP_INT SD_CS | no regulator: don't connect it to 5 V; header pin 1 must move to 3.3 V first |
| Display | Power it alone: VCC to 5 V and GND to ground, nothing else connected. Meter on DC volts, black probe on GND: read the pins CTP_SDA, CTP_SCL, SDO and CTP_INT. | each 3.4 V or less | a pin near 5 V would put 5 V on a 3.3 V pin of the ESP32: don't use this display |
| Display backlight | Still powered like that: meter on its 200 mA range, red probe on 3.3 V, black probe on the display's LED pin. The backlight comes on. | 10 mA or less | over 10 mA: the ESP32 pin that drives the backlight would be overloaded from the first power-up. Leave the display's LED lead (pin 8) unplugged in 6.5 until the backlight has its own transistor |
| E-stop (22 mm, NC) | Beep across its two contact screws, button released, then pressed. | released beeps, pressed is open | the contact block is the wrong type (NO); swap the block |
| Toggles (MTS-203) × 7 | For each lever position, find which outer lugs beep to each middle lug. | centre: nothing beeps; each end: each middle lug beeps to one outer lug | note the lug pattern; Stage 6 uses it |
| USB-C to 2-pin adapters × 2 | Meter on resistance: each CC pin (or the two tiny pads marked CC1, CC2) to GND. | about 5.1 kΩ each | without them a USB-C charger won't switch on: use USB-C breakouts that have them |
| USB-C to 2-pin adapters × 2 | Look at both sides. | a socket, two small resistors and the two screws, nothing else | a chip, or solder pads marked 9 V, 12 V, 15 V or 20 V: it asks the charger for a higher voltage. Never use it: 9 V or more destroys the relay, the pumps and everything on the 5 V side |
| Chargers × 2, each with its cable and adapter | Read the charger's label. Then plug it in and put the meter, on DC volts, on the adapter's two screws. | a CSA, UL or ETL mark with a file number; 4.9 to 5.3 V. Mark the + screw red | no mark: buy a certified charger. 0 V: the adapter row above. Any other voltage: don't use that charger and adapter |
| Float switch | Hang it by its thread. Beep its two wires with the float down, then lifted. | it beeps with the float down and goes open when lifted | pull the clip, flip the float over on its stem, refit, test again |
| ADS1115 modules × 2 | Hold it components up, header along the edge nearest you, and read the header: VDD GND SCL SDA ADDR ALRT A0 A1 A2 A3. | same order, VDD at the left end | the socket wiring would need to change |
| 1000 µF capacitors × 2 | Read the sleeve. | 1000 µF, 16 V (10 V at the least). The stripe marks the − lead, the shorter one | a lower voltage: don't fit it |
| BAT85 diodes (small, glass) × 4 | Meter on diode test, red on the plain end, black on the banded end. | 0.15 to 0.45 V | 0.6 to 0.7 V: it is a zener from the wrong bag. Put it back and take that bag off the bench |
| Level switches (XKC-Y21) × 3 | One at a time: brown to 5 V, blue to ground, and a 10 kΩ resistor from yellow to 5 V. Meter on DC volts from yellow to blue, with the sensor's face flat against a full glass of water, then away from it. | under 0.4 V in one state, about 5 V in the other. Write down which state is low | never low, or it never changes: it isn't an NPN switch, or a fourth wire inverts it. Don't use it for the high or emergency level: it could never stop a refill |
| TDS board | Feed its + pin from 3.3 V through the meter on its 200 mA range; − to ground. | 10 mA or less | more than the ESP32 pin that powers it should give: don't use this board |
| Ultrasonic board (JSN-SR04T) | Read its four header labels, and put a paint dot beside 5V. | 5V Trig Echo GND, in that order | another order: its lead has to be re-pinned to match 9.1. The plug has no key; the dot is what stops it going on backwards |
| Dosing pumps (peristaltic) × 4 | Meter on its lowest resistance range across the pump's two terminals. Turn the rotor slowly by hand and take the lowest steady reading. | 8 Ω or more | under 8 Ω: stalled, it draws more than the 0.5 A one channel of the driver chip can take. That pump goes on its own D4184 module, wired like refill and drain (9.1) |
| Refill and drain pumps (370 type) | Nothing to measure: they draw about 0.9 A at every start. | they always go on their own D4184 modules (9.1) | never plug one straight into REFILL or DRAIN |
| Jumper leads for the 10-wide strip | Meter on resistance, each lead end to end; then tug each housing. | under 0.2 Ω more than the meter shows with its probes touching; no housing pulls off | bin that lead: these carry the pumps' current |
| Protoboards | Count the holes along a long and a short edge. | 53 × 33 or more, plated on both sides | use a larger board and line it up on the top-left hole |
| 2-pin red/black wire | Cut the end and look. | many fine strands (stranded) | solid wire breaks in the lid hinge: use stranded 22 AWG for the lid leads |
| Resistors | Measure each value before you fit it (Stage 4 says which goes where). | within 1 % of its value | sort it back into the right bag |

**Dosing pump current, if you have time now** (otherwise in Stage 8): run each dosing pump from a USB lead through the meter on its 10 A range, then pinch its outlet tube for a second. A pump that draws more than 0.3 A while running must go on its own driver module, like refill, drain and circulation.

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

[![A flat top-down drawing of the hand-wired main board to scale, component side: a 9 × 15 cm perfboard with every hole shown, the black ESP32-S3 dev board at the top left, the two blue ADS1115 modules marked 0x48 and 0x49, the ULN2803A in its socket, the blue relay K1 glued legs-up with its red and white flying leads, the two 1000 µF capacitors, the two yellow PTC fuses and the two standing 1N5822 diodes, the resistors with their colour bands, the single-pin and multi-pin headers for the panel leads, and the green pluggable terminals along three edges, each named](/media/picofarm/revb/main/main-protoboard-2d.png)](/media/picofarm/revb/main/main-protoboard-2d.png)

[![The hand-wired main board’s solder side, mirrored as the builder sees it: the perfboard holes, the tinned bare runs in grey, the red, black, yellow, blue, green and white insulated wires lying over them, a solder joint on every pin, and the parts’ outlines and references ghosted through the board](/media/picofarm/revb/main/main-protoboard-2d-solder.png)](/media/picofarm/revb/main/main-protoboard-2d-solder.png)

*The finished main board, component side and solder side (the solder side mirrored, as you see it with the board turned over). 2D renders to scale, drawn from the protoboard layout files: every hole, part, bare run and wire is where the wire list puts it. The hole-by-hole drawing below is the one to work from.*

[![Main board, component side, with the modules lifted: every part, socket and hidden wire](/media/picofarm/revb/main/board-top-open.svg)](/media/picofarm/revb/main/board-top-open.svg)

### 4.1 Prepare the board

1. Component side up, hole A1 at the top left. Write the column numbers every five holes along the top and bottom edges, and the row letters every five rows down both sides. Do the same on the solder side, mirrored.
2. Drill four holes out to 1.6 mm for the big 1N5822 diodes, whose leads are too thick for normal holes: U48, R48, M47 and P47. Turn the bit by hand in a pin vise; don't tear the copper ring.
3. Solder the straight 1×10 male header that comes with each ADS1115 module: short ends up through the module from underneath, plastic under the module, long pins pointing down, away from the components. The module must lie flat on its socket with its components facing up.

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
| 1 kΩ | brown black black brown | R10 U4–Q4, R34 S31–W31, R36 S9–W9 (in series with the ultrasonic Trig line) |
| 100 Ω | brown black black black | R9 F48–F52, R11 A48–A52 |
| 33 Ω | orange orange black gold | R30 I7–I11, R31 H8–H12, R32 G9–G13, R33 F10–F14 (these sit under the ESP32 board) |

R1 and R2, the two resistors that divide the pH board's signal, must be 1 % parts: the five-band ones from the kit, measured as in Stage 2. With 5 % parts a pH board stuck at its top voltage could push that input past its limit.

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

**Test every diode now, before you fit anything else.** A diode the wrong way round is the easiest way to burn this board: D9 backwards shorts the pump supply through the relay's transistor the first time the relay closes, and D3 or D10-D14 backwards shorts it through the driver chip the first time that pump is asked to run. Later the relay's coil hides D9 from the meter, so this is the moment.

Meter on its diode range, probes on the diode's own two holes from the solder side.

- **The reading in the "must read" column with the probes as listed, and the "swapped probes" reading the other way round:** right. (C1 and C2 aren't fitted yet, so D1 and D2 show OL at once with the probes swapped.)
- **The two readings the other way round:** the diode is in backwards. Unsolder it, turn it and test again.
- **0.6 to 0.7 V** on D4, D5 or D6: that is a zener, not a BAT85. Replace it.
- **Near 0 V both ways:** a solder bridge between its two holes.




**Main board, diode test (meter on the diode range)**

| # | diode | red probe on (plain end) | black probe on (band end) | must read | swapped probes |
| --- | --- | --- | --- | --- | --- |
| MD1 | D1 1N5822 | R48 (GNDP) | U48 (PFUSE) | 0.15 to 0.45 V | climbs to OL as the 1000 µF capacitor charges |
| MD2 | D2 1N5822 | P47 (GNDP) | M47 (L5V) | 0.15 to 0.45 V | climbs to OL as the 1000 µF capacitor charges |
| MD3 | D3 1N5819 | AD32 (OUT5) | AD29 (REFP) | 0.15 to 0.45 V | OL |
| MD4 | D4 BAT85 | W5 (XLOW) | Z5 (XLOWS) | 0.15 to 0.45 V | OL |
| MD5 | D5 BAT85 | AB6 (XHIGH) | AE6 (XHIGHS) | 0.15 to 0.45 V | OL |
| MD6 | D6 BAT85 | AB7 (XEMG) | AE7 (XEMGS) | 0.15 to 0.45 V | OL |
| MD7 | D8 1N5819 | X22 (L5V) | U22 (S35V) | 0.15 to 0.45 V | OL |
| MD8 | D9 1N5819 | W34 (K1C) | W37 (ESN) | 0.15 to 0.45 V | OL |
| MD9 | D10 1N5819 | AD48 (OUT1) | AD45 (PSW1) | 0.15 to 0.45 V | OL |
| MD10 | D11 1N5819 | AD44 (OUT2) | AD41 (PSW2) | 0.15 to 0.45 V | OL |
| MD11 | D12 1N5819 | AD40 (OUT3) | AD37 (PSW3) | 0.15 to 0.45 V | OL |
| MD12 | D13 1N5819 | AD36 (OUT4) | AD33 (PSW4) | 0.15 to 0.45 V | OL |
| MD13 | D14 1N5819 | AD24 (OUT6) | AD21 (PSW7) | 0.15 to 0.45 V | OL |




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
| Q2 | S8050 | E X30, B X31, C X32 | flat face toward row Y, as drawn |

### 4.8 Headers and plugs

1. **Dupont headers** (straight male pins, cut from a 40-way strip):

    | Ref | For | Holes, pin 1 first |
    | --- | --- | --- |
    | J9 | ultrasonic (JSN-SR04T board) | AC10, AB10, AA10, Z10 |
    | J10 | pH board | M35, M34, M33 |
    | J11 | TDS board | M32, M31, M30 |
    | J12 | I2C spare | A43, B43, C43, D43 |
    | J13 | analog level spare | M27, M28, M29 |

    J9 has no key: its plug fits both ways round, and backwards it puts 5 V into the ultrasonic board the wrong way. Put a paint dot on the board beside its pin 1, AC10 (L5V), now. The plug gets the same dot in 9.1.

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

  
5. **Mark the look-alike headers now.** PUMP IN, LOGIC IN and E-STOP sit in a row on the right edge and take the same 2-pin plug. A charger plugged into E-STOP would power everything with no fuse and no E-stop.
    - Give each of the three headers its own colour (a band of paint or nail varnish on its top): for example red for PUMP IN, yellow for LOGIC IN, white for E-STOP. Their plugs get the same colours in 7.1.
    - Write **+** on the board beside S53 (PIN) and beside M53 (LIN). They are not the same way up: the + of PUMP IN is its lower pin, the + of LOGIC IN its upper one.
    - Put a paint dot beside CIRC's pin 1, Z53 (RAIL). Its two plugs are glued into one block in 9.1, because swapped they would run the circulation pump's current through the driver chip.

  

### 4.9 Bare runs (solder side)

The wire list has 117 bare runs, B1 to B117, each with its holes and length. Work down the list ten at a time. After each ten, beep every run end to end and against its neighbours, and tick them off on the printout. Lay the long ones (B21 is 124 mm) first in each group, so the short ones go on top where they join.

[![Main board, solder side: every bare run (B) and insulated wire (W) numbered](/media/picofarm/revb/main/board-bottom-guide.svg)](/media/picofarm/revb/main/board-bottom-guide.svg)

### 4.10 Insulated wires (solder side)

The wire list has 45 insulated wires, W1 to W45, each with its colour and holes. Lay them flat with square bends; strip 3 mm at each end. A wire may cross a bare run but never lies along one or over a joint. Fit **W32, the black star wire from I50 to P50, last**: it is the only join between the logic ground and the pump ground.

### 4.11 The relay K1, legs up

1. Solder four short stranded 22 AWG leads to the relay's COM, NO and two coil pins, each with a small loop. NO is the far pin you marked in Stage 2: with the relay on its back and COM to the left it is the top-right pin, as drawn. Cut the NC pin (bottom right) off short.
2. Glue the relay on its back inside the outline on the drawing (body over columns 34-41, rows P-U).
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

**Then the bridge tables, one sitting, about half an hour.** The rows above find a dead short. The tables below find the solder bridges that would stay hidden until a chip or a pump is connected, and then burn it: each row is a pair of lines that run through neighbouring holes somewhere on the board, and one reading proves every place where they are neighbours.

- Sockets empty, nothing plugged in, the relay fitted. Meter on **resistance**, not beep.
- Hold the black probe on the hole named above each table and move the red probe down its rows.
- **open (OL)** is what the meter shows with its probes in the air.
- A reading under about 5 Ω where the table says anything else is a bridge. The last column lists the neighbouring hole pairs to look at; clear it with braid and read that row again.
- **SMOKE** rows: the bridge destroys a part at power-up or at the first pump run. **SAFETY** rows: the board works, but a toggle's OFF, the E-stop or the relay no longer cuts what it should.
- Tick every row on a printout. Don't skip the rows that look alike: they are different holes.




**Main board, solder bridges: 51 net pairs (22 SMOKE, 29 SAFETY)**

**Black probe on AG45 (OUT7)**

| # | red probe on | must read | kind | a reading near 0 Ω means | look at these neighbouring holes |
| --- | --- | --- | --- | --- | --- |
| M1 | AF45 (PSW1) | open (OL) | SMOKE | pump supply straight on ULN2803A OUT7: that channel shorts the supply when it turns on | AG45/AF45 |
| M2 | AF41 (PSW2) | open (OL) | SMOKE | pump supply straight on ULN2803A OUT7: that channel shorts the supply when it turns on | AG41/AF41 |
| M3 | AF37 (PSW3) | open (OL) | SMOKE | pump supply straight on ULN2803A OUT7: that channel shorts the supply when it turns on | AG37/AF37 |
| M4 | AF33 (PSW4) | open (OL) | SMOKE | pump supply straight on ULN2803A OUT7: that channel shorts the supply when it turns on | AG33/AF33 |
| M5 | AF25 (PSW5) | open (OL) | SMOKE | pump supply straight on ULN2803A OUT7: that channel shorts the supply when it turns on | AG25/AF25 |
| M6 | AF21 (PSW7) | open (OL) | SMOKE | pump supply straight on ULN2803A OUT7: that channel shorts the supply when it turns on | AG21/AF21 |
| M7 | AF27 (REFP) | open (OL) | SMOKE | pump supply straight on ULN2803A OUT7: that channel shorts the supply when it turns on | AG27/AF27 AG29/AF29 |
| M8 | AF47 (OUT1) | open (OL) | SAFETY | two pump outputs joined: commanding one pump runs both (pH up with pH down, or double dosing) | AF47/AG47 |
| M9 | AF43 (OUT2) | open (OL) | SAFETY | two pump outputs joined: commanding one pump runs both (pH up with pH down, or double dosing) | AF43/AG43 |
| M10 | AF39 (OUT3) | open (OL) | SAFETY | two pump outputs joined: commanding one pump runs both (pH up with pH down, or double dosing) | AF39/AG39 |
| M11 | AF35 (OUT4) | open (OL) | SAFETY | two pump outputs joined: commanding one pump runs both (pH up with pH down, or double dosing) | AF35/AG35 |
| M12 | AF31 (OUT5) | open (OL) | SAFETY | two pump outputs joined: commanding one pump runs both (pH up with pH down, or double dosing) | AF31/AG31 |
| M13 | X15 (OUT6) | open (OL) | SAFETY | two pump outputs joined: commanding one pump runs both (pH up with pH down, or double dosing) | X15/X14 AF23/AG23 |

**Black probe on P23 (L5V)**

| # | red probe on | must read | kind | a reading near 0 Ω means | look at these neighbouring holes |
| --- | --- | --- | --- | --- | --- |
| M14 | P24 (ESNS) | about 50.2 kΩ; a diode is on the path, so one probe polarity may read lower, never 0 Ω | SMOKE | 5 V straight on a 3.3 V pin (ESNS) | P24/P23 P24/O24 |
| M15 | Q1 (LEAK) | open (OL) | SMOKE | 5 V straight on a 3.3 V pin (LEAK) | Q2/Q1 |
| M16 | U24 (ESN) | about 49.4 kΩ; a diode is on the path, so one probe polarity may read lower, never 0 Ω | SAFETY | joins the pump supply to the logic supply: the E-stop/K1/fuse chain is bypassed through the logic charger and the two chargers fight | U24/U23 V24/V23 |
| M17 | X21 (PSW7) | open (OL) | SAFETY | joins the pump supply to the logic supply: the E-stop/K1/fuse chain is bypassed through the logic charger and the two chargers fight | X22/X21 |
| M18 | U22 (S35V) | open (OL); a diode is on the path, so one probe polarity may read lower, never 0 Ω | SAFETY | bypasses D8: the logic charger and a PC on the USB port back-feed each other | U23/U22 |

**Black probe on W33 (K1C)**

| # | red probe on | must read | kind | a reading near 0 Ω means | look at these neighbouring holes |
| --- | --- | --- | --- | --- | --- |
| M19 | V33 (ESN) | about 70 Ω | SMOKE | the S8050 shorts that supply to ground when it turns K1 on (ESN: coil shorted; a PSWn: through that pump's toggle); with K1 off the coil back-feeds 5 V into that net | V33/W33 |
| M20 | X33 (PSW4) | open (OL) | SMOKE | the S8050 shorts that supply to ground when it turns K1 on (ESN: coil shorted; a PSWn: through that pump's toggle); with K1 off the coil back-feeds 5 V into that net | X32/X33 W33/X33 |
| M21 | W31 (K1B) | about 29.5 kΩ | SAFETY | S8050 base joined to its collector: it turns itself on through the coil, K1 closes whenever the E-stop is released, with no command | W31/W32 X31/X32 |

**Black probe on AD44 (OUT2)**

| # | red probe on | must read | kind | a reading near 0 Ω means | look at these neighbouring holes |
| --- | --- | --- | --- | --- | --- |
| M22 | AD45 (PSW1) | open (OL) | SMOKE | pump supply straight on ULN2803A OUT2: that channel shorts the supply when it turns on | AD44/AD45 AE44/AE45 |
| M23 | X20 (OUT1) | open (OL) | SAFETY | two pump outputs joined: commanding one pump runs both (pH up with pH down, or double dosing) | X20/X19 |
| M24 | X18 (OUT3) | open (OL) | SAFETY | two pump outputs joined: commanding one pump runs both (pH up with pH down, or double dosing) | X19/X18 |

**Black probe on AD36 (OUT4)**

| # | red probe on | must read | kind | a reading near 0 Ω means | look at these neighbouring holes |
| --- | --- | --- | --- | --- | --- |
| M25 | AD37 (PSW3) | open (OL) | SMOKE | pump supply straight on ULN2803A OUT4: that channel shorts the supply when it turns on | AD36/AD37 AE36/AE37 |
| M26 | X18 (OUT3) | open (OL) | SAFETY | two pump outputs joined: commanding one pump runs both (pH up with pH down, or double dosing) | X18/X17 |
| M27 | X16 (OUT5) | open (OL) | SAFETY | two pump outputs joined: commanding one pump runs both (pH up with pH down, or double dosing) | X17/X16 |

**Black probe on AD24 (OUT6)**

| # | red probe on | must read | kind | a reading near 0 Ω means | look at these neighbouring holes |
| --- | --- | --- | --- | --- | --- |
| M28 | AD25 (PSW5) | open (OL) | SMOKE | pump supply straight on ULN2803A OUT6: that channel shorts the supply when it turns on | AD24/AD25 AE24/AE25 |
| M29 | AE21 (PSW7) | open (OL); a diode is on the path, so one probe polarity may read lower, never 0 Ω | SMOKE | pump supply straight on ULN2803A OUT6: that channel shorts the supply when it turns on | AE22/AE21 |
| M30 | X16 (OUT5) | open (OL) | SAFETY | two pump outputs joined: commanding one pump runs both (pH up with pH down, or double dosing) | X16/X15 |

**Black probe on W45 (RAIL)**

| # | red probe on | must read | kind | a reading near 0 Ω means | look at these neighbouring holes |
| --- | --- | --- | --- | --- | --- |
| M31 | X45 (PSW1) | open (OL) | SAFETY | PSW1 and RAIL joined: that pump's toggle is bypassed, OFF no longer cuts it | X45/W45 |
| M32 | X41 (PSW2) | open (OL) | SAFETY | PSW2 and RAIL joined: that pump's toggle is bypassed, OFF no longer cuts it | X41/W41 |
| M33 | X49 (PSW6) | open (OL) | SAFETY | PSW6 and RAIL joined: that pump's toggle is bypassed, OFF no longer cuts it | X49/X48 |

**Black probe on L14 (CIRCEN)**

| # | red probe on | must read | kind | a reading near 0 Ω means | look at these neighbouring holes |
| --- | --- | --- | --- | --- | --- |
| M34 | L15 (DRAINEN) | open (OL) | SAFETY | two pump enables joined: commanding one pump runs both; two GPIO outputs fight (~40 mA) | L14/L15 M14/M15 N14/N15 O14/O15 P14/P15 Q14/Q15 R14/R15 S14/S15 T14/T15 U14/U15 |
| M35 | L13 (K1EN) | open (OL) | SAFETY | pump enable follows K1EN: the pump runs when that line is high | L14/L13 M14/M13 N14/N13 O14/O13 P14/P13 Q14/Q13 R14/R13 S14/S13 |

**Black probe on M32 (ECPWR)**

| # | red probe on | must read | kind | a reading near 0 Ω means | look at these neighbouring holes |
| --- | --- | --- | --- | --- | --- |
| M36 | M33 (PHPO) | open (OL) | SMOKE | PHPO can sit at 5 V (sensor side of the divider/diode): 5 V on ECPWR | M32/M33 |
| M37 | L10 (ESNS) | open (OL) | SAFETY | E-stop sense (GPIO17) follows ECPWR: the firmware can miss a pressed E-stop (the hardware cut still works) | L9/L10 M9/M10 N9/N10 O9/O10 P9/P10 |

**Black probe on L18 (NAEN)**

| # | red probe on | must read | kind | a reading near 0 Ω means | look at these neighbouring holes |
| --- | --- | --- | --- | --- | --- |
| M38 | L17 (NBEN) | open (OL) | SAFETY | two pump enables joined: commanding one pump runs both; two GPIO outputs fight (~40 mA) | L18/L17 M18/M17 N18/N17 O18/O17 P18/P17 Q18/Q17 R18/R17 S18/S17 T18/T17 U18/U17 |
| M39 | L19 (PHDEN) | open (OL) | SAFETY | two pump enables joined: commanding one pump runs both; two GPIO outputs fight (~40 mA) | L18/L19 M18/M19 N18/N19 O18/O19 P18/P19 Q18/Q19 R18/R19 S18/S19 T18/T19 U18/U19 |

**Black probe on L20 (PHUEN)**

| # | red probe on | must read | kind | a reading near 0 Ω means | look at these neighbouring holes |
| --- | --- | --- | --- | --- | --- |
| M40 | L21 (S35V) | open (OL) | SMOKE | 5 V straight on a 3.3 V pin (PHUEN) | L20/L21 M20/M21 N20/N21 O20/O21 P20/P21 Q20/Q21 R20/R21 S20/S21 T20/T21 U20/U21 |
| M41 | L19 (PHDEN) | open (OL) | SAFETY | two pump enables joined: commanding one pump runs both; two GPIO outputs fight (~40 mA) | L19/L20 M19/M20 N19/N20 O19/O20 P19/P20 Q19/Q20 R19/R20 S19/S20 T19/T20 U19/U20 |

**Black probe on L16 (REFEN)**

| # | red probe on | must read | kind | a reading near 0 Ω means | look at these neighbouring holes |
| --- | --- | --- | --- | --- | --- |
| M42 | L15 (DRAINEN) | open (OL) | SAFETY | two pump enables joined: commanding one pump runs both; two GPIO outputs fight (~40 mA) | L15/L16 M15/M16 N15/N16 O15/O16 P15/P16 Q15/Q16 R15/R16 S15/S16 T15/T16 U15/U16 |
| M43 | L17 (NBEN) | open (OL) | SAFETY | two pump enables joined: commanding one pump runs both; two GPIO outputs fight (~40 mA) | L17/L16 M17/M16 N17/N16 O17/O16 P17/P16 Q17/Q16 R17/R16 S17/S16 T17/T16 U17/U16 |

**Black probe on L11 (ECHO3)**

| # | red probe on | must read | kind | a reading near 0 Ω means | look at these neighbouring holes |
| --- | --- | --- | --- | --- | --- |
| M44 | L10 (ESNS) | about 23.5 kΩ | SAFETY | E-stop sense (GPIO17) follows ECHO3: the firmware can miss a pressed E-stop (the hardware cut still works) | L11/L10 M11/M10 N11/N10 O11/O10 P11/P10 |

**Black probe on W37 (ESN)**

| # | red probe on | must read | kind | a reading near 0 Ω means | look at these neighbouring holes |
| --- | --- | --- | --- | --- | --- |
| M45 | X37 (PSW3) | open (OL) | SAFETY | ESN and PSW3 joined: that pump's toggle is bypassed, OFF no longer cuts it | W37/X37 |

**Black probe on S50 (GNDP)**

| # | red probe on | must read | kind | a reading near 0 Ω means | look at these neighbouring holes |
| --- | --- | --- | --- | --- | --- |
| M46 | S51 (PIN) | about 30.0 kΩ; a diode is on the path, so one probe polarity may read lower, never 0 Ω | SMOKE | PIN is before its fuse: a dead short across the charger with only the charger's own protection | S50/S51 |

**Black probe on L13 (K1EN)**

| # | red probe on | must read | kind | a reading near 0 Ω means | look at these neighbouring holes |
| --- | --- | --- | --- | --- | --- |
| M47 | L12 (TRIG) | open (OL) | SAFETY | K1 enable follows TRIG: the relay closes when that line is high | L13/L12 M13/M12 N13/N12 O13/O12 P13/P12 Q13/Q12 R13/R12 S13/S12 |

**Black probe on X20 (OUT1)**

| # | red probe on | must read | kind | a reading near 0 Ω means | look at these neighbouring holes |
| --- | --- | --- | --- | --- | --- |
| M48 | X21 (PSW7) | open (OL) | SMOKE | pump supply straight on ULN2803A OUT1: that channel shorts the supply when it turns on | X20/X21 |

**Black probe on AD40 (OUT3)**

| # | red probe on | must read | kind | a reading near 0 Ω means | look at these neighbouring holes |
| --- | --- | --- | --- | --- | --- |
| M49 | AD41 (PSW2) | open (OL) | SMOKE | pump supply straight on ULN2803A OUT3: that channel shorts the supply when it turns on | AD40/AD41 AE40/AE41 |

**Black probe on AD32 (OUT5)**

| # | red probe on | must read | kind | a reading near 0 Ω means | look at these neighbouring holes |
| --- | --- | --- | --- | --- | --- |
| M50 | AD33 (PSW4) | open (OL) | SMOKE | pump supply straight on ULN2803A OUT5: that channel shorts the supply when it turns on | AD32/AD33 AE32/AE33 |

**Black probe on Z6 (XHIGH)**

| # | red probe on | must read | kind | a reading near 0 Ω means | look at these neighbouring holes |
| --- | --- | --- | --- | --- | --- |
| M51 | Z5 (XLOWS) | open (OL) | SMOKE | XLOWS can sit at 5 V (sensor side of the divider/diode): 5 V on XHIGH | Z6/Z5 |

**Main board, supplies to ground: black probe on B1 (GNDL)**

| # | red probe on | must read |
| --- | --- | --- |
| MS1 | S51 (PIN) | no beep; climbs as the 1000 µF capacitor charges, then over 10 kΩ (swap the probes if it starts low) |
| MS2 | O43 (PFUSE) | no beep; climbs as the 1000 µF capacitor charges, then over 10 kΩ (swap the probes if it starts low) |
| MS3 | X12 (ESN) | about 19.4 kΩ |
| MS4 | O39 (RAIL) | about 30.0 kΩ |
| MS5 | M51 (LIN) | no beep; climbs as the 1000 µF capacitor charges, then over 10 kΩ (swap the probes if it starts low) |
| MS6 | AA1 (L5V) | no beep; climbs as the 1000 µF capacitor charges, then over 10 kΩ (swap the probes if it starts low) |
| MS7 | L21 (S35V) | open (OL); a diode is on the path, so one probe polarity may read lower, never 0 Ω |
| MS8 | L1 (V33) | open (OL) |




**Done when** every row of all these tables passes. Nothing gets power until Stage 7.

## Stage 5: the panel board, in solder order

The panel board hangs behind the lid and carries the toggle-switch chip (MCP23017), the knob filters, the buzzer and the display header. Same method as the main board: low parts first, wiring last. Mark the rows and columns first, as in 4.1.

[![A flat top-down drawing of the hand-wired panel board to scale, component side: the MCP23017 in its socket, its 14 pull-up resistors to the left, the black buzzer with its transistor and diode at the top right, the knob’s filter resistors and capacitors, the display header and the two headers for the leads to the main board with their coloured wire ends, and the seven groups of five coloured wire stubs for the toggles along the bottom edge](/media/picofarm/revb/panel/panel-protoboard-2d.png)](/media/picofarm/revb/panel/panel-protoboard-2d.png)

[![The hand-wired panel board’s solder side, mirrored as the builder sees it: the perfboard holes, the grey bare runs, the green, white, red, yellow, blue and black insulated wires, the solder joints, and the parts’ outlines and references ghosted through the board](/media/picofarm/revb/panel/panel-protoboard-2d-solder.png)](/media/picofarm/revb/panel/panel-protoboard-2d-solder.png)

*The finished panel board, component side and solder side (mirrored). 2D renders to scale, drawn from the protoboard layout files: every hole, part, bare run and wire is where the wire list puts it.*

[![Panel board, component side](/media/picofarm/revb/panel/board-top.svg)](/media/picofarm/revb/panel/board-top.svg)

### 5.1 Three wires first

Lay these three insulated wires on the solder side now. The bodies of R7, R8 and R9 lie across their path, so they are easier to place first.

| Wire | Colour | Carries | From → to |
| --- | --- | --- | --- |
| W65 | blue | I2C SDA | X40 → AF40 |
| W66 | white | display reset | X41 → AF41 |
| W67 | yellow | I2C SCL | W42 → AF42 |

### 5.2 Resistors (22 × 10 kΩ, 2 × 1 kΩ)

| Value | Refs and holes |
| --- | --- |
| 10 kΩ, switch pull-ups | R10 P6–P10, R11 Q9–Q13, R12 R12–R16, R13 S15–S19, R14 P18–P22, R15 Q21–Q25, R16 R24–R28, R20 R19–R23, R21 Q16–Q20, R22 P13–P17, R23 S10–S14, R24 R7–R11, R25 Q4–Q8, R26 P1–P5 |
| 10 kΩ, other | R1 R48–N48, R2 R41–R45, R3 Q40–Q44, R4 AB34–X34, R5 AC35–Y35, R8 AB39–AB43, R9 AE39–AE43, R17 Y38–AC38 |
| 1 kΩ | R6 A47–A51, R7 Z39–Z43 |

### 5.3 Diode, capacitors, transistor, buzzer

| Ref | Part | Holes | Watch |
| --- | --- | --- | --- |
| D1 | BAT85 (a 1N5819 also works here) | band in H51, other end E51 | glass: bend beyond pliers |
| C1, C2 | 100 nF, 2.54 mm leads | C1 J48–J49, C2 Q34–R34 | |
| C3, C4 | 10 nF, 2.54 mm leads | C3 AB44–AC44, C4 AD43–AC43 | |
| C5 | **1 nF** (marked 102), 2.54 mm leads | Z50–AC50 | spread its leads to the 7.62 mm gap (two empty holes between); not 10 nF: the knob's push switch shares a boot pin with the chip |
| Q1 | S8050 | E C49, B C50, C C51 | flat face toward row D, as drawn |
| BZ1 | 5 V buzzer | + in H48, − in E48 | fit it after the resistors; it is tall |

### 5.4 Socket and headers

1. **MCP23017 socket (DIP-28):** pins 1-14 in I36 to V36, pins 15-28 in V39 back to I39, with the notch at the row-I end. Pin 1 is I36: seen from the parts side the notch is at the top and pin 1 at its left, as on the chip's datasheet.
2. **Ribbon headers (straight male pins):** a 15-pin strip in column 52 from P52 to AD52 (TO MAIN A), a 10-pin strip in row AE from AE25 to AE34 (TO MAIN B), and one single pin in AE44 (labelled A16: J1 pin 16).
3. **Display header J2 (1×14, right-angle male):** along the bottom edge, pin 1 in AF51, then AF50, … pin 14 in AF38, pins pointing off the board's edge.

### 5.5 Bare runs and the other wires

All on the solder side, from the panel wire list: the 90 bare runs B1-B90, then the other 64 insulated wires (W1-W64). The rail along the bottom edge and the ground row above it are bare runs; keep them straight, because the toggle leads join them in Stage 6. Beep each group of ten as on the main board.

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

Then the panel's bridge tables, read the same way as the main board's in 4.12 (socket empty, nothing plugged in, meter on resistance), and a diode test of D1 on the diode range. D1 backwards shorts the 5 V supply through the buzzer's transistor at the first beep.




**Panel board, solder bridges: 21 net pairs (1 SMOKE, 20 SAFETY)**

**Black probe on AF6 (RAIL)**

| # | red probe on | must read | kind | a reading near 0 Ω means | look at these neighbouring holes |
| --- | --- | --- | --- | --- | --- |
| P1 | AE6 (PSW1) | open (OL) | SAFETY | PSW1 and RAIL joined: that pump's toggle is bypassed, OFF no longer cuts it | AE6/AF6 |
| P2 | AE9 (PSW2) | open (OL) | SAFETY | PSW2 and RAIL joined: that pump's toggle is bypassed, OFF no longer cuts it | AE9/AF9 |
| P3 | AE12 (PSW3) | open (OL) | SAFETY | PSW3 and RAIL joined: that pump's toggle is bypassed, OFF no longer cuts it | AE12/AF12 |
| P4 | AE15 (PSW4) | open (OL) | SAFETY | PSW4 and RAIL joined: that pump's toggle is bypassed, OFF no longer cuts it | AE15/AF15 |
| P5 | AE18 (PSW5) | open (OL) | SAFETY | PSW5 and RAIL joined: that pump's toggle is bypassed, OFF no longer cuts it | AE18/AF18 |
| P6 | AE21 (PSW6) | open (OL) | SAFETY | PSW6 and RAIL joined: that pump's toggle is bypassed, OFF no longer cuts it | AE21/AF21 AE28/AE27 |
| P7 | AE24 (PSW7) | open (OL) | SAFETY | PSW7 and RAIL joined: that pump's toggle is bypassed, OFF no longer cuts it | AE24/AF24 AE25/AE26 |

**Black probe on I23 (HAND1)**

| # | red probe on | must read | kind | a reading near 0 Ω means | look at these neighbouring holes |
| --- | --- | --- | --- | --- | --- |
| P8 | H23 (AUTO7) | about 20.0 kΩ | SAFETY | HAND1 and AUTO7 joined: one line pulls the other low, the firmware sees a toggle in HAND that is not, and runs that pump (until max_s) | H23/I23 H24/I24 H25/I25 H26/I26 H27/I27 H28/I28 H29/I29 H30/I30 H31/I31 H32/I32 H33/I33 H34/I34 H35/I35 H36/I36 |
| P9 | J9 (HAND2) | about 20.0 kΩ | SAFETY | HAND1 and HAND2 joined: one line pulls the other low, the firmware sees a toggle in HAND that is not, and runs that pump (until max_s) | I9/J9 I10/J10 I11/J11 I12/J12 I13/J13 I14/J14 I15/J15 I16/J16 I17/J17 I18/J18 I19/J19 I20/J20 I21/J21 I22/J22 I23/J23 I24/J24 I25/J25 I26/J26 I27/J27 I28/J28 I29/J29 I30/J30 I31/J31 I32/J32 I33/J33 I34/J34 I35/J35 I36/J36 |

**Black probe on K12 (HAND3)**

| # | red probe on | must read | kind | a reading near 0 Ω means | look at these neighbouring holes |
| --- | --- | --- | --- | --- | --- |
| P10 | J12 (HAND2) | about 20.0 kΩ | SAFETY | HAND2 and HAND3 joined: one line pulls the other low, the firmware sees a toggle in HAND that is not, and runs that pump (until max_s) | J12/K12 J13/K13 J14/K14 J15/K15 J16/K16 J17/K17 J18/K18 J19/K19 J20/K20 J21/K21 J22/K22 J23/K23 J24/K24 J25/K25 J26/K26 J27/K27 J28/K28 J29/K29 J30/K30 J31/K31 J32/K32 J33/K33 J34/K34 J35/K35 J36/K36 |
| P11 | L15 (HAND4) | about 20.0 kΩ | SAFETY | HAND3 and HAND4 joined: one line pulls the other low, the firmware sees a toggle in HAND that is not, and runs that pump (until max_s) | K15/L15 K16/L16 K17/L17 K18/L18 K19/L19 K20/L20 K21/L21 K22/L22 K23/L23 K24/L24 K25/L25 K26/L26 K27/L27 K28/L28 K29/L29 K30/L30 K31/L31 K32/L32 K33/L33 K34/L34 K35/L35 K36/L36 |

**Black probe on M18 (HAND5)**

| # | red probe on | must read | kind | a reading near 0 Ω means | look at these neighbouring holes |
| --- | --- | --- | --- | --- | --- |
| P12 | L18 (HAND4) | about 20.0 kΩ | SAFETY | HAND4 and HAND5 joined: one line pulls the other low, the firmware sees a toggle in HAND that is not, and runs that pump (until max_s) | L18/M18 L19/M19 L20/M20 L21/M21 L22/M22 L23/M23 L24/M24 L25/M25 L26/M26 L27/M27 L28/M28 L29/M29 L30/M30 L31/M31 L32/M32 L33/M33 L34/M34 L35/M35 L36/M36 |
| P13 | N21 (HAND6) | about 20.0 kΩ | SAFETY | HAND5 and HAND6 joined: one line pulls the other low, the firmware sees a toggle in HAND that is not, and runs that pump (until max_s) | M21/N21 M22/N22 M23/N23 M24/N24 M25/N25 M26/N26 M27/N27 M28/N28 M29/N29 M30/N30 M31/N31 M32/N32 M33/N33 M34/N34 M35/N35 M36/N36 |

**Black probe on O35 (HAND7)**

| # | red probe on | must read | kind | a reading near 0 Ω means | look at these neighbouring holes |
| --- | --- | --- | --- | --- | --- |
| P14 | P35 (BUZ) | open (OL) | SAFETY | HAND7 and BUZ joined: one line pulls the other low, the firmware sees a toggle in HAND that is not, and runs that pump (until max_s) | P35/O35 P36/O36 |
| P15 | N24 (HAND6) | about 20.0 kΩ | SAFETY | HAND6 and HAND7 joined: one line pulls the other low, the firmware sees a toggle in HAND that is not, and runs that pump (until max_s) | N24/O24 N25/O25 N26/O26 N27/O27 N28/O28 N29/O29 N30/O30 N31/O31 N32/O32 N33/O33 N34/O34 N35/O35 N36/O36 |

**Black probe on AE32 (PSW2)**

| # | red probe on | must read | kind | a reading near 0 Ω means | look at these neighbouring holes |
| --- | --- | --- | --- | --- | --- |
| P16 | AE33 (PSW1) | open (OL) | SAFETY | joins two pumps' switched feeds: either toggle feeds both, OFF no longer cuts one pump | AE33/AE32 |
| P17 | AE31 (PSW3) | open (OL) | SAFETY | joins two pumps' switched feeds: either toggle feeds both, OFF no longer cuts one pump | AE32/AE31 |

**Black probe on AE30 (PSW4)**

| # | red probe on | must read | kind | a reading near 0 Ω means | look at these neighbouring holes |
| --- | --- | --- | --- | --- | --- |
| P18 | AE31 (PSW3) | open (OL) | SAFETY | joins two pumps' switched feeds: either toggle feeds both, OFF no longer cuts one pump | AE31/AE30 |
| P19 | AE29 (PSW5) | open (OL) | SAFETY | joins two pumps' switched feeds: either toggle feeds both, OFF no longer cuts one pump | AE30/AE29 |

**Black probe on H48 (L5V)**

| # | red probe on | must read | kind | a reading near 0 Ω means | look at these neighbouring holes |
| --- | --- | --- | --- | --- | --- |
| P20 | I48 (TFTRST) | open (OL) | SMOKE | 5 V straight on a 3.3 V pin (TFTRST) | H48/I48 |

**Black probe on AE29 (PSW5)**

| # | red probe on | must read | kind | a reading near 0 Ω means | look at these neighbouring holes |
| --- | --- | --- | --- | --- | --- |
| P21 | AE28 (PSW6) | open (OL) | SAFETY | joins two pumps' switched feeds: either toggle feeds both, OFF no longer cuts one pump | AE29/AE28 |

**Panel board, supplies to ground: black probe on AD6 (GNDL)**

| # | red probe on | must read |
| --- | --- | --- |
| PS1 | H48 (L5V) | open (OL) |
| PS2 | P1 (V33) | open (OL) |
| PS3 | AF6 (RAIL) | open (OL) |

**Panel board, diode test (meter on the diode range)**

| # | diode | red probe on (plain end) | black probe on (band end) | must read | swapped probes |
| --- | --- | --- | --- | --- | --- |
| PD1 | D1 BAT85 | E51 (BZN) | H51 (L5V) | 0.15 to 0.45 V | OL |




**Done when** every row of all these tables passes. Leave the MCP23017 out of its socket until Stage 7.

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
    - The single lead: the panel's pin labelled A16 (hole AE44) to the main board's single pin in hole A17 (backlight).
    - The 10-wide strip: panel TO MAIN B to the main board's single pins: 25 (X21), 23 (X25), 22 (X33), 21 (X37), 20 (X41), 19 (X45), the 3-pin piece 17-18-24 (X47-X49) and 26 (P26).
    - **Mark lead 1 of the 15-wide strip with a paint dot at both ends.** It is the 5 V lead. One pin off, this strip can put 5 V on the 3.3 V line, so it must always go on the same way. On the panel it goes on P52 (L5V), the top pin of TO MAIN A. On the main board it goes on O24 (L5V), the bottom pin of header A, in row O. Put a dot beside that pin too.
    - Wrap a turn of tape round the 15 housings at each end, so the strip goes on and comes off as one block.
3. Don't plug the ribbon into the main board yet: the ESP32 has to be flashed first (Stage 7), and the ribbon blocks its USB ports.

**Done when** every toggle passes the check in 6.2, knob A and B each beep to C in turn as you turn it, and S1 beeps to S2 when you press it.

## Stage 7: first power-up, flashing, fitting the chips

Power the bare board first, so a wiring fault can only damage solder and wire, not the chips. Then flash the ESP32 off the board, and fit the chips one step at a time.

### 7.1 Make the two supply leads

Each supply is a certified USB charger, a short USB cable, and a USB-C to 2-pin adapter whose two screws go into a 2-pin plug. Pump supply: the 5 V 3 A USB-C charger into PUMP IN. Logic supply: the 5 V USB-A charger, through a USB-A to USB-C cable, into LOGIC IN. Mark each plug's + side with red marker.

Use only the adapters and chargers that passed Stage 2, with the + screw you marked there. If the ESP32 board's regulator read AMS1117, the logic charger is a 5 V 2 A one and its lead is short and thick.

**Colour the plugs to match their headers** (4.8): the PUMP IN plug, the LOGIC IN plug and the E-stop's plug each get the colour of their header. The three plugs are the same part and sit side by side. A plug only ever goes into the header of its own colour, with its red + mark beside the + written on the board.

The two leads need different cables: USB-C to USB-C for the pump charger (both ends are USB-C), USB-A to USB-C for the logic charger. Check which kind your 0.25 m cables are; any short cable of the missing kind works.

### 7.2 Power the bare board (no chips, no modules)


**Before you plug in a charger, look at the two big capacitors once more.** C1's stripe (its − side) is toward S45 (GNDP) and C2's stripe toward I49 (GNDL). A 1000 µF capacitor fitted backwards shows on no meter; it heats up and bursts within minutes of getting power.


Meter on DC volts. Plug the E-stop into E-STOP, released.

1. **Logic charger only.** Black probe on LOGIC IN − (O53).
    - LOGIC IN + (M53): 4.9 to 5.3 V. A reading of −5 V means the lead is backwards: unplug at once.
    - ESP32 socket L21 (the dev board's 5 V pin): 4.5 to 5.2 V.
    - Leave it plugged in for one minute, then touch C2: it must be cold. Warm: unplug at once. It is in backwards; fit a new one the right way round (the old one is damaged).
    - Unplug.
2. **Pump charger only.** Black probe on PUMP IN − (Q53).
    - E-STOP pin 1 (U53): 4.9 to 5.3 V. A reading of −5 V means the lead is backwards: unplug at once.
    - E-STOP pin 2 (W53): the same with the button released, 0 V with it pressed.
    - CIRC pin 1 (Z53, the pump rail): 0 V. The relay is off, because nothing drives it yet.
    - After one minute, touch C1: cold, as for C2.
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
3. In the monitor, check the boot text ends with `type 'help' for commands`. The Wi-Fi and the server are normally set from the panel's own screen once it is connected (step 7.6). If you would rather do it now over the cable, the console takes the same settings, and they apply at once without a restart:
    - `wifi <your Wi-Fi name> <password>`. A name or password with a space in it needs the JSON form that `help` shows: `{"op":"wifi","ssid":"..","pass":".."}`.
    - `mqtt <server address> 1884 pf-device <device password>` (the device password is the server's `PF_DEVICE_MQTT_PASS` setting).
    - `ip dhcp` (the default) or `ip static <ip> <mask> <gateway> [dns]` for a fixed address.
    - `name <a name for this controller>`
    - `status` prints one line of JSON. `"wifi":"<an IP address>"` means it joined; `"ads":false` and `"temp_probe":false` are expected while nothing is fitted.
    - `offline on` if this controller will run with no server at all (the panel runs everything; `offline off`, the panel's Network page or holding BOOT for 3 s bring Wi-Fi back).
4. Unplug the ESP32 from the computer.

**A rule for every later flash or monitor session:** once the panel is connected (7.6), never run the controller from the computer alone. Without the logic charger the display and its touch chip have no supply while the ESP32 still drives their lines, and the unpowered touch chip holds the sensor bus down, so the level, pH and supply readings stop. Either the logic charger is plugged in as well (only if the board passed the USB diode test in Stage 2 and 7.5), or the 15-wide strip and the single backlight lead are unplugged from the main board first.

Until the controller joins a server, it runs on its own panel. On the panel, Network shows the link's state and four settings (Wi-Fi, IP settings, Server, Offline mode); every dialog works by touch and by the knob, and a password is typed on the screen's keyboard.

### 7.4 Fit the chips and modules (both chargers unplugged)

1. **ULN2803A** into its socket, notch at the column-20 end. Check that no leg folded under.
2. **ESP32-S3 board** into its sockets: antenna end at the left edge (column 1), USB ports toward header A.
3. **ADS1115 modules** into their two sockets, VDD at row A, components up. Either module goes in either socket: the board sets their addresses.
4. **Three checks before any power.** A chip turned round or one pin along in its socket burns at power-up.
    - Look along every socket from the side: no pin hangs outside the end of a socket, and none is bent under.
    - Unplug the E-stop's plug from E-STOP first (or press the button). Then meter on diode test, red probe on AF47 (OUT1), the lower pin of the pH UP header, black probe on Q53 (GNDP), PUMP IN −. It must read OL. A steady 0.5 to 0.7 V means the ULN2803A is in backwards: lift it out and turn it. (With the E-stop plugged in and released, the reading starts low and climbs to OL over a few seconds while the meter charges C1 through the chip: that is a correctly fitted chip, but unplug the E-stop and measure again to be sure.) Plug the E-stop back in afterwards.
    - Meter on beep, on the ESP32 board's own pins: 3V3, at L1 (V33), to G, at B1 (GNDL). It must not beep. A steady beep means the board is in the wrong way round or one pin along.

[![Main board, component side, assembled](/media/picofarm/revb/main/board-top.svg)](/media/picofarm/revb/main/board-top.svg)

### 7.5 Power up with the chips (still no panel)

The ribbon isn't plugged in, so you can still reach the ESP32's UART port. First check that the ESP32 board can't push the charger's power back into the computer. Plug a USB-A to USB-C cable into its UART port with nothing on the other end, and plug in the logic charger. Then measure the free USB-A plug's two outer pins (pin 1 to pin 4).

- **0 V:** the board has a diode on that port. Unplug the charger, connect the computer, open the monitor, then plug the charger back in.
- **About 5 V:** the board has no diode there, or its USB-OTG ("IN-OUT") jumper is bridged. Never connect the computer and the logic charger at the same time. Do this stage on the computer's power alone; the pH and level boards stay unpowered, which is fine here. It is the last time computer power alone is allowed: see the rule at the end of 7.3.

1. The monitor shows the boot, including `[sensors] ADS1115 found` and `[panel] power monitor (ADS1115 0x49) found`. `[panel] no MCP23017 at 0x20 ...` is expected until the panel is connected. The relay stays off.
2. Plug in the pump charger. Within a few seconds of the first sensor reading, the relay clicks on and CIRC pin 1 shows 5 V.
3. Press the E-stop: the relay drops at once and CIRC pin 1 goes to 0 V. `status` lists `estop` under `alarms`, with `"estop_src":"hardware"`.
4. Release it. Nothing restarts. Type `restart`: the relay clicks back on.

### 7.6 Connect the panel (both chargers unplugged)

1. Fit the **MCP23017** in its socket, notch at the row-I end. Then check it, before the ribbon goes on: meter on diode test, red probe on R52 (V33), TO MAIN A pin 3, black probe on AC12 (AUTO3), toggle 3's A hole. It should read OL. A reading of 0.5 to 0.7 V means the chip is in backwards: lift it out and turn it.
2. Plug the ribbon onto the main board in this order:
    - **first the single lead 26**, onto the single pin P26 (GNDL). It is the panel's ground. With it on, a misplaced strip makes a short that the fuse limits; with it off, the same mistake puts 5 V on the 3.3 V line;
    - then the 15-wide strip onto header A, its painted lead 1 on the painted pin O24 (L5V) in row O. Look from both sides: no pin of the header shows beside the block, at either end;
    - then the single backlight lead and the 10-wide strip's leads, each on the pin with its number (6.5).
3. **Meter check before power**, on beep. If the display's backlight failed its Stage 2 check, its LED lead stays off.
    - 5 V to 3.3 V: M35 (L5V), pin 1 of the pH header, to the ESP32 board's 3V3 pin, L1 (V33). No beep. From the solder side the same check is O24 (L5V) to M24 (V33).
    - 5 V to ground: M35 (L5V) to the ESP32 board's G pin, B1 (GNDL). No steady beep (a short chirp while the big capacitor charges is normal).
    - 3.3 V to ground: L1 (V33) to B1 (GNDL). No beep.

   A beep: the 15-wide strip is one pin off. Unplug it, count the pins again and repeat the check.
4. **Plug in the logic charger, not the computer.** From here on the rule at the end of 7.3 applies: never the computer alone while the panel is connected.
5. The display lights and shows the Overview page. Move each toggle and watch its pump change between AUTO, OFF and HAND on the screen. (Before the panel was plugged in, every switch read as AUTO.)
6. Put the controller on the network from the screen (unless you did it over the cable in 7.3): touch **Network** in the bar at the bottom, then **Wi-Fi**; the list fills with the networks around you, strongest first. Touch yours, type its password on the keyboard (**Show** lets you check it), **Join**; the Wi-Fi row says "joined" with the address, or why not. Then **Server**: the server's address, port 1884, user `pf-device` and the device password (the server's `PF_DEVICE_MQTT_PASS` setting), **Save & connect**; the Server row says "connected" and the top bar "server online". **IP settings** is only for a fixed address; **Offline mode** is for a controller that will never have a server (the panel runs everything; the same page, or holding BOOT for 3 s, brings Wi-Fi back). Everything here also works with the knob: turn to move, push to press, hold to go back.

**Done when** 7.5 and 7.6 behave as written. If the screen stays white or shows mirrored colours, it is one setting in the firmware's board settings file, `board.h` (colour inversion, red/blue order, rotation, touch axes).

## Stage 8: bench checks

These prove the safety features before any water is near the box. Connect one pump to its plug for the run checks (pH UP is easiest), with its tube in an empty cup. Run every check; tick it off. Check 1 is done with both chargers unplugged. Checks 14 and 16 need the three driver modules and their pumps wired as in 9.1: do that wiring on the bench first, with the pumps' tubes in a bucket of water.

| # | Check | How | Expect | If not |
| --- | --- | --- | --- | --- |
| 1 | Each toggle feeds its own pump, and only that one | Both chargers unplugged, ribbon on, all seven toggles at OFF. Meter on beep, one probe on CIRC pin 1,Z53 (RAIL). The other probe goes in turn on each pump's feed pin: toggle 1 AF45 (PSW1), toggle 2 AF41 (PSW2), toggle 3 AF37 (PSW3), toggle 4 AF33 (PSW4), toggle 5 AF25 (PSW5), toggle 6 AD53 (PSW6), toggle 7 AF21 (PSW7). First touch all seven pins with every toggle at OFF. Then move one toggle to AUTO and to HAND and touch all seven pins again; put it back to OFF before the next toggle. | all OFF: every pin silent. One toggle at AUTO or HAND: its own pin beeps and the six others stay silent | two leads of the 10-wide strip are on each other's pins at the main board (6.5): each toggle would cut the other's pump, or OFF would cut nothing. Swap them and repeat |
| 2 | 3.3 V under Wi-Fi | Meter between the ESP32 socket's 3V3 (L1) and GND (B1) while it connects to Wi-Fi after a restart. | stays at 3.2 V or more | swap D8 for a spare 1N5822: drill U22 and X22 to 1.6 mm and stand it on end, band in U22, as for D1 |
| 3 | Relay at boot | Unplug and replug both chargers. | relay off at power-up, then on after the first reading | stop: don't connect pumps until this is right |
| 4 | Hardware E-stop | Press it while a pump runs. | pump stops at once, `estop` latched, source hardware | |
| 5 | Restart needed | Release the E-stop. | nothing runs until RESTART (Alarms page, confirm) | |
| 6 | Remote E-stop | Press E-STOP on the dashboard while a pump runs (the controller's screen has no E-STOP button: the lid's E-stop is the local one). | pump stops, relay drops a moment later, `estop` latched, source server | |
| 7 | OFF cuts power | Toggle at OFF, then ask for a run from the Pumps page. | refused, reason `switch_off`; the pump never moves | the toggle's pole 1 is mis-wired |
| 8 | HAND | Toggle to HAND. | pump runs, stops after its `max_s`, alarm `hand_timeout` until the toggle leaves HAND | |
| 9 | Pump budget | Three dosing toggles to HAND together. | two run, the third waits ("waiting: two pumps already running") and starts when one stops | |
| 10 | Both throws closed | Briefly join a toggle group's A and H holes with a clip lead. | alarm `switch_fault`, that pump treated as OFF | |
| 11 | Pump supply lost | Unplug the pump charger while a pump runs. | alarm `pump_power` | |
| 12 | Stuck relay | All toggles OFF. Press the E-stop, release it, and don't RESTART. Clip a lead across the relay's COM and NO. | alarm `relay_fault` | |
| 13 | Knob | Turn and press it. Meter from R8's far end, hole AB43 on the panel board (the GPIO20 line), to GND, with the knob resting on a click. | focus moves, push presses; AB43 reads under 0.3 V in the positions where the contact is closed | stays near 3 V: GPIO20's USB pull-up is still on (a firmware fix) |
| 14 | Pump current | Dosing pumps: meter on 10 A in series with each pump at its plug; run it, then pinch its outlet tube for a second. Refill and drain: meter on 10 A in the lead from CIRC pin 1 to the first module's DC+, which feeds all three modules; with circulation running, run refill, block its outlet for a second, then the same for drain. | dosing pumps: 0.3 A or less running. Refill and drain: each primes and moves water, and the total with one of them blocked stays under 2.5 A | a dosing pump over 0.3 A needs its own driver module, like refill and drain. A total over 2.5 A will trip fuse F1 whenever that pump blocks: check the pump and its tube |
| 15 | Relay chatter | Watch the alarm list during checks 3-5. | no `relay_open` alarm when the relay closes normally | |
| 16 | The float stops the refill by itself | Float hanging down, refill toggle to HAND so the refill pump runs. Lift the float by hand. | the pump stops at once, whatever the screen says | the float isn't in the line to the refill module's input: check the FLOAT and REFILL plugs against 9.1 |

After check 12, remove the clip lead, press CLEAR on the Alarms page (`relay_fault` stays latched; RESTART clears only the E-stop), then RESTART. **Done when** all sixteen pass.

The display's backlight current was measured in Stage 2. If it read over 10 mA there, the LED lead stays unplugged until the backlight's transistor is fitted.

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
| Refill module (D4184) | REFILL (J19) | PWM | signal GND | | |
| Drain module (D4184) | DRAIN (J20) | PWM | signal GND | | |
| Circulation module (D4184) | CIRC (J21), two 2-pin plugs glued into one block | DC+ | DC− | PWM | signal GND |

**Refill, drain and circulation each run from their own D4184 module.** The refill and drain pumps (370 type) draw about 0.9 A at every start, nearly twice what one channel of the board's driver chip can take. **Never plug a pump straight into REFILL or DRAIN:** those two plugs only carry a module's input now.


1. **Circulation module:** CIRC pins 1 and 2, Z53 (RAIL) and AB53 (GNDP), go to its DC+ and DC− terminals; pins 3 and 4, AD53 (PSW6) and AF53 (OUT7), to its PWM and signal GND pins.
2. **Power for the other two:** a red and a black stranded 22 AWG wire from the circulation module's DC+ and DC− terminals to the refill module's DC+ and DC−, and on from there to the drain module's. Red is DC+ on all three.
3. **Refill module's input:** REFILL pin 1, AF29 (REFP), to its PWM pin; pin 2, AF31 (OUT5), to its signal GND pin.
4. **Drain module's input:** DRAIN pin 1, AF21 (PSW7), to its PWM pin; pin 2, AF23 (OUT6), to its signal GND pin.
5. **Each pump on its own module's output terminals,** + to +. Solder a 1N5819 across each module's two output terminals, banded end to the + terminal. Solder the 100 nF capacitor across the refill and the drain pump's terminals at the motor, as for the dosing pumps.
6. **Glue the two CIRC plugs into one block.** Push both onto the header, pins 1-2 beside the paint dot at Z53 (RAIL), and run a line of glue along the seam between the two housings (none on the header), or bind them with a small cable tie. Paint a dot on the block at pin 1. Swapped, the two plugs would run the circulation pump's current through one channel of the driver chip and switch the module on for good.
7. **Check with the meter before power** (both chargers unplugged, plugs in, meter on beep):
    - every module's DC+ terminal beeps to Z53 (RAIL), and every DC− terminal to PUMP IN −, Q53 (GNDP);
    - no DC+ terminal beeps to a DC− terminal (a short chirp is the capacitors);
    - each 1N5819, before its pump is connected, on diode test: 0.15 to 0.45 V with red on the output's − terminal and black on its + terminal, OL the other way round. Backwards, it shorts the pump supply through the module the first time that pump runs.


Notes:

- **Check the level switch's colours on its label or listing first.** If yours has a fourth wire, leave it unconnected until you know what it does.
- **Solder a 100 nF capacitor across each brushed pump's two terminals,** at the motor (dosing, refill and drain pumps). It stops the motors' noise reaching the pH probe.
- **The float switch** goes above the high level switch. Fitted as in Stage 2, it is closed with the float down and opens when the water lifts it. It sits in the line to the refill module's input, so it carries only a few milliamps, and an open float switches the refill pump off whatever the firmware does (Stage 8 check 16).
- **The level switches:** if one read the other way round in Stage 2 (low when dry), 9.2 sets that in Manage.
- **The ultrasonic lead:** put a paint dot on the plug at its 5V wire, to match the dot beside J9's pin 1 on the board and the dot on the ultrasonic board (Stage 2). Dot to dot at both ends, every time.
- **PUMP IN, LOGIC IN and E-STOP:** each plug into the header of its own colour (4.8, 7.1), + mark to + mark.
- **The circulation, refill and drain pumps** go on their modules' output terminals, never on the board.
- **A dosing pump that read under 8 Ω in Stage 2** gets a fourth module, wired like the drain module from its own plug.
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
5. **Level:** with the tank empty, type `cal level empty` on the serial monitor (or **Save empty** on the dashboard's Calibrate tab); fill it to its working level, then `cal level full` (or **Save full**).
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

- [ ] Every part passed Stage 2, and the zener bag never came to the bench
- [ ] Every diode passed its test (4.4, 5.6)
- [ ] Both boards passed their resistance checks and every row of their bridge tables (4.12, 5.6)
- [ ] Each chip and the ribbon passed their meter checks before power (7.4, 7.6)
- [ ] Supplies, relay and E-stop behaved as in 7.2 and 7.5, and both big capacitors stayed cold
- [ ] All sixteen bench checks passed (Stage 8)
- [ ] Refill, drain and circulation each run from their own module; no pump is plugged into REFILL or DRAIN
- [ ] The look-alike plugs are coloured, the CIRC plugs are one block, and J9 and the ribbon have their pin 1 dots
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
| Touch doesn't respond | CTP leads (display pins 10-12) | check those three leads and W65-W67 on the panel board |
| A toggle shows HAND at AUTO | its A and H leads swapped | swap the two leads at the toggle |
| `switch_fault` | A and H both closed: a bridge in that toggle's group | look at its five holes |
| The knob turns the wrong way | normal for some knobs | one setting in `board.h` |
| pH jumps while a pump runs | expected for dosing pumps: the controller pauses pH readings then | if it jumps with circulation only, move the probe lead away from the pump leads |
| pH stuck near 7.0 | probe unplugged or dry; an old probe | reseat the BNC; soak the probe in KCl for an hour; recalibrate |
| Leak alarm with no water | condensation or dirt between the pads | clean and dry them; raise them off the tray floor slightly |
| `relay_open` when the relay closes | the rail reading arrives late | note it; the firmware's margin may need raising |

## Parts

The parts for a controller are the ones named through this guide: the ESP32-S3 dev board, two ADS1115 modules, the MCP23017, the ULN2803A, the SRD-05VDC-SL-C relay, the three D4184 modules, the 3.5" ST7796 display, the EC11 knob, seven MTS-203 toggles, the 22 mm NC E-stop, the buzzer, the PTC fuses, the diodes, capacitors and resistors listed in Stages 4 and 5, the pluggable terminals and headers, two 9 × 15 cm double-sided protoboards (plus spares to practise on), and the sensors and pumps in 9.1. Buy two certified 5 V 3 A USB-C chargers (CSA or UL mark) locally for the pumps; 5 V USB-A chargers do the logic side unless the ESP32 board's regulator is an AMS1117 (Stage 2) or Stage 8 check 2 fails: then use a 5 V 2 A one. Each controller uses three D4184 modules and three more 1N5819 diodes off the board.
