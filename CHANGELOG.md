# Changelog

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
