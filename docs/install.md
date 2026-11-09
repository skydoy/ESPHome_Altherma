# Install

🇵🇹 [Ler em português](instalar.md) · [Back to the README](../README.md)

Most people only need the **[web installer](https://skydoy.github.io/esphome-altherma/)**. This page is the same flow with a bit more detail.

## Install in 3 steps

1. **Flash.** Open the **[web installer](https://skydoy.github.io/esphome-altherma/)** in Chrome or Edge on a computer, pick your board, plug it in by USB → **Install**. The board finds your heat pump model by itself (see [Models](models.md)). Do this *before* wiring: never connect USB and the X10A 5 V at the same time.
2. **Wi-Fi.** Type your Wi-Fi in the same window. (Or later: join the `ESPHome Altherma Setup` hotspot from your phone.)
3. **Wire and add.** Heat pump off at the breaker, connect the board to **X10A** ([wiring guide](wiring.md)), breaker back on. Home Assistant shows *ESPHome Altherma* under **Settings → Devices & services** → **Configure**.

After that, updates come over the air from the **Firmware** entity in Home Assistant. No more USB.

## Boards

| Board | Notes |
|---|---|
| [ESP32 DevKit](https://www.espboards.dev/esp32/esp32doit-devkit-v1/) | Cheapest, most tested. |
| [ESP32-S3 DevKitC-1](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32s3/esp32-s3-devkitc-1/) | Newer chip. |
| [M5Stack AtomS3 / AtomS3 Lite](https://docs.m5stack.com/en/core/AtomS3%20Lite) | Tiny, wires on the Grove port. |
| [D1 mini (ESP8266)](https://docs.wemos.cc/en/latest/d1/d1_mini.html) | Works, but less memory. |
| [M5Stack Core / Basic](https://docs.m5stack.com/en/core/basic) | Screen + buttons. |

> ⚠️ Some units can't power the board from the X10A 5 V pin. If it keeps rebooting, power it from a USB charger instead (and connect only TX, RX and GND). Details: [wiring · Power](wiring.md#power).

## Pinout (quick)

| X10A pin | Signal | ESP32 DevKit | ESP32-S3 DevKitC-1 | M5Stack AtomS3 | D1 mini (ESP8266) | M5Stack Core / Basic |
|---|---|---|---|---|---|---|
| 1 | 5 V | 5V / VIN | 5V | Grove 5V (red) | 5V | 5V (M-Bus) |
| 2 | TX (pump → ESP) | GPIO16 | GPIO2 | Grove G2 | D1 (GPIO5) | GPIO16 |
| 3 | RX (ESP → pump) | GPIO17 | GPIO1 | Grove G1 | D2 (GPIO4) | GPIO17 |
| 4 | – | not connected | not connected | not connected | not connected | not connected |
| 5 | GND | GND | GND | Grove GND (black) | GND | GND |

TX goes to RX and RX to TX. Where X10A is, a diagram, power and safety: [wiring guide](wiring.md).

## Security and updates

The prebuilt firmware has no API key or OTA password, so any Home Assistant can adopt it, and it updates itself from the **Firmware** entity. To add a key and passwords, adopt it in the ESPHome Device Builder: [security and OTA updates](security.md).

Adopted boards show **Update Available**; the blueprint [`esphome_altherma_update_available.yaml`](../homeassistant/blueprints/esphome_altherma_update_available.yaml) sends a phone notification when a new release is out.

## Next

- [Models](models.md) · [Compatibility](compatibility.md)
- [Device web page](web-page.md)
- [Overview](overview.md)
- [Advanced / manual YAML](advanced.md)
