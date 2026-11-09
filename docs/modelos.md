# Modelos de bomba de calor

🇬🇧 [Read in English](models.md) · [Voltar ao README](../README.pt.md)

## Firmware pronto (modelos confirmados)

| Ficheiro do modelo | Unidade |
|---|---|
| `erga_eh_da_04_08` | Altherma 3 R · ERGA D + EHV/EHB/EHVZ DA (4–8 kW), também Altherma 3 R MT (ERRA + ELVH/ELVX) |
| `erga_eh_e_ej_04_08` | Altherma 3 R · ERGA E + EHV/EHB/EHVZ E/EJ (4–8 kW) |
| `erla_d_ebv_ebb_ebvz_11_16` | Altherma 3 R · ERLA D + EBV/EBB/EBVZ D (11–16 kW) |
| `erla_d_ebsh_11_16_ech2o` | Altherma 3 R ECH₂O · ERLA D + EBSH-X D (11–16 kW) |
| `epra_d_etv_etb_etvz_14_18` | Altherma 3 H HT · EPRA D + ETV/ETB/ETVZ (14–18 kW) |
| `altherma_ehvh_ehvx_cb` | Altherma LT · EHVH/EHVX CB (11–16 kW) |

## Não precisas de saber o modelo

O instalador põe um firmware **genérico**; a placa lê o Software ID e o Micon ID da unidade interior (só leitura) e mostra **Suggested Model**. Se o modelo for conhecido, carrega em **Install the right firmware** na página da placa (ou no Home Assistant) e ela atualiza-se sozinha por Wi-Fi. Se aparecer `unknown`, carrega em **Reportar a minha bomba** e escolhe o modelo à mão no site do instalador.

Há mais 26 ficheiros de modelo (🧪, por testar) em [`confs/`](../confs/): escolhe-os à mão e compila no ESPHome Builder ([Uso avançado](avancado.md)).

Todos os modelos estão numa só lista, [`installer/models.yaml`](../installer/models.yaml). Quem testou cada unidade: vê a [lista de compatibilidade](compatibilidade.md).

O teu modelo não está na lista, ou os valores parecem errados? [Reportar a minha bomba](https://github.com/skydoy/ESPHome_Altherma/issues/new?template=compatibility-report.yml).
