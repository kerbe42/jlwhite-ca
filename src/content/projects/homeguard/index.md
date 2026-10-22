---
title: 'HomeGuard: self-hosted home security from radios, cameras and one set of rules'
world: work
date: 2026-10-05
summary: "Home security that runs entirely on my own hardware: ESP32 nodes that hear which devices are in and around the house, person detection on the camera feeds, a software radio that hears drone links, and one set of rules that judges all of it by who is home and the time of day. Alerts arrive on the phone with a photo and a clip; the nodes update over the air in stages and roll back on their own."
featured: false
cover: ./cover.png
coverAlt: "An architecture diagram: ESP32 nodes, cameras, a software radio and the home Wi-Fi's client list feed a HomeGuard server with a person detector, a clip recorder, rules, health checks and staged updates; alerts go out as push notifications, to an Android app and to a dashboard"
tags: ['home-security', 'esp32', 'computer-vision', 'onnx', 'mqtt', 'sdr', 'android', 'python', 'self-hosted']
draft: false
---

## What it is

HomeGuard is home security that runs on my own hardware. Home security has a high bar: it has to be right at three in the morning, it has to say so when part of it stops working, and it can't depend on anyone's cloud. HomeGuard runs as a self-hosted service with its own database, its own ESP32 nodes and its own Android app.

It brings together three kinds of evidence that are each weak alone: radio (which phones and devices are in and around the house), cameras (is that a person), and drones (Remote ID and the drones' own links). One set of rules weighs them against who is home.

## Watch states

![Three columns: Away alerts on a person on a camera, unfamiliar radio devices, drones and health problems; Night alerts on a person at a watched zone, never-seen radio devices, drones and health problems; Home alerts only on drones and health problems while it learns the household baseline](./watch-states.png)

- **Away.** Every resident's phone is outside the home radius (the Android app reports presence), or the system is armed by hand. Every rule alerts.
- **Night.** Residents are home, inside an overnight window. A person at a watched zone alerts, and so does a radio device never seen before; a familiar visitor staying over does not.
- **Home.** Daytime with residents in. Only drones and health problems alert, while HomeGuard learns the household's normal devices.

Some details only show up in real use. Coming home, the car, earbuds and watch are heard by the nodes before the phone reports that you've arrived, so radio-only alerts are held while you pull in; the cameras still alert as normal. A trusted device joining the home Wi-Fi while you're away is someone you trust arriving, so it's an arrival notice, not an intruder alarm.

Phones, earbuds and trackers change their Bluetooth address every few minutes, so to a baseline of known devices each new address looks like a stranger, and the household was setting off "unknown device" alerts all night. HomeGuard now links a new address to the one it took over from: the same kind of device, at the same place by signal strength at every node, either at the exact moment the old one went quiet or on the device's own beacon rhythm. If two addresses could have taken over at once, neither link is trusted. A chain of addresses that was inside since well before the watch began, and hasn't moved, isn't an intruder; anything that arrives during the watch, or turns up somewhere new, alerts exactly as before. Replayed against the real nights, that removed more than half of the overnight radio alerts, and strangers injected into the same nights, even at the household device's hand-over moments, still alerted.

## Who belongs here

The cleanest signal of who belongs is the home Wi-Fi itself: everyone trusted has the password and nobody else does. HomeGuard reads the router's client list through a read-only API, so a device that has ever joined the home network counts as household. Phones use one fixed private address per Wi-Fi network, which is also the address HomeGuard's nodes hear from them over the air, so the client list lines up with the radio sightings. Everything else is judged against a household baseline that HomeGuard learns while you're home.

## Nodes

Home nodes are ESP32-S3 boards, or the ESP32-C5 for dual-band 2.4 and 5 GHz Wi-Fi, running HomeGuard's node firmware. They stay on Wi-Fi and MQTT and stream what they hear every few seconds. The broker's last-will message reports a dead node within about 45 seconds. Each node decodes drone Remote ID from Bluetooth, Wi-Fi beacons and Wi-Fi NAN; the decoder is tested against the open-source Remote ID reference implementation.

**Updates go over the air, carefully.** Upload an image on the dashboard and press *Roll out*. The image carries a version and role marker, and HomeGuard refuses one built for the pocket unit or for a different chip. Nodes then update one at a time, and each must come back healthy on the new version before the next one starts; any failure stops the rollout. On the node, a freshly written image stays "pending" until the node is back on MQTT, and the bootloader rolls back to the previous image if that doesn't happen. A one-time USB flash sets the layout up so that each node keeps its own settings across every later update.

## Cameras and person detection

Each camera's low-resolution stream is decoded continuously, and a YOLOX person detector (Apache-2.0, run through ONNX Runtime on the CPU) checks the frames. Where a person counts depends on the watch state: anywhere in the picture while away, only overlapping the zones drawn on the dashboard overnight, and nowhere in the daytime. An event starts when three of the last five checks see a person and in at least two of them the picture inside the person's box actually changed; it ends 30 seconds after the last change. One alert per event, with an annotated still and a 40-second clip that starts ten seconds *before* the detection, cut from a rolling recording of the camera's full-resolution stream.

The "picture changed" test is what keeps false alarms down. The things a detector mistakes for a person, a coat on a hook or a poster, sit perfectly still, so the picture in their box correlates almost exactly from one check to the next, while a real person's doesn't. Normalized correlation ignores brightness, and a check where most of the frame changed at once (lights coming on, the infrared filter switching) doesn't count as a change. The cost, stated plainly: someone already in view and perfectly still when the watch starts isn't an event until they move. Areas marked "not a person" from an alert are ignored from then on.

**Motion gating** keeps it affordable. The detector is the expensive part and the scenes are still most of the time, so it runs only when the picture changes, during an active event, or every ten seconds for someone standing still, and not at all while the household is home. That took the service from about two busy CPU cores to under a fifth of one while nothing is happening.

**A second look.** Every event also goes to a vision model running on a GPU machine in the house, never a cloud service. It is shown each box that set the event off, cut from the full frame, and asked whether a real person is in it; the answer goes on the alert as one line, such as "a real person, dark shirt, doing laundry" or "no person: looks like a pile of clothes". Asking about each box worked where asking about the whole picture didn't: replayed over the stored events, every verdict was right, including the punching ball that used to set off alarms, while whole annotated frames confused the model. By default the second look only annotates, so the alert goes out at once and the note follows. An optional mode lets an alarm it is sure about go out as a normal "possible person" notice instead; any other answer, an error or the model's machine being off leaves the alarm as it was.

**Who was it.** Household recognition is opt-in, person by person: someone is added only with a note that they have agreed, and from then on the faces in each event's full-resolution clip are compared with theirs, adding "probably" or "possibly" a name to the alert, or "not recognised". Faces of people who aren't enrolled are never turned into anything comparable, and removing a person deletes everything kept about them. It runs on the server's CPU with small open face models, after the alert has gone out, and never changes an alert.

Cameras that only work through their maker's cloud are supported the long way round: HomeGuard downloads each new clip, runs its own person detector over it, and arms and disarms those cameras along with its own watch states.

## Drones from a software radio

The ESP32 nodes hear Remote ID and drones flown over Wi-Fi, but not the proprietary video and telemetry links most consumer drones use. For those, a networked software-defined radio streams samples to a separate HomeGuard service that looks for two things:

- **DJI DroneID.** Each burst is found by cyclic-prefix correlation and confirmed by its Zadoff-Chu reference symbols, then decoded: channel estimate, QPSK, descrambling, rate de-matching (with a full LTE turbo decoder as the fallback) and two CRCs. A plaintext packet gives the drone's serial number, its position, altitude and speed, and the pilot's and home point's positions. The serial is the same one Remote ID carries, so a drone heard by both the radio and the nodes is merged into one track. Newer models encrypt the payload; the burst is the same, so they are still detected, and their session identifier becomes the track key. The decoder is validated on published research recordings, where every burst decodes.
- **Analog FPV video** on 5.8 GHz, found by demodulating an occupied channel and checking for a television line rate.

The scan schedule follows the drones' hopping pattern, so every DroneID channel gets a gap-free look often enough to catch a drone that is hopping between bands. The radio's transmitters are powered down and fully attenuated on every connect: left on, they leaked a carrier into the radio's own 2.4 GHz measurements.

## Health

A security system that has quietly stopped is worse than none, because you think you're covered. Every node, camera, the detector, the recorder, the broker connection and the disk are checked every ten seconds. A problem lasting two minutes raises an alert, urgently when you're away or overnight, and its recovery is reported too. A wedged worker thread makes the process exit so its container restarts, and the phone app raises its own alarm if the server itself disappears.

## Alerts, the app and the dashboard

Alerts go to the phone through a self-hosted push server, with the photo and the clip. HomeGuard's Android app arms and disarms, shows each camera's live still and the recent alerts, lists the nodes, drones and household devices, and updates itself from the server. After the overnight watch, one quiet notification sums up the night: alarms, camera events with the second look's verdicts, radio alerts grouped by what was heard, and health problems. The web dashboard is where zones are drawn (by clicking around the area on a live image), firmware is rolled out and the radio's spectrum is shown.

## Limits

- A person who is perfectly still from the moment the watch starts isn't detected until they move.
- Radio alone can't tell a guest from an intruder; it only knows familiar from unfamiliar, which is why it's weighed against the cameras and the watch state.
- Encrypted DroneID gives detection and a session identifier, not the drone's position or serial.
- Cameras mounted high see the tops of heads more often than faces, so recognition is a note when it works, and each person needs several examples from different days before it works well.
- The second look is a mid-sized vision model. It describes well but misjudges a single box now and then (it once called a real person a mannequin), which is why it annotates rather than decides.
- Where the decoded altitude fields come from is still uncertain in the published sources; HomeGuard keeps the raw values beside its interpretation.
