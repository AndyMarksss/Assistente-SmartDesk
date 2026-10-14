# Avaliação técnica da IA

Confere, com relatos fictícios, se a IA do SmartDesk identifica o caminho certo a partir do relato livre ("Descrever com minhas palavras"), se extrai os dados certos (data, horário, opções) e se cada um dos 57 caminhos chega ao resumo pelos botões. É uma verificação técnica: não substitui o teste com usuários reais.

## Arquivos

- `relatos.json` — banco de ajuste: 3 relatos por caminho (claro, vago, informal), casos fora do escopo, restritos ao setor, com dois pedidos e uma tentativa de manipular a IA.
- `relatos-controle.json` — banco de controle: 30 relatos novos, escritos antes de ver os erros e nunca usados para ajustar a IA. Mostra se uma melhora vale para relatos que a IA nunca viu.
- `avaliar-ia.cjs` — envia cada relato para `/api/analyze` (e `/api/extract` quando há dados para conferir) e grava `resultados-<rodada>.json`.
- `percorrer-botoes.cjs` + `navegador-cdp.cjs` — percorrem os 57 caminhos no navegador (Edge sem janela) até o resumo, sem enviar, e gravam `percurso-botoes.json`.
- `gerar-relatorio.cjs` — monta `relatorio-avaliacao-ia.md`.

## Como rodar

1. Em `03-prototipo`, com a chave do Gemini no `.env`, rode `npm start` (o envio ao Google pode ficar desligado: nenhuma rota usada aqui cria chamados).
2. Nesta pasta:

```bash
node avaliar-ia.cjs --rodada depois
node avaliar-ia.cjs --rodada controle-depois --banco relatos-controle.json
node navegador-cdp.cjs percorrer-botoes.cjs
node gerar-relatorio.cjs antes,depois controle-antes,controle-depois
```

Os pedidos são espaçados (4,5 s) para respeitar o limite gratuito do Gemini; quando a IA não responde, o script espera e tenta de novo. Uma rodada completa leva cerca de 30 minutos.
