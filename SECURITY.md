# Security policy

## Supported versions
Only the latest release receives fixes. Devices on the prebuilt firmware update themselves over the air through the
**Firmware** entity in Home Assistant.

| Version | Supported |
|---|---|
| latest release | ✅ |
| older | ❌ |

## Reporting a vulnerability
Please **do not open a public issue**. Report it privately through
[GitHub private vulnerability reporting](https://github.com/skydoy/ESPHome_Altherma/security/advisories/new).
Include the firmware version, the board, the affected file or feature, and steps to reproduce.

You can expect a first reply within 7 days. Once a fix is released, the advisory is published with credit to the
reporter unless you prefer otherwise.

## Scope
In scope: the firmware configurations and the `altherma_hub` component in this repository, the release workflows
and the web installer. Out of scope: ESPHome itself, Home Assistant and the heat pump's own electronics. The indoor
unit has mains voltage inside; that is a safety matter, not a software vulnerability (see
[docs/wiring.md](docs/wiring.md#safety)).

## Hardening tips
The prebuilt firmware ships without an API key, OTA password or hotspot password so that any Home Assistant can adopt
it. After adopting it in the ESPHome Device Builder, add these to your own configuration and flash it once:
- `api: encryption: key:` (Home Assistant asks for it when you add the device)
- an OTA password (`ota: - platform: esphome password:`)
- a fallback hotspot password (`wifi: ap: password:`)

Step by step: [docs/security.md](docs/security.md) (🇵🇹 [docs/seguranca.md](docs/seguranca.md)).
