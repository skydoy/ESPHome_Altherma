<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/logo-dark.png">
    <source media="(prefers-color-scheme: light)" srcset="docs/logo-light.png">
    <img src="docs/logo-light.png" alt="ESPHome Altherma" width="256">
  </picture>
</p>

<p align="center"><b>Like it? Help me build something better.</b><br>
  <a href="https://ko-fi.com/skydoy"><img src="https://img.shields.io/badge/Ko--fi-Support%20me-FF5E5B?logo=ko-fi&logoColor=white" alt="Support me on Ko-fi"></a>
  <a href="https://buymeacoffee.com/skydoy"><img src="https://img.shields.io/badge/Buy%20Me%20a%20Coffee-Support%20me-FFDD00?logo=buymeacoffee&logoColor=black" alt="Buy Me a Coffee"></a>
</p>

<p align="center">
  <a href="https://github.com/skydoy/esphome-altherma/actions/workflows/publish.yml"><img src="https://github.com/skydoy/esphome-altherma/actions/workflows/publish.yml/badge.svg" alt="Build"></a>
  <a href="https://github.com/skydoy/esphome-altherma/actions/workflows/ci.yml"><img src="https://github.com/skydoy/esphome-altherma/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
  <a href="https://github.com/skydoy/esphome-altherma/releases/latest"><img src="https://img.shields.io/github/v/release/skydoy/esphome-altherma?sort=semver" alt="Release"></a>
  <a href="https://github.com/jjohnsen/esphome-altherma"><img src="https://img.shields.io/badge/upstream-jjohnsen%2Fesphome--altherma-555" alt="Upstream"></a>
</p>

<p align="center"><b>Your Daikin Altherma 3 in Home Assistant. Plug in by USB, pick your heat pump, click Install. No YAML.</b><br>
🇵🇹 <a href="README.pt.md">Ler em português</a></p>

<p align="center">
  <a href="https://skydoy.github.io/esphome-altherma/"><img src="https://img.shields.io/badge/Open%20the%20web%20installer-1784F7?style=for-the-badge&logo=esphome&logoColor=white" alt="Open the web installer" height="40"></a>
</p>

Connect a small ESP32 board to the **X10A** service connector of your **Daikin Altherma** heat pump and read
temperatures, flow, power and more locally in Home Assistant. No cloud, no MQTT, no app.

**Is my heat pump supported?** See the [models](#heat-pump-models) below ·
[successful installs (upstream)](https://github.com/jjohnsen/esphome-altherma#successful-installs)

## Install in 3 steps
1. **Flash.** Open the **[web installer](https://skydoy.github.io/esphome-altherma/)** in Chrome or Edge on a computer,
   pick your board and your heat pump model, plug the board in by USB → **Install**.
   (Do this *before* wiring: never connect USB and the X10A 5 V at the same time.)
2. **Wi-Fi.** Type your Wi-Fi in the same window. (Or later: join the `esphome-altherma…` hotspot from your phone.)
3. **Wire and add.** Heat pump off at the breaker, connect the board to **X10A** (table below), breaker back on.
   Home Assistant shows *ESPHome Altherma* under **Settings → Devices & services** → **Configure**.

After that, updates come over the air from the **Firmware** entity in Home Assistant. No more USB.

| X10A pin | Signal | ESP32 DevKit | ESP32-S3 DevKitC-1 | M5Stack AtomS3 | D1 mini (ESP8266) | M5Stack Core / Basic |
|---|---|---|---|---|---|---|
| 1 | 5 V | 5V / VIN | 5V | Grove 5V (red) | 5V | 5V (M-Bus) |
| 2 | TX (pump → ESP) | GPIO16 | GPIO2 | Grove G2 | D1 (GPIO5) | GPIO16 |
| 3 | RX (ESP → pump) | GPIO17 | GPIO1 | Grove G1 | D2 (GPIO4) | GPIO17 |
| 4 | – | not connected | not connected | not connected | not connected | not connected |
| 5 | GND | GND | GND | Grove GND (black) | GND | GND |

TX goes to RX and RX to TX. Photos: [ESPAltherma wiring guide](https://github.com/raomin/ESPAltherma?tab=readme-ov-file#daikin-altherma-4-pin-x10a-connection).

## What you get in Home Assistant
| Entity | What it does |
|---|---|
| **Sensors** | Water and refrigerant temperatures, flow, pressures, compressor and fan speed, voltage, current, power (depends on the model file). |
| **Operation** | Operation mode, defrost, pumps and valves status, error codes. |
| **Firmware** | New versions in one click, over the air. |
| **query_register** action | Read any X10A register by hand to map new sensors (experimental). |

On the M5Stack Core / Basic the screen shows the live values (buttons to navigate, dark / light theme) and a short boot animation.

<p align="center"><img src="docs/logo-animation.gif" alt="ESPHome Altherma animated logo" width="200"></p>

## Boards
| Board | Notes |
|---|---|
| [ESP32 DevKit](https://www.espboards.dev/esp32/esp32doit-devkit-v1/) | Cheapest, most tested. |
| [ESP32-S3 DevKitC-1](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32s3/esp32-s3-devkitc-1/) | Newer chip. |
| [M5Stack AtomS3 / AtomS3 Lite](https://docs.m5stack.com/en/core/AtomS3%20Lite) | Tiny, wires on the Grove port. |
| [D1 mini (ESP8266)](https://docs.wemos.cc/en/latest/d1/d1_mini.html) | Works, but less memory. |
| [M5Stack Core / Basic](https://docs.m5stack.com/en/core/basic) | Screen + buttons. |

> ⚠️ Some units can't power the board from the X10A 5 V pin. If it keeps rebooting, power it from a USB charger
> instead (and connect only TX, RX and GND).

## Heat pump models
| Pick in the installer | Unit |
|---|---|
| `erga_eh_da_04_08` (default) | Altherma 3 R · ERGA D + EHV/EHB/EHVZ DA (4–8 kW), also Altherma 3 R MT (ERRA + ELVH/ELVX) |
| `erga_eh_e_ej_04_08` | Altherma 3 R · ERGA E + EHV/EHB/EHVZ E/EJ (4–8 kW) |
| `erla_d_ebv_ebb_ebvz_11_16` | Altherma 3 R · ERLA D + EBV/EBB/EBVZ D (11–16 kW) |
| `erla_d_ebsh_11_16_ech2o` | Altherma 3 R ECH₂O · ERLA D + EBSH-X D (11–16 kW) |
| `epra_d_etv_etb_etvz_14_18` | Altherma 3 H HT · EPRA D + ETV/ETB/ETVZ (14–18 kW) |
| `altherma_ehvh_ehvx_cb` | Altherma LT · EHVH/EHVX CB (11–16 kW) |

> **Status:** pick the model by hand; automatic detection ([upstream PR #51](https://github.com/jjohnsen/esphome-altherma/pull/51))
> is still experimental. Your model isn't listed? Share it in the
> [upstream discussions](https://github.com/jjohnsen/esphome-altherma/discussions).

## Advanced / manual YAML
Own build or Device Builder: board configs `esphome-altherma-<board>.yaml`, shared `base.yaml`, sensor maps in
[`confs/`](confs/). Run `esphome run esphome-altherma-esp32.yaml` with your Wi-Fi in `secrets.yaml`.
Relays (thermostat / Smart Grid), mock UART, register discovery and vendored ESPAltherma files:
see the [upstream README](https://github.com/jjohnsen/esphome-altherma#readme).

## Docs
[Upstream README](https://github.com/jjohnsen/esphome-altherma#readme) ·
[Register discovery](https://github.com/jjohnsen/esphome-altherma#register-discovery-experimental) ·
[Emoncms guide](https://jjohnsen.no/2026/esphome-altherma-emoncms-setup-guide/) ·
[HA Community](https://community.home-assistant.io/t/esphome-altherma-monitor-your-daikin-altherma-3-heat-pump-via-x10a/1000476) ·
[Report a problem](https://github.com/skydoy/esphome-altherma/issues/new) ·
[Releases](https://github.com/skydoy/esphome-altherma/releases)

## Credits
- Component, sensors and model files: [jjohnsen/esphome-altherma](https://github.com/jjohnsen/esphome-altherma)
  and its contributors, based on [ESPAltherma](https://github.com/raomin/ESPAltherma) by raomin.
- Web installer, builds, logo and boot animation: [skydoy](https://github.com/skydoy). Board pictures are illustrations.

Provided as-is for personal and educational use, like upstream; ESPAltherma files keep their
[original license](https://github.com/raomin/ESPAltherma/blob/main/LICENSE). Use at your own risk: work on the
heat pump with the breaker off. Daikin and Altherma are trademarks of their owner; this is an independent
community project, not affiliated with it.
