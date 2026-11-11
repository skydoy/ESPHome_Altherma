# ESPHome Altherma

**Your Daikin Altherma 3 in Home Assistant.** Plug in by USB, pick your heat pump, click Install. No YAML.

<div class="hero-install" markdown="1">

[Open the web installer](https://skydoy.github.io/ESPHome_Altherma/){ .md-button .md-button--primary }

</div>

**ESP32 DevKit**, **ESP32-S3**, **M5Stack AtomS3**, **D1 mini (ESP8266)** or **M5Stack Core / Basic**, on **Daikin Altherma** units with the **X10A** service connector (Altherma 3 R / H HT, Altherma LT, and more).

## Start here

1. [Install](install.md) — flash the firmware
2. [Wiring](wiring.md) — connect the board to X10A
3. [Models](models.md) — the board suggests the model
4. [Compatibility](compatibility.md) — units people have already run

Also: [Overview](overview.md) · [Device web page](web-page.md) · [Security and updates](security.md) · [Advanced use](advanced.md)

## What you get

- Sensors: water and refrigerant temperatures, flow, pressures, compressor / fan speed, power (depends on the model)
- Operation: mode, defrost, pumps and valves, error codes
- One-click firmware updates over the air
- Device web page on your LAN (`http://<board-ip>/`)
- M5Stack Core / Basic: live values on the screen and a short boot animation
- Local read-only — no cloud; optional anonymous compatibility report

Flash the board before you wire it. Never connect USB and the X10A 5 V at the same time.
