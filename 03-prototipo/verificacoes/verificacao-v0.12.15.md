# Verificação 0.12.15

Data: 2026-10-22. `npm test` com dez suítes aprovadas, `version:check` e `format:check` aprovados.

## Onde o quadro começa (demonstração)

| Tela | 0.12.14 | 0.12.15 | Cabeçalhos das colunas | Primeiro cartão inteiro | Aviso "↓" |
|---|---|---|---|---|---|
| 1864 × 958 (usuário) | 1037 px | 692 px | sim | sim | oculto |
| 1920 × 1080 | — | 692 px | sim | sim | oculto |
| 1440 × 900 | — | 741 px | sim | não | oculto |
| 1536 × 864 | — | 752 px | sim | não | visível |
| 1366 × 768 | — | 719 px | parcial | não | visível |
| 1280 × 720 | — | 798 px | não | não | visível |

## Filtros (mouse real via CDP, tema escuro e claro)

| Ação | Indicadores (total/abertos/atendimento/finalizados) | Gráfico | Quadro |
|---|---|---|---|
| Abertura | 12/10/2/1 | TI 4, Audiovisual 3, Impressora 3, Google 2 | 12 cartões |
| "Chamados abertos" | 12/10/2/1 | igual | 10 cartões; Finalizado e Cancelado apagados |
| Área "TI" | 4/3/1/0 | Computador 2, Dúvidas 1, Internet 1 ("TI: Computador lidera com 2 chamados") | 3 cartões |
| Categoria "Computador" | 2/1/1/0 | Computador marcado | 1 cartão |
| Esc | volta a 4/3/1/0 (sai a categoria) | | 3 cartões |
| "Todas as áreas" | 12/10/2/1 | áreas | 10 cartões |
| "Limpar tudo" | 12/10/2/1 | áreas | 12 cartões, faixa "Sem filtros…" |

## Varredura de layout

Painel nos 12 tamanhos, dois temas, comparado com a 0.12.14: nenhum achado novo fora do detalhe aberto (com o modal aberto, os itens apontados são os da página por baixo do diálogo). Uma primeira rodada pegou controles da origem com 38 px no toque, botões espremidos no celular e o aviso flutuante cobrindo controles em telas pequenas; corrigido (compacto só com mouse a partir de 900 px, arranjo próprio no celular, aviso oculto até 800 px de largura ou 500 px de altura). Barra lateral: fila sem vazar e sem rolagem nos 12 tamanhos.

Evidências EVID-272 a EVID-273.
