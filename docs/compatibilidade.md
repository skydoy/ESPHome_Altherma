# Lista de compatibilidade

🇬🇧 [Read in English](compatibility.md) · [Voltar ao README](../README.pt.md)

Que unidades Daikin Altherma e que placas funcionam, e com que ficheiro de modelo.

**A tua unidade não está aqui, ou está e alguma coisa não bate certo?**
[**Reportar a minha bomba**](https://github.com/skydoy/esphome-altherma/issues/new?template=compatibility-report.yml),
também quando funciona: cada relato ajuda a pessoa seguinte.

## Legenda
| | Significado |
|---|---|
| ✅ | Testado por um responsável do projeto na sua própria unidade. |
| 🔶 | Um utilizador reportou que funciona. |
| 🧪 | Mapeado a partir de uma exportação de registos ou de uma definição de modelo; ainda sem instalação reportada aqui. |
| ❌ | Não funciona. |
| ❔ | Desconhecido: o ficheiro de modelo existe, mas ninguém reportou esta unidade. |

O firmware, o componente `altherma_hub` e os ficheiros de modelo são os mesmos do projeto original (esphome-altherma,
de jjohnsen); a maior parte dos relatos abaixo foi feita lá, antes de existir este instalador web, e aparece com o
autor e o número da discussão ou do *pull request* original.

## Ficheiros de modelo
| Ficheiro de modelo (firmware pronto) | Unidades | Estado |
|---|---|---|
| `erga_eh_da_04_08` | Altherma 3 R · ERGA D + EHV/EHB/EHVZ DA (4–8 kW); Altherma 3 R MT (ERRA + ELVH/ELVX) | ✅ |
| `erga_eh_e_ej_04_08` | Altherma 3 R · ERGA E + EHV/EHB/EHVZ E/EJ (4–8 kW) | 🔶 |
| `erla_d_ebv_ebb_ebvz_11_16` | Altherma 3 R · ERLA D + EBV/EBB/EBVZ D (11–16 kW) | ✅ |
| `erla_d_ebsh_11_16_ech2o` | Altherma 3 R ECH₂O · ERLA D + EBSH-X 16P30-50 D (11–16 kW) | 🧪 |
| `epra_d_etv_etb_etvz_14_18` | Altherma 3 H HT · EPRA D/D7 + ETV16/ETB16/ETVZ16 E/E7 (14–18 kW) | 🔶 |
| `altherma_ehvh_ehvx_cb` | Altherma LT CA/CB · EHVH-CB / EHVX-CB (11–16 kW) | ❔ |

### Ficheiros de modelo sem firmware pronto (escolha à mão)
Convertidos a partir das definições de modelo do ESPAltherma (raomin e colaboradores, licença MIT). Todos passam no `esphome config`, mas ainda nenhum foi experimentado numa unidade real. No site do instalador aparecem na lista manual marcados com 🧪, sem firmware para instalar: usa-os na tua própria compilação ([Uso avançado](avancado.md#compilar-por-ti)) definindo `altherma_model`, e reporta como correu para o modelo poder ser confirmado (uma linha em `installer/models.yaml`) e ter o seu firmware.

| Ficheiro de modelo | Definição do ESPAltherma | Entidades | Estado |
|---|---|---|---|
| `altherma_hybrid` | Altherma · HYBRID | 173 | 🧪 |
| `altherma_lt_ca_cb_04_08` | Altherma · LT_CA_CB_04-08KW | 174 | 🧪 |
| `altherma_lt_cb_04_08_bizone` | Altherma · LT_CB_04-08kW Bizone | 174 | 🧪 |
| `altherma_lt_cb_11_16_bizone` | Altherma · LT_CB_11-16kW Bizone | 174 | 🧪 |
| `altherma_lt_eblq_eblq_ca_5_7_monobloc` | Altherma · LT_EBLQ-EBLQ-CA series 5-7kW Monobloc | 156 | 🧪 |
| `altherma_lt_eblq_edlq_ca_11_16_monobloc` | Altherma · LT_EBLQ-EDLQ-CA series 11-16kW Monobloc | 171 | 🧪 |
| `altherma_lt_multi_dhwhp` | Altherma · LT_MULTI_DHWHP | 173 | 🧪 |
| `altherma_lt_multi_hybrid` | Altherma · LT_MULTI_HYBRID | 174 | 🧪 |
| `ebla_edla_d_4_8_monobloc` | Altherma · EBLA-EDLA D series 4-8kW Monobloc | 188 | 🧪 |
| `ebla_edla_d_9_16_monobloc` | Altherma · EBLA-EDLA D series 9-16kW Monobloc | 192 | 🧪 |
| `egsah_x_ewsah_x_d_6_10_geo3` | Altherma · EGSAH-X-EWSAH-X-D series 6-10kW GEO3 | 140 | 🧪 |
| `egsqh_a_10_geo2` | Altherma · EGSQH-A series 10kW GEO2 | 171 | 🧪 |
| `ekhwet_bav3_multi_dhw_tank` | EKHWET-BAV3 · MULTI DHW TANK | 191 | 🧪 |
| `epga_d_eab_eav_eavz_d_j_11_16` | Altherma · EPGA D EAB-EAV-EAVZ D(J) series 11-16kW | 164 | 🧪 |
| `epra_d_d7_etsh_x_16p30_50_e_e7_14_18_ech2o` | Altherma · EPRA D_D7 ETSH-X 16P30-50 E_E7 series 14-18kW-ECH2O | 195 | 🧪 |
| `epra_d_etsh_x_16p30_50_d_14_16_ech2o` | Altherma · EPRA D ETSH-X 16P30-50 D series 14-16kW-ECH2O | 186 | 🧪 |
| `epra_d_etv16_etb16_etvz16_d_14_16` | Altherma · EPRA D ETV16-ETB16-ETVZ16 D series 14-16kW | 187 | 🧪 |
| `epra_e_etsh_x_16p30_50_e_8_12_ech2o` | Altherma · EPRA E ETSH-X 16P30-50 E series 8-12kW-ECH2O | 196 | 🧪 |
| `epra_e_etv16_etb16_etvz16_e_ej_8_12` | Altherma · EPRA E ETV16-ETB16-ETVZ16 E_EJ series 8-12kW | 196 | 🧪 |
| `erga_d_ehsh_x_p30_50_d_04_08_ech2o` | Altherma · ERGA D EHSH-X P30-50 D series 04-08kW-ECH2O | 170 | 🧪 |
| `erga_d_ehv_ehb_ehvz_dj_04_08` | Altherma · ERGA D EHV-EHB-EHVZ DJ series 04-08 kW | 188 | 🧪 |
| `erga_e_ehsh_x_p30_50_e_ef_04_08_ech2o` | Altherma · ERGA E EHSH-X P30-50 E_EF series 04-08kW-ECH2O | 195 | 🧪 |
| `erla03_d_ehfh_ehfz_dj_3` | Altherma · ERLA03 D EHFH-EHFZ DJ series 3kW | 170 | 🧪 |
| `mini_chiller_ewaa_ewya_d_4_8` | Daikin Mini chiller · EWAA-EWYA D series 4-8kW | 188 | 🧪 |
| `mini_chiller_ewaa_ewya_d_9_16` | Daikin Mini chiller · EWAA-EWYA D series 9-16kW | 174 | 🧪 |
| `mini_chiller_ewaq_ewyq_b_4_8` | Daikin Mini chiller · EWAQ-EWYQ B series 4-8kW | 156 | 🧪 |

## Instalações reportadas
| Unidade exterior / interior | Série | Ficheiro de modelo | Placa | Estado | Reportado por, notas |
|---|---|---|---|---|---|
| ERLA11D2V3 / EBBH11DF6V | Altherma 3 R ERLA D | `erla_d_ebv_ebb_ebvz_11_16` | ESP32 DevKit | ✅ | @skydoy (responsável). Ficheiro de modelo feito para esta unidade (PR #46 do projeto original). |
| ERGA08DAV3 / EHVH08S23DA6V | Altherma 3 R ERGA D | `erga_eh_da_04_08` | ESP32 DevKit, M5Stack Basic | ✅ | @jjohnsen (autor original); o ficheiro de modelo predefinido. |
| ERRA08EV3 / ERRA08EAV37 + ELVH12S23E6V / ELVX12S23EJ6V | Altherma 3 R MT (bibloc) | `erga_eh_da_04_08` | ESP32-S3 DevKit | 🔶 | @mathep34 (discussão #41). |
| ERGA04 E / EHVX04S18EJ6V | Altherma 3 R ERGA E | `erga_eh_e_ej_04_08` | ESP32 DevKit (ESP32-D0WDQ6) | 🔶 | @sh4jonny. |
| EPRA18DW17 / ETBX16E9W7 | Altherma 3 H HT | `epra_d_etv_etb_etvz_14_18` | DOIT ESP32 DevKit V1 | 🔶 | @kepten; ficheiro de modelo feito para esta unidade (PR #49). |
| ERLA16D2W17 / EBVX16S23DJ9W | Altherma 3 R ERLA D | mapeamento próprio (mesma família de `erla_d_ebv_ebb_ebvz_11_16`) | ESP32-S3 SuperMini | 🔶 | @hansiputz (discussão #48). |
| EBSXB16P50DF | Altherma 3 R ECH₂O | `erla_d_ebsh_11_16_ech2o` | – | 🧪 | Mapeado a partir da exportação de registos e sensores de um utilizador. |
| EHSXB08P30EF | Altherma 3 R ECH₂O | não indicado | M5Stack AtomS3 Lite | 🔶 | @maromme (discussão #4). |
| EHSX08P50BB | Altherma 3 R ECH₂O | não indicado | M5Stack Stamp S3 | 🔶 | @smdx2 (discussão #47). |
| EHVX08S26CB9W | Altherma | mapeamento próprio | DOIT ESP32 DevKit V1 | 🔶 | @MaBeniu (discussão #5). |
| ERLQ011CAV3 / EHBX11CB9W | Altherma LT | não indicado | ESP32 DevKit | 🔶 | Reportado num guia de instalação em francês. |
| EHBH16C9W | Altherma | não indicado | ESP32-C6-WROOM-1 ¹ | 🔶 | @AndriesMuylaert (discussão #11); com um relé e sensores na placa. |
| EDLA09DA3V3 | Altherma 3 M | não indicado | Freenove ESP32 | 🔶 | @jandenouden2 (discussão #13). |
| ERLQ016CAW1 | Altherma LT (16 kW) | não indicado | ESP32-WROOM-32U DevKit | 🔶 | @ezfrag2021 (discussão #25). Os 5 V do X10A não chegavam: alimentado por USB; antena externa fora da caixa. |
| EHBH08CA3V | Altherma | não indicado | ESP32 | 🔶 | @papayou66 (discussão #63); painéis próprios. |

¹ Não é uma das placas do instalador web; precisa de uma compilação própria ([Uso avançado](avancado.md#compilar-por-ti)).

## Como verificar a tua unidade
1. Lê o modelo na etiqueta da unidade **interior** (por exemplo EBBH11DF6V) e da unidade **exterior** (por exemplo
   ERLA11D2V3).
2. Procura a série na tabela de [ficheiros de modelo](#ficheiros-de-modelo): as letras antes da potência (ERGA, ERLA,
   EPRA, EHV…) e a letra da geração a seguir (D, E, CB…).
3. Instala com esse ficheiro de modelo e compara alguns valores no Home Assistant com o ecrã da bomba de calor:
   temperatura exterior, temperatura da água de saída, modo de funcionamento.
4. Faltam valores ou estão claramente errados (por exemplo −3276,8, ou uma temperatura de 0 que nunca muda)?
   Experimenta o ficheiro de modelo mais próximo a seguir e depois
   [reporta-o](https://github.com/skydoy/esphome-altherma/issues/new?template=compatibility-report.yml) com um excerto
   dos registos. Para mapear os valores em falta por ti, vê a
   [descoberta de registos](avancado.md#descoberta-de-registos-experimental).
