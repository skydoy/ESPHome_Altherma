# Changelog

## [Unreleased]

- Nomes de entidades sem «/», que o ESPHome 2027.7 deixa de aceitar (até lá o ESPHome trocava-os por «⁄» e avisava): o «/» passa a espaço em 15 nomes do modelo `altherma_ehvh_ehvx_cb` («O U capacity», «I U operation mode», «Reheat ON OFF», …) e em «3-Way Valve (DHW Space)» do `erla_d_ebv_ebb_ebvz_11_16`. Os IDs das entidades no Home Assistant não mudam (o `object_id` e a chave de cada entidade ficam iguais, confirmado no código gerado); só muda o nome mostrado. O seletor PT/EN da página da placa já traduz os nomes novos.
- Componente `altherma_hub`, identificação do modelo e ecrãs do M5Stack: deixam de usar `EntityBase::get_name()` (obsoleto no ESPHome 2026.11, removido no 2027.5). Escolhe a função pela versão do ESPHome, por isso as placas adotadas continuam a compilar no 2026.10.
- M5Stack: a imagem do ecrã de arranque usa o formato novo `image:` com `platform: file` (o antigo deixa de funcionar no ESPHome 2027.1).
- Versões automáticas: cada *push* para o `main` que muda o firmware (`components/`, `confs/`, `boards/`, `installer/`, `.github/esphome-version`) é validado e publica sozinho a versão *patch* seguinte (commit `release vX.Y.Z` com `altherma_version` e este ficheiro, tag e publicação). Mudanças só na documentação, nos READMEs, na página do instalador ou no CI não lançam versão. Todos os dias às 04:00 (UTC) o workflow «ESPHome auto-update» procura uma versão estável nova do ESPHome, abre um *pull request*, compila todas as placas × modelos e, se tudo passar, junta-o e lança uma versão *patch*; se falhar, o *pull request* fica aberto e não sai versão.
- A versão do ESPHome do CI e do firmware pré-compilado está agora num só sítio, `.github/esphome-version`.

## [2.6.4] - 2026-11-24

- Pacote opcional `boards/common/packet-transport.yaml` para compilações adotadas (Device Builder): envia na rede local, por UDP (`packet_transport` do ESPHome, porta 18511, em claro, sem encriptação), a temperatura da água de saída e de retorno, a temperatura exterior, a frequência do compressor, os códigos de erro das unidades exterior e interior (byte em bruto, 0 = sem erro) e um binário de avaria, para outro ESPHome (por exemplo um controlador de piso radiante) os usar sem Home Assistant. Funciona com todos os modelos e placas. Os valores vão sem encriptação (o recetor pode ter firmware pré-compilado, sem chave): qualquer pessoa na rede local os consegue ler, por isso só o ligues numa rede em que confias. O firmware pré-compilado não muda. Documentado em Uso avançado e na página Segurança.
- ESPHome 2026.11.0 (antes 2026.10.1) no CI, na publicação (build-action) e no firmware pré-compilado. Revi as alterações que partem compatibilidade: nenhuma afeta este projeto (não usa canbus, lvgl, ethernet, nextion, openthread nem remote_base). As ações `http_request.get`/`post` deixam de bloquear o loop; os scripts que as usam (verificação de atualizações e relatório automático) continuam em `mode: single`, por isso um segundo disparo enquanto o pedido está a decorrer é ignorado, o que aqui não faz mal. A página web só deixa de servir por URL entidades `internal: true`, e o botão «Install the right firmware» não é interno.
- Publicação: o workflow «Publish documentation only» apanha a última tag quando o site no ar ainda tem uma versão anterior (o deploy do Pages de uma tag no mesmo commit que um deploy de docs já publicado não ficava no ar), sempre depois de confirmar o firmware contra os checksums da release; a publicação de uma tag falha se o site não mostrar a versão nova.
- CI: job «packet-transport» valida o pacote em ESP32, ESP32-S3, AtomS3, ESP8266 e M5Stack e compila-o em ESP32, ESP8266 e M5Stack (`tools/packet-transport-check.yaml`; no M5Stack o CI escreve segredos de exemplo em `tools/secrets.yaml`, ignorado pelo git).
- Versão do projeto 2.6.4 para o Device Builder detetar a atualização.

## [2.6.3] - 2026-11-23

- Documentação bilingue (MkDocs Material, português com tu e inglês, menu lateral, pesquisa, tema claro/escuro): https://skydoy.github.io/ESPHome_Altherma/docs/pt/ e /docs/en/. O workflow «Publish documentation only» publica só essa documentação por cima do site já no ar, sem recompilar firmware nem mexer no instalador. O workflow «Build firmware & publish installer» fica para tags `v*`; uma execução manual desse workflow publica firmware dev e não serve para atualizar a documentação.
- Uso avançado: para acrescentar um modelo ao instalador, a lista é `installer/models.yaml` (depois `python installer/gen_models.py`). A publicação compila 5 placas × (`generic` + modelos com `confirmed: true`).
- Instalador web: botão de tema (sol/lua) igual ao hub ESPmaniacs — última pílula depois de PT | EN, 36,4×25 px, ícone SVG 14 px centrado (sem emoji).
- Entidades secundárias passam a vir desativadas por defeito (`disabled_by_default: true`): **Manual Query Registry Result**, **Latest Version** (placas adotadas) e, no pacote de diagnóstico opcional (sempre incluído no M5Stack), **Boot Count**, **ESPHome Version**, **WiFi BSSID** e **MAC Address**. O Home Assistant só aplica isto a entidades novas: as que já tens não mudam e os IDs ficam iguais. Na página web da placa ficam atrás de «Mostrar tudo».
- Segurança: o SECURITY.md indica as versões suportadas (2.6.x) e como reportar em privado; a página Segurança (docs/security.md, docs/seguranca.md) tem uma secção nova com o que a placa expõe na rede local (página web na porta 80 sem login e com envio de firmware, API 6053 sem chave, OTA 3232/8266 sem palavra-passe, mDNS, rede de recurso aberta com portal cativo, Improv por USB), as ligações que faz para fora e recomendações.
- CI: os pull requests falham se algum commit (`base..head`) não tiver como autor `skydoy <25871317+skydoy@users.noreply.github.com>` (`tools/check_commit_authors.sh`).
- CI: verificação do tamanho do firmware (`tools/firmware_size.py`). Em cada compilação (Validate: uma por placa; publicação: todas as placas × modelos) compara a imagem da app com a partição da app e falha acima de 90% (um só valor, `MAX_PERCENT`, para baixar mais tarde para 80%). O resumo do job mostra tamanho, partição, % usada e o que ocupa mais espaço. Agora (modelo `generic`): ESP32 55,3%, ESP32-S3 55,2%, AtomS3 55,2%, ESP8266 59,3%, M5Stack 65,7%.
- Versão do projeto 2.6.3 para o Device Builder detetar a atualização.

## [2.6.2] - 2026-11-09

- Repositório renomeado para `skydoy/ESPHome_Altherma`: todos os links, o instalador web (https://skydoy.github.io/ESPHome_Altherma/), o endereço das atualizações OTA e os `package_import_url` passam a usar o nome novo. Placas com versões anteriores procuram atualizações no endereço antigo (que deixou de existir): atualiza uma vez pelo instalador web ou pelo Device Builder.
- README (EN/PT) encurtado no mesmo layout do ESPHome_AC: logótipo, donativos, badges (build/validate/release/license), tagline + idioma, botão do instalador web, imagem social-preview; depois compatibilidade, instalação em 3 passos, ~6 bullets e links para docs/. O detalhe passou para docs/overview.md e docs/visao-geral.md (mais docs/install.md, docs/instalar.md, docs/models.md, docs/modelos.md). As capturas da página da placa ficam em docs/web-page.md e docs/pagina-web.md. Instalador web simplificado no fluxo 1-2-3 (placa → modelo → instalar) + «A seguir», com o mesmo estilo visual e o seletor PT/EN.
- Pacote de diagnóstico opcional: os sensores WiFi Signal, Uptime, IP Address e WiFi SSID passam a ter ids estáveis (`wifi_signal_sensor`, `uptime_s`, `ip_addr`, `ssid_name`). A placa M5Stack deixa de os definir em duplicado e inclui sempre `diagnostics-esp32.yaml`, por isso o pacote combina sem conflito em todas as placas.
- Seletor PT/EN da página da placa: os valores de texto dos sensores Altherma (modo de operação, tipo de erro, «No error», «Heating», «Fan Only»/«Stopped», etc.) também são traduzidos, só no ecrã — os estados enviados pela placa continuam em inglês.
- Ecrã de arranque do M5Stack: por baixo da versão do firmware aparece agora, mais pequena e mais escura, a versão do ESPHome com que foi compilado (ex. «ESPHome 2026.10.1»).
- O hotspot de configuração passa a chamar-se «ESPHome Altherma Setup», como nos outros projetos (ESPHome_AC Setup, ESPHome Hunter Setup). O nome da placa e o `project` não mudam, por isso as placas adotadas continuam a atualizar.
- Pacote de diagnóstico opcional (`boards/common/diagnostics.yaml`): novos **Motivo do reinício**, **Versão do firmware** e **Reiniciar (modo seguro)**, iguais aos do ESPHome_AC; nomes traduzidos no seletor PT/EN da página da placa.
- Seletor PT/EN da página da placa: os valores de diagnóstico também são traduzidos (motivo do reinício em ESP32 e ESP8266, «Pedido de reinício de …», estado da atualização), com as mesmas palavras do ESPHome_AC. Só muda o texto mostrado; os valores enviados pela placa ficam iguais.
- Correção: o pacote de diagnóstico opcional (`boards/common/diagnostics.yaml`) já funciona no ESP8266. A temperatura interna, que só existe no ESP32, passou para `boards/common/diagnostics-esp32.yaml` (inclui o resto). Se usas o pacote numa placa ESP32 e queres manter a temperatura interna, muda o include para esse ficheiro.
- Página web da placa: capturas PT/EN e explicação do botão PT · EN em docs/web-ui.md e docs/web-ui.pt.md (ligadas a partir do README).
- Novo blueprint do Home Assistant `homeassistant/blueprints/esphome_altherma_update_available.yaml`: notificação no telemóvel quando há versão nova (placas adotadas no Device Builder).
- Repositório: CONTRIBUTING, CODE_OF_CONDUCT, modelo de pull request, CODEOWNERS e .editorconfig, como nos outros projetos.
- Novo LICENSE: a PolyForm Noncommercial 1.0.0 aplica-se só ao trabalho do skydoy neste fork (instalador, página da placa, documentação, logótipo, blueprint, report worker); o LICENSE lista os caminhos. Não abrange o código do projeto original (sem licença declarada), os ficheiros do ESPAltherma (MIT) nem o runtime GPL-3.0 do ESPHome dentro dos `.bin`.
- Novo THIRD_PARTY_NOTICES.md com os créditos e licenças de terceiros (ESPAltherma, MIT, com o texto completo; projeto original esphome-altherma; ESPHome e ferramentas usadas na compilação). O README deixa de ter link para outro repositório na nota da licença.

## [2.6.1] - 2026-11-09

- Sincronizado com o projeto original até 2026-11-08. O novo perfil experimental GEO3 EGSAH/EWSAH D (6-10 kW) foi comparado sensor a sensor com o perfil `egsah_x_ewsah_x_d_6_10_geo3` deste fork: todos os registos, posições e conversões coincidem (salmoura de entrada R5T `0x20`/8, saída R6T `0x20`/10, bomba de salmoura `0x30`/1). Nota de verificação no cabeçalho do perfil; sem alterações de sensores.
- Versão do projeto 2.6.1 para o Device Builder detetar a atualização.

## [2.6.0] - 2026-11-06

### Interface web (PT/EN)
- Tradução completa da interface web_server v3 (nomes, grupos, botões PRESS, opções) com o seletor PT/EN e texto em português de Portugal (tu).
- Correção dos valores que chegam como texto ou `"NA"` (NaN): a UI aceita strings numéricas e mantém o último valor conhecido.
- Nova linha **Estado da atualização** (Update Status) junto de **Procurar atualização**, mais um aviso opcional no esquema. Nas placas adotadas no Device Builder, se houver versão nova, o texto indica para instalares no Device Builder (não uses «Install Update» — esse botão só existe na imagem de fábrica do instalador web).

### Desempenho e esquema (ERLA D e derivados)
- **COP em tempo real** enquanto o compressor corre: caudal × (água saída − retorno) × 4,186/60 ÷ (corrente INV × 230 V), no esquema e como sensor. A potência elétrica é uma estimativa (sem pinças CT nesta unidade).
- Contadores de energia (kWh) de aquecimento e AQS, separados pela válvula de 3 vias: totais `total_increasing` para o Energy do Home Assistant, mais hoje e este mês.
- Estatísticas do compressor: arranques por hora e por dia, duração do último ciclo e tempo de funcionamento hoje.
- Mini-gráfico de 24 h no esquema (água saída, depósito AQS, ar exterior), com histórico neste browser (`localStorage`).
- **Descrição do erro** a partir dos códigos interior/exterior, com texto PT/EN e aviso no esquema.
- Animação de descongelação no esquema e contagem de descongelações por dia.
- Nova temperatura alvo de condensação (`0x10`/8); passo do ventilador, impulsos da válvula de expansão, R5T a meio do permutador e sinal da bomba de água já estavam confirmados no modelo ERLA D.

## [2.5.0] - 2026-11-05

- Esquema da bomba de calor (válvula 3 vias, ventilador exterior), glifos PT no M5Stack e favicon Altherma na UI web.
