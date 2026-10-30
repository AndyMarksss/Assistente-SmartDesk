# Verificação 0.13.1

Data: 2026-10-29. `npm test` com todas as suítes aprovadas, e `version:check` e `format:check` aprovados.

## Robô no quadro de boas-vindas do celular

Servidor local (envio ao Google desligado), com perfil salvo e `?p=P00`, como no ensaio do usuário. Medido no navegador: posição do robô, linhas de texto do quadro e rolagem da conversa.

| Tela | Nível do `fitWelcome` | Robô | Folga até o texto | Primeira tela rola? |
|---|---|---|---|---|
| 360 × 740 (escuro e claro) | 0 | visível | 6 px | não |
| 375 × 667 | 3 | visível | 39 px | não |
| 390 × 844 (claro) | 0 | visível | 3 px | não |
| 398 × 860 | 0 | visível | 11 px | não |
| 412 × 915 | 0 | visível | 25 px | não |
| 430 × 932 | 0 | visível | 43 px | não |
| 600 × 900 | 0 | visível | 201 px | não |

- A primeira versão (robô de 60 px a 12 px da borda) cobria 4 px do título em 360 px; o robô ficou com 52 px, a 10 px da borda.
- Abaixo de 340 px, o robô continua escondido.
- Acima de 600 px nada mudou: a ilustração inteira segue as regras de antes.
- Nenhum erro no console.

## Kit de impressão

`04-validacao/registros/kit-impressao-sessoes.html` impresso em PDF pelo Edge (A4): 14 páginas, sem página extra (1 de recrutamento, 1 de guia, 2 por participante e 2 de cartões). Conferido na versão de tela do mesmo arquivo.

## Publicação

Só interface: falta o `git push` para o Pages. O Apps Script não muda e continua na implantação @35, que responde 0.13.0.
