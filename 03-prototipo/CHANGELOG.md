# Changelog

Registre mudanças do protótipo e da organização do projeto, com data e evidência quando disponível.

## 2026-09-30 — Estrutura inicial

- Criadas as oito áreas do projeto e suas subpastas.
- Preparados modelos para decisões, evidências, README futuro e diário de validação.
- Registrado um resumo do fluxo proposto e pendências da próxima etapa.
- Nenhum protótipo implementado ou resultado de validação registrado nesta etapa.

## Modelo para próximas mudanças

### AAAA-MM-DD — [Versão ou etapa]

- Alteração:
- Motivo:
- Telas ou regras afetadas:
- Verificação realizada:
- Evidência:
- Pendências conhecidas:

## 2026-09-30 — Organização das evidências

- Recuperados e copiados os três prints definidos na conversa, preservando os originais.
- Criados índice Markdown e manifesto JSON com etapas, descrições, datas aproximadas e SHA-256.
- Adotado o padrão EVID-###_descricao-curta.ext; próximo número livre: EVID-004.
- Atualizado o checklist e registradas as instruções de continuidade em AGENTS.md.
- Conferidos visualmente os prints; cópias a verificar por hash.

## 2026-09-30 — Versão 0.1.0, primeiro percurso do MVP

- Criados index.html, style.css, app.js, classifier.js, knowledge-base.js, flows.js e README.md.
- Implementadas entrada, análise, classificação, correção e confirmação da classificação.
- Base inicial parcial de 14 necessidades; matriz completa e setores oficiais pendentes de importação.
- Preservadas as pastas src, assets e versoes; arquivos da interface organizados conforme o Passo 4.
- Perguntas complementares, triagem, resumo e avaliação permanecem na próxima etapa.

- Verificação técnica concluída: dez cenários de classificação, percurso no navegador e layout em largura de celular. Detalhes em verificacao-v0.1.0.md.
- Corrigida a exibição da confirmação anterior ao reabrir a correção manual.
- Salvas EVID-004 e EVID-005; índices e checklist atualizados. Próximo número: EVID-006.

## 2026-10-01 — Versão 0.2.0, chat guiado

- Substituída a interface de formulário por conversa com escolhas padronizadas e digitação liberada por etapa, conforme correção do usuário.
- Incluídos acompanhamento lateral, confirmação/correção, coleta de detalhes e identificação, resumo revisável e exportação local preparada.
- Versão anterior preservada em versoes/v0.1.0-antes-chat, incluindo a base e o classificador.
- Criados motor de conversa, servidor local, adaptador de IA desativado e contrato da integração.
- Serviço de IA adiado por escolha explícita do usuário; não houve chamadas externas.
- Conferidos percurso no navegador, layout de celular e doze verificações do servidor. Limite do download no navegador integrado registrado em verificacao-v0.2.0.md.
- Salvas EVID-006 a EVID-008, índices e checklist atualizados. Próximo número: EVID-009.

## 2026-10-01 — Versão 0.3.0

- Font Awesome Free 6.7.2 local substitui símbolos de interface; licença preservada.
- Temas claro/escuro por botão, preferência persistente, contraste e foco de teclado.
- Início pessoal: convite, nome/apelido, saudação pelo nome. Empresas retiradas do fluxo acadêmico; versões antigas preservam contexto histórico para futura implementação corporativa.
- Nome coletado uma única vez; e-mail de contato genérico, com exemplo fictício. Setores continuam exemplos da base parcial.
- Adaptador Gemini com resposta estruturada, confirmação humana e fallback identificado. Chave em .env, bloqueado no servidor e ignorado no Git. Sem chave real ou chamada externa nesta verificação.
- Corrigida rolagem após renderização das escolhas no celular.
- Preservados 11 arquivos da versão 0.2.0 em versoes/v0.2.0-antes-temas-gemini.
- 21 verificações automatizadas e percurso visual desktop/celular documentados em verificacao-v0.3.0.md.
- EVID-009 a EVID-011 registradas; próximo número: EVID-012.

## 2026-10-01 — Versão 0.4.0, identidade lavanda

- Substituído verde por lavanda, ameixa e rosa discreto nos dois temas, por instrução direta do usuário.
- Refinados espaçamento, moldura do chat, sidebar clara/escura, cartões, botões e hierarquia tipográfica. Robô Font Awesome e coração discreto nas boas-vindas.
- Contraste dos textos inspecionados acima de 4,5:1; celular 390x844 sem transbordamento horizontal.
- Preservados 12 originais em versoes/v0.3.0-antes-lavanda. Nenhum arquivo apagado; .env não foi copiado nem alterado pelo assistente.
- Servidor reiniciado para carregar a chave inserida pelo usuário. Google aceita consulta de modelos, mas gemini-2.5-flash-lite retorna 404: indisponível para novos usuários. Classificação permanece em fallback local identificado.
- Tentativa de atualizar para Gemini 3.5 Flash-Lite e testar bloqueada pela revisão automática por possível custo. Sem mudança de modelo ou chamada nessa tentativa. Confirmação do plano gratuito solicitada ao usuário; pendente.
- 21 verificações simuladas do servidor passaram. Nenhuma classificação real de IA bem-sucedida registrada.
- Evidências EVID-012 a EVID-014; próximo número EVID-015.

## 2026-10-01 — Conexão Gemini concluída

O usuário confirmou explicitamente Free tier sem faturamento. Com essa confirmação e a tabela oficial mostrando entrada/saída gratuitas nessa modalidade, a atualização foi autorizada pela revisão automática. Modelo atualizado para gemini-3.5-flash-lite, chave preservada. Resposta real 200 com printer-paper, e chat mostrou Gemini · análise com IA e Impressora / Papel atolado. EVID-015 registrada; próximo número EVID-016. 21 testes simulados repetidos e aprovados após a atualização. A interrupção e pendência anteriores estão resolvidas; não houve ativação de faturamento ou mudança automática de modelo.

Referência: [preços oficiais](https://ai.google.dev/gemini-api/docs/pricing#gemini-3.5-flash-lite).

## 2026-10-01 — 0.5.0, escolhas da matriz e assunto do chamado

- Substituída classificação livre por setor padronizado, quatro áreas e 57 caminhos da matriz.
- Campos específicos e condicionais; QuickBooks para Financeiro, câmeras para Coordenação EI (Infantil), roteiro de evento, data de Chromebook, conta para reset e cor/modelo para toner.
- Gemini adapta a pergunta da descrição e sugere apenas um assunto curto, sem mudar categoria nem descrição. Sem ferramentas ou conversa livre.
- Anexos opcionais depois da descrição; rascunhos locais com arquivos, validação no servidor e resumo em texto. Sem envio ao suporte.
- Preservados temas e Font Awesome. Versão anterior arquivada, sem chave.
- 147 verificações simuladas passaram. Percurso real de toner verificado no navegador: Gemini sugeriu Solicitação de Toner Magenta; rascunho fictício com anexo salvo e conferido em disco. Sem erros de console observados.
- Evidências EVID-016 a EVID-019. Validação com usuários reais continua pendente.

## 2026-10-01 — 0.6.0, diálogo suave e receptor Google

- Mensagens do bot enfileiradas, indicador de digitação e entrada suave, respeitando movimento reduzido. Respostas só liberadas após a mensagem.
- Nome no cumprimento em negrito, setor com texto simplificado e seletor destacado; campo indisponível com aparência pausada e rótulo com cadeado.
- Escolhas sem destaque automático da primeira opção; hover e botão Voltar uma etapa acima das opções. Histórico restaura a etapa anterior, sem reiniciar o setor para corrigir a área.
- Local retirado por instrução do usuário. Assunto permanece interno, sem confirmação ou exibição no resumo.
- Revisão final com Enviar, Editar descrição e Revisar anexos apenas quando existem; Novo atendimento somente após recebimento confirmado.
- Receptor Apps Script e ponte no servidor: chamados em linhas numeradas, anexos privados no Drive, token secreto, trava de numeração, ID de envio e retomada sem duplicatas.
- 152 verificações do servidor passaram com Google simulado; testes do Apps Script verificaram #001/#002/#003, repetição, token, descrição literal, links e retomada após falha de arquivo.
- Publicação real pendente: navegador não autenticado no Apps Script; nenhuma planilha ou pasta nova foi criada no Google nesta sessão. Não afirmar envio real. Chave .env preservada.

## 2026-10-01 — Publicação e diagnóstico do Google

- Usuário publicou receptor versão 1 e inseriu configuração no .env. Servidor reiniciado; arquivo de configuração não foi exibido nem alterado pelo assistente.
- GET real retorna SmartDesk 0.6.0. POST do chamado fictício com TXT retorna erro interno do script, distinto de falha de token. Sem confirmação de número; não alegar envio. Mesmo ID reutilizado nas tentativas.
- Preservado Code.gs anterior em versoes/v0.6.0-antes-diagnostico-google. Adicionado log seguro ao catch e Diagnostico.gs para validação/retomada pelo editor. Causa exata depende da execução na conta do usuário.
- EVID-030 e EVID-031 registram configuração e publicação; recebimento permanece pendente.

## 2026-10-01 — Correção do diagnóstico e confirmação Google

- Diagnostico.gs corrigido para preencher area/need a partir do Schema antes de validar, reproduzindo o contrato do servidor. Versão anterior preservada.
- Teste local confirma campos obrigatórios corretos.
- Reteste real do servidor recebeu HTTP 201: chamado fictício #001, um anexo, status enviado. Repetição do mesmo requestId/conteúdo retornou #001 novamente. Sem novos chamados por essa repetição.
- .env não foi modificado nem exibido. EVID-032 preserva o diagnóstico anterior; pendência de recebimento resolvida, conferência visual da planilha/arquivo ainda pendente.

## 0.7.0 — Gestão e adaptação de telas

- Compositor alinhado e compacto; adaptação por largura/altura, até 4K.
- E-mail após nome; indicador verde/vermelho baseado em resposta recente válida do Gemini, não apenas chave configurada.
- Dashboard, filtros, kanban, detalhes e mudança de etapa; demonstrações persistidas separadamente.
- Extensão Google com listagem/etapa/e-mail preparada; requer atualização da implantação pelo usuário. Estratégia de retorno registrada.

## 0.7.1 — Acesso ao servidor correto

- Cliente e painel abertos em localhost:5500 ou como arquivo local encaminham para localhost:4173, preservando a tela desejada.
- Painel verifica o tipo da resposta antes de interpretar JSON e apresenta orientação legível.
- Leitura real pelo servidor confirmou um chamado Google (#001) após a atualização da implantação; não foram alteradas etapas nem criados chamados reais nesta correção.

## 0.8.0 — Refinamento de experiência

Modal fecha por clique externo e Escape; botão de fechar compacto; dashboard com fundos discretos e temas refinados; favicon SVG. Nome e sobrenome com Unicode, e-mail destacado até correção, Recomeçar, instruções e respostas acolhedoras. Computador identificado por quem utiliza. Pergunta imediata de descrição sem espera por IA. Autorização declarada ou pendente para compra/troca, servidor valida e Apps Script armazena em O. IA distingue pronta, processando, conectada e indisponível sem chamadas artificiais.

## 0.8.1 — Contexto e trilha horizontal

HDMI sem autorização e sem descrição duplicada. Periféricos distinguem defeito de item novo/diferente antes dos detalhes. Prompts contextualizados por serviço/campo. Trilha horizontal sob cabeçalho, resumo e orientação na lateral. Regra de autorização alinhada entre navegador e servidor.
