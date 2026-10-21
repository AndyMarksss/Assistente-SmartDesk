# Verificação 0.12.7

Data: 2026-10-20. `npm test` com dez suítes aprovadas, `version:check` e `format:check` aprovados.

## Rolagem da barra lateral (servidor local)

| Tamanho | Antes (0.12.6): para o lado / para baixo | Depois | Dica | O que a TI atende |
|---|---|---|---|---|
| 1920×1080 | 87 / 61 px | 0 / 0 | sim | sim |
| 1864×958 (tela do usuário) | 87 / 54 px | 0 / 0 | sim | sim (folga de 16 px) |
| 1440×900 | 73 / 52 px | 0 / 0 | sim | não |
| 1366×768 | 73 / 44 px | 0 / 0 | não | sim |
| 1280×720 | 73 / 41 px | 0 / 0 | não | não |
| 1024×768 | 60 / 45 px | 0 / 0 | não | não (barra estreita) |
| 932×430 | 60 / 74 px | barra oculta (layout do celular) | — | — |

Também medidos sem rolagem: 2560×1440, 1440×955, 1440×954, 1440×861, 1440×860, 1280×740, 1280×739, 1024×740, 1024×700, 1280×600, 1280×561 e 1280×560 (barra oculta).

Pior caso na tela do usuário (nome, e-mail, setor e necessidade longos, quebrando linha): a proteção tirou "O que a TI atende", manteve a dica e a barra continuou sem rolar; ao voltar para 1920×1080, o bloco reapareceu.

## Varredura de layout

Abertura, áreas e data nos 12 tamanhos, temas escuro e claro: 72 medições, sem rolagem lateral (da página ou dentro de elementos), rolagem da barra, elementos fora da tela, texto cortado, botões cobertos ou sobrepostos.

Evidências EVID-235 a EVID-237.
