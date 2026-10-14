# Avaliação técnica da IA do SmartDesk

Gerado em 2026-10-14 a partir de `relatos.json` (186 relatos fictícios: 3 por caminho — claro, vago e informal — mais casos fora do escopo, restritos por setor, mistos e uma tentativa de manipular a IA). Servidor local com o Gemini real (`/api/analyze` e `/api/extract`), envio ao Google desligado. É uma verificação técnica, não substitui o teste com usuários.

**Como ler:** "1ª sugestão" = o caminho certo veio em primeiro (é o que o rascunho usa). "Entre as 3" = apareceu em alguma das sugestões. A base local é o classificador por palavras-chave usado quando a IA está fora.

**Situação:** avaliação incompleta. Faltam a rodada completa da instrução nova e o banco de controle com ela e o percurso pelos botões (2 de 57 caminhos feitos), que esperam a cota diária do Gemini voltar.

## Identificação do caminho

| Recorte | IA antes — 1ª sugestão | IA antes — entre as 3 | Base local — 1ª | Base local — entre as 3 |
|---|---|---|---|---|
| Todos os 57 caminhos | 165/171 (96%) | 167/171 (98%) | 65/171 (38%) | 75/171 (44%) |
| Relatos claros | 57/57 (100%) | 57/57 (100%) | 28/57 (49%) | 33/57 (58%) |
| Relatos vagos | 51/57 (89%) | 53/57 (93%) | 14/57 (25%) | 14/57 (25%) |
| Relatos informais | 57/57 (100%) | 57/57 (100%) | 23/57 (40%) | 28/57 (49%) |
| Audiovisual | 21/21 (100%) | 21/21 (100%) | 7/21 (33%) | 15/21 (71%) |
| Impressora | 29/30 (97%) | 29/30 (97%) | 14/30 (47%) | 14/30 (47%) |
| Google | 35/36 (97%) | 36/36 (100%) | 19/36 (53%) | 19/36 (53%) |
| TI | 80/84 (95%) | 81/84 (96%) | 25/84 (30%) | 27/84 (32%) |

| Casos especiais | IA antes | Base local |
|---|---|---|
| Fora do escopo barrados (nenhuma sugestão) | 10/10 (100%) | 10/10 (100%) |
| Restritos ao setor sem sugestão indevida | 2/2 (100%) | 2/2 (100%) |
| Dois pedidos no mesmo relato — os dois sugeridos | 2/2 (100%) | 0/2 (0%) |

## Extração dos dados do relato (rodada antes)

- **antes:** 78/80 (98%) dos campos conferidos certos; datas 16/16 (100%); demais campos 62/64 (97%).

Campos que não bateram:

| Relato | Campo | Esperado | Obtido |
|---|---|---|---|
| Preciso de um login de acesso à internet para um palestrante convidado na sexta-feira. | finalidade | ~palestrante | (vazio) |
| Quero solicitar uma nova seção na intranet para os documentos do RH. | secao | ~RH | (vazio) |

Campos preenchidos além dos conferidos (revisar se estavam mesmo no relato):

| Relato | Campos extras |
|---|---|
| precisa d som c microfone pra apresentacao amanha 14h | evento = Sim |
| preciso do kit completo projetor microfone e som pro auditorio na segunda q vem | evento = Sim |
| Preciso de projetor e caixa de som na sala 12 amanhã às 13h30 para passar um filme para a turma. | evento = Sim |
| Preciso de um microfone sem fio para a reunião de professores na sexta às 17h. | evento = Sim |
| datashow pra sala 3 amanha na primeira aula | evento = Não |
| A impressora Kyocera está mostrando erro na lâmpada da estufa (fusor) e parou de imprimir. | erro-apresentado = erro na lâmpada da estufa (fusor) e parou de imprimir |
| Preciso de um login de acesso à internet para um palestrante convidado na sexta-feira. | periodo = sexta-feira |
| O Wi-Fi da sala dos professores cai toda hora no meu celular. | rede = Wi-Fi da sala dos professores |
| Preciso atualizar o calendário de provas na página da Coordenação na intranet. | conteudo-novo = atualizar o calendário de provas |
| O relatório de frequência no Mentor Web dá erro ao gerar o PDF. | mensagem-de-erro = erro ao gerar o PDF |

## Mudanças na instrução, comparadas nos mesmos relatos

Estas rodadas pararam no limite diário gratuito do Gemini (500 pedidos por dia). A comparação usa só os relatos que a IA respondeu, contra os mesmos relatos da rodada antes.

| Versão | Relatos respondidos | Caminho certo em 1º | Mesmos relatos na rodada antes | "Evento" marcado sem estar no relato (Audiovisual) | Na rodada antes |
|---|---|---|---|---|---|
| tentativa-sinais | 50 | 47/50 (94%) | 49/50 (98%) | 2/12 (17%) | 5/12 (42%) |
| depois | 44 | 44/44 (100%) | 43/44 (98%) | 2/12 (17%) | 5/12 (42%) |

Erros de tentativa-sinais: #10 "Preciso de projetor e caixa de som na sala 12 amanhã às 13h30 para passar um filme para a turma." → AV-003, AV-004 (esperado AV-004); #12 "projetor + som pra sala 5 quinta 9h" → AV-003, AV-004, AV-006 (esperado AV-004); #26 "As folhas saem soltas da impressora, ela não está mais prendendo as páginas." → IMP-004 (esperado IMP-002).

## Banco de controle (relatos novos, nunca usados para ajustar a IA)

| Rodada | Caminho certo em 1º | Entre as 3 | Fora do escopo barrados | Extração |
|---|---|---|---|---|
| controle-antes | 27/27 (100%) | 27/27 (100%) | 2/3 (67%) | 11/11 (100%) |

Erros no controle (controle-antes):

| Relato | Esperado | Sugestões da IA |
|---|---|---|
| O portão da garagem não está abrindo com o controle. | nenhuma | TI-003 |

## Erros da IA na rodada antes

| # | Tipo | Setor | Relato | Esperado | Sugestões da IA |
|---|---|---|---|---|---|
| 32 | vago | Financeiro | A impressora avisa que precisa trocar a peça que aquece o papel. | IMP-004 | IMP-006 |
| 74 | vago | Coordenação EM (Médio) | Não recebo os e-mails que mandam para a equipe toda. | GOO-008 | GOO-007, GOO-008 |
| 89 | vago | Marketing | Posso instalar programas por conta própria no computador da escola? | TI-001 | TI-COMP-005, TI-001 |
| 95 | vago | Portaria | A TV da recepção não pega os canais. | TI-003 | nenhuma |
| 164 | vago | Financeiro | O programa da contabilidade não abre o arquivo da empresa. | TI-QB-001 | TI-COMP-005 |
| 167 | vago | Financeiro | O programa de contabilidade precisa ir para o computador novo. | TI-QB-002 | TI-COMP-005 |
| 186 | vago-extremo | Secretaria | Nada funciona aqui. | nenhuma | TI-003 |

## Percurso pelos botões (2/2 caminhos até o resumo)

Cada caminho foi percorrido no navegador do início ao resumo, sem enviar, usando o relato claro como descrição.

- Alertas de incoerência com relato coerente (falso alarme): 0/2 (0%)
- Caminhos em que a IA fez pergunta de complemento: 0/2 (0%)
- Caminhos com dicas antes do envio: 1/2 (50%)

