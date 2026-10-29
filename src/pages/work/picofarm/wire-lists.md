---
layout: ../../../layouts/Doc.astro
title: "PicoFarm revision B: wire lists"
description: "Every bare run, insulated wire and part of the two hand-wired protoboards, with its holes, generated from the same netlists as the printed boards. Used with the build instructions."
back: /work/picofarm/build
backLabel: Build instructions
wide: true
---

These are the two wire lists the [build instructions](/work/picofarm/build) tick through. Holes are row letter + column number seen from the component side (**L4** = row L, column 4). The drawings they go with: main board [top](/media/picofarm/revb/main/board-top.svg), [top with the modules lifted](/media/picofarm/revb/main/board-top-open.svg), [bottom](/media/picofarm/revb/main/board-bottom.svg), [bottom guide](/media/picofarm/revb/main/board-bottom-guide.svg); panel board [top](/media/picofarm/revb/panel/board-top.svg), [top with the modules lifted](/media/picofarm/revb/panel/board-top-open.svg), [bottom](/media/picofarm/revb/panel/board-bottom.svg), [bottom guide](/media/picofarm/revb/panel/board-bottom-guide.svg).

## Main board


9 × 15 cm double-sided protoboard (all 53 × 33 holes, lined up on the top-left hole). Holes are row letter + column number, seen from the component side: **L4** = row L, column 4 (columns 1-53 left to right, rows A-AG top to bottom). On the solder side the columns run right to left.

### Bare runs (solder side)

Tinned solid wire laid along the holes (strip a length of the 22 AWG solid wire, or use resistor lead offcuts for short ones). Solder it at each end and at every component pin it passes. A run between two neighbouring holes is a solder bridge.

| run | carries | holes | length |
| --- | --- | --- | --- |
| B1 | circulation, GPIO46 | L14 → U14 | 23 mm |
| B2 | drain, GPIO9 | L15 → U15 | 23 mm |
| B3 | refill, GPIO10 | L16 → U16 | 23 mm |
| B4 | nutrient B, GPIO11 | L17 → U17 | 23 mm |
| B5 | nutrient A, GPIO12 | L18 → U18 | 23 mm |
| B6 | pH down, GPIO13 | L19 → U19 | 23 mm |
| B7 | pH up, GPIO14 | L20 → U20 | 23 mm |
| B8 | pH up − | AD48 → AE48 → AE47 → AF47 | 8 mm |
| B9 | pH down − | AD44 → AE44 → AE43 → AF43 | 8 mm |
| B10 | nutrient A − | AD40 → AE40 → AE39 → AF39 | 8 mm |
| B11 | nutrient B − | AD36 → AE36 → AE35 → AF35 | 8 mm |
| B12 | refill − | AD32 → AE32 → AE31 → AF31 | 8 mm |
| B13 | drain − | AD24 → AE24 → AE23 → AF23 | 8 mm |
| B14 | drain − | AE23 → AE22 | 3 mm |
| B15 | drain + (from its switch) | X21 → AF21 | 20 mm |
| B16 | refill + (from its switch) | X25 → AF25 | 20 mm |
| B17 | nutrient B + (from its switch) | X33 → AF33 | 20 mm |
| B18 | nutrient A + (from its switch) | X37 → AF37 | 20 mm |
| B19 | pH down + (from its switch) | X41 → AF41 | 20 mm |
| B20 | pH up + (from its switch) | X45 → AF45 | 20 mm |
| B21 | circulation trigger − | X14 → AG14 → AG53 → AF53 | 124 mm |
| B22 | backlight, GPIO47 | B17 → A17 | 3 mm |
| B23 | knob B, GPIO19 | B20 → A20 → A24 | 13 mm |
| B24 | logic ground | B22 → B24 | 5 mm |
| B25 | logic ground | L22 → L24 | 5 mm |
| B26 | pump ground | U12 → U13 | 3 mm |
| B27 | knob A, GPIO20 | B19 → C19 → C24 | 15 mm |
| B28 | panel interrupt, GPIO21 | B18 → D18 → D24 | 20 mm |
| B29 | knob push, GPIO45 (no pull-up) | B15 → E15 → E24 | 30 mm |
| B30 | display DC, GPIO39 | B9 → F9 → F10 | 13 mm |
| B31 | display DC, ribbon side | F14 → F24 | 25 mm |
| B32 | display CS, GPIO40 | B8 → G8 → G9 | 15 mm |
| B33 | display CS, ribbon side | G13 → G24 | 28 mm |
| B34 | display MOSI, GPIO41 | B7 → H7 → H8 | 18 mm |
| B35 | display MOSI, ribbon side | H12 → H24 | 30 mm |
| B36 | display SCK, GPIO42 | B6 → I6 → I7 | 20 mm |
| B37 | display SCK, ribbon side | I11 → I24 | 33 mm |
| B38 | I2C SCL, GPIO2 | B5 → I5 | 18 mm |
| B39 | I2C SDA, GPIO1 | B4 → J4 | 20 mm |
| B40 | 3.3 V | L2 → M2 | 3 mm |
| B41 | 3.3 V | L1 → M1 | 3 mm |
| B42 | logic ground | N3 → AG3 → AG5 → AF5 | 56 mm |
| B43 | logic 5 V | O2 → AB2 → AB1 | 36 mm |
| B44 | logic 5 V | AA1 → AC1 | 5 mm |
| B45 | E-stop sense, GPIO17 | L10 → P10 | 10 mm |
| B46 | E-stop sense, GPIO17 | P24 → P25 | 3 mm |
| B47 | TDS board power, GPIO16 | L9 → Q9 | 13 mm |
| B48 | 1-Wire, GPIO15 | L8 → R8 | 15 mm |
| B49 | ultrasonic trigger, GPIO8 | L12 → S12 | 18 mm |
| B50 | pump ground | U12 → T12 | 3 mm |
| B51 | leak, GPIO4 | L4 → Q4 | 13 mm |
| B52 | low switch, GPIO5 | L5 → W5 | 28 mm |
| B53 | high switch, GPIO6 | L6 → AB6 | 41 mm |
| B54 | emergency switch, GPIO7 | L7 → AB7 | 41 mm |
| B55 | emergency switch plug | AE7 → AF7 | 3 mm |
| B56 | echo after divider, GPIO18 | L11 → W11 | 28 mm |
| B57 | echo after divider, GPIO18 | U11 → U10 | 3 mm |
| B58 | echo from the ultrasonic board | AA11 → AA10 | 3 mm |
| B59 | logic ground | Y10 → Z10 | 3 mm |
| B60 | logic ground | T8 → V8 | 5 mm |
| B61 | logic ground | AG3 → AG1 | 5 mm |
| B62 | logic 5 V | AC10 → AF10 → AF9 | 10 mm |
| B63 | the ESP32's 5V pin | L21 → U21 → U22 | 25 mm |
| B64 | logic 5 V | O24 → O23 → X23 → X22 | 28 mm |
| B65 | logic ground | B24 → B50 → D50 → D53 | 79 mm |
| B66 | 3.3 V | A27 → A48 | 53 mm |
| B67 | 3.3 V to the temperature plug | A52 → B52 → B53 | 5 mm |
| B68 | 3.3 V to the temperature plug | B51 → B52 | 3 mm |
| B69 | 1-Wire, GPIO15 | E47 → F47 → F48 | 5 mm |
| B70 | 1-Wire to the plug | F52 → F53 | 3 mm |
| B71 | I2C SCL, GPIO2 | J24 → J25 → C25 → C43 | 66 mm |
| B72 | I2C SDA, GPIO1 | K24 → K26 → D26 → D43 | 66 mm |
| B73 | pH divider to A0 | G27 → G30 → F30 → F33 | 18 mm |
| B74 | logic 5 V monitor | J35 → J37 | 5 mm |
| B75 | rail monitor | I35 → I39 | 10 mm |
| B76 | E-stop monitor | H35 → H41 | 15 mm |
| B77 | supply monitor | G35 → G43 | 20 mm |
| B78 | 3.3 V | M24 → M27 → K27 → K28 | 15 mm |
| B79 | analog input A2 | I27 → I29 → M29 | 15 mm |
| B80 | TDS output to A1 | H27 → H30 → M30 | 20 mm |
| B81 | pH board output | J33 → M33 | 8 mm |
| B82 | logic ground | N26 → N42 | 41 mm |
| B83 | logic ground | M28 → N28 | 3 mm |
| B84 | logic ground | J31 → N31 | 10 mm |
| B85 | logic ground | J31 → J32 | 3 mm |
| B86 | logic ground | M34 → N34 | 3 mm |
| B87 | logic ground | N24 → N26 → U26 | 23 mm |
| B88 | logic ground | U25 → U26 | 3 mm |
| B89 | logic 5 V in (before its fuse) | M51 → M53 | 5 mm |
| B90 | logic 5 V | M37 → M38 | 3 mm |
| B91 | logic 5 V | M43 → M49 | 15 mm |
| B92 | logic 5 V | M49 → K49 | 5 mm |
| B93 | logic 5 V | O33 → O31 | 5 mm |
| B94 | logic ground | I49 → I50 → D50 | 15 mm |
| B95 | pump ground | O53 → Q53 | 5 mm |
| B96 | pump ground | P53 → P45 → S45 | 28 mm |
| B97 | pump ground | R48 → P48 | 5 mm |
| B98 | pump ground | T27 → W27 → W26 | 10 mm |
| B99 | pump ground | W27 → X27 → X30 | 10 mm |
| B100 | pump ground | P50 → AB50 → AB53 | 38 mm |
| B101 | pump ground | AA51 → AA50 | 3 mm |
| B102 | pump 5 V in (before its fuse) | S51 → S53 | 5 mm |
| B103 | pump 5 V after the fuse | O43 → U43 → U48 | 28 mm |
| B104 | E-stop node (pump 5 V after the E-stop) | O41 → U41 | 15 mm |
| B105 | E-stop node (pump 5 V after the E-stop) | W37 → V37 | 3 mm |
| B106 | E-stop node (pump 5 V after the E-stop) | Q33 → V33 | 13 mm |
| B107 | E-stop node (pump 5 V after the E-stop) | U24 → V24 | 3 mm |
| B108 | pump ground | W24 → W26 | 5 mm |
| B109 | relay enable, GPIO3 | L13 → S13 | 18 mm |
| B110 | relay driver base | W30 → W31 | 3 mm |
| B111 | relay driver base | W31 → X31 | 3 mm |
| B112 | relay coil, S8050 collector | X32 → W32 → W34 | 8 mm |
| B113 | pump rail (after relay K1) | O39 → W39 → W47 → X47 | 43 mm |
| B114 | pump rail (after relay K1) | X47 → X48 | 3 mm |
| B115 | pump rail (after relay K1) | Z51 → Z53 | 5 mm |
| B116 | refill + (through the float) | AF27 → AE27 → AE29 → AF29 | 10 mm |
| B117 | refill + (through the float) | AD29 → AF29 | 5 mm |

### Insulated wires (solder side)

22 AWG solid wire in the colour named, laid flat with square bends; strip about 3 mm at each end and solder it to the joint named. A wire may cross over a bare run; fit the wires after the bare runs. 

| wire | colour | carries | path | length |
| --- | --- | --- | --- | --- |
| W1 | white | pH up − | X20 → Y20 → Y48 → AD48 | 92 mm |
| W2 | yellow | pH down − | X19 → Z19 → Z44 → AD44 | 85 mm |
| W3 | green | nutrient A − | X18 → AA18 → AA40 → AD40 | 77 mm |
| W4 | blue | nutrient B − | X17 → AB17 → AB36 → AD36 | 70 mm |
| W5 | white | refill − | X16 → AC16 → AC32 → AD32 | 62 mm |
| W6 | yellow | drain − | X15 → AE15 → AE22 | 42 mm |
| W7 | yellow | I2C SCL, GPIO2 | I5 → J5 → J24 | 57 mm |
| W8 | blue | I2C SDA, GPIO1 | J4 → K4 → K24 | 59 mm |
| W9 | yellow | 3.3 V | M2 → M24 | 62 mm |
| W10 | black | logic ground | N3 → N24 | 59 mm |
| W11 | red | logic 5 V | O23 → O2 | 59 mm |
| W12 | blue | E-stop sense, GPIO17 | P10 → P24 | 42 mm |
| W13 | blue | TDS board power, GPIO16 | Q9 → Q32 → M32 | 75 mm |
| W14 | yellow | 1-Wire, GPIO15 | R8 → R44 → E44 → E47 | 138 mm |
| W15 | green | ultrasonic trigger, GPIO8 | S12 → S9 → AB9 → AB10 | 39 mm |
| W16 | green | leak, GPIO4 | Q1 → Q4 | 14 mm |
| W17 | green | leak plug | U4 → U1 | 14 mm |
| W18 | green | low switch plug | Z5 → Z1 → Y1 | 19 mm |
| W19 | green | high switch plug | AE6 → AE1 | 19 mm |
| W20 | black | logic ground | Z10 → Z12 → AD12 → AD3 | 44 mm |
| W21 | black | logic ground | T8 → S8 → S3 | 21 mm |
| W22 | black | logic ground | S3 → S1 | 11 mm |
| W23 | black | logic ground | W3 → W1 | 11 mm |
| W24 | red | logic 5 V | AA2 → AA8 → AC8 → AC10 | 31 mm |
| W25 | black | logic ground | E27 → E28 → B28 | 16 mm |
| W26 | yellow | 3.3 V | E35 → E34 → A34 | 19 mm |
| W27 | red | logic 5 V | M35 → M37 | 11 mm |
| W28 | red | logic 5 V | M38 → M43 | 19 mm |
| W29 | red | logic 5 V | M37 → O37 | 11 mm |
| W30 | red | logic 5 V | O37 → O33 | 16 mm |
| W31 | red | logic 5 V | O31 → O24 | 24 mm |
| W32 | black | star wire (the star wire: fit it last) | I50 → P50 | 24 mm |
| W33 | black | pump ground | S45 → S44 → T44 → T28 → T27 | 54 mm |
| W34 | black | pump ground | T27 → T12 | 44 mm |
| W35 | red | pump 5 V after the fuse | U48 → U51 | 14 mm |
| W36 | red | pump 5 V after the fuse | U51 → U53 | 11 mm |
| W37 | red | E-stop node (pump 5 V after the E-stop) | W53 → W52 → V52 → V42 → U42 → U41 | 42 mm |
| W38 | red | E-stop node (pump 5 V after the E-stop) | U41 → U40 → V40 → V37 | 19 mm |
| W39 | red | E-stop node (pump 5 V after the E-stop) | V37 → V33 | 16 mm |
| W40 | red | E-stop node (pump 5 V after the E-stop) | V33 → V24 | 29 mm |
| W41 | white | relay enable, GPIO3 | S13 → S31 | 52 mm |
| W42 | red | pump rail (after relay K1) | X48 → W48 → W51 → Z51 | 24 mm |
| W43 | red | circulation trigger + (from its switch) | X49 → AD49 → AD53 | 31 mm |
| W44 | red | E-stop node (pump 5 V after the E-stop) | X12 → V12 → V24 | 42 mm |

### Hidden wires (component side, under a module)

| wire | colour | carries | path |
| --- | --- | --- | --- |
| T1 | yellow | 3.3 V | K28 → A28 |
| T2 | black | logic ground | J32 → B32 |

### Parts

| ref | part | holes |
| --- | --- | --- |
| C1 | 1000u | 1:U45, 2:S45 |
| D1 | 1N5822 | 1:U48, 2:R48 |
| C2 | 1000u | 1:K49, 2:I49 |
| D2 | 1N5822 | 1:M47, 2:P47 |
| C3 | 100n | 1:V24, 2:W24 |
| D3 | 1N5819 | 1:AD29, 2:AD32 |
| C4 | 100n | 1:Z51, 2:AA51 |
| D4 | BAT85 | 1:Z5, 2:W5 |
| C5 | 100n | 1:V5, 2:V3 |
| D5 | BAT85 | 1:AE6, 2:AB6 |
| C6 | 100n | 1:T6, 2:T8 |
| D6 | BAT85 | 1:AE7, 2:AB7 |
| C7 | 100n | 1:V7, 2:V8 |
| C8 | 100n | 1:B51, 2:D51 |
| D8 | 1N5819 | 1:U22, 2:X22 |
| C9 | 100n | 1:P4, 2:P3 |
| D9 | 1N5819 | 1:W37, 2:W34 |
| D10 | 1N5819 | 1:AD45, 2:AD48 |
| D11 | 1N5819 | 1:AD41, 2:AD44 |
| D12 | 1N5819 | 1:AD37, 2:AD40 |
| D13 | 1N5819 | 1:AD33, 2:AD36 |
| D14 | 1N5819 | 1:AD21, 2:AD24 |
| F1 | 2.5 A PTC | 1:S51, 2:U51 |
| F2 | 1.6 A PTC | 1:M51, 2:M49 |
| J1 | PUMP IN | 1:S53, 2:Q53 |
| J2 | LOGIC IN | 1:M53, 2:O53 |
| J3 | E-STOP | 1:U53, 2:W53 |
| J4 | LEAK | 1:U1, 2:S1 |
| J5 | LOW | 1:AA1, 2:Y1, 3:W1 |
| J6 | HIGH | 1:AC1, 2:AE1, 3:AG1 |
| J7 | EMERG | 1:AF9, 2:AF7, 3:AF5 |
| J8 | TEMP | 1:B53, 2:D53, 3:F53 |
| J9 | JSN | 1:AC10, 2:AB10, 3:AA10, 4:Z10 |
| J10 | pH | 3:M33, 2:M34, 1:M35 |
| J11 | TDS | 3:M30, 2:M31, 1:M32 |
| J12 | I2C | 1:A43, 2:B43, 3:C43, 4:D43 |
| J13 | AUX | 1:M27, 2:M28, 3:M29 |
| J14 | pH UP | 1:AF45, 2:AF47 |
| J15 | pH DN | 1:AF41, 2:AF43 |
| J16 | NUTR A | 1:AF37, 2:AF39 |
| J17 | NUTR B | 1:AF33, 2:AF35 |
| J18 | FLOAT | 1:AF25, 2:AF27 |
| J19 | REFILL | 1:AF29, 2:AF31 |
| J20 | DRAIN | 1:AF21, 2:AF23 |
| J21 | CIRC | 1:Z53, 2:AB53, 3:AD53, 4:AF53 |
| J22A | PANEL A | 9:A24, 2:B24, 8:C24, 7:D24, 4:E24, 15:F24, 14:G24, 13:H24, 11:I24, 6:J24, 5:K24, 10:L24, 3:M24, 12:N24, 1:O24 |
| J22B | B25 | 25:X21 |
| J22C | B23 | 23:X25 |
| J22D | B22 | 22:X33 |
| J22E | PANEL A0 | 16:A17 |
| J22F | B21 | 21:X37 |
| J22G | B20 | 20:X41 |
| J22H | B19 | 19:X45 |
| J22I | PANEL B | 17:X47, 18:X48, 24:X49 |
| J22J | B26 | 26:P26 |
| K1 | SRD-05VDC-SL-C | 2:Q33, 1:S33, 5:W33, 3:W42 |
| Q2 | S8050 | 1:X30, 2:X31, 3:X32 |
| R1 | 10k | 1:J33, 2:F33 |
| R2 | 20k | 1:F31, 2:J31 |
| R3 | 2.2k | 1:AA11, 2:W11 |
| R4 | 3.3k | 1:U10, 2:Y10 |
| R5 | 4.7k | 1:E47, 2:A47 |
| R6 | 220k | 1:Q1, 2:M1 |
| R9 | 100 | 1:F48, 2:F52 |
| R10 | 1k | 1:U4, 2:Q4 |
| R11 | 100 | 1:A48, 2:A52 |
| R20 | 20k | 1:O43, 2:G43 |
| R21 | 10k | 1:G42, 2:N42 |
| R22 | 20k | 1:O41, 2:H41 |
| R23 | 10k | 1:H40, 2:N40 |
| R24 | 20k | 1:O39, 2:I39 |
| R25 | 10k | 1:I38, 2:N38 |
| R26 | 20k | 1:O37, 2:J37 |
| R27 | 10k | 1:J36, 2:N36 |
| R28 | 22k | 1:U24, 2:P24 |
| R29 | 33k | 1:P25, 2:U25 |
| R30 | 33 | 1:I7, 2:I11 |
| R31 | 33 | 1:H8, 2:H12 |
| R32 | 33 | 1:G9, 2:G13 |
| R33 | 33 | 1:F10, 2:F14 |
| R34 | 1k | 1:S31, 2:W31 |
| R35 | 10k | 1:W30, 2:W26 |
| U1 | ESP32-S3 | L1:L1, R1:B1, L2:L2, R2:B2, L3:L3, R3:B3, L4:L4, R4:B4, L5:L5, R5:B5, L6:L6, R6:B6, L7:L7, R7:B7, L8:L8, R8:B8, L9:L9, R9:B9, L10:L10, R10:B10, L11:L11, R11:B11, L12:L12, R12:B12, L13:L13, R13:B13, L14:L14, R14:B14, L15:L15, R15:B15, L16:L16, R16:B16, L17:L17, R17:B17, L18:L18, R18:B18, L19:L19, R19:B19, L20:L20, R20:B20, L21:L21, R21:B21, L22:L22, R22:B22 |
| U2 | ULN2803A | 1:U20, 2:U19, 3:U18, 4:U17, 5:U16, 6:U15, 7:U14, 8:U13, 9:U12, 10:X12, 11:X13, 12:X14, 13:X15, 14:X16, 15:X17, 16:X18, 17:X19, 18:X20 |
| U3 | ADS1115 0x48 | 1:A27, 2:B27, 3:C27, 4:D27, 5:E27, 6:F27, 7:G27, 8:H27, 9:I27, 10:J27 |
| U4 | ADS1115 0x49 | 1:A35, 2:B35, 3:C35, 4:D35, 5:E35, 6:F35, 7:G35, 8:H35, 9:I35, 10:J35 |

### Checked

The drawing tool draws nothing unless every pin of the circuit-board netlist is on its net and the layout has no short, no unconnected pin, no wire over a joint or along a bare run, no part standing where another part is. This layout: 86 parts, 117 bare runs, 44 wires, 2 hidden wires, 0 errors; 103 pairs of nets run bare in neighbouring holes somewhere, so keep those joints small; 0 wire crossings; pump-side neighbour rule: allowed pairs GNDL/L5V (22 holes: logic 5 V beside its own ground: the two columns down the left edge must both be bare (the sensor plugs' wires cross them) and the bus tap under the TDS header has three bare holes; a bridge shorts logic 5 V to logic ground and trips F2, no safety function is affected); PHUEN/S35V (10 holes: every line through the crossing band is bare (the band's wires cross it); S35V is the dev board's 5 V pin behind D8, not the pump supply: a bridge puts logic 5 V on GPIO14 only).

## Panel board

9 × 15 cm double-sided protoboard. Holes are row letter + column number, seen from the component side: **L4** = row L, column 4 (columns 1-52 left to right, rows A-AF top to bottom). On the solder side the columns run right to left.

### Bare runs (solder side)

Tinned solid wire laid along the holes (strip a length of the 22 AWG solid wire, or use resistor lead offcuts for short ones). Solder it at each end and at every component pin it passes. A run between two neighbouring holes is a solder bridge.

| run | carries | holes | length |
| --- | --- | --- | --- |
| B1 | pump rail (after relay K1) | AE26 → AE27 | 3 mm |
| B2 | pump rail (after relay K1) | AF24 → AF6 | 46 mm |
| B3 | logic ground | AD6 → AD36 | 76 mm |
| B4 | logic ground | AE34 → AE36 | 5 mm |
| B5 | drain + (from its switch) | AE24 → AE25 | 3 mm |
| B6 | 3.3 V | P1 → T1 | 10 mm |
| B7 | 3.3 V | P10 → T10 | 10 mm |
| B8 | 3.3 V | Q4 → T4 | 8 mm |
| B9 | 3.3 V | P13 → T13 | 10 mm |
| B10 | 3.3 V | R7 → T7 | 5 mm |
| B11 | 3.3 V | Q16 → T16 | 8 mm |
| B12 | 3.3 V | R19 → T19 | 5 mm |
| B13 | 3.3 V | P22 → T22 | 10 mm |
| B14 | 3.3 V | Q25 → T25 | 8 mm |
| B15 | 3.3 V | R28 → T28 | 5 mm |
| B16 | 3.3 V | T1 → T34 | 84 mm |
| B17 | 3.3 V | Q33 → T33 | 8 mm |
| B18 | pH up switch AUTO | AC6 → AC5 → U5 | 23 mm |
| B19 | pH up switch HAND | AB6 → U6 | 18 mm |
| B20 | pH up switch HAND | I6 → I36 | 76 mm |
| B21 | pH up switch AUTO | B5 → B46 | 104 mm |
| B22 | pH up switch AUTO | P46 → P39 | 18 mm |
| B23 | pH down switch AUTO | AC9 → AC8 → U8 | 23 mm |
| B24 | pH down switch HAND | AB9 → U9 | 18 mm |
| B25 | pH down switch HAND | J9 → J36 | 69 mm |
| B26 | pH down switch AUTO | C8 → C45 | 94 mm |
| B27 | pH down switch AUTO | O45 → O39 | 15 mm |
| B28 | nutrient A switch AUTO | AC12 → AC11 → U11 | 23 mm |
| B29 | nutrient A switch HAND | AB12 → U12 | 18 mm |
| B30 | nutrient A switch HAND | K12 → K36 | 61 mm |
| B31 | nutrient A switch AUTO | D11 → D44 | 84 mm |
| B32 | nutrient A switch AUTO | N44 → N39 | 13 mm |
| B33 | nutrient B switch AUTO | AC15 → AC14 → U14 | 23 mm |
| B34 | nutrient B switch HAND | AB15 → U15 | 18 mm |
| B35 | nutrient B switch HAND | L15 → L36 | 53 mm |
| B36 | nutrient B switch AUTO | E14 → E43 | 74 mm |
| B37 | nutrient B switch AUTO | M43 → M39 | 10 mm |
| B38 | refill switch AUTO | AC18 → AC17 → U17 | 23 mm |
| B39 | refill switch HAND | AB18 → U18 | 18 mm |
| B40 | refill switch HAND | M18 → M36 | 46 mm |
| B41 | refill switch AUTO | F17 → F42 | 64 mm |
| B42 | refill switch AUTO | L42 → L39 | 8 mm |
| B43 | circulation switch AUTO | AC21 → AC20 → U20 | 23 mm |
| B44 | circulation switch HAND | AB21 → U21 | 18 mm |
| B45 | circulation switch HAND | N21 → N36 | 38 mm |
| B46 | circulation switch AUTO | G20 → G41 | 53 mm |
| B47 | circulation switch AUTO | K41 → K39 | 5 mm |
| B48 | drain switch AUTO | AC24 → AC23 → U23 | 23 mm |
| B49 | drain switch HAND | AB24 → U24 | 18 mm |
| B50 | drain switch HAND | O24 → O36 | 30 mm |
| B51 | drain switch AUTO | H23 → H40 | 43 mm |
| B52 | drain switch AUTO | J40 → J39 | 3 mm |
| B53 | buzzer drive | P36 → P35 | 3 mm |
| B54 | buzzer drive | A35 → A47 | 30 mm |
| B55 | 3.3 V | Q36 → Q33 | 8 mm |
| B56 | 3.3 V | T34 → X34 → X35 → Y35 | 15 mm |
| B57 | logic ground | R36 → R34 | 5 mm |
| B58 | logic ground | R35 → W35 → W36 → AE36 | 36 mm |
| B59 | I2C SCL, GPIO2 | T36 → T37 | 3 mm |
| B60 | I2C SCL, GPIO2 | W37 → W42 → U42 → U52 | 43 mm |
| B61 | I2C SDA, GPIO1 | U36 → U38 | 5 mm |
| B62 | I2C SDA, GPIO1 | X38 → X40 | 5 mm |
| B63 | I2C SDA, GPIO1 | T40 → T52 | 30 mm |
| B64 | logic ground | R36 → R38 → T38 → T39 → V39 | 18 mm |
| B65 | display reset | I39 → I48 → N48 | 36 mm |
| B66 | panel interrupt, GPIO21 | Q39 → Q42 → R42 → R44 | 15 mm |
| B67 | expander reset | S39 → S40 → R40 → R41 | 8 mm |
| B68 | 3.3 V | Q44 → Q45 → R45 → R52 | 23 mm |
| B69 | buzzer transistor base | A51 → B51 → B50 → C50 | 8 mm |
| B70 | buzzer − | C51 → E51 → E48 | 13 mm |
| B71 | logic 5 V | P52 → H52 → H48 | 30 mm |
| B72 | logic ground | Q49 → Q52 | 8 mm |
| B73 | logic ground | S52 → S41 | 28 mm |
| B74 | logic ground | U41 → U39 | 5 mm |
| B75 | display reset | X41 → X48 | 18 mm |
| B76 | panel interrupt, GPIO21 | AA44 → AA52 | 20 mm |
| B77 | 3.3 V | Y37 → Y43 | 15 mm |
| B78 | display SCK, GPIO42 | V52 → V45 | 18 mm |
| B79 | display MOSI, GPIO41 | W52 → W46 | 15 mm |
| B80 | display CS, GPIO40 | X52 → X49 | 8 mm |
| B81 | display DC, GPIO39 | Y52 → Y47 | 13 mm |
| B82 | backlight, GPIO47 | AE44 → AF44 | 3 mm |
| B83 | knob push, GPIO45 (no pull-up) | Z52 → Z43 | 23 mm |
| B84 | knob A, GPIO20 | AB52 → AB43 | 23 mm |
| B85 | logic ground | AC52 → AC39 → AD39 → AD36 | 43 mm |
| B86 | knob B, GPIO19 | AD52 → AD43 | 23 mm |
| B87 | knob B, GPIO19 | AD43 → AE43 | 3 mm |
| B88 | knob push contact | Z37 → Z39 | 5 mm |
| B89 | knob A contact | AB37 → AB39 | 5 mm |
| B90 | knob B contact | AE37 → AE39 | 5 mm |

### Insulated wires (solder side)

22 AWG solid wire in the colour named, laid flat with square bends; strip about 3 mm at each end and solder it to the joint named. A wire may cross over a bare run; fit the wires after the bare runs. 

| wire | colour | carries | path | length |
| --- | --- | --- | --- | --- |
| W1 | red | pump rail (after relay K1) | AE26 → AF26 → AF24 | 14 mm |
| W2 | red | pH up + (from its switch) | AE33 → V33 → V7 → AE7 → AE6 | 120 mm |
| W3 | red | pH down + (from its switch) | AE32 → W32 → W10 → AE10 → AE9 | 105 mm |
| W4 | red | nutrient A + (from its switch) | AE31 → X31 → X13 → AE13 → AE12 | 90 mm |
| W5 | red | nutrient B + (from its switch) | AE30 → Y30 → Y16 → AE16 → AE15 | 75 mm |
| W6 | red | refill + (from its switch) | AE29 → Z29 → Z19 → AE19 → AE18 | 59 mm |
| W7 | red | circulation trigger + (from its switch) | AE28 → AA28 → AA22 → AE22 → AE21 | 44 mm |
| W8 | green | pH up switch AUTO | U5 → P5 | 19 mm |
| W9 | white | pH up switch HAND | U6 → P6 | 19 mm |
| W10 | white | pH up switch HAND | P6 → I6 | 24 mm |
| W11 | green | pH up switch AUTO | P5 → B5 | 42 mm |
| W12 | green | pH up switch AUTO | B46 → P46 | 42 mm |
| W13 | green | pH down switch AUTO | U8 → Q8 | 16 mm |
| W14 | white | pH down switch HAND | U9 → Q9 | 16 mm |
| W15 | white | pH down switch HAND | Q9 → J9 | 24 mm |
| W16 | green | pH down switch AUTO | Q8 → C8 | 42 mm |
| W17 | green | pH down switch AUTO | C45 → O45 | 36 mm |
| W18 | green | nutrient A switch AUTO | U11 → R11 | 14 mm |
| W19 | white | nutrient A switch HAND | U12 → R12 | 14 mm |
| W20 | white | nutrient A switch HAND | R12 → K12 | 24 mm |
| W21 | green | nutrient A switch AUTO | R11 → D11 | 42 mm |
| W22 | green | nutrient A switch AUTO | D44 → N44 | 31 mm |
| W23 | green | nutrient B switch AUTO | U14 → S14 | 11 mm |
| W24 | white | nutrient B switch HAND | U15 → S15 | 11 mm |
| W25 | white | nutrient B switch HAND | S15 → L15 | 24 mm |
| W26 | green | nutrient B switch AUTO | S14 → E14 | 42 mm |
| W27 | green | nutrient B switch AUTO | E43 → M43 | 26 mm |
| W28 | green | refill switch AUTO | U17 → P17 | 19 mm |
| W29 | white | refill switch HAND | U18 → P18 | 19 mm |
| W30 | white | refill switch HAND | P18 → M18 | 14 mm |
| W31 | green | refill switch AUTO | P17 → F17 | 31 mm |
| W32 | green | refill switch AUTO | F42 → L42 | 21 mm |
| W33 | green | circulation switch AUTO | U20 → Q20 | 16 mm |
| W34 | white | circulation switch HAND | U21 → Q21 | 16 mm |
| W35 | white | circulation switch HAND | Q21 → N21 | 14 mm |
| W36 | green | circulation switch AUTO | Q20 → G20 | 31 mm |
| W37 | green | circulation switch AUTO | G41 → K41 | 16 mm |
| W38 | green | drain switch AUTO | U23 → R23 | 14 mm |
| W39 | white | drain switch HAND | U24 → R24 | 14 mm |
| W40 | white | drain switch HAND | R24 → O24 | 14 mm |
| W41 | green | drain switch AUTO | R23 → H23 | 31 mm |
| W42 | green | drain switch AUTO | H40 → J40 | 11 mm |
| W43 | yellow | buzzer drive | P35 → A35 | 44 mm |
| W44 | yellow | I2C SCL, GPIO2 | T37 → W37 | 14 mm |
| W45 | blue | I2C SDA, GPIO1 | U38 → X38 | 14 mm |
| W46 | blue | I2C SDA, GPIO1 | X40 → T40 | 16 mm |
| W47 | black | logic ground | C49 → J49 | 24 mm |
| W48 | black | logic ground | J49 → Q49 | 24 mm |
| W49 | black | logic ground | S41 → U41 | 11 mm |
| W50 | black | logic ground | S50 → Q50 | 11 mm |
| W51 | white | display reset | I47 → X47 | 44 mm |
| W52 | white | display reset | X48 → AF48 | 26 mm |
| W53 | blue | panel interrupt, GPIO21 | R44 → AA44 | 29 mm |
| W54 | yellow | 3.3 V | Y35 → Y37 | 11 mm |
| W55 | yellow | 3.3 V | Y43 → Q43 → Q44 | 29 mm |
| W56 | red | logic 5 V | O52 → O51 → AF51 | 52 mm |
| W57 | white | display SCK, GPIO42 | V45 → AF45 | 31 mm |
| W58 | white | display MOSI, GPIO41 | W46 → AF46 | 29 mm |
| W59 | white | display CS, GPIO40 | X49 → AF49 | 26 mm |
| W60 | white | display DC, GPIO39 | Y47 → AF47 | 24 mm |
| W61 | black | logic ground | AC50 → AF50 | 14 mm |
| W62 | white | knob A contact | AB37 → AB34 | 14 mm |
| W63 | white | knob B contact | AE37 → AF37 → AF35 → AC35 | 21 mm |
| W64 | white | display SD_CS (held high) | AC38 → AF38 | 14 mm |
| W65 | blue | I2C SDA, GPIO1 | X40 → AF40 | 26 mm |
| W66 | white | display reset | X41 → AF41 | 26 mm |
| W67 | yellow | I2C SCL, GPIO2 | W42 → AF42 | 29 mm |

### Parts

| ref | part | holes |
| --- | --- | --- |
| C1 | 100n | 1:J48, 2:J49 |
| D1 | BAT85 | 1:H51, 2:E51 |
| C2 | 100n | 1:Q34, 2:R34 |
| C3 | 10n | 1:AB44, 2:AC44 |
| C4 | 10n | 1:AD43, 2:AC43 |
| C5 | 1n | 1:Z50, 2:AC50 |
| BZ1 | buzzer 5V | 1:H48, 2:E48 |
| ENC1 | EC11 wires | C:X36, S2:AA36, MP:AE36, S1:Z37, A:AB37, B:AE37 |
| J1A | TO MAIN A | 1:P52, 12:Q52, 3:R52, 10:S52, 5:T52, 6:U52, 11:V52, 13:W52, 14:X52, 15:Y52, 4:Z52, 7:AA52, 8:AB52, 2:AC52, 9:AD52 |
| J1B | TO MAIN B | 25:AE25, 17:AE26, 18:AE27, 24:AE28, 23:AE29, 22:AE30, 21:AE31, 20:AE32, 19:AE33, 26:AE34 |
| J1C | A16 | 16:AE44 |
| J2 | DISPLAY | 1:AF51, 2:AF50, 3:AF49, 4:AF48, 5:AF47, 6:AF46, 7:AF45, 8:AF44, 9:AF43, 10:AF42, 11:AF41, 12:AF40, 13:AF39, 14:AF38 |
| Q1 | S8050 | 1:C49, 2:C50, 3:C51 |
| R1 | 10k | 1:R48, 2:N48 |
| R2 | 10k | 1:R41, 2:R45 |
| R3 | 10k | 1:Q40, 2:Q44 |
| R4 | 10k | 1:AB34, 2:X34 |
| R5 | 10k | 1:AC35, 2:Y35 |
| R6 | 1k | 1:A47, 2:A51 |
| R7 | 1k | 1:Z39, 2:Z43 |
| R8 | 10k | 1:AB39, 2:AB43 |
| R9 | 10k | 1:AE39, 2:AE43 |
| R10 | 10k | 1:P6, 2:P10 |
| R11 | 10k | 1:Q9, 2:Q13 |
| R12 | 10k | 1:R12, 2:R16 |
| R13 | 10k | 1:S15, 2:S19 |
| R14 | 10k | 1:P18, 2:P22 |
| R15 | 10k | 1:Q21, 2:Q25 |
| R16 | 10k | 1:R24, 2:R28 |
| R17 | 10k | 1:Y38, 2:AC38 |
| R20 | 10k | 1:R19, 2:R23 |
| R21 | 10k | 1:Q16, 2:Q20 |
| R22 | 10k | 1:P13, 2:P17 |
| R23 | 10k | 1:S10, 2:S14 |
| R24 | 10k | 1:R7, 2:R11 |
| R25 | 10k | 1:Q4, 2:Q8 |
| R26 | 10k | 1:P1, 2:P5 |
| SW1 | SW1 | 1:AF6, 2:AE6, 3:AD6, 4:AC6, 5:AB6 |
| SW2 | SW2 | 1:AF9, 2:AE9, 3:AD9, 4:AC9, 5:AB9 |
| SW3 | SW3 | 1:AF12, 2:AE12, 3:AD12, 4:AC12, 5:AB12 |
| SW4 | SW4 | 1:AF15, 2:AE15, 3:AD15, 4:AC15, 5:AB15 |
| SW5 | SW5 | 1:AF18, 2:AE18, 3:AD18, 4:AC18, 5:AB18 |
| SW6 | SW6 | 1:AF21, 2:AE21, 3:AD21, 4:AC21, 5:AB21 |
| SW7 | SW7 | 1:AF24, 2:AE24, 3:AD24, 4:AC24, 5:AB24 |
| U1 | MCP23017 | 1:I36, 2:J36, 3:K36, 4:L36, 5:M36, 6:N36, 7:O36, 8:P36, 9:Q36, 10:R36, 11:S36, 12:T36, 13:U36, 14:V36, 15:V39, 16:U39, 17:T39, 18:S39, 19:R39, 20:Q39, 21:P39, 22:O39, 23:N39, 24:M39, 25:L39, 26:K39, 27:J39, 28:I39 |

### Checked

The drawing tool draws nothing unless every pin of the circuit-board netlist is on its net and the layout has no short, no unconnected pin, no wire over a joint or along a bare run, no part standing where another part is. This layout: 45 parts, 90 bare runs, 67 wires, 0 hidden wires, 0 errors; 83 pairs of nets run bare in neighbouring holes somewhere, so keep those joints small; 0 wire crossings; pump-side neighbour rule: no allowed pairs.
