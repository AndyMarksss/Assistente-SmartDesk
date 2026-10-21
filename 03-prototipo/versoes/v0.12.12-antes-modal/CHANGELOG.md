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

## 0.10.0 — 2026-10-14

Pedido direto do usuário: mais profundidade, efeitos, animações, hover, vidro e elementos; melhor uso da IA e um fluxo de mensagens mais fluido até a abertura do chamado.

- Aparência: nova camada `assets/css/atmosphere.css` com aurora desfocada e grão no fundo, vidro em camadas (lateral, conversa, cabeçalho, dock, mensagens, opções, gestão), luz que acompanha o cursor, inclinação 3D na cena de abertura, linha de progresso na trilha e cartões de revisão e comprovante redesenhados. Animações novas em `motion.css` (entrada com desfoque, ondulação ao clicar, borda animada no cartão de IA, comprovante). Tudo desligado por `prefers-reduced-motion`; `prefers-reduced-transparency` e navegadores sem desfoque recebem superfícies sólidas. `assets/js/atmosphere.js` só atua com mouse.
- IA: "Descrever com minhas palavras" sugere até três caminhos permitidos para confirmação; depois da descrição, a IA pode fazer uma pergunta de complemento (com opção de pular) e oferecer até três dicas seguras, com "Resolveu! Não preciso mais" sem abrir chamado. Mensagens da IA ganham selo próprio e um balão de "pensando" enquanto ela responde.
- Fluxo: seletor de setor com busca em grade, atalhos dos cenários da matriz, opções com ícones e nomes legíveis (Computador em vez de COMPUTADOR, só na tela), comprovante com botão de copiar e próximos passos, e opção de lembrar nome, e-mail e setor neste dispositivo (com "Esquecer").
- Avaliação pública (Apps Script): cotas por sessão (5 chamados, 40 chamadas de IA) e por dia (60 chamados, 600 chamadas de IA), limite de 3 anexos e 5 MB com conferência do conteúdo pelo tipo do arquivo, e limitador de sessões por minuto que não trava mais com tráfego contínuo.
- Correção: teste de integração usava a data fixa 2026-10-05 e falhava após essa data.
- Verificação: dez suítes aprovadas, incluindo 223 verificações de integração. Fluxo conferido no navegador com o Gemini real e o envio ao Google desligado. Detalhes em verificacao-v0.10.0.md; evidências EVID-179 a EVID-188.
- Pendente: aplicar Portal.gs e PortalShared.gs no Apps Script (guia ATUALIZAR-v0.10.0.md) antes de publicar no Pages; conferir em aparelho real.

## 0.10.1 — 2026-10-14

Teste de ponta a ponta no GitHub Pages, como o avaliador, revelou três falhas do caminho público que existiam desde a 0.9.x e nunca tinham sido conferidas:

- IA: o Apps Script não tinha autorização para chamar serviços externos, então o Gemini sempre caía na alternativa local pelo Pages. Criada a função `diagnosticarIA` (Diagnostico.gs); executada e autorizada pelo dono no editor. Depois disso, sugestão de caminho, pergunta de complemento e dicas funcionaram pelo Pages.
- Envio: o portal devolvia o recibo sem `status: "enviado"`, e o chat mostrava "envio não confirmado" mesmo com o chamado gravado. O portal agora devolve o mesmo recibo do servidor local (status, ID e número validados). Chamado fictício #010 confirmado na interface pública.
- Painel: a listagem pública não trazia as etapas e o painel ficava em "Carregando chamados…". A listagem agora inclui as etapas e o painel tolera a ausência delas. Melhorias junto: depois de enviar, o painel abre em "Chamados desta avaliação"; a demonstração vazia cria as simulações sozinha; detalhes mostram o nome dos campos e o resumo usa singular/plural.
- Publicação: Apps Script publicado pelo clasp (perfil `--user pessoal`) nas versões 5, 6 e 7 da mesma implantação; /exec inalterado.

## 0.10.2 — 2026-10-14

O build do Pages acrescenta `?v=<versão>` aos CSS e JS próprios. O Pages guarda arquivos por cerca de 10 minutos; sem isso, quem já tinha aberto o site recebia HTML novo com JS antigo (visto no teste: o painel novo rodou com o admin.js anterior). Apps Script republicado só para alinhar a versão (implantação versão 8).

## 0.11.0 — 2026-10-14

Revisão pedida pelo usuário depois de testar a 0.10.x: robô parado, painel sem indicação de carregamento, kanban difícil de usar, botões piscando, setor e atalhos poluídos, calendário escondido, IA que perguntava de novo o que já tinha sido dito e fluxos com furos.

- **Chat — aparência:** robô animado (flutua, pisca, acena, brilha e "pensa" enquanto a IA responde); frases da tela inicial em pílulas; botões violeta sem deslocamento no hover (o deslocamento tirava o botão de baixo do cursor e causava a piscada); campo de texto cresce até 3 linhas; botões do cabeçalho com o mesmo tamanho no celular.
- **Chat — escolhas:** setor numa lista com busca (combobox acessível) no lugar da grade; tela de áreas só com as quatro áreas e o cartão da IA (atalhos retirados); data e horário com botão visível "Calendário"/"Relógio" e datas rápidas (Hoje, Amanhã, próximos dias úteis); respostas rápidas ("Não sei o modelo", "Não aparece nada", "A impressora não tem visor", "Enviar o link depois", dispositivo); "Sem mais detalhes" nos caminhos em que a descrição é opcional, com texto montado a partir das respostas.
- **IA monta o rascunho:** "Descrever com minhas palavras" identifica o tipo e extrai os dados já ditos (data, horário, evento, opções) num cartão para a pessoa confirmar ou corrigir; só o que falta é perguntado; o relato vira a descrição sem ser pedido de novo. Novo `POST /api/extract`. Defeito × item novo só nos periféricos (antes uma reserva podia cair em autorização de compra).
- **IA blindada:** a pergunta de complemento traz uma dica de onde achar a resposta, nunca repete dados informados e fica no escopo do pedido; a IA avisa quando o relato não combina com o tipo escolhido ("Escolher outro tipo" mantém o relato). Perguntas e respostas entram formatadas na descrição ("Perguntas do assistente").
- **Dicas e "Resolveu":** "Antes de enviar o chamado, vale tentar…" (não dá mais a entender que o chamado já foi enviado). "Resolveu!" encerra sem chamado e oferece "Voltou a acontecer — abrir o chamado" com os dados mantidos. O resultado é registrado sem dados pessoais na aba Autoatendimento.
- **Acompanhar um chamado:** número + e-mail usado na abertura mostram só a etapa (Recebido, Em andamento, Finalizado), área, necessidade e data. "Lembrar nome, e-mail e setor" ganhou explicação; "Novo atendimento" com dados lembrados volta a rolar a tela.
- **Painel:** skeleton durante o carregamento; texto de busca legível; kanban com cor por etapa, tags nos cartões (área, data, anexos, autorização pendente, simulação), arrastar e soltar com cartão-fantasma, coluna de destino destacada, aviso de confirmação e desfazer em caso de erro; sem rolagem lateral (7 colunas numa linha a partir de 1280 px, quebram abaixo disso). Novo cartão "IA no autoatendimento" (resolvidos pelas dicas × seguiram para o chamado).
- **Apps Script:** rotas de rascunho, acompanhamento (10 por sessão) e autoatendimento (20 por sessão); `trackTicket`, `selfHelp` e `selfHelpStats` em Gestao.gs; link "Ainda não informado" aceito; `removerChamadoDeTeste` em Diagnostico.gs para o dono apagar o chamado de teste #010. Publicado pelo clasp nas versões 9 e 10 da mesma implantação.
- Verificação: dez suítes aprovadas; fluxos conferidos com o Gemini real e o envio ao Google desligado. Detalhes em verificacao-v0.11.0.md.

## 0.11.1 — 2026-10-14

Pedido do usuário: o robô deve olhar para o cursor, e o efeito de luz do fundo do chat deve acontecer no chat inteiro, não só em uma parte.

- **Olhar do robô:** os olhos (grupo `.robot-gaze`) se deslocam na direção do cursor em qualquer ponto da página, até 8 × 7 unidades do desenho, com a boca acompanhando pela metade; a piscada continua em cada olho. Quando o cursor sai da janela, o robô volta a olhar para frente. Só com mouse; com movimento reduzido, os olhos ficam parados.
- **Luz do cursor:** a camada herdava de `visual-depth.css` 380×380 px no canto superior esquerdo e um desfoque de 65 px, e ficava atrás do cabeçalho, das etapas e da área de resposta — por isso o efeito só aparecia num pedaço. Agora ocupa o chat inteiro, por cima das faixas (mistura `screen` no escuro e `multiply` no claro), acende quando o cursor entra no chat e apaga quando sai. O brilho fixo do alto passou para o fundo do próprio chat. Desligada em cores forçadas.
- Apps Script republicado só para alinhar a versão (implantação versão 11). Verificação em verificacao-v0.11.1.md.

## 0.11.2 — 2026-10-14

Correção pedida pelo usuário: na 0.11.1 a luz do cursor passou a ficar por cima de tudo e invadia o card central, a trilha de etapas e os botões. A luz deve ficar só no fundo do chat.

- `.chat-shell::after` voltou para trás do conteúdo (`z-index: 0`, sem mistura de cores), mantendo o tamanho do chat inteiro — o defeito original era só a camada de 380×380 px no canto.
- Medido com as cores reais (tema escuro): fundo abaixo do card vai de (17, 24, 40) para (53, 56, 89) com o cursor perto; área de botões não muda; dentro do card, pelo vidro, a variação é mínima ((34, 52, 72) → (42, 56, 82)).
- Apps Script republicado só para alinhar a versão. Verificação em verificacao-v0.11.2.md.

## 0.11.3 — 2026-10-14

Pedido do usuário: conferir se todos os fluxos foram avaliados, inclusive a interpretação da IA no relato livre. Resposta honesta: as regras dos 57 caminhos tinham testes, mas a IA real só tinha sido testada em 4 relatos. Foi feita uma avaliação técnica em `04-validacao/avaliacao-ia`.

- **Avaliação (instrução anterior):** 186 relatos fictícios. Caminho certo em 1º em 96% (claros e informais 100%, vagos 89%); base local sem IA, 38%. Fora do escopo barrados 10/10, inclusive uma tentativa de manipular a IA; dois pedidos no mesmo relato 2/2; extração 98% dos campos e 100% das datas. Banco de controle com 30 relatos novos: 27/27 caminhos certos e 2/3 fora do escopo barrados.
- **Instrução de identificação:** centralizada em `ai-provider.cjs` (`ANALYZE_INSTRUCTION`, `analyzeCategories`) e copiada para o Apps Script pelo build. Ganhou glossário dos sistemas da escola, preferência pelo caminho específico e lista vazia para assuntos que não são de TI. Uma tentativa de mandar também as palavras-chave da matriz piorou Audiovisual (47/50 contra 49/50) e foi descartada. Versão final nos 44 relatos que deu tempo de rodar: 44/44, contra 43/44 da anterior nos mesmos relatos; nos 10 casos sensíveis, 9 certos.
- **Extração:** "É para um evento?" só é marcado quando a pessoa diz isso; marcações indevidas em Audiovisual caíram de 5/12 para 2/12 nos mesmos relatos.
- **Sem IA:** o relato livre não vira mais um rascunho incerto. O chat avisa que a IA está indisponível, mostra as possibilidades da base local como opções e "Escolher pelas opções", e mantém o texto como descrição.
- **Limite da IA:** o plano gratuito do Gemini permite 500 pedidos por dia por projeto. A avaliação esgotou a cota da chave local (`.env`) em 2026-10-14; o site público seguiu com IA, porque o Apps Script usa outra chave. A rodada completa da instrução nova, o controle com ela e o percurso dos 57 caminhos (2 feitos) ficam pendentes até a cota local renovar.
- **Pages:** Apps Script na versão 13 da implantação. Com a instrução nova, "o programa da contabilidade não abre o arquivo da empresa" (Financeiro) virou rascunho de TI › QuickBooks › Erro no sistema; antes, no mesmo site, a base local sugeria Google › Drive. Numa das tentativas a IA não respondeu e o modo sem IA apareceu como previsto.
- Verificação em verificacao-v0.11.3.md; relatório em 04-validacao/avaliacao-ia/relatorio-avaliacao-ia.md.

## 0.11.4 — 2026-10-15

Avaliação da IA concluída depois que a cota do Gemini renovou (pedido do usuário: continuar quando a cota voltar). Relatório final em `04-validacao/avaliacao-ia/relatorio-avaliacao-ia.md`.

- **Identificação (instrução com glossário da 0.11.3), 186 relatos:** caminho certo em 1º em 99% (antes 96%), entre as três 100%; vagos 98% (antes 89%). Fora do escopo 10/10, restritos 2/2, dois pedidos 2/2. Banco de controle: 27/27 caminhos e 3/3 fora do escopo (antes 2/3).
- **Extração:** a regra da 0.11.3 deixou a IA cautelosa demais também em campos de texto (94%). Agora o cuidado vale só para perguntas de Sim/Não e campos de texto são preenchidos sempre que o relato traz a informação: 99% dos campos certos (antes 98%) e nenhum "evento" marcado sem a pessoa dizer (antes 5/12).
- **Percurso pelos botões:** os 57 caminhos chegaram ao resumo, sem travar. A revisão da IA deu 2 alertas falsos (Lâmpada da Estufa e Câmeras) e uma pergunta pedindo o nome do aluno.
- **Revisão da IA:** o mesmo glossário passou a valer na revisão (com Câmeras do Infantil); alerta só quando a descrição trata claramente de outra coisa, na dúvida segue; motivo em português correto. Conferida direto na rota nos 57 caminhos: 0 alertas falsos, 16 perguntas, 18 caminhos com dicas.
- **Filtro do servidor:** perguntas que pedem nome de pessoas ou endereço de e-mail são descartadas (pegou "o nome completo e o e-mail institucional da professora"). Reaplicado às 39 perguntas coletadas: descartou só as 2 indevidas.
- `revisar-ia.cjs` (revisão direto na rota) e `--so-extracao sim` em `avaliar-ia.cjs` para conferir mudanças sem gastar cota com o resto. Apps Script republicado. Verificação em verificacao-v0.11.4.md.

## 0.12.0 — 2026-10-19

Pedido do usuário: preparar o protótipo e o material para o teste com pelo menos 5 usuários reais (itens 1, 2, 3 e 5 da sugestão).

- **Métricas anônimas por atendimento:** `assets/js/session-metrics.js` registra a última etapa alcançada (início, identificação, caminho, resumo, enviado, resolvido sem chamado), como a pessoa escolheu (botões, relato ou relato e depois botões), o que fez com o rascunho, o alerta, a pergunta e as dicas da IA, quantas vezes voltou, dispositivo, número do chamado e tempo até enviar. Sem nome, e-mail ou relato. Rota `POST /api/metrics` (servidor local e Apps Script), validada por `safeMetrics`; no Google vai para a aba **Sessões** (uma linha por atendimento, atualizada a cada etapa); sem Google, para `server/data/sessoes.jsonl`, fora do Git. O "Como funciona?" avisa que esse registro existe.
- **Participante do teste:** o link `?p=P01` marca a janela (selo "Teste P01" no topo), as métricas e os chamados. Coluna P "Participante do teste" na aba Chamados, tag "Teste P01" no painel e busca pelo código. `removerChamadosDosParticipantes` (Diagnostico.gs) tira esses chamados da fila depois dos testes, mantendo a aba Sessões.
- **Satisfação:** depois do comprovante, "Quão fácil foi abrir este chamado?" (1 a 5, ou não responder) e "O que faltou?" (opcional, sem nomes), guardados só nas métricas.
- **Kit das sessões:** `04-validacao/roteiros/roteiro-sessao-usuarios.md` (preparação, fala de abertura, rodízio dos cenários CT-01 a CT-11 da Matriz Mestre com os links P01–P05, conversa final e cuidados), `04-validacao/registros/ficha-observacao.md` e `prepararPlanilhaDeValidacao` (Validacao.gs), que cria as abas *Validação — Tarefas* (rodízio já preenchido; o número do chamado puxa as métricas da aba Sessões), *Validação — Participantes* e *Validação — Resumo* (indicadores e quadro de critérios com metas em branco).
- **Correção:** o servidor local recusava enviar chamados para o Apps Script desde a 0.10, porque a checagem de versão aceitava só 0.7 a 0.9. O Pages não era afetado.
- Apps Script publicado na versão 15 da mesma implantação. Verificação em verificacao-v0.12.0.md.

## 0.12.1 — 2026-10-19

Pedido do usuário: animar o robozinho que aparece ao lado das mensagens do SmartDesk.

- O avatar deixou de ser a imagem `assistente.svg` e passou a ser o mesmo desenho inline (`miniRobot` em `chat-view.js`), com classes nas partes e IDs próprios para os gradientes de cada cópia.
- Só o robô da mensagem mais recente se mexe, para não encher a conversa de movimento: ao chegar dá um pulinho e mexe a boca como se falasse; depois pisca a cada ~4,6 s e a antena acende e apaga. Na primeira mensagem, acena com a orelha direita. Enquanto a IA pensa, os olhos procuram de um lado para o outro (além do balanço que já existia). Os robôs das mensagens anteriores ficam parados.
- Animações em `motion.css`, desligadas com movimento reduzido; tamanhos e pontos de giro em `atmosphere.css`.
- Apps Script republicado só para alinhar a versão. Verificação em verificacao-v0.12.1.md.

## 0.12.2 — 2026-10-19

Pedido do usuário: algumas animações e elementos não estavam bons em outras telas; verificar a responsividade completa de tudo, inclusive elementos e animações.

Varredura automática (Edge sem janela) do chat inteiro — abertura, Como funciona?, nome, e-mail inválido, setor, áreas, necessidades, data, horário, escolhas, link, relato, rascunho e revisão da IA, dicas, anexo, resumo, comprovante, nota, "o que faltou", acompanhamento — e do painel (quadro, detalhe e busca), nos temas escuro e claro, em 12 tamanhos: 320×568, 360×740, 390×844, 430×932, 740×360, 844×390, 932×430, 768×1024, 1024×768, 1280×720, 1440×900 e 1920×1080. Em cada um: rolagem lateral, elementos fora da tela, texto cortado, botões cobertos ou sobrepostos, alvos de toque, fontes pequenas, altura da conversa e encaixe das linhas da cena.

- **Animação da cena de abertura:** as linhas por onde correm os sinais eram um desenho fixo de 380 × 280; em outros formatos ficavam soltas entre os cartões e o robô (celular e tablet) ou começavam por baixo dos cartões (1280 px). Agora `atmosphere.js` refaz as linhas no tamanho real do quadro, da borda de cada cartão até o círculo do robô, e repete quando o quadro muda de tamanho. Desvio medido: 0 px em todos os tamanhos.
- **Celular deitado (740×360, 844×390, 932×430):** a conversa ficava com 46 a 115 px, espremida entre o topo e os botões, e parte das opções ficava escondida. Com altura até 500 px, a trilha de etapas e o rótulo da área de botões saem, o topo fica mais baixo e as opções viram uma grade compacta (as áreas sem a descrição), com a pergunta e todas as opções visíveis.
- **Monitor baixo (1024×768, 1280×720):** a dica "Sem complicação" da barra lateral não cabia e aparecia cortada; sai quando a altura é até 820 px.
- **Celular pequeno:** "Boas-vindas" quebrava em duas linhas na trilha (320 e 360 px); até 380 px só a etapa atual mostra o nome. Balões com menos recuo para os cartões de rascunho e resumo. O aviso de conexão sai em telas de até 650 px de altura (o status da IA continua no topo).
- **Campo de data e hora:** no celular estreito o botão "Calendário"/"Relógio" cobria o "DD/MM/AAAA"; até 420 px ele vira só o ícone (o nome continua para leitores de tela).
- **Toque:** atalhos de data com 40 px de altura (eram 30), "Voltar uma etapa", "Recomeçar" e "Remover" anexo com 40 px.
- **Textos pequenos:** a abertura chegava a 7–8 px no celular; selo, etiquetas, cena e rótulo da área de botões passaram a 9–10 px.
- O painel de gestão não precisou de ajuste: sem rolagem lateral, sem elementos fora da tela e com o quadro em duas colunas no celular.
- Apps Script republicado só para alinhar a versão (versão 17 da implantação). Verificação em verificacao-v0.12.2.md.

## 0.12.3 — 2026-10-20

Origem: prints do usuário de um atendimento no Pages. Relato: "Teremos um evento na quinta a noite (...) ela solicitou o sistema de som". A IA montou Audiovisual › Caixa de Som com evento "Sim"; o usuário escolheu Corrigir os dados, respondeu "Não" para o evento, respondeu à pergunta da IA com "Não só caixa de som, preciso de microfone também" e, depois, editou a descrição acrescentando o microfone. O chamado chegou ao resumo como **Caixa de Som** e com **"É para um evento?" Não**.

- **Equipamento a mais:** nada conferia se a resposta à IA ou a descrição editada mudavam o pedido; a revisão da IA considera coerente qualquer relato que cite o item escolhido. Nova conferência local (`fullerItem` em `request-policy.js`): no Audiovisual, se o relato ou as respostas citam caixa de som, microfone ou projetor que o tipo escolhido não tem, o chat sugere o tipo que junta tudo ("Você também citou microfone… quer mudar o pedido para Caixa de Som / Microfone?"). Ignora menções negadas ("não vamos precisar de microfone"), nunca tira equipamento e não repete a sugestão recusada. Ao trocar, as respostas já dadas continuam valendo e só o que falta é perguntado.
- **Evento contraditório:** em Corrigir os dados, a mensagem dizia "deixei os valores preenchidos", mas as perguntas de Sim/Não apareciam sem marcar o valor entendido. Agora a opção da IA vem destacada. E se o relato fala em evento e a resposta foi "Não" (`eventMismatch`), o chat confirma uma vez antes de seguir.
- As conferências rodam antes da revisão da IA e depois de cada resposta a ela, sem gastar cota da IA.
- "IA pronta para ajudar" no fim do print não era falha: o topo mostra "IA conectada" até 2 minutos depois da última resposta da IA e volta para "pronta" quando ela fica ociosa.
- Apps Script republicado para alinhar a versão (as regras de `request-policy.js` também vão para o `PortalShared.gs`). Verificação em verificacao-v0.12.3.md.

## 0.12.4 — 2026-10-20

Pedido do usuário (com prints): ao mexer o mouse, o quadro da abertura inclinava em 3D; ele quer o quadro parado e só o robô acompanhando.

- Removida a inclinação do quadro: o cálculo de `--tilt-x`/`--tilt-y` em `atmosphere.js`, a rotação com perspectiva em `atmosphere.css` e as regras de transição e de movimento reduzido que só existiam para ela em `motion.css`.
- Os olhos do robô continuam seguindo o cursor (0.11.1), e as linhas da cena continuam encaixadas nos cartões (0.12.2).
- Apps Script republicado só para alinhar a versão. Verificação em verificacao-v0.12.4.md.

## 0.12.5 — 2026-10-20

Pedido do usuário: o fundo do chat estava "meio morto"; colocar elementos no fundo.

- Nova camada `.chat-backdrop` (index.html), no tema da marca ("Você conta. A gente conecta."): uma rede de conexões em linhas finas com pontos que respiram e quatro sinais correndo pelas linhas, oito ícones de TI em contorno (notebook, Wi-Fi, impressora, fone, conversa, engrenagem, escudo e nuvem) flutuando nas laterais e duas luzes suaves que passeiam devagar.
- Fica só na faixa da conversa: `atmosphere.js` acompanha a posição e a altura dela, então nada passa por trás do topo, das etapas ou da área de botões. Está abaixo das mensagens e não recebe cliques.
- Bem transparente (linhas a 22% da cor de destaque, ícones a 20%) e com ciclos longos e defasados (5,6 s a 46 s). No tablet e no celular ficam só quatro ícones, menores e encostados nas bordas, e a rede mais apagada. Some com o teclado aberto no celular e em cores forçadas; com movimento reduzido fica parada.
- Animações em `motion.css`; estilos em `atmosphere.css` (seção 0.12.5).
- Apps Script republicado só para alinhar a versão. Verificação em verificacao-v0.12.5.md.

## 0.12.6 — 2026-10-20

Pedido do usuário: "a luz do cursor está muito grande" e "melhore a barra lateral também".

- **Luz do cursor:** o círculo que acompanha o mouse no fundo do chat passou de 520 para 260 px de raio. O brilho fixo do alto não mudou.
- **Seu atendimento como trilha de progresso:** cada item ganhou um ícone (pessoa, envelope, prédio, ferramentas); o que já foi informado fica preenchido com o gradiente da marca, o próximo a responder fica destacado e pulsa de leve, e uma linha cresce do primeiro ícone até a etapa atual. O título mostra a contagem ("2 de 4"). Valores ainda não informados ficam em itálico e mais apagados. A linha é calculada em pixels (`placeContextLine` em app.js), porque e-mails e necessidades longos ocupam duas linhas.
- **Dicas que se revezam:** o cartão "Sem complicação" agora alterna três dicas a cada 9 s ("Sem complicação", "Uma pergunta por vez", "Guarde o número"), com pontinhos indicando qual está à vista. Pausa com o mouse em cima; com movimento reduzido fica só a primeira.
- **Fundo da barra:** luz suave roxa e azul na parte de baixo, que respira devagar, no mesmo estilo do fundo do chat.
- Animações em `motion.css`; estilos em `atmosphere.css` (seção 0.12.6).
- Apps Script republicado só para alinhar a versão. Verificação em verificacao-v0.12.6.md.

## 0.12.7 — 2026-10-20

Pedido do usuário (com prints): "eu disse para melhorar, e não aumentar" — a barra lateral da 0.12.6 rolava para os lados e para baixo; ajustar e acrescentar elementos que façam sentido e combinem com a página.

- **Causa da rolagem:** a luz do pé da barra (0.12.6) passava 30% das bordas e 6% do fundo; como a barra rola quando o conteúdo não cabe, ganhou rolagem lateral (60–87 px) e vertical (41–74 px) em todos os tamanhos de computador. A varredura da 0.12.2 não pegou porque media só a rolagem da página, não a de dentro dos elementos — agora mede (`rolagemLateralInterna` e `rolagemBarra`).
- **Correção:** a luz fica dentro dos limites e a barra nunca rola para os lados. Os itens da barra não encolhem mais (antes a dica era espremida e cortava o texto quando faltava espaço) e uma proteção (`fitSidebar` em app.js) tira primeiro "O que a TI atende" e depois a dica se o conteúdo não couber — por exemplo, com um e-mail longo que quebra linha.
- **Alturas medidas:** a dica só aparece acima de 860 px de altura (em 821–860 ela já não cabia); com altura até 560 px (celular grande deitado, 932×430) a barra sai e fica o layout do celular, com o botão "+" de novo atendimento no topo.
- **"O que a TI atende":** as quatro áreas com os ícones das opções do chat (Audiovisual, Impressora, Google, TI), em duas colunas. Aparece onde cabe com folga — com a dica, a partir de 955 px de altura; sem ela, de 740 a 860 px — e não aparece na barra estreita (telas até 1100 px de largura).
- **Rede no pé da barra:** o mesmo desenho do fundo do chat, com pontos que respiram e um sinal correndo; ocupa só o espaço livre entre o Painel de gestão e o rodapé e some quando não sobra espaço.
- Apps Script republicado só para alinhar a versão. Verificação em verificacao-v0.12.7.md.

## 0.12.8 — 2026-10-20

Pedido do usuário (com prints): "O que a TI atende" parecia botões e induzia a clicar; adicionar elementos; no geral, melhorar as cores do tema claro.

- **"O que a TI atende" como lista informativa:** sem caixa, borda ou fundo; cada linha tem o ícone, o nome da área e uma descrição curta (Audiovisual · som e projetor; Impressora · papel e toner; Google · e-mail e Drive; TI · computador e internet). Continua aparecendo só onde cabe; a proteção da barra (sem tolerância de 1 px agora) a retira se o conteúdo não couber.
- **Tema claro:** antes o fundo da página era cinza-azulado (#c9d4e3), o do chat outro cinza parecido (#e0e7f0) e uma névoa colorida a 42% com rosa deixava tudo lavado. Agora: fundo #eef1f8 com névoa suave a 26% (lilás e azul, sem rosa), barra lateral, topo, área de botões e balões do assistente brancos, balões da pessoa lilás (#ebe5ff, texto #2f1f6b), texto principal #1b2233, secundário #56607a, linhas #dce1eb, azul de informação #245d96, e as linhas do fundo do chat mais discretas no claro. O tema escuro não mudou.
- **Contraste (WCAG) da paleta clara:** todos os pares de texto do relatório da 0.8.10 passam (de 5,3:1 a 15,9:1); a borda das opções ficou em 3,2:1 (mínimo 3:1).
- Apps Script republicado só para alinhar a versão. Verificação em verificacao-v0.12.8.md.

## 0.12.9 — 2026-10-20

Pedido do usuário (com prints): o tema claro "ficou horrível" — ser mais criativo, com cores que deixem o ambiente intuitivo; no tema escuro, a barra lateral ainda não estava boa; e, no chat, um elemento do fundo ficava atrás do robozinho das mensagens (ajustar sem remover).

- **Tema claro redesenhado:** a 0.12.8 deixou tudo branco, e barra, chat, fundo e cartão de boas-vindas se confundiam. Agora cada área tem um papel: página em cinza-azulado suave (#e7eaf4) com aurora lilás e azul, para os painéis brancos saltarem; cartão de boas-vindas em gradiente roxo→azul com texto branco e a cena com cartões brancos (ponto focal da abertura); conversa num lilás bem claro (#f4f3fa); balões da pessoa em roxo sólido com texto branco, como nos apps de mensagem; balões do assistente brancos; etapa atual da trilha em roxo; área de botões branca; cabeçalho do painel de gestão no mesmo gradiente. O tema escuro não mudou, fora a barra lateral.
- **Barra lateral (os dois temas):** "Seu atendimento" virou o cartão "Seu chamado": cabeçalho em gradiente roxo e azul profundo, anel de progresso (0/4 a 4/4), título que acompanha o momento ("Vamos começar", "Em andamento", "Quase pronto" e, depois do envio, "Chamado #NNN enviado", com o anel verde) e o picote de ticket entre o cabeçalho e a trilha. A dica ganhou a lâmpada num selo âmbar ao lado do título e ocupa menos altura. A barra continua sem rolar em nenhum tamanho: a proteção agora também pode tirar o rodapé e, até 600 px de altura, a barra dá lugar ao layout do celular.
- **Elemento atrás do robozinho:** os ícones do fundo eram posicionados por porcentagem da largura e, em telas largas, o balão de conversa caía na coluna dos avatares. Agora o atmosphere.js mede a lateral livre de cada lado da coluna de mensagens e os ícones ficam no meio dela; com lateral estreita (celular, tablet) ficam só os da direita. A rede de conexões fica forte nas laterais e suave (25%) dentro da coluna das mensagens. Medido: nenhum ícone encosta em robozinho.
- Apps Script republicado só para alinhar a versão. Verificação em verificacao-v0.12.9.md.

## 0.12.10 — 2026-10-20

Pedido do usuário (prints e um vídeo de 6 s): melhorar a profundidade da barra lateral no tema claro; a parte de "O que a TI atende" e do "Painel de gestão" não combinava com o resto; colocar setas e deslizar nas dicas; o hover do botão lilás ainda piscava no tema escuro; cores, efeitos e animações devem direcionar o foco.

- **Hover sem piscar:** os quadros do vídeo mostraram o botão "Sim, vamos começar" escurecendo ao receber o mouse. Causa medida no navegador: regras antigas (identity.css e visual-depth.css) trocavam o gradiente por uma cor sólida no hover; o gradiente sumia na hora e a cor fazia a transição a partir de transparente, então por um instante o botão ficava sem fundo. Agora o fundo é o mesmo gradiente no hover (nenhuma transição de fundo começa); o retorno vem do brilho e da sombra. "Painel de gestão" e "Novo atendimento" também não sobem mais 2 px no hover.
- **Profundidade e uma linguagem só na barra:** fundo levemente degradê e todos os blocos como cartões elevados — no claro, brancos com sombra suave em lilás; no escuro, vidro com sombra profunda. A sombra do cartão "Seu chamado" acompanha o picote (fica num invólucro fora da máscara). "O que a TI atende" virou um cartão com ícones em círculos coloridos, como os da trilha, sem nada com cara de botão; "Painel de gestão" virou um item de navegação com ícone, nome, a descrição "Fila e etapas" e seta.
- **Dicas navegáveis:** setas de anterior e próxima, pontinhos clicáveis (com destaque no atual) e arrastar para o lado com o dedo ou o mouse (mais de 40 px). A dica entra pelo lado da navegação. Quando a pessoa navega, a troca automática para e o leitor de tela passa a anunciar a dica nova.
- **Foco:** o botão principal continua o elemento mais forte da área de botões; na barra, o destaque fica na etapa atual do cartão; a rede do pé ficou mais discreta no claro.
- A barra continua sem rolar: espaços entre cartões ajustados para "O que a TI atende" caber na tela do usuário (1864 × 958); onde não cabe, a proteção o retira.
- Apps Script republicado só para alinhar a versão. Verificação em verificacao-v0.12.10.md.

## 0.12.11 — 2026-10-21

Pedido do usuário (prints do chat e do painel nos dois temas): "Agora melhore o painel de gestão também".

- **Barra lateral do painel:** virou um cartão flutuante, como a do chat (claro: branco com degradê lilás e sombra; escuro: vidro). "Visão geral" e "Abrir chamado" são itens de navegação com ícone, nome e descrição; o item atual fica em cartão elevado com ícone em gradiente.
- **Fila por etapa (novo):** na barra, as sete etapas com a cor de cada coluna e quantos chamados há em cada uma. Tocar numa etapa rola até a coluna do quadro e a acende por um instante; etapas vazias ficam apagadas. Funciona como legenda do quadro e atalho. A mesma rede discreta do pé da barra do chat ocupa o espaço livre.
- **Indicadores:** ícone em cada cartão, barra fina com a parte no total ("83% do total") e um destaque só — "Chamados abertos", o número que pede ação (borda, ícone em gradiente e número na cor da marca). Os outros ficam neutros, com o ícone na cor da coluna correspondente. Os cartões não sobem mais no hover (não são clicáveis).
- **Distribuição por área:** áreas em ordem (maior no topo), barras em cinza e só a líder colorida; o título diz a conclusão ("TI lidera com 4 chamados"; empates citam as áreas). As barras são proporcionais à líder.
- **Pulso do atendimento:** o título diz o que pede ação ("2 chamados novos esperam a primeira resposta") e o botão "Ver novos chamados" leva à coluna. A etiqueta "Equipe conectada", que não informava nada, saiu.
- **Autoatendimento com IA:** o número primeiro (30% resolvidos sem abrir chamado), depois a barra e o detalhe.
- **Quadro:** coluna vazia com ícone; a coluna escolhida pela fila ou pelo pulso acende e apaga (e recebe o foco, para quem usa teclado).
- **Chat — dicas sem sobreposição:** na troca, as duas dicas cruzavam a meia opacidade e o texto se misturava (visto no print do tema claro). Agora a que sai some em 160 ms, parada, e a nova entra depois, vinda do lado da navegação.
- O anel no botão "Tema escuro" do print não é falha: após o clique com o mouse não há anel; ele aparece quando alguma tecla é pressionada com o botão em foco (por exemplo, o atalho de captura de tela) — é o indicador de foco do teclado.
- Apps Script republicado só para alinhar a versão. Verificação em verificacao-v0.12.11.md.

## 0.12.12 — 2026-10-21

Pedido do usuário: "dentro dos cards e no kanban principalmente, estou sentindo falta de profundidade, as colorações não estão intuitivas, acabam se misturando e confundindo o usuário".

Medido no navegador antes de mudar (0.12.11): no tema escuro o cartão do quadro era mais escuro que a coluna onde fica (afundava em vez de saltar); no claro, branco sobre quase branco; toda etiqueta de área e toda "Simulação" usavam o lilás da marca, o mesmo de "Novos chamados", em todos os cartões; "Novos chamados" e "Agendado" tinham quase o mesmo violeta (#6a4fd8 e #7a52c7); e cada coluna era tingida com a sua cor.

- **Cor = etapa, e só etapa.** Cada etapa tem um tom distinto ("Agendado" passou a rosa: #c2417f no claro, #f49ac8 no escuro) e a cor aparece só na linha do topo da coluna, no ponto, no contador e na borda esquerda do cartão — também na fila da barra lateral e na luz do mouse sobre o cartão. Etiquetas de área, "Simulação" e data ficaram neutras (cinza com ícone); "Autorização pendente" se destaca pela borda tracejada e pelo texto forte, sem usar cor de etapa.
- **Profundidade no quadro:** três camadas — o quadro num painel, as colunas rebaixadas (sombra interna; no escuro, a camada mais escura) e os cartões elevados (no escuro, a camada mais clara, com brilho na borda de cima e sombra; no claro, brancos com sombra lilás). No hover a sombra cresce e a borda pega a cor da etapa.
- **Dentro do cartão do quadro:** número discreto, título forte, área e etiquetas neutras e a data num rodapé com divisória e ícone de calendário.
- **Cartões de cima:** no claro, brancos de verdade com sombra em camadas (antes vidro acinzentado). O pé de cada indicador, o gráfico de áreas, o detalhe do pulso e o autoatendimento ficam num poço interno (superfície rebaixada); os ícones dos indicadores ganharam relevo.
- Estado anterior: EVID-261 (0.12.11). Apps Script republicado só para alinhar a versão. Verificação em verificacao-v0.12.12.md.
