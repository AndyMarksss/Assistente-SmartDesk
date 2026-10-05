# Estrutura do SmartDesk — 0.9.0

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
