# SmartDesk — protótipo 0.9.0

Chat guiado com poucas digitações, 25 setores, quatro áreas e 57 caminhos da Matriz Mestre. Identidade grafite/violeta, temas claro/escuro e Font Awesome local.

## Entrega para avaliação

Usar o portal no Apps Script existente, sem servidor local ou Render para o professor. Chat, gestão, planilha, anexos e IA são executados no Google. Seguir [publicação 0.9.0](integracoes/apps-script/PUBLICAR-PORTAL-v0.9.0.md). Implantação remota ainda precisa ser aplicada/conferida. Pages encaminha para a URL /exec configurada.

## Desenvolvimento local

Use Node.js 22 ou superior. Dentro de 03-prototipo, execute `node server/server.cjs` e abra **http://127.0.0.1:4173/**. Live Server na porta 5500 mostra a interface, mas não executa o servidor de IA e recebimento. A configuração fica no .env, nunca no navegador ou nos prints.

## Fluxo atual

Iniciar → nome → e-mail institucional → setor por seleção → área → necessidade → dados necessários → descrição → anexos opcionais → revisão → Enviar chamado → confirmação numerada → Novo atendimento.

Nome destacado no cumprimento. Mensagens uma por vez, com digitação e animação suave; preferência de movimento reduzido respeitada. Campo de texto pausado nas escolhas. **Voltar uma etapa**, acima dos controles, restaura o passo anterior; corrigir área não repete setor.

Não há destaque automático da primeira área. Local retirado por instrução direta do usuário, prevalecendo sobre a matriz. QuickBooks permanece exclusivo de Financeiro; câmeras, de Coordenação EI (Infantil). Demais campos e condicionais continuam específicos da escolha.

## IA e revisão

Gemini adapta a pergunta da descrição e gera um assunto interno. A descrição é preservada literalmente como dado do chamado, sem conversa livre ou execução de instruções. Assunto sem confirmação ou exibição no cartão; fica na planilha.

Nome, e-mails dos campos, demais textos complementares e anexos não vão ao Gemini. A descrição é transmitida ao modelo; use dados fictícios. Sem resposta válida, assunto padrão. Revisão com **Enviar chamado**, **Editar descrição** e **Revisar anexos** apenas se houver arquivos. Novo atendimento após recebimento confirmado.

## Recebimento Google

**Código preparado; ativação real pendente.** Siga [INSTALAR-GOOGLE.md](integracoes/apps-script/INSTALAR-GOOGLE.md) para criar/publicar o receptor e autorizar sua conta. configurarSmartDesk cria planilha separada **SmartDesk — Chamados** e pasta privada **SmartDesk — Anexos**; não altera a matriz.

No .env: SMARTDESK_APPS_SCRIPT_URL e SMARTDESK_APPS_SCRIPT_TOKEN. Token obrigatório, somente no servidor/propriedades do script. Confirmação com número #001, #002 etc. Um chamado por linha e links de arquivos do Drive. Trava de numeração e ID do envio permitem retomar sem duplicatas. Falha parcial pode deixar uma linha Recebendo até a retomada.

Sem configuração ou confirmação, o atendimento fica na tela com mensagem do problema. Recarregar/fechar antes de enviar perde o conteúdo em memória. O código não configura faturamento; serviços sujeitos às quotas da conta. Anexos não se tornam públicos: exigem permissão no Drive.

## Anexos e limites

Até cinco arquivos, 10 MB cada, 20 MB somados. PNG, JPG/JPEG, WEBP, GIF, PDF, TXT, DOCX e XLSX. MVP sem autenticação de usuários, antivírus, gestão completa de chamados, triagem para resolução ou avaliação posterior. Use dados fictícios; confirme tamanhos máximos no Google real antes de considerá-los validados.

API de rascunhos locais mantida como histórico, sem ação no fluxo atual. Versões em versoes, sem .env. Evidências/manifestos em 05-evidencias do projeto.

## Verificar

Execute `node server/tests/integration.cjs` e `node server/tests/apps-script.cjs`. Google/IA simulados, sem criar chamados reais. Fonte/exportações em 02-matriz-e-regras. Testes técnicos não substituem validação acadêmica com usuários.

## Recebimento verificado em 2026-10-01

A ativação deixou de estar pendente: após o usuário configurar/publicar o Apps Script e preencher .env, o servidor confirmou o chamado técnico fictício #001 com um anexo. Repetir o mesmo ID retornou o mesmo número. Não é necessário executar o diagnóstico novamente agora. O arquivo de diagnóstico foi corrigido localmente para completar os rótulos área/necessidade. Próxima conferência: linha #001, link do TXT e status Recebido no Google. Essas verificações técnicas não são validação acadêmica com usuários.

## Versão 0.7 — Gestão

Cliente: http://127.0.0.1:4173/; painel: http://127.0.0.1:4173/admin.html. Usar o servidor SmartDesk; Live Server 5500 não oferece API. Demonstração com 12 chamados fictícios separados dos dados Google, dashboard, filtros, detalhes e mudança de etapa persistente. E-mail institucional após o nome; nenhum envio automático de e-mail.

Para gestão real e gravação de e-mail, seguir integracoes/apps-script/ATUALIZAR-GESTAO.md, publicando Código.gs + Gestao.gs juntos. O novo servidor impede envio com e-mail para implantação anterior, evitando perda silenciosa do contato. Resposta ao cliente: proposta em estrategia-retorno-cliente.md.

Indicador: verde após resposta válida do Gemini nos últimos dois minutos; vermelho quando ausente ou sem resposta recente. Chave configurada, sozinha, não comprova conexão.
