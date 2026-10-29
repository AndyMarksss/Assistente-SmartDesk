# Avaliação técnica da IA

Confere, com relatos fictícios, se a IA do SmartDesk identifica o caminho certo a partir do relato livre ("Descrever com minhas palavras"), se extrai os dados certos (data, horário, opções) e se cada um dos 57 caminhos chega ao resumo pelos botões. É uma verificação técnica: não substitui o teste com usuários reais.

## Arquivos

- `relatos.json` — banco de ajuste: 3 relatos por caminho (claro, vago, informal), casos fora do escopo, restritos ao setor, com dois pedidos e uma tentativa de manipular a IA.
- `relatos-controle.json` — banco de controle: 30 relatos novos, escritos antes de ver os erros e nunca usados para ajustar a IA. Mostra se uma melhora vale para relatos que a IA nunca viu.
- `avaliar-ia.cjs` — envia cada relato para `/api/analyze` (e `/api/extract` quando há dados para conferir) e grava `resultados-<rodada>.json`.
- `percorrer-botoes.cjs` + `navegador-cdp.cjs` — percorrem os 57 caminhos no navegador (Edge sem janela) até o resumo, sem enviar, e gravam `percurso-botoes.json`.
- `revisar-ia.cjs` — envia o relato claro de cada caminho direto para `/api/assist` (revisão: alerta, pergunta e dicas) e grava `revisao-<rodada>.json`.
- `gerar-relatorio.cjs` — monta `relatorio-avaliacao-ia.md`.

## Resultado (2026-10-15)

Instrução final: 99% de caminho certo na 1ª sugestão (antes 96%), controle 27/27 e 3/3 fora do escopo, extração 99% sem "evento" inventado, 57/57 caminhos até o resumo pelos botões, revisão sem alertas falsos. Detalhes no relatório.

## Como rodar

1. Em `03-prototipo`, com a chave do Gemini no `.env`, rode `npm start` (o envio ao Google pode ficar desligado: nenhuma rota usada aqui cria chamados).
2. Nesta pasta:

```bash
node avaliar-ia.cjs --rodada depois
node avaliar-ia.cjs --rodada controle-depois --banco relatos-controle.json
node navegador-cdp.cjs percorrer-botoes.cjs
node avaliar-ia.cjs --rodada extracao-final --so-extracao sim
node revisar-ia.cjs --rodada final
node gerar-relatorio.cjs antes,depois controle-antes,controle-depois tentativa-sinais extracao-final
```

Os pedidos são espaçados (4,5 s) para respeitar o limite gratuito do Gemini (500 pedidos por dia por projeto); quando a IA não responde, o script espera e tenta de novo, e uma nova execução retoma de onde parou. Custo aproximado: rodada completa ~250 pedidos e 30 minutos; controle ~36; percurso ~115; só extração 57; só revisão 57.

## Verificação de todas as requisições (0.12.17, 2026-10-28)

`verificar-requisicoes.cjs` chama a IA como a conversa faz, nos 57 caminhos: identificar (`/api/analyze`) e extrair (`/api/extract`) com o relato claro; revisar (`/api/assist`) e dar assunto (`/api/subject`) como no percurso pelos botões — campos já respondidos e o relato vago, que não repete esses dados —, mais cinco casos-limite vistos na planilha (relato sem sentido, item de outra área, relato de uma palavra). Marca "REPETE" quando a pergunta volta a um dado já respondido. Resultado em `relatorio-requisicoes-v0.12.17.md`; dados em `requisicoes-antes.json`, `requisicoes-depois.json` e nas rodadas intermediárias `requisicoes-parcial-*.json`.

```bash
node verificar-requisicoes.cjs --rodada depois --etapas assist,subject --intervalo 7000
```

## Rascunho que interpreta o relato (0.12.18, 2026-10-29)

`avaliar-ia.cjs` passou a gravar, na extração, o que a IA entendeu (`entendimento`), se o relato responde à pergunta de descrição do caminho (`completo`), se há outro pedido (`outroPedido`) e as dicas (`dicas`).

- **1ª rodada** (`resultados-extracao-0-12-18.json`): 80 de 80 campos. Mostrou "Não" inventado em "É para um evento?".
- **Rodada final** (`resultados-extracao-0-12-18-final.json`): 79 de 80 campos. Mostrou 07:00 inventado para "na primeira aula".
- **As duas invenções** passaram a ser descartadas por `safeExtract`, conferido reaplicando a regra às respostas já coletadas.
- **Nunca rode duas avaliações** (ou uma avaliação e testes no navegador) ao mesmo tempo: o limite por minuto do Gemini gratuito devolve "IA indisponível".

```bash
node avaliar-ia.cjs --rodada extracao-0-12-18-final --so-extracao sim
```
