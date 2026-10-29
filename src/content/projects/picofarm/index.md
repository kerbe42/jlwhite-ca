---
title: 'PicoFarm: a stand-alone controller that measures, doses and protects a hydroponic reservoir'
world: work
date: 2026-10-29T12:00:00Z
summary: "My hydroponics monitoring and control system. A controller with a 3.5\" touch screen, a knob and an AUTO/OFF/HAND switch per pump measures pH, EC, water temperature and level and runs seven pumps behind a hardware E-stop and a master relay, all on low-voltage DC. A home server keeps the history, sends push alerts and shows a process control screen; an Android app watches and controls it from the phone. Revision B is designed and reviewed; the bench build is next."
featured: false
cover: ./cover.png
coverAlt: "PicoFarm in four steps: the reservoir is measured (pH, EC, temperature, level and leak), an ESP32 acts (seven pumps, interlocks, automatic dosing), a home server records (MQTT broker, history, alerts, dashboard) and an Android app shows it at home or over a VPN; the safety logic runs on the controller and keeps working if the server is down"
tags: ['hydroponics', 'esp32', 'electronics', 'mqtt', 'fastapi', 'android', 'python', 'self-hosted']
draft: false
---

## What it is

PicoFarm is my hydroponics monitoring and control system. Each reservoir gets a controller that measures pH, EC (how strong the nutrient solution is), water temperature and level, and runs seven pumps: pH Up, pH Down, Nutrient A and Nutrient B for dosing, plus refill, circulation and drain. The controller is a stand-alone instrument: a 3.5" touch screen on the front panel shows the same values as the dashboard, a knob edits setpoints, a three-position switch under each pump sets it to AUTO, OFF or HAND, and a red E-stop button cuts the pumps' power by itself. A home server keeps the history, relays commands and sends push alerts, and an Android app shows everything and controls it from the phone. Whatever is changed in one place shows up in the others.

It grew out of [PicoPH](/builds/picoph), the Raspberry Pi Pico monitor that has been watching the [garden](/garden/hydroponic-garden). PicoPH told me the pH and EC, but every correction was still done by hand: measure, add a little, wait, measure again. PicoFarm does that loop itself, for the reservoirs that feed the [printed towers](/builds/hydro-tower). A system that pumps acid, nutrients and water in a room of the house needs to be careful above all, so most of the design is about what it must never do.

This page describes revision B of the controller. The firmware, the server with its process screen and the Android app are built and running against a simulated controller; the revision B circuit has been designed and reviewed, down to a hole-by-hole drawing of the first hand-wired unit, and the parts are ordered. The bench build is next. You can [try the process screen](https://picofarm.jlwhite.ca) in your browser against a simulated reservoir, and the [build instructions](/work/picofarm/build) are on their own page.

## Try the live demo

[![The PicoFarm process screen running in the live demo: the seven pumps with their hand-off-auto tags, the pump power line with the E-stop circuit live and the K1 relay closed, the reservoir at 62 % with its level switches, pH 6.42, EC 1.30 mS/cm and 21.6 °C with their trends, and the event log of automatic doses](./demo-live.png)](https://picofarm.jlwhite.ca)

**[Open the live demo](https://picofarm.jlwhite.ca).** The dashboard runs entirely in your browser against a simulated revision B controller: the reservoir drifts, the controller doses it back into range, and the circulation pump cycles. The menu at the bottom simulates faults (a leak, low water, a pH probe fault, a switch left in HAND, the E-stop pressed, a blown pump fuse, a welded relay) so you can watch the interlocks react, and the settings page has the crop profiles, the calibration and the firmware update. Nothing in the demo reaches real equipment.

The **Controller panel** button at the bottom opens the controller's own front panel in the middle of the screen: the touch screen, the knob, the seven HAND/OFF/AUTO switches and the latching E-stop button. The screen is the firmware's real screen code, compiled to run in the browser, and it drives the same simulated controller as the dashboard: press E-STOP on either and both show it, put a switch to OFF and the dashboard's run is refused, change a setpoint with the knob and it appears in the settings.

![The controller's front panel open over the demo dashboard: the Overview screen with the tank at 62 %, pH 6.44, EC 1.29 mS/cm and 21.4 °C, the K1 relay closed and the E-stop circuit ready, the seven pumps in AUTO; beside it the knob and the red E-stop button, and below it the seven HAND/OFF/AUTO switches](./demo-panel.png)

## How it fits together

![The PicoFarm architecture: ESP32 controllers, one per reservoir, connect over the home Wi-Fi to an MQTT broker on a home server, which also runs a FastAPI service, SQLite history, alert thresholds, a REST API, push alerts and a process control screen; the Android app connects at home or away over a VPN, alerts reach the phone, and the process screen opens in a browser. Interlocks, run limits, automatic dosing and the watchdog run on each controller.](./architecture.svg)

The controllers join the home Wi-Fi and talk MQTT to a broker on the home server. Each one publishes its readings every few seconds, plus events: a pump started or stopped, a command refused, an alarm raised or cleared, a setting changed on the front panel. Commands and settings flow the other way. Each controller only has access to its own topics, and if one drops off the network the broker tells the server, which raises an offline alert.

The most important choice is where the decisions live. **Every safety rule and all the automation run on the controller.** The server records, relays and alerts, but it never decides anything that matters for safety: if it goes down, or the Wi-Fi does, each controller keeps measuring, keeps dosing within its limits, enforces every interlock and can still be run from its own panel. A command from the app, the dashboard or the panel is a request. The controller checks it against its own rules and either runs it or answers with the reason it refused, such as "blocked: low water".

Settings are versioned. A controller applies a new configuration only if it is newer than the one it has, stores it, and runs on it from then on. Controllers also don't hold on to commands while they're offline: a "run the drain pump" sent while a controller was unreachable is dropped, not carried out hours later.

## The controller

![Eight screens of the front panel, rendered from the firmware’s own screen code: the Overview with the tank level, pH, EC and temperature, the K1 relay and E-stop state and the seven pumps with their AUTO, OFF or HAND state; the Pumps page; the Setpoints page; the pH target dialog edited with the knob; the pH trend over 24 hours; the Calibration page with its pH 7, pH 4, pH 10 and EC 1413 buttons; the Alarms page with ACK, CLEAR and RESTART; and the Overview after a panel E-stop, with the relay open and automation held](./panel-screens.png)

*The front-panel screens, rendered on a PC from the firmware's own screen code before the hardware exists.*

The controller is a box with a front panel and two circuit boards, running on 5 V DC from two ordinary USB chargers. Nothing in it runs on mains voltage.

**On the front panel:**

- A **3.5" IPS touch screen** (480 × 320, ST7796 over SPI, FT6336 touch over I²C) with seven pages: Overview, Trends, Pumps, Setpoints, Alarms, Calibration and Network. The software E-STOP sits at the top right of every page. The screen dims after 2 minutes without input; a touch or the knob wakes it, and that first input does nothing else, except a touch on E-STOP, which stops everything at the first touch.
- A **rotary knob** (EC11): turn to move between buttons or to change a value in a dialog, push to press, hold to cancel or go back to the Overview. Every button also works by touch.
- **Seven AUTO / OFF / HAND toggles**, one per pump, in the firmware's pump order: pH UP, pH DN, NUTR A, NUTR B, REFILL, CIRC, DRAIN.
- A **22 mm latching E-stop** with a normally closed contact, wired into the pumps' power, and a **buzzer** for critical alarms.

**Inside:**

- An **ESP32-S3** dev board (DevKitC-1 layout, with PSRAM for the display buffers). The design needs 27 GPIOs, which the classic ESP32 can't offer; the S3 also has a pull-up on every pin and no input-only pins.
- **Two ADS1115 16-bit converters**: one reads the pH, EC and analog level inputs; the other watches the power: the supply, the E-stop node, the pump rail and the logic 5 V. That is how the controller knows a fuse has tripped (`pump_power`) or the relay is stuck closed (`relay_fault`).
- An **MCP23017** port expander reads the 14 toggle contacts, drives the buzzer and resets the display.
- A **ULN2803A** driver sinks the six dosing, refill and drain pumps, plus the opto input of an isolated MOSFET module that runs the circulation pump.
- A **master relay K1** in the pump rail, driven by an S8050 transistor from one GPIO.
- A **main board** (130 × 110 mm) on the floor of the box with pluggable terminals on three edges (sensors on the left, pumps along the bottom, the supplies, E-stop and circulation module on the right), and a **panel board** (120 × 70 mm) behind the lid with the port expander, the knob's filters, the buzzer and the display header. A 26-way ribbon joins them.

![An angled render of the revision B main board from its design files: the black ESP32-S3 dev board on its sockets in the top left with its silver module and two USB-C ports, the two blue ADS1115 modules in the middle, the ULN2803A in its socket at the bottom, the blue relay K1, the two 1000 µF capacitors and the two yellow PTC fuses on the right, the seven green pump plugs along the bottom edge, the sensor plugs down the left edge and the supply, E-stop and circulation plugs on the right](./main-board-render.png)

![An angled render of the revision B panel board from its design files: the display header’s Dupont housing lying off the left edge with its coloured wires, the MCP23017 in its socket between its two rows of pull-up resistors, the ribbon plug and its grey cable along the top, the knob group and its filter parts on the right, the black buzzer, and the coloured wire stubs of the seven toggle lead groups along the bottom edge labelled pH UP to DRAIN](./panel-board-render.png)

*Renders of the printed main board and panel board from their design files. The first unit is hand-wired on protoboard; the printed boards follow once it passes its bench tests.*

The firmware is plain C++ with a control core that has no hardware calls, so the same code runs on the controller and on a PC, where more than 100 host tests exercise the interlocks, the E-stop, the hand-off-auto states, the dosing order, dilution, the limits, the calibration maths and alarms that survive a reboot. The front panel's screens are rendered on a PC from the same code and fonts, which is where the pictures above come from.

## The safety chain

![The revision B power and safety chain: the pump supply goes from PUMP IN through fuse F1 (2.5 A) to the PFUSE node, through the E-stop’s normally closed contact to the ESN node, through relay K1’s normally open contact to RAIL, through each toggle’s pole 1 to the pump and back through a ULN2803A output; D1 and C1 sit at PFUSE before the E-stop; K1’s coil runs from ESN through an S8050 driven by GPIO3; ESN is sensed by GPIO17 and the second ADS1115. The logic supply goes from LOGIC IN through fuse F2 (1.6 A), the D2 clamp and C2 to logic 5 V, then a Schottky diode into the ESP32-S3’s 5 V pin. Pump ground and logic ground meet at one star wire.](./safety-chain.svg)

The pumps' power runs through a chain of things that can each cut it on their own: a 2.5 A fuse, the E-stop button's normally closed contact, the master relay's contact, and each pump's own toggle. The E-stop is wired like an industrial safety circuit, not like a button the software reads:

| What happens | What cuts the pumps | What the controller does |
| --- | --- | --- |
| E-STOP pressed | the NC contact: the rail dies at once, whatever the firmware is doing; K1's coil, fed from the same node, also drops | sees the node go low, latches `estop` (source `hardware`) |
| E-STOP released | nothing restarts: K1 stays off until the firmware closes it | holds `estop` until RESTART from the panel, app or dashboard |
| software E-STOP (panel, app, dashboard) | the firmware drops K1 (a hardware cut) and every pump output | latches `estop` (source `panel`, `app` or `server`) |
| leak | the firmware drops K1 and every output | latches `leak` |
| firmware hang or crash | the 5 s watchdog resets the chip; the outputs and K1 drop, because the driver inputs and the relay transistor's base are pulled down | restarts with K1 off and automation held |
| power-up | K1 is off: its coil can't energize until the firmware drives its pin | turns K1 on only after the sensors start, with no latched `estop` or `leak` |
| fuse F1 trips or the pump cable is out | | the power monitor sees the supply low: alarm `pump_power` (no dosing counted) |
| K1 stuck closed | | rail present while K1 is commanded off: alarm `relay_fault`, critical |
| a supply wired backwards | a 3 A diode clamps the reversed voltage; the charger shuts down or the fuse trips | |

A few details carry most of the weight. The relay's coil is driven by its own transistor rather than a spare driver channel, so it gets the voltage it needs even from a weak charger. The driver chip's common pin returns each motor's switch-off energy to the node that feeds the pumps, through the E-stop, so a dead rail stays dead. On a software E-stop the firmware turns the pumps off first and drops the relay after them, so the relay never breaks a running motor's current. A diode across every pump protects the toggle and float contacts when they break a running motor. The big capacitor sits before the E-stop, so releasing the button doesn't slam an empty capacitor onto the charger. And the two supplies are two separate certified chargers, so a pump fault can't restart the controller and no ground loop runs through a charger.

## AUTO, OFF and HAND

Each pump has a two-pole, three-position toggle. One pole carries the pump's power: **OFF physically cuts that pump**, whatever the firmware does. The other pole tells the controller where the lever is.

| Position | What the controller does |
| --- | --- |
| AUTO | normal: automation, and manual runs from the panel, app and dashboard |
| OFF | the pump is disabled and shows OFF everywhere; runs are refused with the reason `switch_off`; a mode that needs it raises a `pump_off` notice |
| HAND | runs now, through the controller. Every interlock still applies (E-stop, leak, low water, high and emergency level for refill, pH Up and pH Down never together). It stops after the pump's maximum run time and raises `hand_timeout` until the switch leaves HAND; it counts toward the daily cap and holds automation for a mix period. Circulation in HAND runs with no timeout. |
| both contacts closed | a wiring fault: treated as OFF, alarm `switch_fault` |

The controller also keeps a budget: at most two of the driver chip's pumps run at once, which keeps the chip and the ribbon's rail conductors inside their ratings. A start that would be the third is refused with the reason `pump_budget`, and a HAND request waits for a free channel.

## Sensors and inputs

- **Analog sensors go through an ADS1115.** The ESP32's own converter is noisy, and the external one is accurate to 16 bits.
- **pH:** a pH-4502C board with a BNC probe. Its output swings up to 5 V, so a 10 k/20 k divider brings it under the converter's limit. No pH or EC sample is taken while a dosing, refill or drain pump runs, or for 2 seconds after, because a brushed motor in the water offsets the high-impedance probe; circulation is allowed, so the probes are calibrated with it running.
- **EC:** an analog conductivity board and probe. An EC probe drives current through the water, which skews a pH probe in the same reservoir, so the board is powered from a GPIO and only switched on while EC is being read.
- **Water temperature:** a waterproof DS18B20. EC readings need it for compensation, and the pH calculation uses it to correct the probe's slope; automatic EC dosing refuses to run without it.
- **Level:** an analog level sensor, or an ultrasonic JSN-SR04T looking down at the water from above, through a divider that keeps its 5 V echo under the GPIO's limit.
- **Level switches** for low, high and emergency water, and a **leak sensor** (two stainless pads) at the lowest point of the tray under the tank. The leak input is set to read wet at under about 70 kΩ, so plain tap water counts as well as nutrient solution.
- **A float switch** above the high level, wired in series with the refill pump's power. If the water ever lifts it, the refill pump stops, whatever the firmware is doing.

Every input has its protection: a small series diode and a capacitor on each level switch so the pin never sees the sensor's 5 V, a divider on the echo line, 100 Ω in the 3.3 V feed to the temperature probe and the leak cable so a wet or crushed cable can't short the logic supply, and the pump pins chosen so a reset can't twitch a pump.

## The reservoir

![A cross-section of the reservoir: pH, EC and temperature probes hang into the nutrient solution, an ultrasonic level sensor looks down from above, four dosing lines come in from the pH Up, pH Down, Nutrient A and Nutrient B pumps, a refill pump brings fresh water in, a drain pump takes water out, a circulation pump sits on the bottom, and the low, high and emergency level switches sit on the wall with a float above them that cuts the refill pump’s power; a leak sensor sits on the floor beside the tank](./reservoir.svg)

The probes hang in the solution, the four dosing lines drip in from above, and the circulation pump mixes what arrives. The level switches are placed for what each one protects:

- **Low level:** below it, dosing, circulation and drain are all blocked, so nothing is dosed into a nearly empty tank and no pump runs dry.
- **High level:** stops the refill.
- **Emergency level:** above the high level; the controller locks out the refill pump until the alarm is cleared and shows the trip on the phone.
- **Float switch:** above the high level and in series with the refill pump's power. If the water ever reaches it, the refill pump stops, whatever the firmware is doing.
- **Leak sensor:** under the tank. Wet means every pump stops and the master relay opens, and they stay stopped until someone clears the alarm.

## How it decides

![A timeline of one automatic dosing cycle: after boot, dosing waits 10 minutes; a reading shows EC low, so Nutrient A runs, then Nutrient B after a 60 second gap, then a 10 minute mix with circulation forced on; a fresh reading shows EC in band and pH high, so pH Down runs, then another mix; the next reading is in band and nothing runs](./dosing-cycle.svg)

Automatic dosing works from a target and a band for each value (by default pH 5.9 ± 0.3 and EC 1.6 ± 0.2 mS/cm) and a dose size in millilitres. Each pump's flow rate is calibrated, so a dose in millilitres becomes an exact run time. The controller is deliberately patient:

- **It waits after every dose, refill and boot.** The default is a 10-minute mix, with circulation forced on after a dose, and then it needs a fresh reading taken after the mix before it may act again. After a boot it always waits at least two minutes whatever the mix time is set to, and the daily pump counters are saved at the end of each run and restored after a reset, so a controller stuck in a reboot loop can neither dose once per boot nor forget its daily cap.
- **EC comes before pH**, because adding nutrients moves the pH. But never twice in a row while pH is also out of band, so an EC that won't rise can't hold off the pH correction.
- **Nutrient B follows A after a gap** (60 seconds by default), so the two concentrates never meet undiluted. If A is cut short, B doesn't follow.
- **EC that stays high gets diluted.** Nutrients can't be taken back out, and the normal refills usually bring EC down as the plants drink. If EC is still above its band after a grace period (two hours by default), the controller adds measured steps of fresh water while there's room, and once the tank is full it can drain a share and refill it with fresh water, a few times a day at most. It needs a level reading to measure what goes in and out, and stops with a `dilute_blocked` alarm when it can't go on.
- **Doses that don't move the reading stop.** After six nutrient doses that haven't brought EC into band, or six pH doses the same way that haven't brought pH into band (an empty bottle, a failed pump, or a probe past its range), it pauses that dosing and says so, rather than keep pouring.
- **Automatic refill needs something to stop it**, either a level sensor or the high level switch, and won't run without one. If a refill runs for its maximum time without reaching the stop level, something is wrong (an empty supply, a stuck switch), so it latches a `refill_timeout` alarm and stays off until cleared.
- **It won't guess.** Automatic mode refuses to run with an uncalibrated probe or pump, and says so as an alarm; a minute without a completed sample raises `sensor_stale`. A refused automatic action is retried at most once a minute.

## Layers of protection

1. **Hardware.** The E-stop's contact and each pump's OFF position cut power with no firmware involved; the master relay can't close until the firmware closes it; the float cuts the refill pump; both supplies are fused and clamped; and the driver inputs and the relay transistor are pulled down, so a reset or a crash leaves every pump off.
2. **Watchdog.** If the control loop stalls for 5 seconds, the chip resets, and every pump and the relay drop.
3. **Interlocks.** E-STOP holds everything, HAND and manual runs included, until someone presses RESTART, even across a reboot. A leak stops everything. Low water blocks dosing, circulation and drain. High water, the emergency level and the float block refill. Drain and refill never run together, and neither do pH Up and pH Down. Manual commands from the panel, the app and the dashboard, and a switch in HAND, all go through the same checks as the automation.
4. **Limits.** Each pump can have a maximum single run and a daily run-time cap, and the dosing and refill pumps have both by default. A HAND run stops at the same maximum. At most two driver-chip pumps run at once. A manual refill with nothing to stop it is limited to 60 seconds.
5. **Patience.** The mix wait, the fresh reading, EC before pH and B after A, as above. The leak, E-stop, emergency and refill-timeout alarms survive a reboot and clear only when someone clears them.

## The server

The server runs on a home machine: an MQTT broker for the controllers, and a Python FastAPI service that does everything else. It stores the readings in SQLite and serves them back as charts, keeps a log of events, and holds each controller's settings so that a change made while a controller is offline is applied when it reconnects. It also serves the web dashboard and the API the app uses.

It also updates the controllers' firmware over Wi-Fi. I pick a new build on the settings page; the server checks that it is a firmware image for that controller's chip and that it fits, then hands the controller a one-time download link. The controller stops its pumps and opens its relay, downloads the image and checks it, restarts on it, and goes back to its previous firmware if the new one doesn't come back online within ten minutes.

Alerts are the server's other job. On top of the controllers' own alarms, it watches thresholds I set for each controller (pH, EC and temperature out of range, a low level, a controller offline for too long) and sends every warning and critical event to the phone through a self-hosted ntfy server. Short excursions are the controller's job, so the alerts that matter most are about time: EC above its band for six hours, or pH outside its band for four. Nothing goes through an outside cloud service.

## Everything syncs

A setpoint changed on the front panel takes effect at once, even with the server down. The controller then reports it as an edit: a message with the changed fields, a timestamp and the origin `panel`. The server folds the edit into the controller's desired configuration as the next revision and sends it back, so the dashboard, the app and the panel always agree. If the same field was changed in two places while the controller was offline, the later edit wins. The Network page on the panel shows how many edits are still waiting to sync.

The server, the dashboard and the app also show each pump's switch position (tagged HS-101 to HS-107 on the process screen), the relay's state, the supply, rail and logic voltages, and which side raised an E-stop; the panel's edits appear in the event log, and the alarms that come with the panel (`pump_power`, `relay_fault`, `hand_timeout`, `switch_fault`, `pump_off`, `ph_stalled`, `sensor_stale`) have their own tiles and messages.

## Crop profiles

Different crops want different water. A profile holds, for each growth stage, the pH and EC targets and the alert limits, plus the recipe for the two nutrient stock bottles. There are built-in starting points for lettuce, leafy greens, herbs, strawberries, tomatoes, peppers and cucumbers, and my own copies can be edited. Applying a stage to a controller sets its targets and alert limits in one step and leaves everything else alone, and the screens show when the targets have been changed by hand since.

The recipes use a three-part dry nutrient (a base fertiliser, magnesium sulfate and calcium nitrate, mixed 2:1:2). Three parts go into two bottles because calcium nitrate can't share a concentrate with the sulfate and phosphate in the other two: bottle A holds the base and the magnesium sulfate, bottle B the calcium nitrate, and equal doses of each keep the ratio. Fruiting crops run at a higher EC than the analog EC board reads, so their profiles say to fit a higher-range probe.

## The process screen

![The PicoFarm process screen, running against the simulated revision B controller: an alarm annunciator across the top; a mimic of the reservoir with its four dosing pumps and their HS-101 to HS-104 switch tags, the refill pump and water supply, the recirculation loop, the drain, the low, high and emergency level switches, the leak sensor, the tagged pH, EC, temperature and level instruments, and a pump-power strip showing the supply, E-stop, K1 and rail; on the right the pH, EC, level and circulation faceplates, four trends and the event list](./process-screen.png)

*Shown running against the simulated controller.*

The server's main page is a process control screen, laid out like a plant's operator display. A mimic shows the reservoir and everything around it, with every instrument and pump tagged (AIT-101 is the pH analyser, P-102 the pH Down pump, LSL-105 the low level switch, HS-101 the pH Up pump's switch) and showing its live value or state. Pipes animate while their pump runs. A strip on the left shows the pump power: the supply, the E-stop, the relay and the rail, with their voltages. Across the top, an alarm annunciator lights a tile for each active alarm and flashes it until someone acknowledges it, and latched alarms need a deliberate reset. Faceplates for the pH, EC, level and circulation loops show each value against its setpoint and band, and open to change the mode or the setpoint. Trends cover the last hour to the last day, and the event list records every dose, refusal, alarm and panel edit. Clicking a pump opens its own faceplate to run, dose or stop it, always subject to the controller's checks.

The E-STOP is always on screen. It stops every pump, opens the relay and holds the controller there, manual runs and automation included, until someone presses RESTART. It survives a reboot, and after a restart automatic dosing waits a full mix period before it acts again. On a workstation the whole screen fits in one browser window without scrolling; on a phone it stacks into a scrolling page. A second page holds the settings, calibration and history in more detail.

**[Try the demo](https://picofarm.jlwhite.ca).** It is the same screen running entirely in your browser, against a simulated revision B reservoir that drifts, doses itself and reacts. A fault menu at the bottom simulates failures: a leak, low water, a failed pH, EC, temperature or level sensor, an empty nutrient or pH Down bottle, a shut-off water supply, a stuck high float, an emergency overfill, a nutrient overdose, a heat wave, a Wi-Fi drop, a power cut, a switch left in HAND or OFF, a switch wiring fault, the E-stop button, a blown pump fuse and a welded relay. Each one shows how the controller, the alarms and the dilution respond; the overdose is the one to watch, as EC climbs, waits out its grace period, and comes back down through top-ups and an exchange. Nothing in it is connected to real equipment.

## The Android app

The app is how I'll use PicoFarm day to day, on the home network or from anywhere over a VPN. Its screens:

- **Live readings:** pH, EC, temperature and level for each controller, with its alarms and each pump's switch position.
- **Pumps:** manual control of each pump, STOP ALL, and an E-STOP that holds everything until RESTART.
- **Control settings:** the automatic modes, targets and bands.
- **Guided calibration:** step-by-step calibration of the probes, with a stability indicator that shows when a reading has settled enough to store.
- **History:** charts of pH, EC, temperature and level over time.
- **Events:** doses, refusals, alarms and settings changes.
- **Push alerts:** warnings and critical events arrive as notifications.

![Three screens of the Android app, against the simulated controller: live pH, EC, temperature and level readings with the automatic dosing state and the inputs; the pumps, each with its run time today, cap and flow, above STOP ALL and E-STOP; and the pH calibration wizard showing a stable reading](./app.png)

## Building one

The first unit is hand-wired on two 9 × 15 cm protoboards, drawn hole by hole from the same netlists as the printed boards; the drawing tools refuse to draw a board unless every pin is on its net, and they check the layout rules (no bare run of a pump-side net beside another in more than two holes, no two safety-chain nets side by side).

[![The main board on protoboard, component side, with the modules lifted: the ESP32-S3 sockets and the 33 Ω display resistors under them at the top left, the two ADS1115 sockets, the ULN2803A socket, the relay outline, the fuses, the big capacitors and the pluggable terminals along three edges](/media/picofarm/revb/main/board-top-open.svg)](/media/picofarm/revb/main/board-top-open.svg)

*The main board, component side, with the modules lifted off their sockets. Open the drawing on its own to zoom in on the hole labels.*

[![The lid wiring: the ribbon leads between the panel board and the main board, a toggle with its five leads (rail, out, ground, auto, hand), the knob’s six leads, the E-stop pair to the main board and the display’s fourteen leads](/media/picofarm/revb/lid-wiring.svg)](/media/picofarm/revb/lid-wiring.svg)

The **[build instructions](/work/picofarm/build)** take one controller from the first solder joint to a calibrated unit in nine stages, each ending with a meter check, with the board drawings and the two [wire lists](/work/picofarm/wire-lists). The printed enclosure comes after the bench unit: its requirements (a 190 × 160 mm floor, 70 mm inside, glands low on the walls with drip loops, a hinge on the ribbon edge, the box above the reservoir rim) are settled, the drawing isn't.

## Status

- **Firmware:** the revision B firmware builds for the ESP32-S3 with the front panel, the hand-off-auto states, the relay and the power monitor, covered by the host tests; the screens render from the real code.
- **Server:** running on a home server with the process screen, the settings page, crop profiles and push alerts, extended for revision B (switch positions, relay, voltages, E-stop source, panel edits) and tested end to end against a simulated controller. Firmware updates over Wi-Fi from the settings page are in place; the first real update waits for the bench unit.
- **App:** built and tested against the server and the simulator, including push alerts, crop profiles, dilution settings and the E-STOP.
- **Hardware:** revision B is designed and reviewed, down to the hole-by-hole protoboard drawings and the printed board files. Parts are ordered for two controllers. Nothing is built yet: the bench build is next, then the printed boards and the enclosure.

Next comes the bench unit, its fifteen bench checks, calibrating the probes, and watching the first automatic doses closely before I trust it alone.
