# Heat pump models

🇵🇹 [Ler em português](modelos.md) · [Back to the README](../README.md)

## Ready-made firmware (confirmed models)

| Model file | Unit |
|---|---|
| `erga_eh_da_04_08` | Altherma 3 R · ERGA D + EHV/EHB/EHVZ DA (4–8 kW), also Altherma 3 R MT (ERRA + ELVH/ELVX) |
| `erga_eh_e_ej_04_08` | Altherma 3 R · ERGA E + EHV/EHB/EHVZ E/EJ (4–8 kW) |
| `erla_d_ebv_ebb_ebvz_11_16` | Altherma 3 R · ERLA D + EBV/EBB/EBVZ D (11–16 kW) |
| `erla_d_ebsh_11_16_ech2o` | Altherma 3 R ECH₂O · ERLA D + EBSH-X D (11–16 kW) |
| `epra_d_etv_etb_etvz_14_18` | Altherma 3 H HT · EPRA D + ETV/ETB/ETVZ (14–18 kW) |
| `altherma_ehvh_ehvx_cb` | Altherma LT · EHVH/EHVX CB (11–16 kW) |

## You don't need to know the model

The installer flashes a **generic** firmware; the board reads the indoor unit's Software ID and Micon ID (read-only) and shows **Suggested Model**. If the model is known, press **Install the right firmware** on the board's page (or in Home Assistant) and it updates itself over Wi-Fi. If it says `unknown`, press **Report my heat pump** and pick the model by hand on the installer site.

26 more model files (🧪, untested) are in [`confs/`](../confs/): pick them by hand and build with the ESPHome Builder ([Advanced use](advanced.md)).

All models live in one list, [`installer/models.yaml`](../installer/models.yaml). Who tested which unit: see the [compatibility list](compatibility.md).

Your model isn't listed, or values look wrong? [Report my heat pump](https://github.com/skydoy/ESPHome_Altherma/issues/new?template=compatibility-report.yml).
