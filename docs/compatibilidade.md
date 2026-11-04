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
| Ficheiro de modelo (escolher no instalador) | Unidades | Estado |
|---|---|---|
| `erga_eh_da_04_08` (predefinido) | Altherma 3 R · ERGA D + EHV/EHB/EHVZ DA (4–8 kW); Altherma 3 R MT (ERRA + ELVH/ELVX) | ✅ |
| `erga_eh_e_ej_04_08` | Altherma 3 R · ERGA E + EHV/EHB/EHVZ E/EJ (4–8 kW) | 🔶 |
| `erla_d_ebv_ebb_ebvz_11_16` | Altherma 3 R · ERLA D + EBV/EBB/EBVZ D (11–16 kW) | ✅ |
| `erla_d_ebsh_11_16_ech2o` | Altherma 3 R ECH₂O · ERLA D + EBSH-X 16P30-50 D (11–16 kW) | 🧪 |
| `epra_d_etv_etb_etvz_14_18` | Altherma 3 H HT · EPRA D/D7 + ETV16/ETB16/ETVZ16 E/E7 (14–18 kW) | 🔶 |
| `altherma_ehvh_ehvx_cb` | Altherma LT CA/CB · EHVH-CB / EHVX-CB (11–16 kW) | ❔ |

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
