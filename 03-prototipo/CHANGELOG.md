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

## 0.8.2 — Chat compacto e agendamento intuitivo
Trilha mais fina; painel de resposta compacto, sem caixa pausada redundante; exemplos nas quatro áreas; data/hora digitáveis com teclado numérico e seletor opcional. Validação de datas reais e não passadas, horários e relato só numérico no cliente e servidor. Categorias canônicas preservadas.

## 0.8.3 — Feedback de envio e trilha
Calendário/relógio alternam o tipo da mesma caixa preservando o valor. Indicador animado imediato durante envio, com texto acessível, movimento reduzido respeitado e bloqueio de nova submissão. Etapas concluídas recebem ✓, mantendo etapa atual em destaque; reinício limpa marcações.

## 0.8.4 — Visual móvel e teclado
Tema escuro com conversa em fundo neutro, mensagens ameixa e campo de resposta mais claro. Elementos decorativos difusos e superfícies com vidro/blur. VisualViewport ajusta altura móvel; cabeçalho e trilha recolhem durante teclado, restauram ao fechar. Calendário/relógio ficam acima da caixa. Mantidos campo único, ✓ e feedback de envio.

## 0.8.5 — Profundidade pela cor
Planos de cor para cenário, conversa e resposta; vidro translúcido no cabeçalho e na área de resposta; histórico em ameixa suave e lavanda reservada para ação principal. Lateral integrada ao cenário, menos bordas e cartões, selo de IA duplicado e instrução repetida removidos visualmente. Mensagem atual com detalhe lavanda; iniciar atendimento recebe destaque principal. Mantidos ✓, alternância data/hora, estado de envio e adaptação ao teclado.

## 0.8.6 — Paleta por função
Direção tecnológica escolhida pelo usuário: grafite e neutros frios estruturam planos; violeta indica ação, foco e etapa atual. Histórico do usuário azul acinzentado; mensagens do bot neutras, cores sólidas para legibilidade. Vidro somente no cabeçalho/dock, grade discreta, proporções e texto inicial mais precisos. Mantidos os fluxos e os controles móveis. 22 pares de contraste aprovados; sistema documentado com fontes.

## 0.8.7 — Personalidade e movimento
Assistente ilustrado vetorial próprio na abertura, órbitas e luzes discretas no cenário, vidro no cabeçalho e resposta, avatares maiores e cartão de ajuda. Quatro áreas em cartões com ícones e seta decorativa; quatro colunas desktop e duas mobile. Entradas curtas de mensagens e opções, retorno em hover/toque, flutuação do assistente, rotação do aro e transição de ✓. Botão para pausar efeitos, preferência salva localmente; movimento reduzido desativa animações decorativas e entradas.

## 0.8.8 — Identidade de suporte TI
Marca própria de conversa/terminal substitui S no chat, gestão e favicon. Abertura focada no suporte de TI. Robô centralizado no mobile com legenda abaixo; três destaques alinhados. Botão de pausa retirado; movimento reduzido do sistema segue respeitado. Luzes violeta/azul atrás de superfícies translúcidas tornam o vidro perceptível. Gestão recebe a paleta grafite/fria, cabeçalho de TI, indicadores, cores de etapas com rótulos, gráfico e entradas curtas animadas. Backend, matriz e política de chamados preservados.

## 0.8.9 — Central de apoio
Abertura redesenhada como uma central de apoio: painel com título, texto e ilustração do assistente conectado a computador, conexão, impressão e som. Cena com formas geométricas, vidro nos dispositivos e sinais curtos animados; decoração sem cliques ou anúncios assistivos. Fundo com textura de pontos discreta substitui órbitas grandes. Resumo lateral usa linha de acompanhamento; ajuda azul, ação violeta e mensagens neutras. Composição centralizada no desktop e compacta no mobile, incluindo 360×740. Painel recebe o mesmo vocabulário visual, novos planos de cor e indicadores com menos decoração.

## 0.8.10 — Planos de cor e envio compreensível
Corrigido título local: separadores > do caminho canônico viram travessões no assunto interno, mantendo categoria e descrição originais. O cliente normaliza também a resposta recebida de versões anteriores do servidor. Falha de envio anuncia explicitamente que o recebimento não foi confirmado, preserva dados/ID e oferece Tentar enviar novamente. Nenhuma confirmação é mostrada antes de uma resposta de sucesso. Abertura permanece no topo, sem rolagem automática ocultando o título. Planos definidos por luminosidade: cenário recuado azul cinza/grafite, navegação intermediária, painel e mensagens elevados, pergunta atual em azul e resposta em lavanda/violeta. Mesmo vocabulário no painel. Vidro localizado na ilustração, sem sombras novas.

## 0.8.11 — Estrutura e movimento

Módulos separados para comunicação, fila de mensagens, campos e anexos; validação do servidor extraída; formatação uniforme dos arquivos próprios. Movimento centralizado, efeitos decorativos finitos e novas entradas de mensagens/opções, campos, resumos, detalhes, cartões e gráficos. Feedback de espera no painel e confirmação de recibo antes de concluir envio. Erros de gestão distinguem validação, conflito e origem dos dados.

Sete suítes aprovadas, incluindo 211 verificações de integração, comparação dos 57 caminhos nos 25 setores, anexos, autorização, idempotência, datas e gestão. Novos testes de cancelamento de respostas/controles antigos e sequência sem atrasos em movimento reduzido. Sintaxe de 31 arquivos JavaScript aprovada; 40 arquivos próprios passaram na padronização. Navegador: calendário/relógio preservam um campo e valor; fluxo fictício completo com falha, nova tentativa e recibo #TESTE-LOCAL, sem escrever no Google; etapa de demonstração persistiu e foi restaurada. Chat e painel em 390×844 sem overflow lateral. Preferência de movimento reduzido validada por regras e testes controlados, sem alterar a configuração do sistema. Teclado virtual real ainda exige conferência no aparelho. Nenhum teste equivale a garantia de ausência de qualquer regressão.

## 0.8.12 — Versão nos rodapés

Chat e gestão exibem SmartDesk · v0.8.12 no rodapé, incluindo mobile. Comando único sincroniza versão do pacote, lock, páginas e documentação atual. Regra de incremento registrada para as próximas entregas.

## 0.8.13 — Robô e conexões coerentes

Rodapé centralizado pela caixa e texto. Sinal luminoso segue exatamente as linhas computador → robô → som/imagem, com comprimento normalizado. Mesmo personagem SVG no cabeçalho e avatar das mensagens, com tamanho móvel e moldura suave; bolhas do assistente refinadas.

## 0.8.14 — Conversa acompanha respostas

Rolagem acompanha Como funciona mesmo com abertura visível e reajusta após mudança de altura dos controles/conversa. Área de resposta preserva altura durante fila de digitação; libera após renderizar controles. Recomeçar preserva abertura no topo. Circuito luminoso sequencial: computador, impressão, conexão e som/imagem → robô, sem trecho de saída.

## 2026-10-05 — 0.8.15: preparação da entrega online real

- Servidor compatível com PORT, host público e origem HTTPS de hospedagem. Acesso de avaliação obrigatório na nuvem; saúde pública sem chamadas externas.
- Blueprint Render Free e guia de primeira hospedagem, sem configuração de faturamento.
- Pages gera somente entrada/encaminhamento público, sem publicar arquivos do servidor, histórico ou credenciais. URL pública configurada por variável de Actions.
- Publicação e teste remoto ainda dependem da conta gratuita/ambiente privado. Não afirmar integração online antes de conferir.

## 2026-10-05 — 0.9.0: portal completo no Apps Script

- Migração autorizada para dispensar hospedagem adicional. Interface autocontida, transporte RPC, sessão privada e adaptador Gemini no Google.
- Reutilização da planilha/Drive/token e idempotência existentes; simulações isoladas por sessão. Regras derivadas das fontes canônicas.
- Pages aceita /exec; compatibilidade Node preservada com saúde ?api=health. Auxiliares de configuração/diagnóstico privados para RPC.
- Guia/pacote para aplicação manual pelo usuário. Implantação Google e teste remoto ainda pendentes, sem contratação de plano ou faturamento.

## 0.9.1 — 2026-10-05

Correção solicitada: frontend estático no Pages sem redirecionamento, Apps Script apenas backend. POST em iframe técnico, respostas autenticadas/correlacionadas por postMessage, segredos fora da URL. Build por lista pública, endpoint fornecido pelo usuário e guia incremental. Dez suítes aprovadas; verificação Google real pendente.

## 0.9.2 — 2026-10-05
Acesso direto solicitado: sem modal/senha, sessão técnica automática e renovação única. Gestão pública limitada aos chamados enviados na mesma sessão; registros anteriores bloqueados no servidor. Simulações mantidas; acesso local completo preservado. Dez suítes aprovadas.
