# Contributing

Thanks for helping! Model reports are the most useful contribution: use the
[compatibility report](https://github.com/skydoy/ESPHome_Altherma/issues/new?template=compatibility-report.yml)
form. Bugs and ideas go in the [issue forms](https://github.com/skydoy/ESPHome_Altherma/issues/new/choose).

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
- Commit author must be exactly `skydoy <25871317+skydoy@users.noreply.github.com>` (name and email) on every commit in the pull request (`base..head` only). CI fails the pull request and prints the offending commit SHAs and authors. Set it with `git config user.name skydoy` / `git config user.email 25871317+skydoy@users.noreply.github.com`.
- `esphome config` passes for at least one board + model, e.g. from `installer/`:
  `esphome config esphome-altherma-esp32.installer.yaml` (set `altherma_model` to the profile you changed).
- New or changed sensors: say which register and byte you used and on which unit you checked it. Never write
  settings to the heat pump while testing: only read-only register queries.
- User docs exist in English and Portuguese: update both (`README.md`/`README.pt.md`,
  `docs/compatibility.md`/`docs/compatibilidade.md`, `docs/advanced.md`/`docs/avancado.md`, ...). Portuguese
  texts use Portugal Portuguese and address the reader as "tu".
- Web UI changes (`installer/packages/report.js`): keep the PT/EN toggle working and add new entity names to the
  translation table. ESPHome `web_server` v3 allows only one `js_include`.
- Docs site: `python tools/build_docs.py` (strict MkDocs build and link check). Publishing the guides alone is the «Publish documentation only» workflow. Do not run «Build firmware & publish installer» by hand: a manual run of that workflow ships dev firmware.
- Add a line to `CHANGELOG.md` (Portuguese) under **Unreleased**.
- Say what you tested on real hardware (board, heat pump model), or "not tested on hardware".

## Releases
Releases are automatic (`.github/workflows/auto-release.yml`): every push to `main` that changes the firmware
(`components/`, `confs/`, `boards/`, `installer/`, `.github/esphome-version`) is validated, then a `release vX.Y.Z`
commit bumps the patch version (`altherma_version` in `boards/base.yaml`) and moves the **Unreleased** notes of
`CHANGELOG.md` to `## [x.y.z] - YYYY-MM-DD`, and the `vX.Y.Z` tag is published: CI builds every board and model,
publishes the installer, the OTA manifests and the docs site to GitHub Pages, and creates the GitHub Release with
those notes. For a minor version, raise `altherma_version` (and add the `## [x.y.0]` section) in the push itself.
Pushes that only change docs, READMEs, `static/` or CI do not release; a docs-only change goes out through
«Publish documentation only», which keeps the already published installer and firmware.
`.github/workflows/esphome-auto-update.yml` checks for a new stable ESPHome every day, builds every board and model
in a pull request and releases a patch version if everything passes (the pull request stays open if not).

Code copied from other projects must keep its licence notice: add it to [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
Do not copy code from projects without a licence, or GPL code into the component.

Be kind: see the [Code of Conduct](CODE_OF_CONDUCT.md). Security problems go through [SECURITY.md](SECURITY.md),
not public issues.

## Safety
Switch the heat pump off at the breaker before opening it, and read the [wiring guide](docs/wiring.md) first.
