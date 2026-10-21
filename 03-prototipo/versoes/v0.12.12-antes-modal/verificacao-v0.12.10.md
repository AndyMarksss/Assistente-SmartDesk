# Verificação 0.12.10

Data: 2026-10-20. `npm test` com dez suítes aprovadas, `version:check` e `format:check` aprovados.

## Hover do botão principal (tema escuro, mouse real via CDP)

| | Fundo antes do hover | Fundo logo ao entrar o mouse | Transições que começam |
|---|---|---|---|
| 0.12.9 (Pages) | gradiente | nenhum gradiente; cor transparente | background-color (de transparente até o lilás) |
| 0.12.10 | gradiente | o mesmo gradiente | nenhuma |

## Dicas

Seta → avança; seta ← duas vezes volta e dá a volta até a última; pontinho 2 leva à dica 2 e passa a anunciar (aria-live polite); arrastar 80 px para a esquerda com o mouse avança; 10 s depois de navegar, a dica não troca sozinha.

## Barra lateral

Sem rolagem para os lados nem para baixo nos 19 tamanhos medidos (2560×1440 a 1024×650; até 600 px de altura vale o layout do celular). Na tela do usuário (1864×958), nos dois temas: cartão "Seu chamado", dica com setas, "O que a TI atende" e "Painel de gestão", com 8 px de folga; com valores longos, "O que a TI atende" sai e a barra continua sem rolar.

## Varredura de layout

Abertura, áreas e data nos 12 tamanhos (temas escuro e claro) e painel no tema claro: 100 medições, sem rolagem lateral (da página ou dentro de elementos), rolagem da barra, elementos fora da tela, texto cortado, botões cobertos ou sobrepostos. (Uma primeira rodada pegou a descrição do Painel de gestão cortada com reticências nas barras estreitas; ficou "Fila e etapas".)

Evidências EVID-250 a EVID-255.
