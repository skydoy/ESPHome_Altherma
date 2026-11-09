<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/logo-dark.png">
    <source media="(prefers-color-scheme: light)" srcset="docs/logo-light.png">
    <img src="docs/logo-light.png" alt="ESPHome Altherma" width="256">
  </picture>
</p>

<p align="center"><b>Gostas? Ajuda-me a fazer algo ainda melhor.</b><br>
  <a href="https://ko-fi.com/skydoy"><img src="https://img.shields.io/badge/Ko--fi-Support%20me-FF5E5B?logo=ko-fi&logoColor=white" alt="Apoiar no Ko-fi"></a>
  <a href="https://buymeacoffee.com/skydoy"><img src="https://img.shields.io/badge/Buy%20Me%20a%20Coffee-Support%20me-FFDD00?logo=buymeacoffee&logoColor=black" alt="Buy Me a Coffee"></a>
</p>

<p align="center">
  <a href="https://github.com/skydoy/esphome-altherma/actions/workflows/publish.yml"><img src="https://github.com/skydoy/esphome-altherma/actions/workflows/publish.yml/badge.svg" alt="Build"></a>
  <a href="https://github.com/skydoy/esphome-altherma/actions/workflows/validate.yml"><img src="https://github.com/skydoy/esphome-altherma/actions/workflows/validate.yml/badge.svg" alt="Validação"></a>
  <a href="https://github.com/skydoy/esphome-altherma/releases/latest"><img src="https://img.shields.io/github/v/release/skydoy/esphome-altherma?sort=semver" alt="Versão"></a>
  <img src="https://img.shields.io/badge/upstream-jjohnsen%2Fesphome--altherma-555" alt="Projeto original: jjohnsen/esphome-altherma">
</p>

<p align="center"><b>A tua Daikin Altherma 3 no Home Assistant. Ligar por USB, escolher a bomba de calor, carregar em Instalar. Sem YAML.</b><br>
🇬🇧 <a href="README.md">Read in English</a></p>

<p align="center">
  <a href="https://skydoy.github.io/esphome-altherma/"><img src="https://img.shields.io/badge/Abrir%20o%20instalador%20web-1784F7?style=for-the-badge&logo=esphome&logoColor=white" alt="Abrir o instalador web" height="40"></a>
</p>

Liga uma pequena placa ESP32 ao conector de serviço **X10A** da tua bomba de calor **Daikin Altherma** e vê
temperaturas, caudal, potência e muito mais, localmente, no Home Assistant. Sem nuvem, sem MQTT, sem app.

**A minha bomba de calor é compatível?** Vê os [modelos](#modelos-de-bomba-de-calor) abaixo e a
[lista de compatibilidade](docs/compatibilidade.md) · [**Reportar a minha bomba**](https://github.com/skydoy/esphome-altherma/issues/new?template=compatibility-report.yml)

## Instalar em 3 passos
1. **Instalar o firmware.** Abre o **[instalador web](https://skydoy.github.io/esphome-altherma/)** no Chrome ou Edge,
   num computador, escolhe a placa, liga-a por USB → **Instalar**. A placa descobre sozinha o modelo da bomba (vê abaixo).
   (Faz isto *antes* de ligar os fios: nunca ligues o USB e os 5 V do X10A ao mesmo tempo.)
2. **Wi-Fi.** Escreve o teu Wi-Fi na mesma janela. (Ou mais tarde: liga-te à rede `esphome-altherma…` com o telemóvel.)
3. **Ligar e adicionar.** Desliga a bomba de calor no disjuntor, liga a placa ao **X10A** (tabela abaixo) e volta a
   ligar o disjuntor. O Home Assistant mostra *ESPHome Altherma* em **Definições → Dispositivos e serviços** → **Configurar**.

A partir daí as atualizações chegam pelo ar, na entidade **Firmware** do Home Assistant. Não precisas de USB outra vez.

| Pino X10A | Sinal | ESP32 DevKit | ESP32-S3 DevKitC-1 | M5Stack AtomS3 | D1 mini (ESP8266) | M5Stack Core / Basic |
|---|---|---|---|---|---|---|
| 1 | 5 V | 5V / VIN | 5V | Grove 5V (vermelho) | 5V | 5V (M-Bus) |
| 2 | TX (bomba → ESP) | GPIO16 | GPIO2 | Grove G2 | D1 (GPIO5) | GPIO16 |
| 3 | RX (ESP → bomba) | GPIO17 | GPIO1 | Grove G1 | D2 (GPIO4) | GPIO17 |
| 4 | – | não ligar | não ligar | não ligar | não ligar | não ligar |
| 5 | GND | GND | GND | Grove GND (preto) | GND | GND |

O TX liga ao RX e o RX ao TX. Onde fica o X10A, esquema, alimentação e segurança: [guia de ligações](docs/ligacoes.md).

## O que aparece no Home Assistant
| Entidade | Para que serve |
|---|---|
| **Sensores** | Temperaturas da água e do refrigerante, caudal, pressões, velocidade do compressor e do ventilador, tensão, corrente, potência (depende do ficheiro do modelo). |
| **Funcionamento** | Modo de funcionamento, descongelação, estado das bombas e válvulas, códigos de erro. |
| **Firmware** | Novas versões com um clique, pelo ar. |
| Ação **query_register** | Ler à mão qualquer registo do X10A para mapear sensores novos (experimental). |

No M5Stack Core / Basic o ecrã mostra os valores em direto (botões para navegar, tema escuro / claro) e uma pequena animação de arranque.

<p align="center"><img src="docs/logo-animation.gif" alt="Logótipo animado do ESPHome Altherma" width="200"></p>

## Placas
| Placa | Notas |
|---|---|
| [ESP32 DevKit](https://www.espboards.dev/esp32/esp32doit-devkit-v1/) | A mais barata e a mais testada. |
| [ESP32-S3 DevKitC-1](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32s3/esp32-s3-devkitc-1/) | Chip mais recente. |
| [M5Stack AtomS3 / AtomS3 Lite](https://docs.m5stack.com/en/core/AtomS3%20Lite) | Minúscula, fios na porta Grove. |
| [D1 mini (ESP8266)](https://docs.wemos.cc/en/latest/d1/d1_mini.html) | Funciona, mas tem menos memória. |
| [M5Stack Core / Basic](https://docs.m5stack.com/en/core/basic) | Ecrã + botões. |

> ⚠️ Algumas máquinas não conseguem alimentar a placa pelo pino de 5 V do X10A. Se a placa estiver sempre a
> reiniciar, alimenta-a por um carregador USB (e liga só o TX, o RX e o GND).

## Modelos de bomba de calor
Firmware pronto (modelos confirmados):

| Ficheiro do modelo | Unidade |
|---|---|
| `erga_eh_da_04_08` | Altherma 3 R · ERGA D + EHV/EHB/EHVZ DA (4–8 kW), também Altherma 3 R MT (ERRA + ELVH/ELVX) |
| `erga_eh_e_ej_04_08` | Altherma 3 R · ERGA E + EHV/EHB/EHVZ E/EJ (4–8 kW) |
| `erla_d_ebv_ebb_ebvz_11_16` | Altherma 3 R · ERLA D + EBV/EBB/EBVZ D (11–16 kW) |
| `erla_d_ebsh_11_16_ech2o` | Altherma 3 R ECH₂O · ERLA D + EBSH-X D (11–16 kW) |
| `epra_d_etv_etb_etvz_14_18` | Altherma 3 H HT · EPRA D + ETV/ETB/ETVZ (14–18 kW) |
| `altherma_ehvh_ehvx_cb` | Altherma LT · EHVH/EHVX CB (11–16 kW) |

> **Não precisas de saber o modelo.** O instalador põe um firmware genérico; a placa lê o Software ID e o Micon ID da
> unidade interior (só leitura) e mostra **Suggested Model**. Se o modelo for conhecido, carrega em **Install the right
> firmware** na página da placa (ou no Home Assistant) e ela atualiza-se sozinha por Wi-Fi. Se aparecer `unknown`, carrega
> em **Reportar a minha bomba** e escolhe o modelo à mão no site do instalador. Há mais 26 ficheiros de modelo (🧪, por
> testar) em `confs/`: escolhe-os à mão e compila no ESPHome Builder ([Uso avançado](docs/avancado.md)).
> Todos os modelos estão numa só lista, `installer/models.yaml`. Quem testou cada unidade: vê a
> [lista de compatibilidade](docs/compatibilidade.md). O teu modelo não está na lista, ou os valores parecem errados?
> [Reportar a minha bomba](https://github.com/skydoy/esphome-altherma/issues/new?template=compatibility-report.yml).

## Segurança e atualizações
O firmware pré-compilado não tem chave da API nem palavra-passe OTA, para que qualquer Home Assistant o possa adotar,
e atualiza-se pela entidade **Firmware**. Para acrescentar uma chave e palavras-passe, adota-o no ESPHome Device
Builder: [segurança e atualizações pelo ar](docs/seguranca.md).
As placas adotadas mostram **Update Available**; o blueprint
[`esphome_altherma_update_available.yaml`](homeassistant/blueprints/esphome_altherma_update_available.yaml)
manda-te uma notificação para o telemóvel quando sai uma versão nova.

## Avançado / YAML manual
Compilação própria ou Device Builder: configurações por placa `boards/esphome-altherma-<placa>.yaml`, `boards/base.yaml` comum e
mapas de sensores em [`confs/`](confs/). Corre `esphome run boards/esphome-altherma-esp32.yaml` com o teu Wi-Fi em `boards/secrets.yaml`.
Relés (termóstato / Smart Grid), descoberta de registos (`query_register`), UART simulada, Emoncms e os ficheiros
copiados do ESPAltherma: [uso avançado](docs/avancado.md).

## Documentação
[Ligações](docs/ligacoes.md) ·
[Compatibilidade](docs/compatibilidade.md) ·
[Segurança e OTA](docs/seguranca.md) ·
[Uso avançado](docs/avancado.md) ·
[Descoberta de registos](docs/avancado.md#descoberta-de-registos-experimental) ·
[Reportar a minha bomba](https://github.com/skydoy/esphome-altherma/issues/new?template=compatibility-report.yml) ·
[Reportar um problema](https://github.com/skydoy/esphome-altherma/issues/new/choose) ·
[Versões](https://github.com/skydoy/esphome-altherma/releases) ·
[Política de segurança](SECURITY.md) (em inglês) ·
[Contribuir](CONTRIBUTING.md) (em inglês) ·
[Código de conduta](CODE_OF_CONDUCT.md) (em inglês)

## Créditos
- Componente, sensores e ficheiros de modelo: esphome-altherma, de jjohnsen, e os seus contribuidores, baseado no
  ESPAltherma de raomin.
- Instalador web, compilações, documentação, logótipo e animação de arranque: skydoy. As imagens das placas e o esquema
  de ligações são ilustrações.

**Licença:** o meu trabalho neste fork (instalador web, página da placa, documentação, logótipo, blueprint, report worker)
está sob a [PolyForm Noncommercial 1.0.0](LICENSE): gratuito para uso pessoal e não comercial, uso comercial não
permitido. O [LICENSE](LICENSE) diz exatamente que ficheiros abrange. Não abrange os ficheiros do componente, dos modelos
e das placas do projeto original (não declaram licença, por isso todos os direitos ficam com o autor), os ficheiros do
ESPAltherma (MIT), nem o runtime do ESPHome (GPL-3.0) que vai dentro das imagens de firmware: vê os
[avisos de terceiros](THIRD_PARTY_NOTICES.md) (em inglês).

Usa por tua conta e risco: mexe na
bomba de calor com o disjuntor desligado. Daikin e Altherma são marcas registadas do seu dono; este é um projeto
independente da comunidade, sem ligação à marca.
