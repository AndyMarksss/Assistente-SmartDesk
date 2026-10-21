# Conectar o recebimento ao Google — SmartDesk 0.6.0

O código local está pronto. O envio real só funciona depois de publicar o Apps Script na sua conta e configurar a URL e o token no servidor. Não use a planilha de matriz como destino dos chamados: a função abaixo cria uma planilha separada e uma pasta de anexos.

## 1. Criar o receptor

1. Abra https://script.google.com/ e crie um projeto chamado **SmartDesk — Recebimento**.
2. Cole o conteúdo de `Code.gs` no arquivo de código do projeto.
3. Adicione outro arquivo de script chamado **Schema** e cole `Schema.gs`.
4. Selecione e execute **configurarSmartDesk**. Na primeira execução, o Google solicita acesso ao Drive e às planilhas; confira e autorize na sua conta. Se surgir uma tela de alerta de segurança, você deve avaliar e completar essa etapa pessoalmente.
5. O registro dessa execução mostra os links da nova **SmartDesk — Chamados** e da pasta **SmartDesk — Anexos**. Não registra nem exibe o token.

Executar a configuração novamente reutiliza os IDs existentes, sem apagar chamados. Planilha e anexos permanecem privados conforme as permissões do Drive; o código não ativa compartilhamento público.

## 2. Publicar a aplicação

1. Clique em **Implantar → Nova implantação → Aplicativo da Web**.
2. Executar como: **Você**. Quem tem acesso: **Qualquer pessoa** (se a sua conta permitir), para que o servidor local possa chamar a URL sem login interativo.
3. Antes de confirmar, entenda a autorização: esse endpoint executa o código na sua conta e pode gravar na planilha e criar arquivos no Drive. O código exige um token secreto para cada envio; não disponibiliza leitura de chamados. A URL pública não deve ser usada sem essa proteção. O protótipo local não possui autenticação de usuários, por isso use dados fictícios.
4. Publique e copie a URL que termina em **/exec**. O acesso anônimo do endpoint não torna a planilha nem os anexos públicos.

## 3. Configurar o servidor local

No `.env` já existente em `03-prototipo`, mantenha sua chave Gemini e acrescente:

```dotenv
SMARTDESK_APPS_SCRIPT_URL=https://script.google.com/macros/s/ID_DA_IMPLANTACAO/exec
SMARTDESK_APPS_SCRIPT_TOKEN=cole_o_token_aqui_somente_no_arquivo_local
```

O token fica em **Configurações do projeto → Propriedades do script → SMARTDESK_TOKEN**, criado na etapa 1. Copie-o diretamente para o `.env`; não envie por conversa, print ou e-mail. Não abra `.env` durante a captura de evidências. O arquivo de exemplo contém somente nomes de variáveis vazias.

Reinicie o servidor com `node server/server.cjs`, dentro de `03-prototipo`, e abra **http://127.0.0.1:4173/**. Abrir pelo Live Server na porta 5500 não executa o servidor que recebe os chamados e consulta o Gemini.

## 4. Conferir o primeiro envio

Faça um atendimento fictício, com e sem anexo. Após **Enviar chamado**, deve aparecer **Chamado #001 enviado!** (ou o próximo número existente). Na aba **Chamados**, confira uma linha com número, data, nome, setor, área, necessidade, assunto interno, descrição literal, detalhes, links de anexos e status. Abra o link do anexo estando conectado à conta autorizada.

O assunto é gerado internamente e gravado na planilha; não aparece como etapa de confirmação na conversa nem no cartão de revisão. Novas tentativas com o mesmo ID e conteúdo retomam o envio sem outra linha ou número. Se uma falha ocorrer durante os anexos, a linha fica **Recebendo** até a retomada terminar. Não apague essas linhas durante testes de repetição.

## Atualizações e limites

Depois de alterar o código no Google, atualize a implantação para uma nova versão; salvar no editor não atualiza automaticamente o endereço publicado. Não há faturamento configurado por esse código; os serviços estão sujeitos a limites e quotas da sua conta. Até cinco anexos, 10 MB por arquivo e 20 MB no total; teste tamanhos maiores antes de considerá-los validados no Google.

Referências: [Aplicações Web](https://developers.google.com/apps-script/guides/web), [Drive](https://developers.google.com/apps-script/reference/drive/), [Propriedades](https://developers.google.com/apps-script/reference/properties/), [LockService](https://developers.google.com/apps-script/reference/lock/lock-service). O envio passa pelo servidor local, que acompanha os redirecionamentos do ContentService e guarda o token fora do navegador.
