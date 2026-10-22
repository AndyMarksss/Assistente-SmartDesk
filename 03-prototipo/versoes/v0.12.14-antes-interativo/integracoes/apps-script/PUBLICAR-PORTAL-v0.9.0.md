> SUPERADO pela correção 0.9.1: seguir APLICAR-CORRECAO-PAGES-v0.9.1.md. A interface deve permanecer no Pages, sem redirecionamento.

# Publicar SmartDesk 0.9.0 no projeto Google existente

Esta é a entrega escolhida: Apps Script executa chat, painel, Gemini, planilha e Drive. Pages encaminha para o portal Google. Não criar conta Render, não contratar hospedagem, não ativar faturamento. Código adaptado e serviços simulados testados; implantação real ainda precisa ser atualizada e conferida.

## 1. Atualizar os arquivos

Abra o projeto existente: https://script.google.com/home/projects/1Fc_p6mlNNvpqzouZFURAzcSS8XkHza-4hlaSuziIM607BSDgDxEEYwK5/edit . Faça uma cópia de segurança dos arquivos atuais antes de substituir conteúdos. O pacote ZIP fornecido contém somente fontes públicas, sem chaves, token ou dados.

No editor, substitua o conteúdo dos arquivos existentes **Code.gs, Gestao.gs, Schema.gs e Diagnostico.gs** pelos arquivos de mesmo nome deste pacote. Crie dois arquivos de Script: **Portal** e **PortalShared** (o editor acrescenta .gs). Cole seus conteúdos. Crie dois arquivos HTML: **PortalChat** e **PortalAdmin** (o editor acrescenta .html) e cole os conteúdos completos. Salve todos. Não cole tags HTML em um arquivo .gs. O ZIP deve ser extraído no computador; não é importado diretamente no editor Google.

Em Configurações do projeto, habilite a exibição do arquivo de manifesto appsscript.json; substitua seu conteúdo pelo manifesto do pacote. Ele mantém V8 e fuso America/Sao_Paulo e declara acesso a Sheets, Drive e requisições externas. Se aparecer uma solicitação de autorização, confira os serviços solicitados antes de autorizar. Não altere o compartilhamento dos anexos para público.

**Não execute configurarSmartDesk_ novamente e não crie outra planilha/pasta.** O portal usa os IDs e o token já configurados. As funções configurarSmartDesk_ e diagnosticarSmartDesk_ ficam privadas para o navegador; não execute diagnóstico como parte da publicação, pois ele grava um teste. Evite deixar cópias antigas com nomes públicos dessas funções no projeto ativo.

## 2. Configurar as duas informações privadas adicionais

Nas Propriedades do script, preserve SMARTDESK_SHEET_ID, SMARTDESK_FOLDER_ID e SMARTDESK_TOKEN sem alterações. Adicione:

- **GEMINI_API_KEY**: a chave Gemini já usada no protótipo local. Copie diretamente do seu arquivo privado/Google AI Studio; não envie no chat, commit ou print.
- **GEMINI_MODEL**: gemini-3.5-flash-lite. Manter o modelo e a modalidade gratuita já escolhidos, sem ativar faturamento.
- **SMARTDESK_PORTAL_PASSWORD**: uma senha própria do protótipo, de 16 a 256 caracteres. Não reutilize a senha da sua conta Google. Compartilhe essa senha apenas com o professor/avaliadores.

O token de recebimento nunca é usado como senha do portal e nunca vai ao navegador. Uma sessão temporária protege as operações; cache pode expirar antes de uma hora. Sessão expirada pede recarregamento e nova entrada. Chat e gestão compartilham o mesmo acesso acadêmico; não existe separação corporativa de perfis nesta versão.

## 3. Atualizar a implantação e conferir

Implantar → Gerenciar implantações → selecione a implantação de app da Web existente → Editar → Nova versão → descrição SmartDesk 0.9.0 — portal completo → Implantar. Manter execução como proprietário e conferir o público de acesso adequado à avaliação. A publicação como proprietário dá às funções autorizadas acesso à planilha/Drive dele; o portal exige a senha antes de operações, sem tornar os arquivos do Drive públicos. A atualização deve manter a URL /exec existente; não use a URL do editor nem /dev como link de entrega.

Abra a URL /exec em uma janela privada. Deve aparecer **Acesso ao protótipo**; depois da senha, o chat e a versão 0.9.0. Teste Como funciona, temas e rolagem. Faça um atendimento fictício identificado como teste acadêmico, com arquivo TXT sem dados pessoais. Confirme o número na planilha e o arquivo no Drive na conta proprietária. No Painel de gestão, selecione Google Planilhas e confira o chamado; Demonstração continua separada, com 12 simulações temporárias. Anexos do Drive permanecem privados: ter a senha do portal não concede automaticamente acesso direto ao arquivo no Drive.

IA pronta (âmbar) significa chave configurada; verde exige resposta válida recente. Falha/quota excedida mantém os textos locais e não inventa sucesso de envio. Caso Google solicite uma autorização adicional, faça isso na sua própria conta; nenhum procedimento exige contratar um serviço pago.

Depois de conferir o portal, em GitHub → Settings → Secrets and variables → Actions → Variables, definir **SMARTDESK_SERVICE_URL** com a URL pública /exec, sem parâmetros, senha, chave ou token. Executar novamente a ação Deploy SmartDesk to GitHub Pages. Pages será o endereço de entrada, com mudança de endereço para Google ao abrir o protótipo. Enviar ao professor os links do repositório/Pages e a senha de avaliação por canal privado. Pode também fornecer o link /exec como alternativa direta.

## Manutenção

As fontes são index.html, admin.html, assets/ e server/ticket-validation.cjs. Portal.gs contém o adaptador Google. npm run build:apps-script gera PortalChat.html, PortalAdmin.html e PortalShared.gs. Não editar os artefatos gerados diretamente; atualizar a versão/documentação, gerar novamente e republicar os arquivos alterados no Google. Mudanças no GitHub não atualizam automaticamente a implantação Apps Script.

Rascunhos ficam na memória do navegador até enviar, sem gravar contatos em cache público. Simulações ficam no cache temporário da sessão; nunca na planilha real. Chamados confirmados/anexos mantêm a numeração/idempotência e armazenamento Google existentes. Limites de arquivos continuam: cinco, até 10 MB cada e 20 MB no total; arquivos grandes e teclado real ainda exigem conferência no ambiente Google/dispositivo real.

O Apps Script e Gemini têm quotas gratuitas. Nenhum recurso deste pacote habilita faturamento; quotas excedidas podem impedir operações. Fontes: https://developers.google.com/apps-script/guides/html/communication ; https://developers.google.com/apps-script/guides/html/restrictions ; https://developers.google.com/apps-script/guides/services/quotas . Consulta: 2026-10-05.
