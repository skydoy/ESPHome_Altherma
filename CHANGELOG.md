# Changelog

## [Unreleased]

- Ecrã de arranque do M5Stack: por baixo da versão do firmware aparece agora, mais pequena e mais escura, a versão do ESPHome com que foi compilado (ex. «ESPHome 2026.10.1»).
- O hotspot de configuração passa a chamar-se «ESPHome Altherma Setup», como nos outros projetos (ESPHome_AC Setup, ESPHome Hunter Setup). O nome da placa e o `project` não mudam, por isso as placas adotadas continuam a atualizar.
- Pacote de diagnóstico opcional (`boards/common/diagnostics.yaml`): novos **Motivo do reinício**, **Versão do firmware** e **Reiniciar (modo seguro)**, iguais aos do ESPHome_AC; nomes traduzidos no seletor PT/EN da página da placa.
- Seletor PT/EN da página da placa: os valores de diagnóstico também são traduzidos (motivo do reinício em ESP32 e ESP8266, «Reinício pedido por …», estado da atualização). Só muda o texto mostrado; os valores enviados pela placa ficam iguais.
- Novo blueprint do Home Assistant `homeassistant/blueprints/esphome_altherma_update_available.yaml`: notificação no telemóvel quando há versão nova (placas adotadas no Device Builder).
- Repositório: CONTRIBUTING, CODE_OF_CONDUCT, modelo de pull request, CODEOWNERS e .editorconfig, como nos outros projetos.
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
