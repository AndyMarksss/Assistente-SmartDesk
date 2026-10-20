# Registro de decisões

Use este arquivo para registrar escolhas feitas, o motivo e o efeito sobre o MVP.

## 2026-09-30 — Organização do projeto

- Status: implementada.
- Decisão: separar planejamento, matriz e regras, protótipo, validação, evidências, documentação, pitch e referências.
- Motivo: priorizar a parte prática e preservar material para a entrega acadêmica.
- Efeito: código em 03-prototipo/src; evidências em 05-evidencias; resultados em 04-validacao/resultados.
- Origem: solicitação atual do usuário.
- Preservação: a inspeção inicial encontrou a pasta vazia; nenhum material existente foi movido ou apagado.

## Modelo para novas decisões

### D___ — [Título]

- Data:
- Status: proposta / aprovada / implementada / substituída.
- Problema ou pergunta:
- Opções consideradas:
- Decisão:
- Justificativa:
- Impacto no fluxo, regras ou validação:
- Fonte ou evidência:
- Pendências:

## 2026-09-30 — Primeiro percurso do MVP

- Status: implementado na versão 0.1.0.
- Escopo: entrada, análise e classificação, com confirmação, correção e edição do relato.
- Organização: index.html na raiz de 03-prototipo; CSS e JavaScript separados em assets. A pasta src anterior foi preservada. Esta escolha substitui a localização inicial em src.
- Base parcial de demonstração: 14 necessidades; exemplos de setores com campo livre. Importação da matriz e dos setores oficiais ainda pendente.
- Motivo: seguir o desenvolvimento por etapas definido no planejamento, sem inventar os dados ausentes da planilha.
- Evidências: EVID-004 e EVID-005; verificação técnica em 03-prototipo/verificacao-v0.1.0.md. Nenhuma sessão com usuário realizada nesta etapa.

## 2026-10-01 — Experiência conversacional e IA

- Origem: correção direta do usuário; a experiência desejada é chat com escolhas padronizadas e campo de texto liberado quando necessário.
- Status: chat implementado na versão 0.2.0; escolha e conexão do serviço de IA pendentes.
- A decisão substitui a interface de formulário da versão 0.1.0, preservada no histórico.
- Nome e e-mail passam a ser coletados uma pergunta por vez, após o entendimento inicial.
- O usuário escolheu decidir o serviço de IA depois. Adaptador separado e desativado; a interface identifica a análise por base local.
- Matriz oficial e setores completos permanecem pendentes de incorporação.
- Evidências: EVID-006, EVID-007 e EVID-008; não representam validação com usuários.

## 2026-10-01 — Versão acadêmica, temas e Gemini

Origem: instrução direta do usuário. Implementados Font Awesome e alternância claro/escuro; primeiro contato pessoal, perguntando se deseja começar e como chamá-lo. Empresas do trabalho retiradas da experiência acadêmica. Organizações ficam como requisito futuro, com dados originais preservados nas versões anteriores.

A preferência passa a ser Gemini/Google AI Studio, substituindo o adiamento anterior. Integração implementada; ativação e teste real pendentes de chave local. Não há comprovação de IA real nas evidências desta versão. Nome/e-mail não são enviados ao Google; relato/setor são enviados quando a integração está configurada. Modelo padrão gemini-2.5-flash-lite, sem troca automática ou ativação de faturamento. A gratuidade depende das cotas e modalidade do projeto no Google.

Boas-vindas → iniciar/como funciona → nome/apelido → setor de exemplo → relato → análise/confirmar/corrigir → local → e-mail para resumo → revisar resumo.

## 2026-10-01 — Refinamento visual

Origem: usuário rejeitou o verde e pediu uma aparência bonita, elegante, delicada, fofa e profissional. Implementada identidade lavanda/ameixa, rosa discreto, cartões suaves, botões arredondados, robô e hierarquia mais clara, mantendo o chat guiado e bom contraste.

O usuário inseriu sua chave localmente. Servidor reiniciado; credencial não exibida ou arquivada. O modelo gemini-2.5-flash-lite não aceita novos usuários conforme resposta 404 do Google. Recomendação do serviço: gemini-3.5-flash-lite, com modalidade gratuita na tabela oficial consultada em 2026-10-01. Atualização/teste pendentes de confirmação da modalidade do projeto, após bloqueio automático por possível custo. Não registrar o fallback como análise real de IA.

## 2026-10-01 — Conexão Gemini concluída

O usuário confirmou explicitamente Free tier sem faturamento. Com essa confirmação e a tabela oficial mostrando entrada/saída gratuitas nessa modalidade, a atualização foi autorizada pela revisão automática. Modelo atualizado para gemini-3.5-flash-lite, chave preservada. Resposta real 200 com printer-paper, e chat mostrou Gemini · análise com IA e Impressora / Papel atolado. EVID-015 registrada; próximo número EVID-016. 21 testes simulados repetidos e aprovados após a atualização. A interrupção e pendência anteriores estão resolvidas; não houve ativação de faturamento ou mudança automática de modelo.

Referência: [preços oficiais](https://ai.google.dev/gemini-api/docs/pricing#gemini-3.5-flash-lite).

## 2026-10-01 — Fluxo por escolhas e papel restrito da IA

Origem: instrução direta do usuário. Selecionar setor e uma das quatro áreas antes de descrever. Continuar pelas opções e campos da matriz, adicionar anexo após descrição e pedir à IA um assunto curto. A descrição é preservada como texto do chamado; não há chat livre com o modelo.

Matriz acessada em modo de leitura: 25 setores, 57 classificações, dez regras, 11 cenários e fluxo de telas; resultados de validação não preenchidos. O fluxo antigo baseado em classificação automática fica como histórico. Não afirmar implementação de triagem/resolução e avaliação, que continuam futuras.

Rascunhos e anexos são locais, sob server/data/rascunhos, sem publicação ou envio para o suporte. E-mails e demais campos pessoais não entram no pedido ao Gemini; o texto da descrição entra, por isso demonstrações devem usar conteúdo fictício.

## 2026-10-01 — Ajustes por retorno do usuário

Usar mensagens uma por vez, nome em negrito, seletor de setor destacado e texto pausado nas escolhas. Não sugerir uma área pelo preenchimento do primeiro botão. Voltar uma etapa acima das opções, sem confirmação extra. Local retirado porque o setor atende ao MVP; essa instrução prevalece sobre a matriz. Assunto oculto ao usuário e mantido internamente para a planilha. Revisar antes de enviar, sem etapa de confirmar assunto.

Recebimento planejado: Apps Script cria planilha separada SmartDesk — Chamados e pasta privada SmartDesk — Anexos, sem alterar a matriz. ID sequencial #001 etc., dados em uma linha, links de anexos. Idempotência e trava evitam repetição por tentativa e colisões. Publicação/autorizações ainda dependem da conta do usuário; testes desta sessão foram simulados, sem criar chamados no Google.

## 2026-10-14 — 0.10.0: atmosfera e IA no fluxo

- Origem: instrução direta do usuário (mais profundidade, efeitos, animações, hover, vidro e elementos; melhor uso da IA e do fluxo até a abertura do chamado).
- Decisão: camada visual própria (atmosphere.css) sobre as existentes, sem reescrever o CSS anterior. IA em três pontos com confirmação humana: sugestão de caminho (atalho opcional ao lado das escolhas), uma pergunta de complemento e dicas seguras em defeitos, com saída "Resolveu!" sem envio.
- Justificativa: dar valor visível à IA sem abrir conversa livre nem reclassificar sozinha; as escolhas da matriz continuam sendo o caminho principal.
- Segurança: cotas por sessão e por dia, limite de anexos e checagem de conteúdo na avaliação pública, que estava sem limite.
- Limites: as dicas e perguntas são sugestões do modelo e não foram avaliadas com usuários; nenhum resultado de validação foi produzido.

## 2026-10-14 — 0.11.0: fluxos revisados

- Origem: teste do próprio usuário na 0.10.x, com capturas e pedido de "cobrir todos os furos" e evitar solicitações erradas.
- Decisão: a IA passa a montar o rascunho (tipo + dados já ditos) para confirmação, em vez de só sugerir um caminho; checagem de coerência entre relato e tipo escolhido; tipo do pedido (problema, solicitação, dúvida, outro) orienta a IA; dados nunca extraídos pela IA definidos no servidor.
- Acompanhamento: número + e-mail da abertura, devolvendo só a etapa. Escolhido por não exigir login e não expor conteúdo do chamado.
- Autoatendimento: registro anônimo (setor, caminho, resultado) para o painel mostrar se as dicas ajudam.
- Painel: arrastar e soltar com Pointer Events (funciona com mouse e caneta); no toque, o cartão abre os detalhes para evitar arraste acidental na rolagem.
- Limites: comportamento da IA conferido em testes técnicos, não com usuários.

## 2026-10-14 — 0.11.3: avaliação técnica da IA

- Origem: pergunta do usuário se todos os fluxos e a interpretação da IA tinham sido avaliados. Não tinham: a IA real só tinha 4 relatos testados.
- Decisão: banco de 186 relatos fictícios (3 por caminho, mais casos especiais) e banco de controle de 30 relatos escritos antes de ver os erros e nunca usados para ajustar. Mudanças na instrução só ficam se melhoram nos mesmos relatos sem piorar o controle.
- Resultado: glossário dos sistemas da escola mantido; envio das palavras-chave da matriz descartado (piorou Audiovisual). Sem IA, o relato livre passa a virar opções.
- Limite: avaliação técnica, não validação com usuários; o banco foi escrito pelo assistente. Rodada completa da versão final pendente por causa da cota diária do Gemini.

## 2026-10-15 — 0.11.4: avaliação da IA concluída

- A regra de extração da 0.11.3 foi refinada depois de a rodada completa mostrar que ela também esvaziava campos de texto (94%): cuidado só nas perguntas de Sim/Não.
- O glossário passou a valer também na revisão, depois de 2 alertas falsos no percurso pelos botões.
- Perguntas com nome de pessoa ou endereço de e-mail passam a ser barradas por regra fixa no servidor, além da instrução, porque a instrução sozinha não impediu.
- Limite: avaliação técnica com relatos escritos pelo assistente; não substitui o teste com usuários.

## 2026-10-19 — 0.12.0: preparação do teste com usuários

- Origem: pedido do usuário para medir automaticamente as sessões, marcar participantes, perguntar a satisfação e montar o kit.
- Decisões: métricas anônimas para todos os atendimentos (o código só aparece quando o link traz `?p=`), uma linha por atendimento atualizada a cada etapa (permite ver onde a pessoa desistiu sem depender de evento de saída da página); planilha de validação dentro da planilha do SmartDesk, para as métricas entrarem por fórmula; cenários e colunas da Matriz Mestre (CT-01 a CT-11 e aba 05_Resultados_Validacao).
- Limite: as metas dos critérios de decisão ficam em branco, para o usuário definir antes dos testes.

## 2026-10-20 — 0.12.3: conferências locais em vez de mudar a instrução da IA

- Origem: atendimento do usuário em que "preciso de microfone também" não mudou o tipo e o evento ficou "Não" com o relato falando em evento.
- Decisão: regras locais e testáveis no navegador (lista fechada de equipamentos do Audiovisual e a palavra "evento"), que perguntam e deixam a pessoa decidir. Não alterar a instrução da revisão da IA, já avaliada (0 alertas falsos em 57 caminhos), nem gastar cota em uma nova rodada.
- Limite: cobre as combinações do Audiovisual; em outras áreas, pedidos acumulados continuam só na descrição.
