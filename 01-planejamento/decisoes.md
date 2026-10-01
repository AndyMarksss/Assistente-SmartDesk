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
