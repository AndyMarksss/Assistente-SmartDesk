# 02 · Matriz e regras

A **Matriz Mestre de Chamados** é a base do SmartDesk: diz quais tipos de ajuda existem, o que perguntar em cada um e quem pode pedir o quê. Foi montada a partir dos quatro formulários de pedido que a escola usa hoje (Audiovisual, Impressora, Google e TI).

| Conteúdo | Quantidade |
|---|---|
| Setores | 25 |
| Áreas | 4 (Audiovisual, Impressora, Google, TI) |
| Caminhos de atendimento | 57 |
| Regras condicionais | 10 (por exemplo: evento pede o roteiro; QuickBooks só para o Financeiro; câmeras só para a Coordenação do Infantil) |
| Cenários de teste | 11 (CT-01 a CT-11, usados nas sessões com usuários) |

## Arquivos

Exportação de 01/10/2026, em [`exportacoes/matriz-mestre-2026-10-01`](exportacoes/matriz-mestre-2026-10-01):

- [`origem.md`](exportacoes/matriz-mestre-2026-10-01/origem.md): de onde veio a exportação e como ler o CSV.
- `matriz-mestre-secoes.csv`: as seis tabelas da planilha original (matriz, regras, setores, cenários, resultados e fluxo de telas).
- `matriz-interpretada.json`: os mesmos dados, organizados para o protótipo.

No protótipo, a matriz vive em [`03-prototipo/assets/js/knowledge-base.js`](../03-prototipo/assets/js/knowledge-base.js) (caminhos e campos), e as regras em `classifier.js` e `request-policy.js`. A planilha original não é alterada pelo projeto.
