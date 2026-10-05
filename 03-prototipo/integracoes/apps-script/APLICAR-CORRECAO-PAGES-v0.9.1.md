# Aplicar correção 0.9.1 — interface no GitHub Pages

Esta entrega corrige a arquitetura 0.9.0 que desviou da solicitação do usuário. O chat e o painel completos continuam no GitHub Pages; Google executa apenas IA, recebimento, anexos e gestão. Não há redirecionamento do visitante. O professor não instala Node, abre terminal nem roda npm. Desenvolvimento local continua opcional. Publicação remota ainda precisa ser atualizada/testada.

## Atualizar somente o necessário no Apps Script

Você já aplicou 0.9.0. Extraia o ZIP **SmartDesk-v0.9.1-correcao-Pages.zip**. Substitua o conteúdo de **Código.gs (ou Code.gs), Gestao.gs, Portal.gs e PortalShared.gs** pelas versões deste pacote. Não crie um segundo Code.gs se o projeto já tem Código.gs: deve existir uma única função doGet e uma única doPost. Crie um arquivo de Script **Pages**, cole Pages.gs e salve. Schema.gs e Diagnostico.gs já aplicados permanecem. PortalChat.html e PortalAdmin.html antigos podem ficar no editor: não são mais utilizados e o Google não serve o chat/painel. Não execute configurarSmartDesk_ ou diagnosticarSmartDesk_, não crie planilha/pasta nova.

## Propriedades privadas e manifesto

Em Configurações do projeto → Propriedades do script, preserve SMARTDESK_SHEET_ID, SMARTDESK_FOLDER_ID e SMARTDESK_TOKEN. Se ainda não adicionou: GEMINI_API_KEY (a chave já usada localmente), GEMINI_MODEL (gemini-3.5-flash-lite, sem mudar faturamento) e SMARTDESK_PORTAL_PASSWORD (senha exclusiva de avaliação, 16–256 caracteres). Configure SMARTDESK_PAGES_ORIGIN como **https://andymarksss.github.io**, sem barra final ou caminho. Chaves/token/senha nunca no GitHub, chat ou prints. Origem e URL /exec são públicas.

Habilite exibição de appsscript.json nas configurações e aplique o manifesto do pacote se ainda não fez. Ele usa V8 e America/Sao_Paulo, com acesso à planilha, Drive e requisições Gemini. Confira os serviços ao autorizar em sua conta.

## Publicar a nova versão

Implantar → Gerenciar implantações → implantação existente → Editar → **Nova versão** → descrição SmartDesk 0.9.1 — API para Pages → Implantar. Execução como proprietário, acesso **Qualquer pessoa** para o professor abrir pelo Pages sem login Google; a senha de avaliação protege as operações. Não torne a planilha ou anexos públicos. Se sua instituição restringir publicação anônima, informar: não contornar restrições.

A URL existente já está registrada no arquivo público do repositório:
https://script.google.com/macros/s/AKfycbxZv0elHNTKr8gSSjwmdU6XAMVdjjCTPZwInqOf0w74y7Nmj-IBgkCNNIeRQ3nmttHb/exec

A ação Pages usa a URL pública registrada no repositório; não é necessário criar variável ou segredo no GitHub. GitHub Actions publica somente index.html, admin.html, assets/, smartdesk-config.js e .nojekyll; não publica .env, servidor, dados nem históricos.

## Conferir no endereço de entrega

Abrir **https://andymarksss.github.io/Assistente-SmartDesk/** em janela privada. Deve aparecer o acesso de avaliação, rodapé 0.9.1 e endereço permanecer no domínio github.io durante chat e painel. Como funciona deve acompanhar mensagens. Testar um chamado com dados fictícios e arquivo TXT; confirmar número na planilha, arquivo privado no Drive e cartão em Chamados do Google. Confirmar IA verde somente após resposta válida; chave configurada indica pronta em âmbar. Quota/falha mantém textos locais e não produz recibo falso. Demonstração é separada e temporária na sessão.

A confirmação chega pelo iframe técnico oculto e postMessage com origem e identificador aleatório; senha/sessão/conteúdo usam POST, nunca a URL. Não usamos resposta opaca no-cors como prova de envio. Apenas a resposta técnica permite incorporação; nenhum HTML do chat/painel é hospedado pelo Google. A ponte permite resposta incorporada, mas valida sessão e origem, não expõe a chave/token. O professor pode precisar da senha de avaliação fornecida por canal privado, sem comandos/instalações.

## Manutenção e limites

Editar os arquivos do VS Code normalmente. Commit/push publica a interface pelo Pages. Mudanças em fontes .gs/regras compartilhadas requerem aplicar a nova versão no Apps Script; não são atualizadas pelo GitHub automaticamente. build:apps-script gera somente PortalShared.gs. Versão 0.9.0 preservada no histórico. Serviços gratuitos têm quotas; nenhum código ativa faturamento. Anexos grandes e teclado real exigem verificação no Google/aparelho. Atualização 0.9.1 passou em testes simulados; não afirmar confirmação Google antes do teste real.

Referências técnicas: https://developers.google.com/apps-script/guides/html/restrictions ; https://developers.google.com/apps-script/reference/html/x-frame-options-mode ; https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage . Consultadas em 2026-10-05.
