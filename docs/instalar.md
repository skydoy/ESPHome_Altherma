# Instalar

🇬🇧 [Read in English](install.md) · [Voltar ao README](../README.pt.md)

A maior parte das pessoas só precisa do **[instalador web](https://skydoy.github.io/ESPHome_Altherma/)**. Esta página é o mesmo fluxo, com um pouco mais de detalhe.

## Instalar em 3 passos

1. **Instalar o firmware.** Abre o **[instalador web](https://skydoy.github.io/ESPHome_Altherma/)** no Chrome ou Edge, num computador, escolhe a placa, liga-a por USB → **Instalar**. A placa descobre sozinha o modelo da bomba (vê [Modelos](modelos.md)). Faz isto *antes* de ligar os fios: nunca ligues o USB e os 5 V do X10A ao mesmo tempo.
2. **Wi-Fi.** Escreve o teu Wi-Fi na mesma janela. (Ou mais tarde: liga-te à rede `ESPHome Altherma Setup` com o telemóvel.)
3. **Ligar e adicionar.** Desliga a bomba de calor no disjuntor, liga a placa ao **X10A** ([guia de ligações](ligacoes.md)) e volta a ligar o disjuntor. O Home Assistant mostra *ESPHome Altherma* em **Definições → Dispositivos e serviços** → **Configurar**.

A partir daí as atualizações chegam pelo ar, na entidade **Firmware** do Home Assistant. Não precisas de USB outra vez.

## Placas

| Placa | Notas |
|---|---|
| [ESP32 DevKit](https://www.espboards.dev/esp32/esp32doit-devkit-v1/) | A mais barata e a mais testada. |
| [ESP32-S3 DevKitC-1](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32s3/esp32-s3-devkitc-1/) | Chip mais recente. |
| [M5Stack AtomS3 / AtomS3 Lite](https://docs.m5stack.com/en/core/AtomS3%20Lite) | Minúscula, fios na porta Grove. |
| [D1 mini (ESP8266)](https://docs.wemos.cc/en/latest/d1/d1_mini.html) | Funciona, mas tem menos memória. |
| [M5Stack Core / Basic](https://docs.m5stack.com/en/core/basic) | Ecrã + botões. |

> ⚠️ Algumas máquinas não conseguem alimentar a placa pelo pino de 5 V do X10A. Se a placa estiver sempre a reiniciar, alimenta-a por um carregador USB (e liga só o TX, o RX e o GND). Detalhes: [ligações · Alimentação](ligacoes.md#alimentacao).

## Pinagem (rápida)

| Pino X10A | Sinal | ESP32 DevKit | ESP32-S3 DevKitC-1 | M5Stack AtomS3 | D1 mini (ESP8266) | M5Stack Core / Basic |
|---|---|---|---|---|---|---|
| 1 | 5 V | 5V / VIN | 5V | Grove 5V (vermelho) | 5V | 5V (M-Bus) |
| 2 | TX (bomba → ESP) | GPIO16 | GPIO2 | Grove G2 | D1 (GPIO5) | GPIO16 |
| 3 | RX (ESP → bomba) | GPIO17 | GPIO1 | Grove G1 | D2 (GPIO4) | GPIO17 |
| 4 | – | não ligar | não ligar | não ligar | não ligar | não ligar |
| 5 | GND | GND | GND | Grove GND (preto) | GND | GND |

O TX liga ao RX e o RX ao TX. Onde fica o X10A, esquema, alimentação e segurança: [guia de ligações](ligacoes.md).

## Segurança e atualizações

O firmware pré-compilado não tem chave da API nem palavra-passe OTA, para que qualquer Home Assistant o possa adotar, e atualiza-se pela entidade **Firmware**. Para acrescentar uma chave e palavras-passe, adota-o no ESPHome Device Builder: [segurança e atualizações pelo ar](seguranca.md).

As placas adotadas mostram **Update Available**; o blueprint [`esphome_altherma_update_available.yaml`](../homeassistant/blueprints/esphome_altherma_update_available.yaml) manda-te uma notificação para o telemóvel quando sai uma versão nova.

## A seguir

- [Modelos](modelos.md) · [Compatibilidade](compatibilidade.md)
- [Página web da placa](pagina-web.md)
- [Visão geral](visao-geral.md)
- [Avançado / YAML manual](avancado.md)
