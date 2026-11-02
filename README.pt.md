<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/logo-dark.png">
    <source media="(prefers-color-scheme: light)" srcset="docs/logo-light.png">
    <img src="docs/logo-light.png" alt="ESPHome Altherma" width="320">
  </picture>
</p>

<p align="center">
  <a href="https://github.com/skydoy/esphome-altherma/actions/workflows/publish.yml"><img src="https://github.com/skydoy/esphome-altherma/actions/workflows/publish.yml/badge.svg" alt="Build"></a>
  <a href="https://github.com/skydoy/esphome-altherma/releases/latest"><img src="https://img.shields.io/github/v/release/skydoy/esphome-altherma?sort=semver" alt="Release"></a>
  <a href="https://github.com/jjohnsen/esphome-altherma"><img src="https://img.shields.io/badge/upstream-jjohnsen%2Fesphome--altherma-555" alt="Upstream"></a>
</p>

<p align="center"><b>A tua Daikin Altherma 3 no Home Assistant. Liga por USB, escolhe a bomba de calor, clica em Instalar. Sem YAML.</b><br>
🇬🇧 <a href="README.md">Read in English</a></p>

<p align="center">
  <a href="https://skydoy.github.io/esphome-altherma/"><img src="https://img.shields.io/badge/Abrir%20o%20instalador%20web-1784F7?style=for-the-badge&logo=esphome&logoColor=white" alt="Abrir o instalador web" height="40"></a>
</p>

Este fork junta um instalador web de um clique, com um firmware pronto para cada **placa × modelo de bomba de calor**
(ESP32, ESP32-S3, M5Stack AtomS3 / AtomS3 Lite, ESP8266, M5Stack Core / Basic). Cada firmware atualiza-se sozinho
pelo ar a partir do mesmo sítio (a entidade de atualização **Firmware** no Home Assistant). No M5Stack Core aparece
uma pequena animação de arranque.

## Instalar em 3 passos
1. **Gravar.** Abre o **[instalador web](https://skydoy.github.io/esphome-altherma/)** no Chrome ou no Edge, escolhe
   a placa e o modelo da bomba de calor, liga a placa ao computador por USB → **Instalar**.
   Faz isto *antes* de ligar a placa à bomba de calor: nunca ligues o USB e os 5 V do X10A ao mesmo tempo.
2. **Wi-Fi.** Escreve o teu Wi-Fi na mesma janela. (Ou mais tarde: liga-te à rede `esphome-altherma-…` pelo telemóvel.)
3. **Ligar e adicionar.** Desliga a bomba de calor no disjuntor, liga a placa ao conector **X10A**
   (o instalador mostra os pinos da tua placa) e volta a ligar o disjuntor. O Home Assistant encontra *ESPHome Altherma* em
   **Definições → Dispositivos e serviços** → **Configurar**.

<p align="center"><img src="docs/logo-animation.gif" alt="Logótipo animado do ESPHome Altherma" width="240"></p>

## Modelos suportados
| Ficheiro em `confs/` | Unidade |
|---|---|
| `erga_eh_da_04_08` (predefinido) | Altherma 3 R · ERGA D + EHV/EHB/EHVZ DA (4–8 kW) |
| `erga_eh_e_ej_04_08` | Altherma 3 R · ERGA E + EHV/EHB/EHVZ E/EJ (4–8 kW) |
| `erla_d_ebv_ebb_ebvz_11_16` | Altherma 3 R · ERLA D + EBV/EBB/EBVZ D (11–16 kW) |
| `erla_d_ebsh_11_16_ech2o` | Altherma 3 R ECH₂O · ERLA D + EBSH-X D (11–16 kW) |
| `epra_d_etv_etb_etvz_14_18` | Altherma 3 H HT · EPRA D + ETV/ETB/ETVZ (14–18 kW) |
| `altherma_ehvh_ehvx_cb` | Altherma LT · EHVH/EHVX CB (11–16 kW) |

A deteção automática do modelo (PR #51 no projeto original) ainda é experimental e não está neste instalador:
escolhe o modelo à mão.

## Créditos
Componente, sensores e ficheiros de modelo: [jjohnsen/esphome-altherma](https://github.com/jjohnsen/esphome-altherma),
baseado no [ESPAltherma](https://github.com/raomin/ESPAltherma). Este fork só junta o instalador web e as compilações.
A documentação completa (em inglês) está no [README.md](README.md).
