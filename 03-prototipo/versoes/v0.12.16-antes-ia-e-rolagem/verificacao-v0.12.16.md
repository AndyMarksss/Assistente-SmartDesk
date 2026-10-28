# Verificação 0.12.16

Data: 2026-10-28. `npm test` com dez suítes aprovadas (o teste do portal agora confere: outra sessão vê todos os chamados, com nome "Pessoa F.", e-mail "fi•••@example.com" e anexos sem endereço, e pode mudar a etapa; quem enviou vê os dados completos), `version:check` e `format:check` aprovados.

## Pages (antes de publicar a 0.12.16)

- Envio técnico P99 (Impressora › Papel Atolado): `/api/tickets` respondeu `#016` em 3,2 s; sem erros de console.
- Consulta pelo chat: "Acompanhar um chamado" → #016 → p99@exemplo.com → "Encontrei seu chamado: #016 · Novos chamados · Impressora · Papel Atolado".
- Leitura da aba Chamados pelo servidor local (só leitura): antes do envio técnico, 13 chamados, o último o #015 (19/10).

## Abertura do chat (área da conversa × quadro × primeira mensagem)

| Tela | 0.12.15 sem dados salvos | 0.12.15 com dados salvos | 0.12.16 (os dois casos) |
|---|---|---|---|
| 360 × 640 (celular) | ok | quadro cortado 105 px | quadro inteiro, mensagem à vista |
| 384 × 700 (celular, Chrome) | mensagem 132 px abaixo | quadro cortado 289 px | quadro inteiro (180 px), mensagem à vista |
| 390 × 664 (celular) | mensagem 160 px abaixo | quadro cortado 317 px | idem |
| 412 × 780 (celular) | mensagem 34 px abaixo | quadro cortado 168 px | idem |
| 1864 × 958 (usuário) | ok | quadro cortado 9 px | quadro inteiro, uma saudação |
| 1366 × 768 | ok | quadro cortado 37 px | idem |
| 1280 × 720 | ok | quadro cortado 109 px | idem |

## Corrigir um dado (local, sem envio)

Impressora › Papel Atolado: opções "Nome / E-mail / Setor / Modelo da impressora / Mensagem do visor / Descrição / Voltar ao resumo"; nome veio preenchido ("Participante Teste") e o último resumo mostrou "Participante Corrigido"; o modelo veio preenchido ("Não sei") e o resumo passou a "HP LaserJet 400"; a descrição veio preenchida. Audiovisual (caixa de som + microfone, evento): opções incluem data, horário, "É para um evento?", link do roteiro e "Resposta: Para quantas pessoas…"; "É para um evento?" veio com "Sim" em destaque; ao trocar para "Não", o link do roteiro saiu do resumo.

## Painel

Esqueleto: números vazios (56 px de largura), 7 colunas, 7 linhas na fila, 4 linhas no gráfico; ao clicar em "Atualizar" (mouse real) o esqueleto aparece e os 12 cartões voltam. Alturas: todos os cartões com a mesma altura em 1864 × 958 (137 px), 1366 × 768 e 390 × 844 (171 px); colunas iguais por linha do quadro.

## Varreduras

Painel nos 12 tamanhos, dois temas, comparado com a 0.12.15: nenhum achado novo fora do detalhe aberto. Chat (36 medições por tema) comparado com a 0.12.11: nenhum achado novo.

Evidências EVID-274 a EVID-284.
