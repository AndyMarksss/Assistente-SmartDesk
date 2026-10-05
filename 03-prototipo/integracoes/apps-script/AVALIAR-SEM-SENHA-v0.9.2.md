# Avaliar sem senha — SmartDesk 0.9.2

Instrução direta do usuário: o professor abre o Pages sem senha, conta Google, comandos ou instalação. A interface inicia uma sessão técnica automaticamente. A avaliação pública pode criar chamados reais com IA/anexos e ver/alterar somente os chamados enviados na própria sessão; simulações do painel continuam disponíveis. Não expõe chamados anteriores de terceiros. A sessão é temporária e pode expirar; chamados confirmados continuam na planilha e arquivos privados no Drive. Painel local do proprietário permanece completo.

## O que aplicar agora

Extraia SmartDesk-v0.9.2-sem-senha.zip. Substitua o conteúdo de **Portal.gs**, **Pages.gs** e **PortalShared.gs** pelos arquivos do pacote. Os demais .gs já aplicados em 0.9.1 permanecem.

Não crie nem preencha SMARTDESK_PORTAL_PASSWORD: deixou de ser utilizada. Se já existe, pode ficar; o código não a lê. Preserve SMARTDESK_SHEET_ID, SMARTDESK_FOLDER_ID e SMARTDESK_TOKEN. Configure GEMINI_API_KEY e GEMINI_MODEL como no protótipo existente, e SMARTDESK_PAGES_ORIGIN = https://andymarksss.github.io. Não publicar chaves/token nem compartilhamento público do Drive. Manifesto appsscript.json do pacote anterior continua válido. Não execute configurador/diagnóstico.

Depois: Implantar → Gerenciar implantações → editar implantação existente → **Nova versão** → SmartDesk 0.9.2 — avaliação sem senha → Implantar. Executar como você, acesso Qualquer pessoa, mantendo a URL /exec existente. Conferir permissões em sua conta.

Abra https://andymarksss.github.io/Assistente-SmartDesk/ em janela privada. O chat abre direto e rodapé mostra 0.9.2. Como funciona/opções funcionam sem login. Após atualização Google, conferir IA e um chamado fictício com TXT, número na planilha, arquivo privado no Drive e cartão em Chamados desta avaliação. Ao abrir painel pela mesma aba, sessão é preservada; uma janela privada separada não vê os chamados dessa sessão. Demonstração mantém 12 simulações isoladas. Nova sessão não vê nem altera chamados antigos de outras sessões. Nunca usar dados pessoais nos testes públicos.

Testes automatizados de isolamento/fluxo passaram com Google simulado; recebimento real ainda depende desta atualização manual. Dez suítes aprovadas. Origem e nonce das respostas permanecem validados; não tratar resposta opaca ou timeout como recibo. Sem custo contratado, sujeito às quotas gratuitas existentes. A revisão automática rejeitou a primeira proposta ampla por liberar gestão de todos os dados reais; a alternativa aplicada limita os dados ao contexto da avaliação.
