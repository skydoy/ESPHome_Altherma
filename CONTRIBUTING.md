# Contributing

Thanks for helping! Model reports are the most useful contribution: use the
[compatibility report](https://github.com/skydoy/esphome-altherma/issues/new?template=compatibility-report.yml)
form. Bugs and ideas go in the [issue forms](https://github.com/skydoy/esphome-altherma/issues/new/choose).

## Repository layout
| Folder | What |
|---|---|
| `components/altherma_hub/` | ESPHome external component (X10A serial protocol, `query_register` service) |
| `confs/` | One sensor profile per heat pump model (`<model>.yaml`), `generic.yaml` for identification |
| `boards/` | Board configs: `<board>.yaml` to adopt in the Device Builder, `*.factory.yaml`, `base.yaml`, `common/` |
| `installer/` | Web-installer builds (`*.installer.yaml`), `models.yaml`, `gen_models.py`, `packages/` (web UI, updates, identify, boot animation) |
| `static/` | Web installer page (published to GitHub Pages) and board pictures |
| `docs/` | Guides in English and Portuguese, logo and images |
| `homeassistant/` | Blueprints and Emoncms helpers |
| `tools/` | Report worker |

## Before a pull request
- `esphome config` passes for at least one board + model, e.g. from `installer/`:
  `esphome config esphome-altherma-esp32.installer.yaml` (set `altherma_model` to the profile you changed).
- New or changed sensors: say which register and byte you used and on which unit you checked it. Never write
  settings to the heat pump while testing: only read-only register queries.
- User docs exist in English and Portuguese: update both (`README.md`/`README.pt.md`,
  `docs/compatibility.md`/`docs/compatibilidade.md`, `docs/advanced.md`/`docs/avancado.md`, ...). Portuguese
  texts use Portugal Portuguese and address the reader as "tu".
- Web UI changes (`installer/packages/report.js`): keep the PT/EN toggle working and add new entity names to the
  translation table. ESPHome `web_server` v3 allows only one `js_include`.
- Add a line to `CHANGELOG.md` (Portuguese) under **Unreleased**.
- Say what you tested on real hardware (board, heat pump model), or "not tested on hardware".

## Releases
The maintainer moves the **Unreleased** notes to `## [x.y.z] - YYYY-MM-DD`, bumps `altherma_version` in
`boards/base.yaml` and pushes a `vx.y.z` tag. CI builds every board and model, publishes the installer and OTA
manifests to GitHub Pages and creates the GitHub Release with those notes.

Code copied from other projects must keep its licence notice: add it to [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
Do not copy code from projects without a licence, or GPL code into the component.

Be kind: see the [Code of Conduct](CODE_OF_CONDUCT.md). Security problems go through [SECURITY.md](SECURITY.md),
not public issues.

## Safety
Switch the heat pump off at the breaker before opening it, and read the [wiring guide](docs/wiring.md) first.
