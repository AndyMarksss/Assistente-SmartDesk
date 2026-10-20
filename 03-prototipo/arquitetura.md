# Estrutura do SmartDesk — 0.12.3

## Cliente
Os scripts são carregados com defer na ordem declarada em index.html. Não há ferramenta de compilação: os arquivos continuam funcionando no servidor local e a apresentação estática no GitHub Pages.

- knowledge-base, classifier, flows e request-policy: catálogo, elegibilidade e regras compartilhadas; os dados avaliados foram comparados à versão anterior.
- conversation-copy: textos por contexto.
- client-api: transporte JSON, limites de espera e erros de resposta; compartilhado pelo chat e gestão.
- chat-view: fila de mensagens, indicador de digitação e cancelamento por revisão da conversa.
- form-controls: data/hora, máscaras, validação e alternância do mesmo campo.
- attachments: validação atômica, limites, deduplicação e leitura de arquivos.
- app: coordenação do atendimento, navegação, resumo e envio. Continua sendo o controlador central; não se afirma eliminar toda possibilidade de melhoria futura.
- admin: filtros, quadro e detalhes; animações de entrada somente ao carregar/atualizar dados, sem reiniciar a cada tecla da busca.
- mobile-viewport e theme: adaptação da área visível e preferência de tema.

assistant-engine e personality continuam como arquivos legados não carregados na página atual; não foram removidos para preservar compatibilidade e referências anteriores.

## Servidor
server coordena rotas e arquivos estáticos. ticket-service coordena recebimento; request-body centraliza limite/leitura JSON; ticket-validation reúne regras de seleção, assunto e respostas. ai-provider, google-storage e management preservam responsabilidades separadas. Erros de validação no painel usam 400, chamado ausente 404 e conflito de etapa 409; falhas externas/local de persistência têm mensagem apropriada à origem.

Dados pessoais, arquivos e autorização não são enviados à IA. Recibo precisa informar status enviado, o mesmo requestId e número não vazio antes de confirmar no chat. O servidor continua sendo necessário para operações reais; GitHub Pages oferece somente a interface estática.

## Estilo e movimento
As camadas de CSS visual foram preservadas para não alterar o layout aprovado. motion.css, carregado por último, reúne todas as transições e os 12 keyframes próprios. Não há mais definições de animação distribuídas nas seis folhas visuais. Movimento usa principalmente opacity/transform, com durações curtas. Robô e traços de conexão completam dois ciclos. Digitação, espera de envio, atualização e salvamento só continuam durante a operação. prefers-reduced-motion desativa animações/transições e remove atrasos da fila de mensagens. Não há botão de pausa.

## Manutenção
Node 22 ou superior. A partir desta pasta: npm start inicia o servidor; npm test executa sete suítes. npm ci instala somente a ferramenta de formatação necessária aos comandos npm run format e npm run format:check. Prettier tem versão fixada e ignora fornecedor, histórico e dados locais. Arquivos de configuração privada e dados do servidor nunca devem entrar no Git.

A cópia anterior está em versoes/v0.8.10-antes-refatoracao, sem credenciais ou dados locais. Mudanças de fluxo devem executar testes de integração/autorização/data/anexos e verificar navegador. Alterações de animação devem conferir foco, cliques, cancelamento e preferência de movimento reduzido. Viewport reduzido não comprova teclado físico de celular.

## Versão visível e documentação
A fonte única é package.json. Use npm run version:update -- NOVA_VERSAO em toda entrega que alterar código/interface; o comando sincroniza pacote, lock, rodapés e VERSAO.md. Execute npm run version:check antes do commit. Atualize também CHANGELOG.md e o relatório da entrega, preservando documentos históricos.

## Personagem e circuito
Cabeçalho, ilustração e avatares do assistente compartilham assets/img/assistente.svg. O avatar é decorativo (alt vazio e contêiner aria-hidden), pois a mensagem já identifica SmartDesk. O sinal luminoso deve seguir exatamente o circuito estático, com comprimento normalizado. A área de resposta reserva espaço simétrico de rolagem para manter o rodapé no eixo central.

## Acompanhamento da conversa
chat-view.createScrollFollower mantém a abertura no topo antes da interação e acompanha respostas depois dela. Observa altura do log, mensagens e área de resposta. Atualizações são agrupadas em requestAnimationFrame após layout. readyControls libera a altura reservada do dock e reagenda rolagem; isso evita perguntas cortadas após campos/opções mudarem de altura. Recomeçar reseta o acompanhamento. Circuito ilustrado usa quatro paths dirigidos ao centro, com delays independentes e término invisível.

## Hospedagem real 0.8.15
server/hosting.cjs valida origem pública e exige acesso de avaliação na nuvem. Servidor usa PORT e 0.0.0.0 quando hospedado; local mantém 127.0.0.1:4173. scripts/build-pages.cjs gera apenas dois documentos de entrada e .nojekyll. Workflow publica pages-dist, não a árvore do protótipo. Integrações continuam no servidor; guia em hospedagem.md.

## Portal Google 0.9.0
Apps Script serve HTML autocontido em sandbox IFRAME, com base target=_top. Código JS/CSS/ícones/fontes/SVG são empacotados das fontes existentes, sem HTTP local nem chaves. client-api seleciona google.script.run quando o portal está presente e preserva fetch para desenvolvimento Node. Portal.gs oferece duas entradas RPC: login e smartdeskCall. Cada operação exige sessão, valida seleção/campos/autorização e delega recebimento/gestão ao Apps Script existente. PortalShared.gs é gerado de matriz, regras e validação para evitar divergência. IA recebe somente descrição/contexto permitido; contatos/anexos ficam excluídos. Pages aceita URL /exec e diferencia chat/admin. Manifesto usa V8, timezone São Paulo e escopos Google existentes/externos necessários. Deploy Google não é automático a cada push; republicar segundo guia.

## Correção definitiva 0.9.1

Substitui o portal/redirecionamento 0.9.0: Pages serve a interface e Apps Script recebe POST de operações em iframe técnico oculto. Pages.gs retorna apenas confirmação via postMessage destinada à origem exata do Pages, correlacionada por nonce aleatório. Login gera sessão opaca temporária; regras/segredos/IA/Google permanecem servidor. Cliente não trata no-cors, timeout ou carga do iframe como confirmação. Build publica apenas interface/assets/config pública; não servidor/históricos/segredos.

## Avaliação pública 0.9.2
Sem senha ou login humano. Sessão técnica opaca automática persistida em sessionStorage para navegação chat/painel. A lista/edição Google da ponte pública só permite IDs registrados pelo servidor após recebimento na sessão. Chamados prévios inacessíveis; não depende de filtro cliente. Renovação após 401 tenta uma vez, preservando ID/conteúdo.

## Atmosfera e IA 0.10.0
Camadas de CSS: `atmosphere.css` carrega depois de `identity.css` e antes de `motion.css`; usa seletores `:root[data-theme]` para vencer as camadas antigas sem `!important`. Texto fica sobre superfícies com 88–94% de opacidade; a transparência maior fica nas molduras (lateral, conversa, dock). Toda animação e transição continua em `motion.css` (teste `refactor.cjs` cobre também `atmosphere.css`). `atmosphere.js` grava apenas variáveis CSS de posição e um elemento decorativo de ondulação; não altera foco nem conteúdo.

`chat-view` aceita `{ ai, thinking }` em `append` e oferece `dismiss` para remover o balão de espera, mesmo antes de ele entrar na tela. `form-controls.picker` monta a grade com busca. `attachments.configure` aplica limites menores informados por `/api/status`. Em `app.js`: `pickItem` centraliza a escolha de um caminho (manual, atalho ou sugestão), `suggestPaths` guarda a última sugestão para o Voltar não chamar a IA de novo, e `reviewWithAI` → `askFollowUp` → `offerTips` ficam entre a descrição e a autorização. Rótulos como COMPUTADOR são exibidos como "Computador", mas IDs e valores canônicos não mudam.

Servidor: `ai-provider.generate` é o único ponto de chamada ao Gemini (esquema JSON in, objeto out). `ticket-validation.safeAssist` filtra a pergunta e as dicas e é reaproveitada no Apps Script pelo build. Apps Script: `portalAIJson_` aplica cota por sessão e diária antes de chamar a IA; `portalAnalyze_` restringe a resposta aos IDs do setor; `portalFile_` confere o início do arquivo conforme a extensão; o limitador de sessões usa uma chave por minuto.

## Fluxos revisados 0.11.0
`chat-format.js` concentra a formatação da conversa: rótulos legíveis, ícones, data curta com dia da semana, link pendente ("Envio depois") e `composeDescription`, que junta o relato às perguntas do assistente sem passar de 2.000 caracteres. `conversation-copy.quickReplies` define as respostas rápidas por campo e `autoDescription` monta a descrição quando ela é opcional. `form-controls` passou a ter `structured` (data/hora com botão visível e datas rápidas) e `comboBox` (setor com busca, teclado e leitores de tela).

Em `app.js`, o caminho da IA é `askDescribe` → `suggestPaths` (/api/analyze) → `buildDraft` (/api/extract) → `showDraft`; a escolha confirmada passa por `selectItem`, que guarda os dados pré-preenchidos para `askField` pular. Depois da descrição: `reviewWithAI` (/api/assist) → `askCoherence` (se o relato não combina) → `askFollowUp` → `offerTips` → `resolvedBySelf` ou autorização/anexos/resumo. O `checkpoint` copia respostas, pré-preenchidos e perguntas da IA para o Voltar restaurar o estado exato.

Servidor: `ticket-validation.safeExtract` aceita só valores no formato do campo (data futura, HH:MM, opção existente, URL) e nunca contatos, contas ou dados de alunos (`EXTRACT_SKIP`); a intenção defeito/item novo só vale em `asksEquipmentIntent`. `request-policy.requestKind` informa à IA se é problema, solicitação, dúvida ou outro. No Apps Script, `trackTicket` devolve só a situação do chamado e `autoatendimento_` grava na aba Autoatendimento (Data, Setor, Área, Necessidade, Resultado, Origem).

Painel: `admin.js` desenha o skeleton antes da primeira resposta, usa Pointer Events para o arraste (cartão-fantasma, coluna destacada, rolagem automática), atualiza a etapa de forma otimista e desfaz com aviso se o servidor recusar.

## Olhar e luz 0.11.1
`atmosphere.js` calcula o olhar do robô (`look`) no mesmo quadro da luz: direção do cursor a partir do centro do rosto, limitada por `reach` (alcance total a 240 px), gravada em `--gaze-x/--gaze-y` no SVG; o CSS aplica em `.robot-gaze` (olhos) e `.robot-gaze.mouth` (45%). A luz do chat é `.chat-shell::after` no fundo (`z-index: 0`, atrás das faixas e dos cards, que ficam em `z-index: 1`), com `width/height: auto` e `filter: none` para anular as regras antigas de `visual-depth.css`; a classe `is-lit` controla a opacidade e a transição fica em `motion.css`. Na 0.11.1 ela ficou por cima de tudo; o usuário pediu que ficasse só no fundo (0.11.2).

## Avaliação da IA e modo sem IA 0.11.3
`ai-provider.cjs` concentra as instruções de identificar, extrair e revisar, além de `analyzeCategories`; o build copia essas instruções e `analyzeCategories_` para `PortalShared.gs`, e o `Portal.gs` não tem mais texto de instrução próprio para identificar o caminho. Em `app.js`, `suggestPaths` só monta rascunho (`buildDraft`) quando a análise veio da IA; quando veio da base local, `pickLocalGuess` mostra as possibilidades como opções. A avaliação técnica fica fora do protótipo, em `04-validacao/avaliacao-ia`, e usa só as rotas `/api/analyze` e `/api/extract` e o navegador.

## Teste com usuários 0.12.0
`session-metrics.js` vive fora do `state` do chat (o Voltar restaura o estado e não pode apagar a contagem de voltas): `begin` abre o registro no primeiro clique de início, `update` junta mudanças em 500 ms e envia `/api/metrics`, `reset` fecha ao começar um novo atendimento. O código do participante vem de `?p=` e fica em `sessionStorage`. A validação (`safeMetrics`, `safeParticipant`, `metricPathLabel` em `ticket-validation.cjs`) é copiada para o Apps Script pelo build; `metricas_` (Gestao.gs) revalida e grava/atualiza a linha da sessão na aba Sessões. `Validacao.gs` monta as abas de validação com fórmulas que buscam na aba Sessões pelo número do chamado.
