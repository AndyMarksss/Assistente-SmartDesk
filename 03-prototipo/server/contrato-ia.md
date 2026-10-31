# Contrato da IA

O que entra e o que sai do modelo (Gemini) em cada rota. O documento começou na 0.5.0 e ganhou uma seção a cada mudança, em ordem: quando duas seções divergem, vale a mais recente. As instruções ficam em `ai-provider.cjs` e são copiadas para o Apps Script pelo build.

## Resumo da versão atual (0.13.1; a IA é a mesma desde a 0.12.18)

| Rota | Quando | A IA recebe | A IA devolve |
|---|---|---|---|
| `POST /api/analyze` | Relato livre ("Descrever com minhas palavras") | Setor, relato e os caminhos permitidos ao setor (ID, área e necessidade) | Até 3 IDs dessa lista; fora dela, vale a base local |
| `POST /api/extract` | Depois de confirmar o caminho do relato | Data de hoje, setor, área, necessidade, campos que podem ser preenchidos, relato, `perguntaDoFluxo` e `dicasPermitidas` | Valores dos campos, intenção (defeito ou item novo), entendimento, relato completo, outro pedido e até 3 dicas |
| `POST /api/assist` | Revisão antes do envio | Setor, área, necessidade, tipo, descrição, respostas de opções, `jaInformado` e `dicasPermitidas` | Coerência e motivo, no máximo uma pergunta, ajuda e até 3 dicas |
| `POST /api/subject` | Antes do envio | Setor, área, necessidade, tipo, descrição e respostas de opções | Assunto de até 80 caracteres (fica só na planilha) |

- **Nunca vão ao modelo:** nome, e-mail, textos livres dos campos e anexos. Dados pessoais que a própria pessoa escrever no relato vão junto com ele; os testes usam dados fictícios.
- **Tudo o que volta é conferido no servidor** (`safeExtract`, `safeAssist` e `safeSubject`, em `ticket-validation.cjs`) e passa pela confirmação da pessoa. Sem IA, o chat segue pelos botões e pelas perguntas fixas.
- `POST /api/next-prompt` e `POST /api/drafts` vêm da 0.5.0 e só existem no servidor local.

## 0.5.0 — chat guiado

- Fonte de opções: Matriz Mestre fornecida pelo usuário, leitura em 2026-10-01. 25 setores, quatro áreas, 57 caminhos e dez regras cadastradas. A tabela completa é preservada na exportação; o MVP aplica as ramificações, dados necessários e restrições de setor. Triagem automática e avaliação posterior continuam pendentes.
- `POST /api/next-prompt`: recebe setor e ID permitido; o servidor fornece à IA somente área e necessidade oficiais. Retorna uma frase curta para pedir a descrição, ou uma frase predefinida se a IA falhar.
- `POST /api/subject`: recebe setor, ID, respostas estruturadas e descrição. Valida a seleção e os campos. Encaminha à IA a descrição como dado, rótulos oficiais e respostas de opções fechadas. Retorna `subject`, `source`, `fallback` e o ID selecionado pelo usuário. Assunto validado até 80 caracteres; sem alteração da classificação e da descrição.
- Não envia nomes, e-mails de campos, textos complementares ou anexos à IA. Dados pessoais que o próprio usuário incluir na descrição serão transmitidos com ela; usar dados fictícios nos testes.
- Não há conversa livre, ferramentas, execução de comandos, envio de e-mails nem instruções do usuário ao modelo. A instrução do servidor trata a descrição como conteúdo a resumir. Saídas passam por validação e entram na interface com `textContent`. A qualidade semântica do assunto ainda exige revisão pelo usuário.
- `POST /api/drafts`: salva o chamado revisado e anexos localmente, sem consultar IA e sem envio externo. Seleção, campos e anexos são verificados no servidor; arquivos têm nomes internos independentes do nome enviado. O texto original da descrição fica em `chamado.json`.
- O adaptador antigo de classificação permanece como código histórico compatível, mas não é carregado nem utilizado pelo novo percurso da interface.
- Chave lida apenas pelo servidor, nunca entregue à página. Manter o modelo definido na configuração e o projeto gratuito sem faturamento. Nenhuma tentativa automática em modelos alternativos.

## Atualização 0.6.0

O assunto não aparece na conversa ou no cartão de revisão; é enviado ao receptor com o chamado. Descrição continua literal. Local retirado da base operacional por instrução direta. `POST /api/tickets` valida campos/anexos e envia pelo servidor ao Apps Script; token apenas no corpo desse pedido servidor-servidor, nunca na página. `google-storage.cjs` exige URL HTTPS de implantação /exec. Confirmação de envio somente com resposta válida contendo ID e número do chamado; indisponibilidade conserva os dados no cliente. Rascunho local continua como API histórica, não como ação do novo fluxo.

## Atualização 0.10.0

- `POST /api/analyze`: atalho opcional "Descrever com minhas palavras", ao lado das escolhas guiadas. Recebe relato e setor; a IA só pode devolver IDs da lista permitida ao setor (no máximo três), e qualquer ID fora dela faz cair na base local de palavras-chave. O cliente mostra os caminhos como sugestão e a pessoa confirma ou escolhe pelas opções. O fluxo principal continua sendo por escolhas.
- `POST /api/assist`: depois da descrição, recebe seleção, respostas e descrição validadas. A IA devolve no máximo uma pergunta de complemento e até três dicas. A pergunta é descartada se pedir senha, CPF, telefone ou contiver link. As dicas só existem nos caminhos de `selfHelpEligible` (defeitos que a própria pessoa pode contornar) e nunca em reservas, compras, acessos, senhas ou instalações. A resposta ao complemento é anexada à descrição como "Complemento:"; a descrição original não é reescrita.
- Os dados enviados ao modelo são os mesmos do assunto: setor, área, necessidade, descrição e respostas de opções fechadas. Nome, e-mail, textos livres dos campos e anexos continuam fora.
- Sem IA (chave ausente, falha ou cota atingida), o atendimento segue sem pergunta nem dicas, e o atalho de relato usa a base local. Nada é inventado no lugar da IA.
- Saídas da IA são marcadas na conversa com o selo "IA" e entram na página por `textContent`.

## Atualização 0.11.0

- `POST /api/extract`: recebe setor, ID confirmado e relato. A IA recebe a data de hoje com o dia da semana e a lista de campos extraíveis (rótulo, tipo e opções) e devolve `campos` [{id, valor}] e `intencao`. O servidor descarta valores fora do formato (data passada ou inexistente, horário fora de HH:MM, opção inexistente, link inválido) e campos condicionais cuja condição não foi atendida. Nunca são extraídos computador, conta, e-mails, usuário, aluno, responsável ou contatos. A pessoa confirma tudo no cartão de rascunho.
- `POST /api/assist`: passa a receber o tipo do pedido (problema, solicitação, dúvida, outro) e os rótulos já respondidos. Devolve `coerente`/`motivo` (alerta quando o relato não combina com o tipo), `pergunta` e `ajuda` (onde achar a resposta, até 180 caracteres) e `dicas` "para tentar antes de enviar o chamado". A instrução proíbe sair do escopo do pedido, repetir dados informados e dizer que a equipe já está a caminho.
- As perguntas da IA e as respostas da pessoa entram ao fim da descrição, em bloco "Perguntas do assistente"; o relato original continua literal.
- `POST /api/track` e `POST /api/selfhelp` não usam IA.

## Atualização 0.11.3

- Avaliação técnica com relatos fictícios em `04-validacao/avaliacao-ia` (banco de 186 relatos para ajuste, banco de controle de 30 relatos nunca usados para ajustar, roteiro que percorre os 57 caminhos pelos botões e relatório).
- `POST /api/analyze`: a instrução (`ANALYZE_INSTRUCTION`) e as categorias (`analyzeCategories`) ficam em `server/ai-provider.cjs` e são copiadas para o Apps Script pelo build (`SMARTDESK_ANALYZE_INSTRUCTION` e `analyzeCategories_`), sem texto duplicado. As categorias continuam só com ID, área e necessidade: uma tentativa de enviar também as palavras-chave da matriz piorou Audiovisual, porque os seis caminhos repetem as mesmas palavras, e foi descartada. A instrução traz um glossário dos sistemas da escola (Mentor Web, QuickBooks, Intranet, Google Grupos, estufa da impressora), prefere o caminho específico ao genérico e devolve lista vazia para assuntos que não são de TI ou relatos sem pedido. Continuam valendo: só IDs da lista do setor, no máximo três, relato tratado como dado.
- `POST /api/extract`: campo de opção só é preenchido quando a pessoa diz a resposta com todas as letras; aula, reunião, filme ou apresentação não bastam para marcar "É para um evento?".
- Nenhum dado novo é enviado ao modelo; só o texto da instrução mudou.

## Atualização 0.11.4

- O glossário dos sistemas da escola (`GLOSSARY` em `ai-provider.cjs`) vale na identificação e na revisão. Na revisão, alerta de incoerência só quando a descrição trata claramente de outro equipamento, sistema ou serviço; mesmo item para outra pessoa é coerente; na dúvida, coerente. Motivo em português correto, sem nomes de campos.
- Extração: o cuidado extra vale só para perguntas de Sim/Não (como "É para um evento?"); campos de texto são preenchidos sempre que o relato traz a informação.
- `safeAssist` descarta perguntas que pedem nome de pessoas (aluno, responsável, professor, funcionário…) ou endereço de e-mail, além de senha, CPF e telefone.

## Atualização 0.12.17

- `POST /api/assist`: `jaInformado` passa a levar o valor dos campos de data (dd/mm/aaaa e dia da semana), horário e opção, por exemplo "Data do atendimento: 30/10/2026 (sexta-feira)" e "Horário do atendimento: 14:00". Dos campos de texto livre continua indo só o rótulo, com "(respondido)"; link combinado para depois vai como "a pessoa vai enviar depois". Nome, e-mail, textos livres e anexos continuam fora.
- A instrução proíbe pedir de novo, com outras palavras ou mais exatidão, o que está em `jaInformado` (horário exato ou de cada ambiente, nome do programa, do arquivo ou do relatório, modelo, identificação do computador, mensagem de erro), perguntar qual equipamento a pessoa quer quando a necessidade já diz e perguntar o setor (já conhecido; para saber onde, a sala ou o local). Em Outros, Dúvidas e Sugestão, qualquer assunto de TI é coerente.
- Rede de segurança no servidor e no Apps Script (`repeatsAnswered` em `ticket-validation.cjs`, gerado para `PortalShared.gs`): a pergunta que volta a um campo já respondido é descartada — data (dia, data, quando), horário ou período (exceto até que horas, término ou duração), modelo, identificação, mensagem de erro, programa, relatório, arquivo/link, turma, disciplina, grupo, dispositivo, rede, usuário, perfil, página/seção, finalidade, sistema/processo, evento, tipo de conexão, cor e roteiro; também "qual é o seu setor" e, no Audiovisual, "qual equipamento". Verificação em `04-validacao/avaliacao-ia` (`verificar-requisicoes.cjs`).
- `POST /api/subject`: uma só instrução (`SUBJECT_INSTRUCTION`) no servidor local e no Apps Script — antes o Pages usava um texto mais curto. O modelo recebe também o tipo do pedido (problema ou solicitação, o mesmo da revisão); o assunto sai em português com acentos, resume o que acontece ou o que é pedido (não só o nome da área, da necessidade ou do setor), não deixa de fora itens da necessidade e, em solicitação, não fala em manutenção, defeito ou conserto. Nenhum dado pessoal novo.
- A frase "pergunte a sala ou o local" foi restrita a reservas, instalações e equipamentos: na primeira tentativa a IA passou a perguntar o local até em Agendas do Google.

## Atualização 0.12.18

- `POST /api/extract` é chamado em todos os caminhos do relato livre, mesmo sem campos a preencher, e devolve, além de `answers` e `intent`:
  - `understanding`: uma frase que começa com "Você" e diz o que a pessoa precisa nesta necessidade, com os dados que ela deu. Aparece no rascunho como "Entendi: …". O servidor limpa marcação, recusa links e corta em 200 caracteres.
  - `complete`: se o relato já responde à pergunta de descrição do caminho pelos botões (`conversationCopy.flowQuestion`, enviada ao modelo como `perguntaDoFluxo`; nos periféricos, a de item novo). Só conta o essencial: o que vem depois de "se puder" ou "por exemplo" é opcional, e na dúvida o relato conta como completo. Quando é `false` (ou a IA não respondeu), o chat faz a mesma pergunta dos botões como complemento, com "Já contei tudo" para pular. A pergunta é fixa, não escrita pela IA; a regra de no máximo uma pergunta da IA continua valendo.
  - `otherRequest`: o relato traz outro pedido de TI que precisaria de outro chamado (equipamentos de Audiovisual pedidos juntos não contam). O chat avisa no rascunho e, depois do envio, oferece "Abrir o outro pedido que você contou" com o mesmo relato.
  - `tips`: até 3 passos seguros (a mesma regra `TIPS_RULE` da revisão), só nos caminhos de `selfHelpEligible` e, nos periféricos, só quando a intenção é defeito. Aparecem logo depois de confirmar o rascunho, antes dos dados; se resolver, nada é preenchido, e a revisão não repete as dicas.
- Dados novos enviados ao modelo: só textos da matriz e do chat (`perguntaDoFluxo`) e `dicasPermitidas`. Nome, e-mail, textos livres dos campos e anexos continuam fora.
- `safeExtract` ganhou três redes de segurança (recebe o relato):
  - "É para um evento?" só é preenchido quando o relato fala em evento. A verificação pegou "Não" para "aula de educação física".
  - O horário só é preenchido quando o relato diz a hora. A verificação pegou 07:00 para "na primeira aula".
  - Um horário de hoje que já passou é descartado.
- `POST /api/assist`: o tipo do pedido de "Dúvidas" do Google (GOO-006) passou a ser "dúvida", como o TI-001.
- Avaliação em `04-validacao/avaliacao-ia`, nos 57 relatos claros:
  - extração de 80 de 80 campos na 1ª rodada e de 79 de 80 na final (0.11.4: 79 de 80);
  - as invenções vistas (evento e horário) são descartadas pelas redes acima;
  - resultados em `resultados-extracao-0-12-18.json` e `resultados-extracao-0-12-18-final.json`.
