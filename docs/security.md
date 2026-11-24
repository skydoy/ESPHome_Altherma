# Security and over-the-air updates

🇵🇹 [Ler em português](seguranca.md) · [Back to the README](../README.md)

## What the prebuilt firmware does
The firmware from the [web installer](https://skydoy.github.io/ESPHome_Altherma/) is the same image for everybody,
so it **cannot contain your keys or passwords**. It ships:

| Item | Prebuilt firmware | Why |
|---|---|---|
| Home Assistant API encryption key | none | Any Home Assistant on your network can adopt it with one click. |
| OTA password (ESPHome) | none | Same image for all users. The M5Stack image includes `boards/esphome-altherma-m5stack.yaml`, which asks for `!secret ota_password`; for the installer build that secret comes from [`installer/secrets.yaml`](../installer/secrets.yaml) and is intentionally empty. |
| Fallback hotspot ("ESPHome Altherma Setup") | open, only while Wi-Fi is not connected | So you can set up Wi-Fi from a phone. It also offers a firmware upload page (captive portal). |
| Firmware updates | **Firmware** entity in Home Assistant | Downloaded over HTTPS from this project's GitHub Pages; the manifest carries an MD5 checksum that the device checks before it reboots. |

On a home network that you trust this is the usual ESPHome "ready-made" setup. If other people or devices share that
network, secure it as shown below.

## What the device exposes on your network
Everything below is reachable by **any device on the same network** (LAN or Wi-Fi). Nothing is opened to the internet
unless you forward ports on your router — don't.

| Service | Port | Prebuilt firmware | What someone on your network can do |
|---|---|---|---|
| Device web page (`web_server` v3) | TCP 80 (HTTP) | on, **no login** | See every sensor and the live log, press the buttons (Restart, Check for Update, Install Update, Install the right firmware), turn Auto Update on/off, and upload a firmware file (`POST /update`). |
| Home Assistant native API | TCP 6053 | on, **no encryption key** | Connect like Home Assistant does: read all entities and logs, press buttons, call the read-only `query_register` service. |
| ESPHome OTA | TCP 3232 (ESP32) / 8266 (ESP8266) | on, **no password** (the M5Stack image uses the empty `ota_password` placeholder) | Flash any firmware over the air with the ESPHome tools. |
| mDNS | UDP 5353 | on | See the device name (`esphome-altherma-xxxxxx.local`), its IP and that it runs ESPHome. |
| Fallback hotspot "ESPHome Altherma Setup" + captive portal | Wi-Fi AP | **open**, only when the board cannot join your Wi-Fi | Join it, set new Wi-Fi credentials or upload a firmware file. |
| Improv over USB | USB serial | on | Set Wi-Fi credentials — needs physical access to the USB cable. |
| Value sharing (`packet_transport`, [optional](advanced.md#share-values-with-other-esphome-devices-udp)) | UDP 18511 broadcast | **off** (only if you add the package to your own build) | With your key: read LWT, return and outdoor temperatures, compressor frequency and error codes. Without it: only the board name. |

What the device connects to by itself (outgoing only): your Wi-Fi, NTP time servers (`pool.ntp.org`) and
`skydoy.github.io` over HTTPS every 6 hours to check for updates (and to download one when you or Auto Update install
it). The ESP32 checks the TLS certificate; the **ESP8266 cannot** (`verify_ssl: false`), so on an ESP8266 the MD5 in the
manifest only protects against a broken download, not against someone who can tamper with your traffic.

Towards the heat pump the board only sends **read-only** queries on the X10A port; no setting of the heat pump is ever
written. The **📝 Report my heat pump** button on the web page only opens a GitHub form in your browser — the board itself sends
nothing.

### Recommendations
1. Keep the board on a home network you trust, ideally an IoT VLAN or guest network that cannot reach your PCs.
2. Never forward ports 80, 6053, 3232 or 8266 on your router. For remote access use Home Assistant.
3. If other people or devices share the network, adopt the board and add an API encryption key, an OTA password and a
   hotspot password ([next sections](#securing-your-own-build)).
4. In your own build, stop firmware uploads through the web page with `web_server: ota: false` (the captive portal
   can still flash while the hotspot is up), or remove the page entirely with `web_server: !remove`.
5. Install updates from Home Assistant (Firmware entity) or the Device Builder only; don't flash `.bin` files from
   other sources.

## Updating with the Firmware entity
1. When a new release is published, Home Assistant shows an update on the **Firmware** entity of the device
   (**Settings → Devices & services → ESPHome → ESPHome Altherma**, or **Settings → Updates**).
2. Click **Install**. The device downloads the image for **the same board and heat pump model** you installed
   (each board/model pair has its own manifest, `firmware/<board>/<model>/manifest.json`) and reboots.
3. To switch to another heat pump model, open the web installer again and flash over USB once.

The Firmware entity only exists in the prebuilt firmware. If you adopt the device in the ESPHome Device Builder
(next section), updates come from the Device Builder instead (**Install → Wirelessly**).

## Securing your own build
To add a key and passwords you need your own configuration, so the device is no longer on the shared image.

1. In Home Assistant open the **ESPHome Device Builder** add-on. The device shows up as *discovered* → **Adopt**
   (or **Take Control**). It imports the board file for your board from this repository.
2. Edit the YAML it created. Keep your heat pump model and add the security settings:

   ```yaml
   substitutions:
     altherma_model: erla_d_ebv_ebb_ebvz_11_16   # the model you picked in the installer

   api:
     encryption:
       key: !secret api_key          # generate one: openssl rand -base64 32

   ota:
     - platform: esphome
       password: !secret ota_password

   wifi:
     ssid: !secret wifi_ssid
     password: !secret wifi_password
     ap:
       password: !secret ap_password  # fallback hotspot password (at least 8 characters)
   ```

   and in the Device Builder **Secrets** (top right):

   ```yaml
   wifi_ssid: "MyWiFi"
   wifi_password: "my-wifi-password"
   api_key: "paste the output of openssl rand -base64 32"
   ota_password: "a long random password"
   ap_password: "another password"
   ```

3. **Install → Wirelessly**. From now on every wireless install needs the OTA password (the Device Builder sends it
   for you).
4. Home Assistant shows the device as needing attention and asks for the **encryption key**: paste the same
   `api_key`.

Do not put these values in a file that you share or commit. In a git checkout `boards/secrets.yaml` is
ignored (`.gitignore`); `installer/secrets.yaml` is **not** and must only hold the empty placeholders.

### Manual build (command line)
The same keys work with the ESPHome command line. Put them in `secrets.yaml` next to
`boards/esphome-altherma-<board>.yaml` and add the `api:`, `ota:` and `wifi:` blocks above to that board file (or to a small
file of your own that includes it as a package). See [Advanced use](advanced.md#build-it-yourself).

### Installer / factory configurations
The files in [`installer/`](../installer/) are what the web installer builds; they are meant to stay key-less. Do
**not** add your key or passwords there: the images are public, and an `ota: password` that differs from the one in
an included file makes `esphome config` fail with *"password is inconsistent"*. For your own image, copy the wrapper
for your board, keep the `update:` block if you want the Firmware entity, and put your secrets in `secrets.yaml` next
to it.

## Going back to the prebuilt firmware
Flash the web installer image again over USB. It has no API key, so Home Assistant keeps trying the old key and the
device shows as unavailable: **delete the device** in **Settings → Devices & services → ESPHome** and add it again
(or re-configure it and leave the key empty).

## Reporting a vulnerability
See [SECURITY.md](../SECURITY.md). Please do not open a public issue for security problems.
