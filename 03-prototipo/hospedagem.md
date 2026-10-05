# Entrega online — SmartDesk 0.8.15

Decisão: avaliação com planilha, anexos e Gemini reais. GitHub guarda código/documentação; Pages funciona como porta de entrada; um servidor Node gratuito executa interface e integrações na mesma origem HTTPS. O professor não instala nada. A configuração pública ainda não foi feita.

## Primeira hospedagem, sem contratar plano pago

1. Criar uma conta em https://render.com. Não cadastrar cartão, não ativar faturamento e não selecionar planos pagos. Se a plataforma exigir contratação ou um meio de pagamento para prosseguir, interromper e rever a alternativa.
2. Em New → Web Service, usar o repositório público https://github.com/AndyMarksss/Assistente-SmartDesk (Public Git Repository dispensa conceder acesso aos demais repositórios).
3. Branch main, Runtime Node, Root Directory 03-prototipo, Build Command npm ci --omit=dev, Start Command npm start, Instance Type **Free**, Health Check Path /healthz. Alternativamente usar o Blueprint em 03-prototipo/render.yaml, com os mesmos valores gratuitos.
4. Em Environment, configurar NODE_VERSION=22.16.0, NODE_ENV=production, GEMINI_MODEL=gemini-3.5-flash-lite e SMARTDESK_ACCESS_USER=avaliador. Escolher SMARTDESK_ACCESS_PASSWORD com pelo menos 16 caracteres; compartilhar esse acesso apenas com quem vai avaliar. É a senha do protótipo, não a senha de Google/GitHub.
5. Inserir GEMINI_API_KEY, SMARTDESK_APPS_SCRIPT_URL e SMARTDESK_APPS_SCRIPT_TOKEN nos campos privados de Environment. Usar os valores já configurados localmente, preservando o Apps Script existente. Nunca enviar valores no chat, commit, print ou variável pública do Pages. Render fornece RENDER_EXTERNAL_URL; em outro provedor, configurar SMARTDESK_PUBLIC_ORIGIN com a origem HTTPS, sem caminho.
6. Criar o serviço Free e aguardar implantação. Abrir a URL HTTPS fornecida pelo Render, informar o acesso de avaliação e verificar chat/painel. Não trocar o modelo de IA nem ativar faturamento no Google.
7. Só depois dessa verificação, no GitHub → Settings → Secrets and variables → Actions → Variables, criar **SMARTDESK_SERVICE_URL** com a URL HTTPS pública do serviço. Essa variável contém somente o endereço, nunca senha/token/chave.
8. Executar novamente a ação Deploy SmartDesk to GitHub Pages. A entrada Pages passa a encaminhar para o protótipo online, preservando admin.html quando solicitado. Até configurar a URL, mostra uma mensagem honesta de hospedagem pendente.

## Conferência antes da entrega

Abrir Pages em janela anônima; conferir encaminhamento HTTPS e pedido de acesso. Percorrer Como funciona, criar chamado fictício identificado como teste acadêmico, anexar TXT sem dados pessoais, conferir número na planilha, arquivo privado no Drive e chamado no painel no modo Google. Conferir uma resposta válida da IA antes de afirmar integração online. A chave configurada sozinha não comprova conexão. Compartilhar com o professor links do repositório/Pages e acesso do protótipo, sem chaves de integração.

## Limites da gratuidade

Render Free entra em repouso após 15 minutos sem tráfego e pode levar cerca de um minuto para abrir novamente. Tem limites mensais; sem meio de pagamento, pode suspender serviço/construções quando atingir a franquia. Não oferece garantia de disponibilidade. Os arquivos locais são temporários: rascunhos não enviados e simulações podem desaparecer ao reiniciar; chamados confirmados permanecem na planilha e anexos no Drive. Não usar este protótipo como produção institucional. Gemini continua sujeito à quota gratuita já escolhida: falha de IA não deve produzir confirmação falsa de envio.

## Arquitetura e acesso

O servidor mantém Google/Gemini no ambiente privado e exige HTTP Basic em toda a aplicação hospedada, inclusive APIs/gestão, com comparação de hashes em tempo constante. O acesso é único para a avaliação, não um sistema corporativo de usuários/perfis. O navegador guarda a autenticação enquanto a sessão estiver aberta; fechar a janela privada encerra a sessão de teste. /healthz é público, não expõe configuração e não consulta integrações. Hosts/origens externos são rejeitados. Não há API aberta com credenciais de Google no frontend nem necessidade de CORS entre Pages e servidor, pois o Pages encaminha a navegação.

Fontes oficiais: https://render.com/docs/free ; https://render.com/docs/web-services ; https://render.com/docs/environment-variables . Consultadas em 2026-10-05.
