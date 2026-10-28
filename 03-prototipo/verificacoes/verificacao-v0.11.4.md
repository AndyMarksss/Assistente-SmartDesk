# Verificação 0.11.4

Data: 2026-10-15. `npm test` com dez suítes aprovadas (novos casos: pergunta com nome do aluno e com nome/e-mail da professora descartadas; "nome do arquivo" e "mensagem de erro ao abrir o e-mail" mantidas); `version:check` e `format:check` aprovados.

## Avaliação concluída (servidor local, Gemini real, só relatos fictícios)

| Medida | Instrução anterior | Final |
|---|---|---|
| Caminho certo em 1º (171 relatos dos 57 caminhos) | 96% | 99% |
| Relatos vagos certos em 1º | 89% | 98% |
| Controle: caminhos / fora do escopo | 27/27 e 2/3 | 27/27 e 3/3 |
| Extração: campos certos | 98% | 99% |
| "Evento" marcado sem a pessoa dizer | 5/12 | 0/12 |
| Revisão: alertas falsos nos 57 caminhos | 2 (percurso) | 0 |
| Perguntas pedindo dados pessoais | 2 | 0 (filtro) |

- O único relato ainda fora do 1º lugar é "Posso instalar programas por conta própria no computador da escola?" (Programas em 1º, Dúvidas em 2º), ambíguo de fato.
- Percurso pelos botões: 57/57 caminhos até o resumo.
- Uso da cota local no dia: cerca de 450 dos 500 pedidos. O site público usa outra chave.

Relatório completo em `04-validacao/avaliacao-ia/relatorio-avaliacao-ia.md`. Evidência EVID-208.
