# Segurança e atualizações pelo ar

🇬🇧 [Read in English](security.md) · [Voltar ao README](../README.pt.md)

## O que faz o firmware pré-compilado
O firmware do [instalador web](https://skydoy.github.io/esphome-altherma/) é a mesma imagem para todos e, por isso,
**não pode conter as suas chaves nem palavras-passe**. Vem assim:

| Item | Firmware pré-compilado | Porquê |
|---|---|---|
| Chave de encriptação da API do Home Assistant | nenhuma | Qualquer Home Assistant da sua rede o adota com um clique. |
| Palavra-passe OTA (ESPHome) | nenhuma | A mesma imagem para todos. A imagem M5Stack inclui o `esphome-altherma-m5stack.yaml`, que pede `!secret ota_password`; na compilação do instalador esse segredo vem do [`installer/secrets.yaml`](../installer/secrets.yaml) e está vazio de propósito. |
| Rede de recurso (`esphome-altherma…`) | aberta, só enquanto o Wi-Fi não está ligado | Para poder configurar o Wi-Fi com o telemóvel. Também tem uma página para enviar firmware (portal cativo). |
| Atualizações de firmware | Entidade **Firmware** no Home Assistant | Descarregadas por HTTPS a partir do GitHub Pages deste projeto; o manifesto inclui uma soma MD5 que o dispositivo confirma antes de reiniciar. |

Numa rede doméstica de confiança esta é a configuração habitual dos firmwares ESPHome "prontos a usar". Se outras
pessoas ou dispositivos partilharem essa rede, proteja-a como se explica a seguir.

## Atualizar com a entidade Firmware
1. Quando sai uma nova versão, o Home Assistant mostra uma atualização na entidade **Firmware** do dispositivo
   (**Definições → Dispositivos e serviços → ESPHome → ESPHome Altherma**, ou **Definições → Atualizações**).
2. Carregue em **Instalar**. O dispositivo descarrega a imagem **da mesma placa e do mesmo modelo de bomba de calor**
   que instalou (cada par placa/modelo tem o seu manifesto, `firmware/<placa>/<modelo>/manifest.json`) e reinicia.
3. Para mudar de modelo de bomba de calor, abra outra vez o instalador web e instale uma vez por USB.

A entidade Firmware só existe no firmware pré-compilado. Se adotar o dispositivo no ESPHome Device Builder (secção
seguinte), as atualizações passam a ser feitas no Device Builder (**Install → Wirelessly**).

## Proteger a sua própria compilação
Para acrescentar uma chave e palavras-passe precisa da sua própria configuração; o dispositivo deixa de usar a imagem
partilhada.

1. No Home Assistant abra o add-on **ESPHome Device Builder**. O dispositivo aparece como *descoberto* → **Adopt**
   (ou **Take Control**). É importado o ficheiro da sua placa a partir deste repositório.
2. Edite o YAML criado. Mantenha o seu modelo de bomba de calor e acrescente a segurança:

   ```yaml
   substitutions:
     altherma_model: erla_d_ebv_ebb_ebvz_11_16   # o modelo que escolheu no instalador

   api:
     encryption:
       key: !secret api_key          # gere uma com: openssl rand -base64 32

   ota:
     - platform: esphome
       password: !secret ota_password

   wifi:
     ssid: !secret wifi_ssid
     password: !secret wifi_password
     ap:
       password: !secret ap_password  # palavra-passe da rede de recurso (pelo menos 8 caracteres)
   ```

   e nos **Secrets** do Device Builder (canto superior direito):

   ```yaml
   wifi_ssid: "MeuWiFi"
   wifi_password: "palavra-passe-do-wifi"
   api_key: "cole aqui o resultado de openssl rand -base64 32"
   ota_password: "uma palavra-passe longa e aleatória"
   ap_password: "outra palavra-passe"
   ```

3. **Install → Wirelessly**. A partir daqui cada instalação sem fios precisa da palavra-passe OTA (o Device Builder
   envia-a por si).
4. O Home Assistant indica que o dispositivo precisa de atenção e pede a **chave de encriptação**: cole o mesmo
   `api_key`.

Não coloque estes valores num ficheiro que partilhe ou envie para o git. Numa cópia do repositório, o `secrets.yaml`
na raiz é ignorado (`.gitignore`); o `installer/secrets.yaml` **não** é, e só pode ter os valores vazios.

### Compilação manual (linha de comandos)
As mesmas chaves funcionam na linha de comandos do ESPHome. Coloque-as no `secrets.yaml` ao lado do
`esphome-altherma-<placa>.yaml` e acrescente os blocos `api:`, `ota:` e `wifi:` acima a esse ficheiro (ou a um
ficheiro seu que o inclua como pacote). Veja [Uso avançado](avancado.md#compilar-por-si).

### Configurações do instalador / de fábrica
Os ficheiros em [`installer/`](../installer/) são o que o instalador web compila e devem continuar sem chaves.
**Não** coloque lá a sua chave nem palavras-passe: as imagens são públicas, e uma `ota: password` diferente da de um
ficheiro incluído faz o `esphome config` falhar com *"password is inconsistent"*. Para uma imagem sua, copie o
ficheiro da sua placa, mantenha o bloco `update:` se quiser a entidade Firmware e coloque os segredos num
`secrets.yaml` ao lado.

## Voltar ao firmware pré-compilado
Instale outra vez a imagem do instalador web por USB. Ela não tem chave da API, por isso o Home Assistant continua a
tentar a chave antiga e o dispositivo fica indisponível: **apague o dispositivo** em **Definições → Dispositivos e
serviços → ESPHome** e adicione-o de novo (ou reconfigure-o e deixe a chave vazia).

## Reportar uma vulnerabilidade
Veja o [SECURITY.md](../SECURITY.md). Não abra um *issue* público para problemas de segurança.
