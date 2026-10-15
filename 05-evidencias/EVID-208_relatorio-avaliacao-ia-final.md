# Avaliação técnica da IA do SmartDesk

Gerado em 2026-10-15 a partir de `relatos.json` (186 relatos fictícios: 3 por caminho — claro, vago e informal — mais casos fora do escopo, restritos por setor, mistos e uma tentativa de manipular a IA). Servidor local com o Gemini real (`/api/analyze` e `/api/extract`), envio ao Google desligado. É uma verificação técnica, não substitui o teste com usuários.

**Como ler:** "1ª sugestão" = o caminho certo veio em primeiro (é o que o rascunho usa). "Entre as 3" = apareceu em alguma das sugestões. A base local é o classificador por palavras-chave usado quando a IA está fora.

## Identificação do caminho

| Recorte | IA antes — 1ª sugestão | IA antes — entre as 3 | IA depois — 1ª sugestão | IA depois — entre as 3 | Base local — 1ª | Base local — entre as 3 |
|---|---|---|---|---|---|---|
| Todos os 57 caminhos | 165/171 (96%) | 167/171 (98%) | 170/171 (99%) | 171/171 (100%) | 65/171 (38%) | 75/171 (44%) |
| Relatos claros | 57/57 (100%) | 57/57 (100%) | 57/57 (100%) | 57/57 (100%) | 28/57 (49%) | 33/57 (58%) |
| Relatos vagos | 51/57 (89%) | 53/57 (93%) | 56/57 (98%) | 57/57 (100%) | 14/57 (25%) | 14/57 (25%) |
| Relatos informais | 57/57 (100%) | 57/57 (100%) | 57/57 (100%) | 57/57 (100%) | 23/57 (40%) | 28/57 (49%) |
| Audiovisual | 21/21 (100%) | 21/21 (100%) | 21/21 (100%) | 21/21 (100%) | 7/21 (33%) | 15/21 (71%) |
| Impressora | 29/30 (97%) | 29/30 (97%) | 30/30 (100%) | 30/30 (100%) | 14/30 (47%) | 14/30 (47%) |
| Google | 35/36 (97%) | 36/36 (100%) | 36/36 (100%) | 36/36 (100%) | 19/36 (53%) | 19/36 (53%) |
| TI | 80/84 (95%) | 81/84 (96%) | 83/84 (99%) | 84/84 (100%) | 25/84 (30%) | 27/84 (32%) |

| Casos especiais | IA antes | IA depois | Base local |
|---|---|---|---|
| Fora do escopo barrados (nenhuma sugestão) | 10/10 (100%) | 10/10 (100%) | 10/10 (100%) |
| Restritos ao setor sem sugestão indevida | 2/2 (100%) | 2/2 (100%) | 2/2 (100%) |
| Dois pedidos no mesmo relato — os dois sugeridos | 2/2 (100%) | 2/2 (100%) | 0/2 (0%) |

## Extração dos dados do relato

- **antes:** 78/80 (98%) dos campos conferidos certos; datas 16/16 (100%); demais campos 62/64 (97%); "evento" marcado sem estar no relato 5/12 (42%).
- **depois:** 73/78 (94%) dos campos conferidos certos; datas 16/16 (100%); demais campos 57/62 (92%); "evento" marcado sem estar no relato 2/12 (17%); 1 sem resposta da IA (cota), fora da conta.
- **extracao-final:** 79/80 (99%) dos campos conferidos certos; datas 16/16 (100%); demais campos 63/64 (98%); "evento" marcado sem estar no relato 0/12 (0%).

Tabelas abaixo: rodada extracao-final.

Campos que não bateram:

| Relato | Campo | Esperado | Obtido |
|---|---|---|---|
| Preciso de um login de acesso à internet para um palestrante convidado na sexta-feira. | finalidade | ~palestrante | (vazio) |

Campos preenchidos além dos conferidos (revisar se estavam mesmo no relato):

| Relato | Campos extras |
|---|---|
| A impressora Kyocera está mostrando erro na lâmpada da estufa (fusor) e parou de imprimir. | erro-apresentado = erro na lâmpada da estufa (fusor) e parou de imprimir |
| Preciso de um login de acesso à internet para um palestrante convidado na sexta-feira. | periodo = na sexta-feira |
| O Wi-Fi da sala dos professores cai toda hora no meu celular. | rede = sala dos professores |
| Preciso atualizar o calendário de provas na página da Coordenação na intranet. | conteudo-novo = calendário de provas |
| O relatório de frequência no Mentor Web dá erro ao gerar o PDF. | mensagem-de-erro = erro ao gerar o PDF |

## Mudanças na instrução, comparadas nos mesmos relatos

Rodadas interrompidas (por piorar o resultado ou pelo limite diário do Gemini). A comparação usa só os relatos que a IA respondeu, contra os mesmos relatos da rodada antes.

| Versão | Relatos respondidos | Caminho certo em 1º | Mesmos relatos na rodada antes | "Evento" marcado sem estar no relato (Audiovisual) | Na rodada antes |
|---|---|---|---|---|---|
| tentativa-sinais | 50 | 47/50 (94%) | 49/50 (98%) | 2/12 (17%) | 5/12 (42%) |

Erros de tentativa-sinais: #10 "Preciso de projetor e caixa de som na sala 12 amanhã às 13h30 para passar um filme para a turma." → AV-003, AV-004 (esperado AV-004); #12 "projetor + som pra sala 5 quinta 9h" → AV-003, AV-004, AV-006 (esperado AV-004); #26 "As folhas saem soltas da impressora, ela não está mais prendendo as páginas." → IMP-004 (esperado IMP-002).

## Banco de controle (relatos novos, nunca usados para ajustar a IA)

| Rodada | Caminho certo em 1º | Entre as 3 | Fora do escopo barrados | Extração |
|---|---|---|---|---|
| controle-antes | 27/27 (100%) | 27/27 (100%) | 2/3 (67%) | 11/11 (100%) |
| controle-depois | 27/27 (100%) | 27/27 (100%) | 3/3 (100%) | 11/11 (100%) |

## Erros da IA na rodada depois

| # | Tipo | Setor | Relato | Esperado | Sugestões da IA |
|---|---|---|---|---|---|
| 89 | vago | Marketing | Posso instalar programas por conta própria no computador da escola? | TI-001 | TI-COMP-005, TI-001 |

## Percurso pelos botões (57/57 caminhos até o resumo)

Cada caminho foi percorrido no navegador do início ao resumo, sem enviar, usando o relato claro como descrição. O percurso rodou antes do ajuste da revisão da IA; a seção seguinte confere a revisão final, direto na rota.

- Alertas de incoerência com relato coerente (falso alarme): 2/57 (4%)
- Caminhos em que a IA fez pergunta de complemento: 23/57 (40%)
- Caminhos com dicas antes do envio: 22/57 (39%)

Falsos alarmes:

- IMP-004: Antes de continuar, uma conferência: A necessidade escolhida e lâmpada da estufa, mas a descricao trata de impressora. Quer escolher outro tipo de atendimento?
- TI-CAM-001: Antes de continuar, uma conferência: A necessidade escolhida é de infraestrutura de TI, mas o pedido trata de acesso de terceiros às câmeras. Quer escolher outro tipo de atendimento?

Perguntas feitas pela IA:

- AV-002: Em qual local exato do pátio os equipamentos devem ser montados?
- AV-003: Em qual espaço ou sala do auditório o equipamento será utilizado?
- AV-005: Em qual sala ou local da escola acontecerá a reunião?
- AV-006: Para qual atividade o projetor será utilizado?
- IMP-001: Em qual pasta ou formato você prefere receber os arquivos digitalizados?
- IMP-003: Em qual sala ou setor o notebook será utilizado?
- GOO-001: Qual mensagem de erro aparece quando você tenta compartilhar a agenda?
- GOO-003: Qual mensagem de erro aparece ao tentar adicionar os alunos?
- GOO-004: Você pode verificar se há uma mensagem de erro ou se o ícone de salvamento exibe algum aviso no topo da página?
- GOO-005: Para qual atividade na secretaria você precisará acessar esta pasta?
- GOO-006: Qual ferramenta específica do Google você gostaria de saber como usar?
- GOO-010: Em qual sala os Chromebooks serão utilizados?
- GOO-012: Quais alterações específicas você precisa fazer na página do projeto 'Horta Escolar'?
- TI-001: Qual é a sua dúvida específica sobre o funcionamento do backup?
- TI-002: Poderia informar para qual sistema de reservas você sugere essa melhoria e quais telas deveriam ter o lembrete?
- TI-003: Poderia informar qual é o modelo da TV e o que exatamente precisa ser configurado?
- TI-COMP-006: Em qual sala ou local será realizada a reunião de pais amanhã?
- TI-INT-002: Para qual data você precisa que esta nova seção esteja disponível?
- TI-MENT-002: Qual é a mensagem de erro que aparece ao tentar gerar o PDF?
- TI-MENT-003: Qual é o nome do aluno e qual é a nota correta que deve ser lançada?
- TI-MENT-007: Em qual formato você prefere o relatório e para quando precisa?
- TI-MENT-008: Em qual setor ou perfil o acesso ao relatório de inadimplência deve ser liberado?
- TI-QB-002: Em qual sala ou mesa o computador novo está localizado?

## Revisão da IA conferida direto (final, 57 caminhos)

Mesmo relato claro de cada caminho, enviado direto para `/api/assist` com respostas fictícias válidas.

- Alertas de incoerência (falso alarme): 0/57 (0%)
- Com pergunta de complemento: 16/57 (28%)
- Com dicas antes do envio: 18/57 (32%)

Perguntas:

- AV-002: Em qual local exato do pátio os equipamentos devem ser montados?
- AV-005: Em qual local da escola será realizada a reunião?
- IMP-003: Em qual sala ou setor o notebook será utilizado?
- IMP-004: Em qual sala ou setor a impressora está localizada?
- GOO-006: Qual ferramenta específica do Google você gostaria de saber utilizar?
- GOO-010: Em qual sala ou laboratório os Chromebooks serão utilizados?
- GOO-012: O que exatamente precisa ser alterado ou adicionado nesta página do site?
- TI-001: Qual é a sua principal dúvida sobre o funcionamento do backup dos seus arquivos?
- TI-003: Qual é o modelo da TV e o que exatamente precisa ser configurado nela?
- TI-COMP-006: Em qual sala ou local será realizada a reunião?
- TI-NET-001: O cabo de rede está firmemente conectado tanto no computador quanto na tomada de parede?
- TI-INT-002: Quais documentos e links devem ficar disponíveis nesta nova seção da Intranet?
- TI-MENT-001: Qual é o nome completo e o e-mail institucional da professora?
- TI-MENT-002: Poderia informar qual é a mensagem de erro exata que aparece ao tentar gerar o PDF?
- TI-MENT-007: Para qual turma ou disciplina específica você precisa deste relatório de notas?
- TI-QB-002: Em qual sala ou mesa o novo computador está instalado?
