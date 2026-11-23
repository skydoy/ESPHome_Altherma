# Security policy

## Supported versions
Fixes go into the latest 2.6.x release. Devices on the prebuilt firmware update over the air through the
**Firmware** entity in Home Assistant; boards adopted in the ESPHome Device Builder update from the Device Builder.

| Version | Supported |
|---|---|
| 2.6.x (latest: see [Releases](https://github.com/skydoy/ESPHome_Altherma/releases)) | ✅ |
| < 2.6 | ❌ |

## Reporting a vulnerability
Please **do not open a public issue**. Report it privately through
[GitHub private vulnerability reporting](https://github.com/skydoy/ESPHome_Altherma/security/advisories/new).
Include the firmware version, the board, the affected file or feature, and steps to reproduce.
If that form is not available, open an issue that only says you have a security report and asks for a private
contact — no details in the issue.

You can expect a first reply within 7 days. Once a fix is released, the advisory is published with credit to the
reporter unless you prefer otherwise.

## Scope
In scope: the firmware configurations and the `altherma_hub` component in this repository, the release workflows
and the web installer. Out of scope: ESPHome itself, Home Assistant and the heat pump's own electronics. The indoor
unit has mains voltage inside; that is a safety matter, not a software vulnerability (see
[docs/wiring.md](docs/wiring.md#safety)).

## What the device exposes on your network
The prebuilt firmware is the same public image for everybody, so it has **no API key, no OTA password, no web page
login and an open fallback hotspot**. Anyone on the same network can:
- open the web page (HTTP, port 80): see sensors and logs, press buttons, upload a firmware file;
- connect to the native API (port 6053) without encryption;
- flash firmware with ESPHome OTA (port 3232 on ESP32, 8266 on ESP8266) without a password.

The board only sends read-only queries to the heat pump and only connects out to NTP and `skydoy.github.io` (update
checks, HTTPS; the ESP8266 cannot verify the certificate). Full table and recommendations:
[docs/security.md](docs/security.md#what-the-device-exposes-on-your-network)
(🇵🇹 [docs/seguranca.md](docs/seguranca.md#o-que-o-dispositivo-expõe-na-tua-rede)).

Exposure through these defaults on a network you share is expected behaviour, not a vulnerability; please report
anything that goes beyond it (for example a way to write to the heat pump, or to reach the device from outside the
network).

## Hardening tips
The prebuilt firmware ships without an API key, OTA password or hotspot password so that any Home Assistant can adopt
it. After adopting it in the ESPHome Device Builder, add these to your own configuration and flash it once:
- `api: encryption: key:` (Home Assistant asks for it when you add the device)
- an OTA password (`ota: - platform: esphome password:`)
- a fallback hotspot password (`wifi: ap: password:`)
- optionally `web_server: ota: false` (no firmware upload through the web page) or `web_server: !remove`

Never forward ports 80, 6053, 3232 or 8266 on your router.

Step by step: [docs/security.md](docs/security.md) (🇵🇹 [docs/seguranca.md](docs/seguranca.md)).
