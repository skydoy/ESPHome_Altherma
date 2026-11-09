# Overview

Details that used to live in the root [README](../README.md). Short start: [README](../README.md) · [Install](install.md).

## What it is

Connect a small ESP board to the **X10A** service connector of your **Daikin Altherma** heat pump and read
temperatures, flow, power and more locally in Home Assistant. No cloud, no MQTT, no app.

Free for personal and non-commercial use on my own files in this fork ([LICENSE](../LICENSE)). Commercial use is not permitted for those files.

**Is my heat pump supported?** See the [models](models.md) and the
[compatibility list](compatibility.md) ·
[Report my heat pump](https://github.com/skydoy/ESPHome_Altherma/issues/new?template=compatibility-report.yml)

## What you get in Home Assistant

| Entity | What it does |
|---|---|
| **Sensors** | Water and refrigerant temperatures, flow, pressures, compressor and fan speed, voltage, current, power (depends on the model file). |
| **Operation** | Operation mode, defrost, pumps and valves status, error codes. |
| **Firmware** | New versions in one click, over the air. |
| **query_register** action | Read any X10A register by hand to map new sensors (experimental). |

On the M5Stack Core / Basic the screen shows the live values (buttons to navigate, dark / light theme) and a short boot animation.

Screenshots of the device web page: [Device web page](web-page.md).

## Boards

| Board | Notes |
|---|---|
| [ESP32 DevKit](https://www.espboards.dev/esp32/esp32doit-devkit-v1/) | Cheapest, most tested. |
| [ESP32-S3 DevKitC-1](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32s3/esp32-s3-devkitc-1/) | Newer chip. |
| [M5Stack AtomS3 / AtomS3 Lite](https://docs.m5stack.com/en/core/AtomS3%20Lite) | Tiny, wires on the Grove port. |
| [D1 mini (ESP8266)](https://docs.wemos.cc/en/latest/d1/d1_mini.html) | Works, but less memory. |
| [M5Stack Core / Basic](https://docs.m5stack.com/en/core/basic) | Screen + buttons. |

> ⚠️ Some units can't power the board from the X10A 5 V pin. If it keeps rebooting, power it from a USB charger
> instead (and connect only TX, RX and GND). Details: [wiring · Power](wiring.md#power).

Pinout and safety: [Install](install.md) · [Wiring](wiring.md).

## Heat pump models

Ready-made firmware covers Altherma 3 R (ERGA / ERLA), Altherma 3 H HT (EPRA), Altherma LT and more.
The installer flashes a **generic** image; the board reads the indoor unit's Software ID and Micon ID (read-only)
and shows **Suggested Model**. Full tables and untested maps: [Models](models.md).

## Automatic updates (OTA)

The prebuilt firmware has no API key or OTA password, so any Home Assistant can adopt it, and it updates itself from
the **Firmware** entity. To add a key and passwords, adopt it in the ESPHome Device Builder:
[Security and OTA](security.md).

- **Web installer image:** Home Assistant shows **Firmware**. Press **Install**. Wi-Fi is kept.
- **Adopted in the ESPHome Device Builder:** the board reports **Update Available**. Press **Install** in the Device Builder (do not use «Install Update» on the device — that button is only on the factory web-installer image).

Adopted boards can use the blueprint
[`esphome_altherma_update_available.yaml`](../homeassistant/blueprints/esphome_altherma_update_available.yaml)
for a phone notification when a new release is out.

## Device web page

Open `http://<board-ip>/` on your LAN for a live heat-pump diagram, entities, update buttons and the debug log
(no password by design; [security notes](security.md)).
Language: PT/EN toggle. Diagnostic and Altherma text values follow the same language on screen only.

Full screenshots: [Device web page](web-page.md).

## Own build / Device Builder

Board configs `boards/esphome-altherma-<board>.yaml`, shared `boards/base.yaml`, sensor maps in [`confs/`](../confs/).
Relays, register discovery, mock UART, Emoncms and the vendored ESPAltherma files: [Advanced use](advanced.md).

## Credits

- Component, sensors and model files: esphome-altherma by jjohnsen and its contributors, based on ESPAltherma by raomin.
- Web installer, builds, docs, logo and boot animation: skydoy. Board pictures and the wiring diagram are illustrations.

**Licence:** my own work in this fork (web installer, web UI, docs, logo, blueprint, report worker) is under
[PolyForm Noncommercial 1.0.0](../LICENSE). It does not cover the upstream component, model and board files
(no licence declared), the ESPAltherma files (MIT), or the GPL-3.0 ESPHome runtime inside the firmware images:
see [third-party notices](../THIRD_PARTY_NOTICES.md).

Use at your own risk: work on the heat pump with the breaker off. Daikin and Altherma are trademarks of their owner;
this is an independent community project, not affiliated with it.
