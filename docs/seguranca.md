# Segurança e atualizações pelo ar

🇬🇧 [Read in English](security.md) · [Voltar ao README](../README.pt.md)

## O que faz o firmware pré-compilado
O firmware do [instalador web](https://skydoy.github.io/ESPHome_Altherma/) é a mesma imagem para todos e, por isso,
**não pode conter as tuas chaves nem palavras-passe**. Vem assim:

| Item | Firmware pré-compilado | Porquê |
|---|---|---|
| Chave de encriptação da API do Home Assistant | nenhuma | Qualquer Home Assistant da tua rede o adota com um clique. |
| Palavra-passe OTA (ESPHome) | nenhuma | A mesma imagem para todos. A imagem M5Stack inclui o `boards/esphome-altherma-m5stack.yaml`, que pede `!secret ota_password`; na compilação do instalador esse segredo vem do [`installer/secrets.yaml`](../installer/secrets.yaml) e está vazio de propósito. |
| Rede de recurso («ESPHome Altherma Setup») | aberta, só enquanto o Wi-Fi não está ligado | Para poderes configurar o Wi-Fi com o telemóvel. Também tem uma página para enviar firmware (portal cativo). |
| Atualizações de firmware | Entidade **Firmware** no Home Assistant | Descarregadas por HTTPS a partir do GitHub Pages deste projeto; o manifesto inclui uma soma MD5 que o dispositivo confirma antes de reiniciar. |

Numa rede doméstica de confiança esta é a configuração habitual dos firmwares ESPHome "prontos a usar". Se outras
pessoas ou dispositivos partilharem essa rede, protege-a como se explica a seguir.

## O que o dispositivo expõe na tua rede
Tudo o que está abaixo fica acessível a **qualquer dispositivo na mesma rede** (cabo ou Wi-Fi). Nada fica aberto para
a internet, a não ser que reencaminhes portas no router — não o faças.

| Serviço | Porta | Firmware pré-compilado | O que alguém na tua rede pode fazer |
|---|---|---|---|
| Página web da placa (`web_server` v3) | TCP 80 (HTTP) | ligada, **sem login** | Ver todos os sensores e o registo em direto, carregar nos botões (Reiniciar, Procurar atualização, Instalar atualização, Instalar o firmware certo), ligar/desligar a Atualização automática e enviar um ficheiro de firmware (`POST /update`). |
| API nativa do Home Assistant | TCP 6053 | ligada, **sem chave de encriptação** | Ligar-se como o Home Assistant: ler todas as entidades e o registo, carregar nos botões, chamar o serviço `query_register` (só leitura). |
| OTA do ESPHome | TCP 3232 (ESP32) / 8266 (ESP8266) | ligada, **sem palavra-passe** (a imagem M5Stack usa o `ota_password` vazio) | Instalar qualquer firmware pelo ar com as ferramentas do ESPHome. |
| mDNS | UDP 5353 | ligado | Ver o nome da placa (`esphome-altherma-xxxxxx.local`), o IP e que corre ESPHome. |
| Rede de recurso «ESPHome Altherma Setup» + portal cativo | Ponto de acesso Wi-Fi | **aberta**, só quando a placa não consegue ligar ao teu Wi-Fi | Entrar, mudar as credenciais de Wi-Fi ou enviar um ficheiro de firmware. |
| Improv por USB | Série USB | ligado | Configurar o Wi-Fi — precisa de acesso físico ao cabo USB. |

Ligações que a placa faz sozinha (só de saída): ao teu Wi-Fi, aos servidores de hora NTP (`pool.ntp.org`) e ao
`skydoy.github.io` por HTTPS de 6 em 6 horas para procurar atualizações (e para descarregar uma quando tu ou a
Atualização automática a instalam). O ESP32 confirma o certificado TLS; o **ESP8266 não consegue** (`verify_ssl: false`),
por isso num ESP8266 o MD5 do manifesto só protege contra uma transferência estragada, não contra alguém que consiga
mexer no teu tráfego.

Para a bomba de calor a placa só envia pedidos de **leitura** na porta X10A; nunca escreve nenhuma definição da bomba.
O botão **📝 Reportar a minha bomba** da página web só abre um formulário do GitHub no teu browser — a placa não envia nada.

### Recomendações
1. Mantém a placa numa rede doméstica de confiança, de preferência uma VLAN de IoT ou rede de convidados que não chegue
   aos teus computadores.
2. Nunca reencaminhes as portas 80, 6053, 3232 ou 8266 no router. Para acesso remoto usa o Home Assistant.
3. Se outras pessoas ou dispositivos partilham a rede, adota a placa e acrescenta uma chave de encriptação da API, uma
   palavra-passe OTA e uma palavra-passe para a rede de recurso ([secções seguintes](#proteger-a-tua-propria-compilacao)).
4. Na tua compilação, impede o envio de firmware pela página web com `web_server: ota: false` (o portal cativo continua
   a poder instalar enquanto a rede de recurso está ativa), ou tira a página de vez com `web_server: !remove`.
5. Instala atualizações só pelo Home Assistant (entidade Firmware) ou pelo Device Builder; não instales ficheiros
   `.bin` de outras origens.

## Atualizar com a entidade Firmware
1. Quando sai uma nova versão, o Home Assistant mostra uma atualização na entidade **Firmware** do dispositivo
   (**Definições → Dispositivos e serviços → ESPHome → ESPHome Altherma**, ou **Definições → Atualizações**).
2. Carrega em **Instalar**. O dispositivo descarrega a imagem **da mesma placa e do mesmo modelo de bomba de calor**
   que instalaste (cada par placa/modelo tem o seu manifesto, `firmware/<placa>/<modelo>/manifest.json`) e reinicia.
3. Para mudar de modelo de bomba de calor, abre outra vez o instalador web e instala uma vez por USB.

A entidade Firmware só existe no firmware pré-compilado. Se adotares o dispositivo no ESPHome Device Builder (secção
seguinte), as atualizações passam a ser feitas no Device Builder (**Install → Wirelessly**).

## Proteger a tua própria compilação
Para acrescentar uma chave e palavras-passe precisas da tua própria configuração; o dispositivo deixa de usar a imagem
partilhada.

1. No Home Assistant abre o add-on **ESPHome Device Builder**. O dispositivo aparece como *descoberto* → **Adopt**
   (ou **Take Control**). É importado o ficheiro da tua placa a partir deste repositório.
2. Edita o YAML criado. Mantém o teu modelo de bomba de calor e acrescenta a segurança:

   ```yaml
   substitutions:
     altherma_model: erla_d_ebv_ebb_ebvz_11_16   # o modelo que escolheste no instalador

   api:
     encryption:
       key: !secret api_key          # gera uma com: openssl rand -base64 32

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
   api_key: "cola aqui o resultado de openssl rand -base64 32"
   ota_password: "uma palavra-passe longa e aleatória"
   ap_password: "outra palavra-passe"
   ```

3. **Install → Wirelessly**. A partir daqui cada instalação sem fios precisa da palavra-passe OTA (o Device Builder
   envia-a por ti).
4. O Home Assistant indica que o dispositivo precisa de atenção e pede a **chave de encriptação**: cola o mesmo
   `api_key`.

Não coloques estes valores num ficheiro que partilhes ou envies para o git. Numa cópia do repositório, o `boards/secrets.yaml`
é ignorado (`.gitignore`); o `installer/secrets.yaml` **não** é, e só pode ter os valores vazios.

### Compilação manual (linha de comandos)
As mesmas chaves funcionam na linha de comandos do ESPHome. Coloca-as no `secrets.yaml` ao lado do
`boards/esphome-altherma-<placa>.yaml` e acrescenta os blocos `api:`, `ota:` e `wifi:` acima a esse ficheiro (ou a um
ficheiro teu que o inclua como pacote). Vê [Uso avançado](avancado.md#compilar-por-ti).

### Configurações do instalador / de fábrica
Os ficheiros em [`installer/`](../installer/) são o que o instalador web compila e devem continuar sem chaves.
**Não** coloques lá a tua chave nem palavras-passe: as imagens são públicas, e uma `ota: password` diferente da de um
ficheiro incluído faz o `esphome config` falhar com *"password is inconsistent"*. Para uma imagem tua, copia o
ficheiro da tua placa, mantém o bloco `update:` se quiseres a entidade Firmware e coloca os segredos num
`secrets.yaml` ao lado.

## Voltar ao firmware pré-compilado
Instala outra vez a imagem do instalador web por USB. Ela não tem chave da API, por isso o Home Assistant continua a
tentar a chave antiga e o dispositivo fica indisponível: **apaga o dispositivo** em **Definições → Dispositivos e
serviços → ESPHome** e adiciona-o de novo (ou reconfigura-o e deixa a chave vazia).

## Reportar uma vulnerabilidade
Vê o [SECURITY.md](../SECURITY.md). Não abras um *issue* público para problemas de segurança.
