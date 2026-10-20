> Atualização 0.12.9: tema claro redesenhado (boas-vindas em gradiente roxo e azul, balões da pessoa em roxo, etapa atual em roxo), barra lateral com o cartão "Seu chamado" (anel de progresso, picote de ticket e número do chamado enviado) e ícones do fundo fora da coluna das mensagens. 0.12.8: tema claro com cores limpas (fundo quase branco, painéis brancos, balões da pessoa em lilás) e "O que a TI atende" como lista informativa com a descrição de cada área. 0.12.7: barra lateral sem rolagem em nenhum tamanho, com "O que a TI atende" e uma pequena rede no espaço livre. 0.12.6: luz do cursor menor; barra lateral com trilha de progresso do atendimento (ícones, linha até a etapa atual e contagem), dicas que se revezam e luz suave no fundo. 0.12.5: fundo do chat com vida — rede de conexões com sinais correndo, ícones de TI em contorno flutuando e duas luzes que passeiam, só atrás da conversa. 0.12.4: o quadro da abertura não inclina mais com o mouse; só os olhos do robô acompanham o cursor. 0.12.3: conferências do pedido antes da revisão da IA — quem pede caixa de som e depois cita microfone recebe a sugestão de mudar para Caixa de Som / Microfone; "evento" no relato com resposta "Não" é confirmado; ao corrigir o rascunho, a opção entendida pela IA vem destacada. 0.12.2: responsividade revisada em 12 tamanhos de tela — a animação da cena de abertura encaixa em qualquer formato, o celular deitado mostra a pergunta e todas as opções, textos pequenos e botões de toque aumentados. 0.12.1: o robozinho ao lado das mensagens ganhou vida — chega com um pulinho e mexe a boca, pisca, acende a antena, acena na primeira mensagem e procura a resposta com os olhos enquanto a IA pensa. 0.12.0: pronto para o teste com usuários — métricas anônimas de cada atendimento (aba Sessões), código do participante pelo link `?p=P01`, nota de facilidade no fim do chat e kit das sessões em `04-validacao`. 0.11.4: avaliação da IA concluída — 99% de caminho certo na 1ª sugestão, extração 99%, revisão sem alertas falsos e sem perguntas de dados pessoais. 0.11.3: avaliação técnica da IA com 186 relatos fictícios (04-validacao/avaliacao-ia), instrução de identificação ajustada e, sem IA, o relato livre vira opções em vez de um rascunho incerto. 0.11.2: a luz do cursor fica só no fundo do chat, atrás de cards, etapas e botões, e cobre o fundo inteiro. 0.11.1: o robô da abertura acompanha o cursor com os olhos. 0.11.0: a IA monta o rascunho do chamado a partir do relato, acompanhamento de chamado por número e e-mail, painel com skeleton e kanban de arrastar e soltar, e revisão de todos os fluxos. Apps Script 0.11.0 publicado (versão 10 da implantação existente). Avaliação: basta abrir o GitHub Pages. Uso local: `npm start` e http://127.0.0.1:4173/.

# SmartDesk — protótipo 0.12.9

Chat guiado com poucas digitações, 25 setores, quatro áreas e 57 caminhos da Matriz Mestre. Identidade grafite/violeta, temas claro/escuro e Font Awesome local.

## Entrega para avaliação

Chat e painel completos no GitHub Pages, com Apps Script somente para IA, planilha, anexos e gestão. Sem redirecionamento ou servidor local para o professor. Seguir [correção 0.9.2](integracoes/apps-script/AVALIAR-SEM-SENHA-v0.9.2.md). Endpoint público registrado; implantação Google e teste real pendentes.

## Desenvolvimento local

Use Node.js 22 ou superior. Dentro de 03-prototipo, execute `node server/server.cjs` e abra **http://127.0.0.1:4173/**. Live Server na porta 5500 mostra a interface, mas não executa o servidor de IA e recebimento. A configuração fica no .env, nunca no navegador ou nos prints.

## Fluxo atual

Iniciar (ou "Continuar como…" se os dados foram lembrados neste dispositivo) → nome → e-mail institucional → setor (busca em grade) → área, atalho ou "Descrever com minhas palavras" → necessidade → dados necessários → descrição → pergunta de complemento da IA (opcional) → dicas da IA nos defeitos (opcional, com "Resolveu!") → anexos opcionais → revisão → Enviar chamado → comprovante numerado → Novo atendimento.

Nome destacado no cumprimento. Mensagens uma por vez, com digitação e animação suave; preferência de movimento reduzido respeitada. Campo de texto pausado nas escolhas. **Voltar uma etapa**, acima dos controles, restaura o passo anterior; corrigir área não repete setor.

Não há destaque automático da primeira área. Local retirado por instrução direta do usuário, prevalecendo sobre a matriz. QuickBooks permanece exclusivo de Financeiro; câmeras, de Coordenação EI (Infantil). Demais campos e condicionais continuam específicos da escolha.

## IA e revisão

Gemini adapta a pergunta da descrição e gera um assunto interno. A descrição é preservada literalmente como dado do chamado, sem conversa livre ou execução de instruções. Assunto sem confirmação ou exibição no cartão; fica na planilha.

Nome, e-mails dos campos, demais textos complementares e anexos não vão ao Gemini. A descrição é transmitida ao modelo; use dados fictícios. Sem resposta válida, assunto padrão. Revisão com **Enviar chamado**, **Editar descrição** e **Revisar anexos** apenas se houver arquivos. Novo atendimento após recebimento confirmado.

## Recebimento Google

O receptor existente é preservado. Para esta entrega, seguir somente o guia 0.9.2 e não executar configuração novamente.

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

## Versão 0.11.0 — fluxos revisados

- **Rascunho pela IA:** em "Descrever com minhas palavras", `POST /api/analyze` identifica o tipo e `POST /api/extract` preenche os dados que a pessoa já disse (data, horário, opções). O cartão de rascunho mostra o que foi entendido; só o que falta é perguntado.
- **Pergunta e dicas:** `POST /api/assist` devolve no máximo uma pergunta (com dica de onde achar a resposta), um alerta quando o relato não combina com o tipo escolhido e, em defeitos, até três passos para tentar antes de enviar. Perguntas e respostas entram na descrição.
- **Acompanhar um chamado:** `POST /api/track` com número e e-mail da abertura devolve só a etapa, área, necessidade e data.
- **Autoatendimento:** `POST /api/selfhelp` registra, sem dados pessoais, se as dicas resolveram; o painel mostra o resultado.
- **Painel:** skeleton, kanban com tags e cores por etapa, arrastar e soltar (mouse e caneta; no toque, o cartão abre os detalhes).
- **Chamado de teste:** `removerChamadoDeTeste` (Diagnostico.gs) é executada pelo dono no editor do Apps Script.

Verificação em `verificacao-v0.11.0.md`.

## Versão 0.10.0 — atmosfera, IA e fluxo

- **Aparência:** `assets/css/atmosphere.css` (vidro, aurora, luz sob o cursor, cartões novos) e animações em `motion.css`; `assets/js/atmosphere.js` cuida da luz, da inclinação da cena e da ondulação, só com mouse. Movimento reduzido e transparência reduzida do sistema são respeitados.
- **IA:** `POST /api/analyze` sugere caminhos para um relato livre (sempre confirmados pela pessoa); `POST /api/assist` faz no máximo uma pergunta de complemento e até três dicas seguras. Regras em `server/contrato-ia.md`.
- **Fluxo:** seletor de setor com busca, atalhos dos cenários da matriz, nomes legíveis nas opções, comprovante com cópia do número e "Lembrar meus dados neste dispositivo" (opcional, só no navegador).
- **Avaliação pública:** cotas por sessão e por dia, 3 anexos/5 MB e checagem do conteúdo dos arquivos no Apps Script.

Verificação em `verificacao-v0.10.0.md`.
