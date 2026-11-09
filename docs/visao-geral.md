# Visão geral

Detalhes que estavam no [README](../README.pt.md) da raiz. Começo curto: [README](../README.pt.md) · [Instalar](instalar.md).

## O que é

Liga uma pequena placa ESP ao conector de serviço **X10A** da tua bomba de calor **Daikin Altherma** e vê
temperaturas, caudal, potência e muito mais, localmente, no Home Assistant. Sem nuvem, sem MQTT, sem app.

Gratuito para uso pessoal e não comercial nos meus ficheiros neste fork ([LICENSE](../LICENSE)). Uso comercial desses ficheiros não é permitido.

**A minha bomba de calor é compatível?** Vê os [modelos](modelos.md) e a
[lista de compatibilidade](compatibilidade.md) ·
[Reportar a minha bomba](https://github.com/skydoy/esphome-altherma/issues/new?template=compatibility-report.yml)

## O que aparece no Home Assistant

| Entidade | Para que serve |
|---|---|
| **Sensores** | Temperaturas da água e do refrigerante, caudal, pressões, velocidade do compressor e do ventilador, tensão, corrente, potência (depende do ficheiro do modelo). |
| **Funcionamento** | Modo de funcionamento, descongelação, estado das bombas e válvulas, códigos de erro. |
| **Firmware** | Novas versões com um clique, pelo ar. |
| Ação **query_register** | Ler à mão qualquer registo do X10A para mapear sensores novos (experimental). |

No M5Stack Core / Basic o ecrã mostra os valores em direto (botões para navegar, tema escuro / claro) e uma pequena animação de arranque.

Capturas da página web da placa: [Página web da placa](pagina-web.md).

## Placas

| Placa | Notas |
|---|---|
| [ESP32 DevKit](https://www.espboards.dev/esp32/esp32doit-devkit-v1/) | A mais barata e a mais testada. |
| [ESP32-S3 DevKitC-1](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32s3/esp32-s3-devkitc-1/) | Chip mais recente. |
| [M5Stack AtomS3 / AtomS3 Lite](https://docs.m5stack.com/en/core/AtomS3%20Lite) | Minúscula, fios na porta Grove. |
| [D1 mini (ESP8266)](https://docs.wemos.cc/en/latest/d1/d1_mini.html) | Funciona, mas tem menos memória. |
| [M5Stack Core / Basic](https://docs.m5stack.com/en/core/basic) | Ecrã + botões. |

> ⚠️ Algumas máquinas não conseguem alimentar a placa pelo pino de 5 V do X10A. Se a placa estiver sempre a
> reiniciar, alimenta-a por um carregador USB (e liga só o TX, o RX e o GND). Detalhes: [ligações · Alimentação](ligacoes.md#alimentação).

Pinagem e segurança: [Instalar](instalar.md) · [Ligações](ligacoes.md).

## Modelos de bomba de calor

O firmware pronto cobre Altherma 3 R (ERGA / ERLA), Altherma 3 H HT (EPRA), Altherma LT e mais.
O instalador põe uma imagem **genérica**; a placa lê o Software ID e o Micon ID da unidade interior (só leitura)
e mostra **Suggested Model**. Tabelas completas e mapas por testar: [Modelos](modelos.md).

## Atualizações automáticas (OTA)

O firmware pré-compilado não tem chave da API nem palavra-passe OTA, para que qualquer Home Assistant o possa adotar,
e atualiza-se pela entidade **Firmware**. Para acrescentar uma chave e palavras-passe, adota-o no ESPHome Device
Builder: [Segurança e OTA](seguranca.md).

- **Imagem do instalador web:** o Home Assistant mostra **Firmware**. Carrega em **Install**. O Wi-Fi mantém-se.
- **Adotada no ESPHome Device Builder:** a placa reporta **Update Available**. Carrega em **Install** no Device Builder (não uses «Install Update» na placa — esse botão só existe na imagem de fábrica do instalador web).

As placas adotadas podem usar o blueprint
[`esphome_altherma_update_available.yaml`](../homeassistant/blueprints/esphome_altherma_update_available.yaml)
para uma notificação no telemóvel quando sai uma versão nova.

## Página web da placa

Abre `http://<ip-da-placa>/` na tua LAN para o esquema em direto, entidades, botões de atualização e o registo de
depuração (sem palavra-passe de propósito; [notas de segurança](seguranca.md)).
Idioma: botão PT/EN. Os valores de diagnóstico e os textos da Altherma seguem o mesmo idioma, só no ecrã.

Capturas completas: [Página web da placa](pagina-web.md).

## Compilação própria / Device Builder

Configurações por placa `boards/esphome-altherma-<placa>.yaml`, `boards/base.yaml` comum e mapas em [`confs/`](../confs/).
Relés, descoberta de registos, UART simulada, Emoncms e os ficheiros do ESPAltherma: [Uso avançado](avancado.md).

## Créditos

- Componente, sensores e ficheiros de modelo: esphome-altherma, de jjohnsen, e os seus contribuidores, baseado no ESPAltherma de raomin.
- Instalador web, compilações, documentação, logótipo e animação de arranque: skydoy. As imagens das placas e o esquema de ligações são ilustrações.

**Licença:** o meu trabalho neste fork (instalador web, página da placa, documentação, logótipo, blueprint, report worker)
está sob a [PolyForm Noncommercial 1.0.0](../LICENSE). Não abrange os ficheiros do componente, dos modelos e das placas
do projeto original (sem licença declarada), os ficheiros do ESPAltherma (MIT), nem o runtime GPL-3.0 do ESPHome
dentro das imagens de firmware: vê os [avisos de terceiros](../THIRD_PARTY_NOTICES.md).

Usa por tua conta e risco: mexe na bomba de calor com o disjuntor desligado. Daikin e Altherma são marcas registadas
do seu dono; este é um projeto independente da comunidade, sem ligação à marca.
