# Third-party notices

ESPHome Altherma (skydoy) is a fork of an earlier ESPHome Altherma project and builds on ESPAltherma. This file lists
the third-party work in this repository or used to build its firmware, with the licence each one declares.

## In this repository

### ESPAltherma (Raomin and contributors), MIT License
- `components/altherma_hub/converters.h` and `components/altherma_hub/labeldef.h` are copied from ESPAltherma
  (`include/converters.h`, `include/labeldef.h`), with a small include guard added (see `docs/advanced.md`).
- The heat pump model profiles in `confs/` are converted from the ESPAltherma model definitions (`include/def/*.h`);
  each file names its source definition in its header.

```
MIT License

Copyright (c) 2020 Raomin

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

### esphome-altherma (Jan Åge Johnsen and contributors), no licence declared
The ESPHome component `components/altherma_hub/` (C++ hub, X10A read protocol, mock UART, Python platforms), the
board files and the original model conversions come from this upstream project. Its repository says the project is
"provided as-is for educational and personal use" and does not include a licence file.

## Downloaded at build time or in the browser (not stored here)
- **ESPHome** (Open Home Foundation and contributors): the Python tooling is MIT, the C++ runtime that is compiled into
  every firmware is GPL-3.0. Firmware images built from this repository contain that runtime.
- **ESP-IDF / Arduino core for ESP32 and ESP8266** (Espressif and contributors), Apache-2.0 / LGPL-2.1: frameworks
  that ESPHome downloads and links into the firmware.
- **ESP Web Tools** (Open Home Foundation), Apache-2.0: the web installer's Install button, loaded from a CDN.
- **ESPHome web_server v3 front end** (ESPHome), loaded from the ESPHome CDN by the board's web page.
- **Roboto** font (Google Fonts), SIL Open Font License 1.1 / Apache-2.0: glyphs embedded in the M5Stack screen
  firmware.

Daikin and Altherma are trademarks of their owner. This is an independent community project, not affiliated with it.
