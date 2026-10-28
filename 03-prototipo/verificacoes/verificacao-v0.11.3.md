# Verificação 0.11.3

Data: 2026-10-14. `npm test` com dez suítes aprovadas (novo teste no portal: com o setor que permite os IDs, a resposta da IA é aceita e a requisição leva o glossário e as necessidades); `version:check` e `format:check` aprovados.

## Avaliação da IA

Detalhes, tabelas e lista de erros em `04-validacao/avaliacao-ia/relatorio-avaliacao-ia.md`. Servidor local com Gemini real e envio ao Google desligado; só relatos fictícios.

- Instrução anterior, 186 relatos: 96% de caminho certo em 1º, 98% entre as três sugestões; base local 38%. Banco de controle (30 relatos novos): 27/27.
- Tentativa com palavras-chave da matriz: 47/50 contra 49/50 nos mesmos relatos — descartada.
- Instrução final: 44/44 contra 43/44 nos mesmos relatos e 9 de 10 casos sensíveis certos. Rodada completa, controle e percurso dos 57 caminhos interrompidos pelo limite diário do Gemini (HTTP 429, 500 pedidos por dia no plano gratuito).

## Sem IA

Com a cota esgotada (IA indisponível de verdade), no servidor local: "Preciso instalar o QuickBooks no computador novo do financeiro" (Financeiro) → mensagem de IA indisponível, opções "TI › QuickBooks › Erro no sistema" e "Escolher pelas opções"; escolhida a primeira, os campos foram perguntados, a descrição não foi pedida de novo e o resumo trouxe o relato como descrição. Antes, no Pages, o mesmo cenário montava um rascunho de "Google › Drive" para "o programa da contabilidade não abre o arquivo da empresa".

## Pages publicado (Apps Script versão 13)

- Saúde: `"version":"0.11.3"`; Pages servindo `app.js?v=0.11.3`.
- "O programa da contabilidade não abre o arquivo da empresa" (Financeiro): rascunho da IA com TI › QuickBooks › Erro no sistema e a alternativa Computador › Programas. A IA do site público seguiu ativa depois de a cota da chave local esgotar, então usa outra chave.
- Em uma tentativa a IA do Apps Script não respondeu e o chat mostrou o aviso de IA indisponível com as opções, como no teste local.

Evidências EVID-205 a EVID-207.
