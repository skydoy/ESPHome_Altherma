# Compatibility list

🇵🇹 [Ler em português](compatibilidade.md) · [Back to the README](../README.md)

Which Daikin Altherma units and boards are known to work, and with which model file.

**Your unit is not here, or it is and something is off?**
[**Report my heat pump**](https://github.com/skydoy/esphome-altherma/issues/new?template=compatibility-report.yml),
also when it works: every report helps the next person.

## Status key
| | Meaning |
|---|---|
| ✅ | Tested by a maintainer on their own unit. |
| 🔶 | Reported working by a user. |
| 🧪 | Mapped from a register export or a model definition; no working install reported here yet. |
| ❌ | Does not work. |
| ❔ | Unknown: model file exists, nobody reported this unit yet. |

The firmware, the `altherma_hub` component and the model files are the same as in the original project
(esphome-altherma by jjohnsen); most reports below were made there, before this web installer existed, and are
listed with their author and the original discussion or pull request number.

## Model files
| Model file (pick in the installer) | Units | Status |
|---|---|---|
| `erga_eh_da_04_08` (default) | Altherma 3 R · ERGA D + EHV/EHB/EHVZ DA (4–8 kW); Altherma 3 R MT (ERRA + ELVH/ELVX) | ✅ |
| `erga_eh_e_ej_04_08` | Altherma 3 R · ERGA E + EHV/EHB/EHVZ E/EJ (4–8 kW) | 🔶 |
| `erla_d_ebv_ebb_ebvz_11_16` | Altherma 3 R · ERLA D + EBV/EBB/EBVZ D (11–16 kW) | ✅ |
| `erla_d_ebsh_11_16_ech2o` | Altherma 3 R ECH₂O · ERLA D + EBSH-X 16P30-50 D (11–16 kW) | 🧪 |
| `epra_d_etv_etb_etvz_14_18` | Altherma 3 H HT · EPRA D/D7 + ETV16/ETB16/ETVZ16 E/E7 (14–18 kW) | 🔶 |
| `altherma_ehvh_ehvx_cb` | Altherma LT CA/CB · EHVH-CB / EHVX-CB (11–16 kW) | ❔ |

## Reported installs
| Outdoor / indoor unit | Series | Model file | Board | Status | Reported by, notes |
|---|---|---|---|---|---|
| ERLA11D2V3 / EBBH11DF6V | Altherma 3 R ERLA D | `erla_d_ebv_ebb_ebvz_11_16` | ESP32 DevKit | ✅ | @skydoy (maintainer). Model file written for this unit (original project PR #46). |
| ERGA08DAV3 / EHVH08S23DA6V | Altherma 3 R ERGA D | `erga_eh_da_04_08` | ESP32 DevKit, M5Stack Basic | ✅ | @jjohnsen (original author); the default model file. |
| ERRA08EV3 / ERRA08EAV37 + ELVH12S23E6V / ELVX12S23EJ6V | Altherma 3 R MT (bibloc) | `erga_eh_da_04_08` | ESP32-S3 DevKit | 🔶 | @mathep34 (discussion #41). |
| ERGA04 E / EHVX04S18EJ6V | Altherma 3 R ERGA E | `erga_eh_e_ej_04_08` | ESP32 DevKit (ESP32-D0WDQ6) | 🔶 | @sh4jonny. |
| EPRA18DW17 / ETBX16E9W7 | Altherma 3 H HT | `epra_d_etv_etb_etvz_14_18` | DOIT ESP32 DevKit V1 | 🔶 | @kepten; model file written for this unit (PR #49). |
| ERLA16D2W17 / EBVX16S23DJ9W | Altherma 3 R ERLA D | own mapping (same family as `erla_d_ebv_ebb_ebvz_11_16`) | ESP32-S3 SuperMini | 🔶 | @hansiputz (discussion #48). |
| EBSXB16P50DF | Altherma 3 R ECH₂O | `erla_d_ebsh_11_16_ech2o` | – | 🧪 | Mapped from a user's register and sensor export. |
| EHSXB08P30EF | Altherma 3 R ECH₂O | not stated | M5Stack AtomS3 Lite | 🔶 | @maromme (discussion #4). |
| EHSX08P50BB | Altherma 3 R ECH₂O | not stated | M5Stack Stamp S3 | 🔶 | @smdx2 (discussion #47). |
| EHVX08S26CB9W | Altherma | own mapping | DOIT ESP32 DevKit V1 | 🔶 | @MaBeniu (discussion #5). |
| ERLQ011CAV3 / EHBX11CB9W | Altherma LT | not stated | ESP32 DevKit | 🔶 | Reported in a French setup guide. |
| EHBH16C9W | Altherma | not stated | ESP32-C6-WROOM-1 ¹ | 🔶 | @AndriesMuylaert (discussion #11); with a relay and onboard sensors. |
| EDLA09DA3V3 | Altherma 3 M | not stated | Freenove ESP32 | 🔶 | @jandenouden2 (discussion #13). |
| ERLQ016CAW1 | Altherma LT (16 kW) | not stated | ESP32-WROOM-32U DevKit | 🔶 | @ezfrag2021 (discussion #25). X10A 5 V was not enough: powered from USB; external antenna outside the casing. |
| EHBH08CA3V | Altherma | not stated | ESP32 | 🔶 | @papayou66 (discussion #63); custom dashboards. |

¹ Not one of the web installer boards; needs your own build ([Advanced use](advanced.md#build-it-yourself)).

## How to check your unit
1. Read the model on the label of the **indoor** unit (for example EBBH11DF6V) and of the **outdoor** unit (for
   example ERLA11D2V3).
2. Find the series in the [model files](#model-files) table: the letters before the size (ERGA, ERLA, EPRA, EHV…)
   and the generation letter after it (D, E, CB…).
3. Install with that model file and compare a few values in Home Assistant with the heat pump display: outdoor
   temperature, leaving water temperature, operation mode.
4. Values missing or clearly wrong (for example −3276.8 or a temperature of 0 that never changes)? Try the next
   closest model file, then [report it](https://github.com/skydoy/esphome-altherma/issues/new?template=compatibility-report.yml)
   with a log excerpt. To map the missing values yourself, see
   [register discovery](advanced.md#register-discovery-experimental).
