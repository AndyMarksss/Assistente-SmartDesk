# Verificação 0.12.11

Data: 2026-10-21. `npm test` com dez suítes aprovadas, `version:check` e `format:check` aprovados.

## Painel de gestão

Na tela do usuário (1864×958), temas escuro e claro, com as simulações: títulos "TI lidera com 4 chamados", "2 chamados novos esperam a primeira resposta" e "30% resolvidos sem abrir chamado"; fila com as sete etapas e as contagens do quadro (2, 2, 2, 2, 2, 1, 1); indicadores com 83%, 17% e 8% do total.

| Interação (mouse real via CDP) | Resultado |
|---|---|
| Clique em "Finalizado" na fila | página rola até o quadro, a coluna recebe o foco e acende (`column-spot`); o destaque some sozinho; sem anel de foco após o mouse |
| "Ver novos chamados" no pulso | leva à coluna "Novos chamados" e a acende |
| Mouse sobre um indicador | o cartão não se move (antes subia 2 px) |

## Barra lateral do painel

12 tamanhos, dois temas (2560×1440 a 844×390): a barra nunca rola, nenhuma linha da fila passa da borda do cartão e nada fica cortado. A fila aparece a partir de 701 px de altura (a dica dela, a partir de 821 px); em 1024 e 1100 px de largura três nomes de etapa quebram em duas linhas; até 800 px de largura a barra vira a faixa do topo, só com a navegação.

## Dicas do chat

Seta → com amostragem de 70 quadros (700 ms): nenhum quadro com as duas dicas visíveis ao mesmo tempo; soma máxima das opacidades 1,00 (antes as duas cruzavam a 50%). Seta ←: a nova dica parte de −14 px (vem da esquerda).

## Anel de foco do botão de tema

Clique com o mouse real: foco no botão, `:focus-visible` falso, sem contorno. Depois de uma tecla (Shift) com o botão em foco: `:focus-visible` verdadeiro, contorno de 3 px — comportamento de acessibilidade do navegador, mantido.

## Varredura de layout

Comparação com a varredura da 0.12.10 (mesmos tamanhos e estados). Painel: 28 medições por tema (12 tamanhos com o quadro, 12 com o detalhe aberto e 4 com busca), sem rolagem lateral e sem achado novo fora do detalhe aberto — ali só mudam os nomes dos itens da página que ficam por baixo do diálogo, que cobre a tela de propósito. Uma primeira rodada pegou três coisas, corrigidas: descrições da navegação cortadas na barra estreita (até 1100 px agora mostram só o nome), o botão "Ver novos chamados" com 38 px de altura (agora 40) e a porcentagem dos indicadores em 10 px no celular (agora 11). Chat: 36 medições por tema, nenhum achado novo. Barra lateral do chat nos 20 tamanhos medidos: sem rolagem para os lados nem para baixo.

Evidências EVID-256 a EVID-262.
