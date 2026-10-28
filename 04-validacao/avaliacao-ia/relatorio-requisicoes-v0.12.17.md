# Verificação de todas as requisições da IA — 0.12.17

Data: 2026-10-28. Servidor local com a chave do `.env` e o envio ao Google desligado; nenhum chamado criado. Cada caminho foi percorrido como na conversa pelos botões: campos já respondidos (data daqui a 3 dias, 14:00, "Não" no evento, valores de texto fictícios) e o relato **vago** do banco `relatos.json`, que não repete esses dados — é quando a IA mais pergunta. Mais cinco casos-limite vistos na planilha (#014, #020, #021, #022).

## Revisão (`/api/assist`)

| Rodada | Perguntas | Voltam a dado já respondido ou não fazem sentido | Alertas de incoerência |
|---|---|---|---|
| Antes (0.12.16) | 37 em 62 | 12 | 2 (1 falso, em Outros) |
| 1ª instrução nova (rodada interrompida) | 18 em 27 | local perguntado até em Agendas do Google | 0 |
| Depois (0.12.17) | 23 em 62 | 0 | 1 (micro-ondas num pedido de som) |

O que mudou: a IA recebe o valor de data, horário e opções já respondidos (textos livres continuam só pelo rótulo); a instrução proíbe pedir de novo o que já foi respondido, perguntar qual equipamento quando a necessidade já diz e perguntar o setor, e limita a pergunta de local a reservas, instalações e equipamentos; e o servidor descarta a pergunta que ainda volte a um dado respondido (`repeatsAnswered`).

| Caminho | Antes (0.12.16) | 1ª instrução nova | Depois (0.12.17) |
|---|---|---|---|
| AV-001 | Em qual local da escola será realizada a atividade? | Para qual sala ou local será o uso do som? | Em qual sala ou local será realizada a atividade? |
| AV-002 | Para qual atividade no pátio a caixa de som e o microfone serão utilizados? | Em qual local do pátio será utilizado o microfone? | Em qual local do pátio a caixa de som e o microfone devem ser montados? |
| AV-003 | Qual equipamento específico (projetor, caixa de som ou microfone) você precisa? ⚠ _pergunta qual dos três equipamentos, que a necessidade já diz_ | (sem pergunta) | (sem pergunta) |
| AV-004 | Em qual sala ou local o equipamento será utilizado? | Em qual sala ou local será utilizado o equipamento? | Em qual sala ou local o equipamento será utilizado? |
| AV-005 | Em qual sala ou local da escola o microfone será utilizado e para qual atividade? | Em qual sala ou local da escola você precisará do microfone? | Para qual sala ou local você precisa do microfone? |
| AV-006 | Em qual sala de aula o projetor será utilizado? | Em qual sala ou local será utilizado o projetor? | Em qual sala será utilizado o projetor? |
| AV-007 | Em qual sala a TV e o cabo estão localizados? | Em qual sala está acontecendo? | (sem pergunta) |
| IMP-001 | Para qual pasta ou e-mail os arquivos digitalizados devem ser enviados? ⚠ _pede e-mail (a instrução proíbe)_ | Em qual sala ou local a impressora está instalada? | Qual pasta do seu computador deve receber os documentos digitalizados? |
| IMP-002 | (sem pergunta) | Em qual sala está essa impressora? | (sem pergunta) |
| IMP-003 | Qual é o nome ou o patrimônio da impressora que deseja instalar? ⚠ _nome ou patrimônio da impressora, com o modelo já informado_ | Em qual sala ou local a impressora deve ser instalada? | Em qual sala a impressora deve ser instalada? |
| IMP-004 | (sem pergunta) | Em qual sala ou local está essa impressora? | (sem pergunta) |
| IMP-005 | Em qual impressora o problema está acontecendo? | Em qual sala ou local fica esta impressora? | (sem pergunta) |
| IMP-006 | (sem pergunta) | Em qual sala a impressora está localizada? | (sem pergunta) |
| IMP-007 | (sem pergunta) | (sem pergunta) | (sem pergunta) |
| IMP-008 | (sem pergunta) | (sem pergunta) | (sem pergunta) |
| IMP-009 | Em qual pasta ou aplicativo você está tentando localizar o arquivo digitalizado? | Qual é a sala ou o local onde está essa impressora? | (sem pergunta) |
| IMP-010 | Em qual impressora da secretaria será feita a troca do toner? | Em qual sala ou local está a impressora? | (sem pergunta) |
| GOO-001 | Para quais pessoas ou equipes você precisa compartilhar os compromissos da agenda? | Em qual sala ou local você está tentando visualizar ou sincronizar essas agendas? | (sem pergunta) |
| GOO-002 | (sem pergunta) | (sem pergunta) | (sem pergunta) |
| GOO-003 | (sem pergunta) | (sem pergunta) | (sem pergunta) |
| GOO-004 | Qual é o nome do documento ou o link do arquivo? ⚠ _nome do documento já informado_ | Em qual computador ou navegador isso aconteceu? | (sem pergunta) |
| GOO-005 | (sem pergunta) | (sem pergunta) | (sem pergunta) |
| GOO-006 | Qual ferramenta ou recurso específico do Google você gostaria de aprender a usar? | Qual ferramenta do Google você gostaria de saber usar? | Qual ferramenta ou recurso específico do Google você gostaria de saber como usar? |
| GOO-007 | (sem pergunta) | (sem pergunta) | (sem pergunta) |
| GOO-008 | (sem pergunta) | (sem pergunta) | (sem pergunta) |
| GOO-009 | (sem pergunta) | (sem pergunta) | (sem pergunta) |
| GOO-010 | Em qual sala ou local os Chromebooks serão utilizados? | Em qual sala os Chromebooks serão utilizados? | Em qual sala ou local os Chromebooks serão utilizados? |
| GOO-011 | (sem pergunta) | — | (sem pergunta) |
| GOO-012 | (sem pergunta) | — | (sem pergunta) |
| TI-001 | (sem pergunta) | — | (sem pergunta) |
| TI-002 | Poderia detalhar qual melhoria gostaria de sugerir para o processo de pedido de equipamentos? | — | Poderia detalhar qual melhoria você sugere para facilitar o processo de pedido de equipamentos? |
| TI-003 | **Alerta:** A necessidade escolhida não corresponde ao problema relatado com a TV. (sem pergunta) ⚠ _alerta falso: TV é assunto de TI e o caminho é Outros_ | — | Poderia informar qual canal ou entrada de vídeo a TV está tentando sintonizar? |
| TI-COMP-001 | Qual é o modelo ou marca do headset que está apresentando falha no microfone? | — | O microfone está devidamente conectado e ativado nas configurações de som do computador? |
| TI-COMP-002 | Qual é a mensagem de erro que aparece ao tentar ler o disco? | — | Qual é a mensagem de erro que aparece ao tentar ler o disco? |
| TI-COMP-003 | (sem pergunta) | — | (sem pergunta) |
| TI-COMP-004 | Em quais aplicativos ou sistemas a lentidão é mais frequente? | — | Quais programas ou telas ficam mais lentos durante o uso? |
| TI-COMP-005 | Qual é o nome do programa que está apresentando o erro ao abrir? ⚠ _repete Nome do programa_ | — | (sem pergunta) |
| TI-COMP-006 | Para qual atividade e em qual local o notebook será utilizado? | — | Em qual sala ou local os notebooks serão utilizados? |
| TI-COMP-007 | (sem pergunta) | — | (sem pergunta) |
| TI-COMP-008 | (sem pergunta) | — | (sem pergunta) |
| TI-NET-001 | (sem pergunta) | — | (sem pergunta) |
| TI-NET-002 | Para qual dia e horário o visitante precisará do acesso? ⚠ _repete Período solicitado_ | — | (sem pergunta) |
| TI-NET-003 | Em qual ambiente da secretaria a conexão está instável e se isso ocorre em mais de um aparelho? | — | Em qual sala ou local da secretaria a instabilidade do Wi-Fi está ocorrendo? |
| TI-INT-001 | (sem pergunta) | — | (sem pergunta) |
| TI-INT-002 | (sem pergunta) | — | (sem pergunta) |
| TI-INT-003 | Quais melhorias específicas você sugere para facilitar a navegação no portal? | — | (sem pergunta) |
| TI-MENT-001 | (sem pergunta) | — | (sem pergunta) |
| TI-MENT-002 | Qual é o nome exato do relatório que está saindo em branco? ⚠ _nome do relatório já informado_ | — | (sem pergunta) |
| TI-MENT-003 | Qual é a nota correta e o motivo da alteração? | — | Qual é a nota correta que deve ser lançada? |
| TI-MENT-004 | Qual é a mensagem de erro que aparece ao tentar fechar o diário? | — | Qual mensagem de erro aparece ao tentar fechar o diário? |
| TI-MENT-005 | Em qual tela ou relatório o sistema cai e qual a mensagem exata de erro que aparece? ⚠ _repete Mensagem de erro_ | — | (sem pergunta) |
| TI-MENT-006 | (sem pergunta) | — | (sem pergunta) |
| TI-MENT-007 | Quais dados específicos e filtros devem constar nesse relatório? | — | Quais campos ou informações específicas devem constar nesse relatório? |
| TI-MENT-008 | Qual é o nome exato do relatório que você precisa acessar? ⚠ _nome do relatório já informado_ | — | (sem pergunta) |
| TI-QB-001 | Qual é a mensagem de erro que aparece ao tentar abrir o arquivo no QuickBooks? ⚠ _repete Mensagem de erro_ | — | (sem pergunta) |
| TI-QB-002 | Em qual sala ou local o novo computador está instalado? | — | (sem pergunta) |
| TI-CAM-001 | (sem pergunta) | — | (sem pergunta) |
| AV-003 relato sem sentido | Poderia especificar qual equipamento de som ou projeção você precisa e em qual sala será utilizado? ⚠ _volta a perguntar qual equipamento_ | — | Em qual sala ou local o equipamento será utilizado? |
| AV-003 item de outra área | **Alerta:** A descrição do item difere completamente do equipamento de áudio ou vídeo selecionado. (sem pergunta) | — | **Alerta:** A descrição menciona micro-ondas, que não é um equipamento audiovisual. (sem pergunta) |
| IMP-003 relato de uma palavra | Em qual sala ou setor a impressora deve ser instalada? ⚠ _repete Setor_ | — | Em qual sala ou local a impressora deve ser instalada? |
| AV-002 evento sem roteiro | Em qual local da escola será utilizada a caixa de som e o microfone? | — | Em qual sala ou local a caixa de som e o microfone serão utilizados? |
| GOO-010 reserva com período | Em qual sala os Chromebooks serão utilizados? | — | Em qual sala ou local os Chromebooks serão utilizados? |

## Assunto (`/api/subject`)

O Pages usava uma instrução mais curta que o servidor local; agora as duas usam `SUBJECT_INSTRUCTION`, que também recebe o tipo do pedido. A coluna "antes" é a instrução unificada sem as regras de resumo e de tipo.

| Caminho | Antes | Depois |
|---|---|---|
| AV-001 | Solicitação de Caixa de Som | Solicitação de caixa de som para atividade com alunos |
| AV-002 | Manutenção em Caixa de Som e Microfone | Solicitação de Caixa de Som e Microfone para evento no pátio |
| AV-003 | Caixa de Som, Microfone e Projetor | Reserva de Caixa de Som, Microfone e Projetor para palestra |
| AV-004 | Solicitação de Caixa de Som e Projetor | Reserva de Caixa de Som e Projetor |
| AV-005 | Solicitação de microfone para reuniões | Solicitação de microfone para reuniões |
| AV-006 | Projetor para Secretaria | Solicitação de projetor para slides |
| AV-007 | Troca de cabo HDMI | Imagem da TV da sala não aparece com o notebook |
| IMP-001 | Impressora - Configurar Scanner | Solicitação para configurar scanner da impressora |
| IMP-002 | Grampo da Impressora | Grampo da impressora com defeito |
| IMP-003 | Instalar Impressora | Instalar impressora no computador da sala |
| IMP-004 | Impressora: Lâmpada da Estufa | Troca da peça que aquece o papel na impressora |
| IMP-005 | Impressora manchando folhas | Impressora manchando folhas |
| IMP-006 | Impressora: Não imprime | Documento na fila da impressora e não sai |
| IMP-007 | Impressora não liga | Impressora não liga |
| IMP-008 | Papel Atolado na Impressora | Papel atolado na impressora |
| IMP-009 | Impressora: Scanner não funciona | Scanner da impressora não envia documentos para o computador |
| IMP-010 | Solicitação de Toner / Tinta Preto | Solicitação de Toner Preto para Impressora |
| GOO-001 | Problema com compartilhamento de Agendas no Google | Compromissos da agenda do Google não aparecem para a equipe |
| GOO-002 | Google Apresentações - Slides sumidos | Slides do Google Apresentações sumiram |
| GOO-003 | Google Classroom | Alunos não veem atividade postada no Google Classroom |
| GOO-004 | Documentos Google: Texto não salvo | Documentos do Google não salvou o texto |
| GOO-005 | Google Drive | Arquivos sumiram do Google Drive |
| GOO-006 | Dúvidas sobre o Google | Dúvidas sobre o uso do Google na escola |
| GOO-007 | Gmail: Mensagens não chegam na caixa de entrada | Mensagens não chegam na caixa de entrada do Gmail |
| GOO-008 | Grupos do Google: não recebo e-mails da equipe | Não recebo os e-mails enviados para o grupo da equipe |
| GOO-009 | Problema no somatório das Planilhas do Google | Planilha do Google parou de somar |
| GOO-010 | Reserva de Chromebook | Solicitação de reserva de Chromebook |
| GOO-011 | Resetar senha Google | Solicitação de reset de senha da conta Google |
| GOO-012 | Problema no Google Sites do projeto | Site do projeto da turma no Google Sites saiu do ar |
| TI-001 | Dúvidas sobre instalação de programas | Dúvida sobre instalação de programas no computador |
| TI-002 | Sugestão de melhoria no pedido de equipamento | Sugestão de melhoria para solicitação de equipamentos |
| TI-003 | Outros na Secretaria | TV da recepção sem sinal de canais |
| TI-COMP-001 | Problema no headset ou fone de ouvido | Headset não funciona nas chamadas de vídeo |
| TI-COMP-002 | COMPUTADOR: Leitor de CD/DVD não lê disco | Computador não lê o disco |
| TI-COMP-003 | Computador não liga | Computador da Secretaria não liga |
| TI-COMP-004 | (IA indisponível) | Computador da secretaria com lentidão e travamentos |
| TI-COMP-005 | Problema com programa | Programa parou de abrir |
| TI-COMP-006 | Reserva de Notebook | Reserva de Notebook para a Secretaria |
| TI-COMP-007 | Troca de Mouse | Computador com problema no mouse |
| TI-COMP-008 | Troca de Teclado de Computador | Teclado com falha nas teclas |
| TI-NET-001 | Computador não está conectado à rede | Computador sem rede e sem acesso à internet |
| TI-NET-002 | INTERNET: Criar Login de acesso Internet | Criação de login de acesso à internet para visitante |
| TI-NET-003 | Problemas com Wi-Fi na Secretaria | Wi-Fi da secretaria instável |
| TI-INT-001 | Atualização da Intranet | Atualização de informação desatualizada no portal interno |
| TI-INT-002 | Solicitação na Intranet | Solicitação de espaço na Intranet para formulários |
| TI-INT-003 | Sugestão para a Intranet | Sugestão de melhoria na navegação da Intranet |
| TI-MENT-001 | Criação de Login no Mentor Web | Criação de login no Mentor Web |
| TI-MENT-002 | Erro no relatório do Mentor Web | Relatório em branco no Mentor Web |
| TI-MENT-003 | Alteração de notas no Mentor Web | Correção de nota lançada errada no Mentor Web |
| TI-MENT-004 | MENTOR WEB - Encerramento de diário | Solicitação de encerramento de diário no Mentor Web |
| TI-MENT-005 | Erro no Mentor Web e desconexão | Erro e desconexão no Mentor Web |
| TI-MENT-006 | Remanejamento de aluno no Mentor Web | Remanejamento de aluno no Mentor Web |
| TI-MENT-007 | Solicitação de Relatório Mentor Web | Solicitação de relatório de alunos no Mentor Web |
| TI-MENT-008 | (IA indisponível) | Solicitação de acesso a relatório no Mentor Web |
| TI-QB-001 | Erro no sistema QUICKBOOKS | Erro ao abrir arquivo da empresa no QuickBooks |
| TI-QB-002 | Instalação do QuickBooks | Instalação do QuickBooks no computador novo |
| TI-CAM-001 | Acesso às Câmeras | Solicitação de acesso às câmeras para os pais |

## Identificação e extração (`/api/analyze`, `/api/extract`)

Instruções sem mudança desde a 0.11.4 (57/57 caminhos naquela avaliação). Conferência de hoje com o relato claro: identificação certa na 1ª sugestão em 28 de 28 caminhos; extração em 27 caminhos, com datas relativas resolvidas a partir de 28/10 (quarta): amanhã → 29/10, sexta → 30/10, dia 20 → 20/11, terça → 03/11. A rodada parou nesse ponto para poupar a cota diária e refazer a revisão.

| Caminho | Relato | Extraído |
|---|---|---|
| AV-001 | Preciso de uma caixa de som na quadra amanhã às 10h para a aula de educação física. | {"data":"2026-10-29","horario":"10:00"} |
| AV-002 | Preciso de caixa de som e microfone no pátio na sexta-feira às 8h para a abertura da gincana, que é um evento. | {"data":"2026-10-30","horario":"08:00","evento":"Sim"} |
| AV-003 | Para a palestra no auditório no dia 20, às 19h, vou precisar de projetor, microfone e caixa de som. É um evento com os pais. | {"data":"2026-11-20","horario":"19:00","evento":"Sim"} |
| AV-004 | Preciso de projetor e caixa de som na sala 12 amanhã às 13h30 para passar um filme para a turma. | {"data":"2026-10-29","horario":"13:30"} |
| AV-005 | Preciso de um microfone sem fio para a reunião de professores na sexta às 17h. | {"data":"2026-10-30","horario":"17:00"} |
| AV-006 | Preciso reservar um projetor para a sala 8 na terça-feira às 10h para apresentar slides. | {"data":"2026-11-03","horario":"10:00"} |
| AV-007 | O cabo HDMI da sala 4 está com mau contato e a imagem do projetor fica piscando, precisa trocar. | {} |
| IMP-001 | Preciso configurar o scanner da impressora Brother DCP-L5652 para digitalizar direto no meu computador. | {"modelo":"Brother DCP-L5652"} |
| IMP-002 | A impressora Ricoh do 2º andar está com o grampo travado e não grampeia as provas. | {"modelo":"Ricoh do 2º andar"} |
| IMP-003 | Preciso instalar a impressora HP LaserJet M428 no meu notebook novo. | {"modelo":"HP LaserJet M428"} |
| IMP-004 | A impressora Kyocera está mostrando erro na lâmpada da estufa (fusor) e parou de imprimir. | {"modelo":"Kyocera","erro-apresentado":"erro na lâmpada da estufa (fusor)"} |
| IMP-005 | A impressora Samsung da secretaria está manchando todas as folhas com uma faixa preta. | {"modelo":"Samsung"} |
| IMP-006 | Mando imprimir e nada sai na impressora HP da coordenação; aparece a mensagem 'impressora offline'. | {"modelo":"HP","mensagem-de-erro":"impressora offline"} |
| IMP-007 | A impressora Epson L3250 da portaria não liga, nenhuma luz acende. | {"modelo":"Epson L3250"} |
| IMP-008 | Papel preso na impressora Brother da sala dos professores; o visor mostra 'Atolamento bandeja 2'. | {"modelo":"Brother","mensagem-do-visor":"Atolamento bandeja 2"} |
| IMP-009 | O scanner da multifuncional Canon não digitaliza, aparece 'erro de comunicação com o computador'. | {"modelo":"Canon","erro":"erro de comunicação com o computador"} |
| IMP-010 | Preciso de toner preto para a impressora HP M428 da secretaria. | {"cor":"Preto","modelo":"HP M428"} |
| GOO-001 | Não consigo compartilhar minha agenda do Google com a coordenação. | {} |
| GOO-002 | Minha apresentação do Google Slides 'Feira de Ciências' não abre, fica carregando. | {"link-ou-nome-do-arquivo":"Feira de Ciências"} |
| GOO-003 | Não consigo adicionar alunos na turma 7º B do Google Classroom. | {"turma":"7º B"} |
| GOO-004 | O Google Docs 'Ata de reunião' não salva as alterações que faço. | {"arquivo":"Ata de reunião"} |
| GOO-005 | Preciso de acesso à pasta 'Planejamento 2026' no Google Drive da coordenação. | {"link-ou-nome-do-recurso":"Planejamento 2026"} |
| GOO-006 | Tenho uma dúvida sobre como usar as ferramentas do Google da escola. | {} |
| GOO-007 | Meu Gmail institucional não está recebendo e-mails desde ontem. | {"erro-apresentado":"não está recebendo e-mails desde ontem"} |
| GOO-008 | Preciso ser incluída no grupo de e-mail professores@ do Google Grupos. | {"grupo":"professores@"} |
| GOO-009 | A planilha 'Controle de frequência' no Google Sheets está com as fórmulas quebradas. | {"link-ou-nome-da-planilha":"Controle de frequência"} |
| GOO-010 | Quero reservar 30 Chromebooks para o 6º ano na quinta-feira, no 3º e 4º horário. | {"data":"2026-10-29","horario-periodo":"3º e 4º horário"} |
