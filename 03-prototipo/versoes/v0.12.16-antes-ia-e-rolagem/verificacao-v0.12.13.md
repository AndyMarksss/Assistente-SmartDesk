# Verificação 0.12.13

Data: 2026-10-21. `npm test` com dez suítes aprovadas, `version:check` e `format:check` aprovados.

## Modal de detalhes (mouse real via CDP, demonstração)

| Passo | Escuro | Claro |
|---|---|---|
| Abrir #SIM-003 | foco no título; sem anel no botão de fechar; cor da etapa `--tone` = âmbar | igual |
| Opções de etapa | 7, "Aguardando terceiros" marcada como atual | igual |
| Botão antes de escolher | "Salvar etapa", desligado | igual (agora com aparência de desligado) |
| Escolher "Finalizado" | botão "Mover para Finalizado", ligado | igual |
| Salvar | modal fecha, cartão vai para "Finalizado", aviso "#SIM-003 movido para Finalizado." | — |

Celular (390×844): modal com 352 px de largura, sem rolagem lateral, rodapé com "Fechar" e o botão preso na base.

## Varredura de layout

Painel nos 12 tamanhos, dois temas (28 medições por tema), comparado com a 0.12.12: nenhum achado novo fora do detalhe aberto; com o modal aberto, os itens apontados são os da página que ficam por baixo do diálogo (cobre a tela de propósito). Fontes abaixo de 11 px no painel: de 152 para 56 ocorrências.

## Chamados de teste que não apareciam

- Leitura da aba Chamados pelo servidor local (só leitura): 13 chamados, o último é o #015, de 19/10/2026. Nenhum chamado posterior foi gravado.
- Código do Apps Script igual ao de quando o #015 foi gravado (só mudou a conferência de equipamentos da 0.12.3); `/exec?api=health` responde.
- Pages: caminho de Impressora até o resumo sem erro de console; o envio não foi feito (gravaria na planilha). O link "Painel de gestão" abre na mesma aba, que mantém a sessão.
- O painel publicado mostra em "Chamados desta avaliação" só os chamados enviados naquela aba, por até 1 hora (privacidade: o Pages é público). Agora isso aparece escrito no painel vazio.

Evidências EVID-264 a EVID-269.
