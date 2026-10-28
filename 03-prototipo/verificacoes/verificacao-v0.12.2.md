# Verificação 0.12.2

Data: 2026-10-19. `npm test` com dez suítes aprovadas, `version:check` e `format:check` aprovados.

## Varredura de responsividade (servidor local, Edge sem janela)

O chat foi percorrido de ponta a ponta duas vezes, nos temas escuro e claro, com o envio e o acompanhamento simulados no navegador (nada foi gravado no Google). Em cada etapa a tela foi medida e fotografada em 12 tamanhos: 320×568, 360×740, 390×844, 430×932, 740×360, 844×390, 932×430, 768×1024, 1024×768, 1280×720, 1440×900 e 1920×1080. O painel passou pelo mesmo processo (quadro, detalhe e busca). Foram 232 medições por tema.

Etapas do chat: abertura, Como funciona?, nome, e-mail inválido, lista de setores, áreas, necessidades, data, horário, escolha Sim/Não, link, relato, rascunho da IA, revisão da IA, dicas, anexo com nome longo, resumo, comprovante com a nota, "o que faltou", fim, relato livre e acompanhamento.

| Verificação | Antes (0.12.1) | Depois (0.12.2) |
|---|---|---|
| Rolagem lateral da página | nenhuma | nenhuma |
| Elementos fora da tela, texto cortado, botões cobertos ou sobrepostos | nenhum | nenhum |
| Linhas da cena de abertura até os cartões e o círculo do robô | soltas ou por baixo dos cartões em 360, 390, 430, 768, 1024 e 1280 px (até 93 px de desvio) | 0 px de desvio em todos os tamanhos |
| Celular deitado, etapa das áreas | conversa com 46–60 px; "Descrever com minhas palavras" escondida | pergunta e as cinco opções visíveis sem rolar (conversa com 79–134 px) |
| Dica da barra lateral em 1024×768 e 1280×720 | cortada | oculta nessas alturas |
| Trilha de etapas em 320 e 360 px | "Boas-vindas" em duas linhas | uma linha, só a etapa atual com nome |
| Campo de data em 360 px | "DD/MM/AAAA" coberto pelo botão | inteiro (botão só com o ícone) |
| Atalhos de data / Voltar / Recomeçar / Remover | 30 / 36 / 26–36 / 26 px de altura | 40 px |
| Menor fonte no chat do celular | 7 px (cena e selo da abertura) | 8 px só na legenda decorativa da cena; textos de leitura com 9–10 px ou mais |

Restam abaixo de 40 px: no celular deitado, Voltar uma etapa e Recomeçar com 34–36 px (reduzidos de propósito para sobrar espaço à conversa); Copiar do comprovante (37 px); o botão de calendário dentro do campo (36 px); e, no painel, os links do topo (35 px) e o botão de tema (35–38 px). Todos ficam perto do recomendado.

O painel não precisou de ajuste: sem rolagem lateral, quadro em duas colunas no celular e detalhe do chamado ocupando a tela.

Evidências EVID-220 a EVID-222.
