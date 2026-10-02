# Pendências da próxima etapa

## Antes de implementar

- [ ] Localizar a planilha original e registrar o link.
- [ ] Guardar uma exportação datada da matriz e das regras.
- [ ] Conferir a lista completa de setores e os cenários de teste.
- [ ] Revisar o fluxo proposto e os campos de cada tela.
- [ ] Definir o comportamento quando a classificação for incerta.
- [ ] Confirmar as restrições por setor usando a matriz original.
- [ ] Definir o tratamento de anexos no MVP.
- [ ] Conferir o enunciado para confirmar requisitos da validação e da entrega.

## Construção e validação

- [ ] Implementar o fluxo e as mensagens dos campos obrigatórios.
- [ ] Conferir as regras com os cenários documentados.
- [ ] Preparar o roteiro de teste com usuários.
- [ ] Realizar as sessões e preencher os registros com observações reais.
- [ ] Reunir evidências, aprendizados e decisão sobre a hipótese.

## Atualização 2026-10-01 — Passo 4

Acesso à matriz resolvido e opções incorporadas. Setores, quatro áreas, campos, anexo e assunto implementados. Ainda pendentes: integração de envio ao suporte, autenticação, gestão de anexos para produção, triagem/resolução e avaliação posterior. Nenhum resultado com usuário real foi registrado.

## 2026-10-01 — Recebimento Google

Código e testes simulados prontos. Falta entrar no Google, criar/publicar o projeto conforme 03-prototipo/integracoes/apps-script/INSTALAR-GOOGLE.md, autorizar e preencher URL/token no .env local; reiniciar servidor e conferir envio real com e sem anexo. Não configurar no Live Server 5500: usar o servidor SmartDesk 4173.

## 2026-10-01 — Diagnóstico após publicação

Usuário executou a configuração, publicou /exec e inseriu a configuração local. Servidor reiniciado: ticketsReady=true. GET real funciona. POST com chamado fictício e TXT retorna erro interno, sem confirmação numérica; resposta não é Não autorizado. Preparados Code.gs com log seguro e Diagnostico.gs com a mesma tentativa. Precisa atualizar o código no editor, executar diagnosticarSmartDesk e conferir o registro; após corrigir, atualizar a versão da implantação e repetir o teste. Não reconstruir nem apagar planilha/pasta.

## Resolução em 2026-10-01 — Recebimento Google

Servidor confirmou chamado fictício #001 com um anexo e repetição do mesmo ID sem nova numeração. Pendência de POST real resolvida. A falha Campo obrigatório do diagnóstico foi causada pela ausência de área/necessidade no próprio teste, corrigido localmente. O erro genérico da tentativa anterior não teve sua causa remota isolada, mas não se reproduziu no reteste do fluxo principal. Não pedir ao usuário nova execução do diagnóstico agora. Falta somente conferir/capturar a linha e o arquivo no Google.

## Atualização em 2026-10-01 — EVID-033

Conferência visual da linha #001 resolvida: print mostra status Recebido e link de anexo na aba Chamados. Próxima pendência: abrir o link no Drive e conferir nome/conteúdo do TXT fictício, registrando EVID-034.

## Resolução em 2026-10-01 — Anexo do #001

EVID-034 confirma abertura, nome e conteúdo do TXT fictício. EVID-035 confirma a pasta do #001 e seu acesso restrito no painel do Drive. Pendência de conferência visual do arquivo resolvida. Próxima coleta sugerida: confirmação de envio na interface do chat, com dados fictícios, para evidenciar também a experiência completa pelo navegador.

## 2026-10-01 — Gestão Google ativa

Publicação versão 2 enviada pelo usuário; leitura real e visualização do #001 confirmadas em EVID-045. Pendência de ativação/listagem resolvida. Erros dos prints vieram do Live Server 5500; encaminhamento automático ao servidor correto foi verificado. Ainda falta conferir envio novo com e-mail e mudança de etapa real.

## Refinamento 0.8 — 2026-10-01

Visual, modal, favicon, nome/sobrenome, erro persistente de e-mail, reinício, proprietário do computador, conversação e autorização implementados. Print do usuário confirma e-mail no #002. Pendente: publicar Code.gs/Gestao.gs 0.8 e conferir autorização na coluna O, sem recriar planilha/token. Validação acadêmica permanece pendente.

## 0.8.1 — Revisão de contexto e navegação

HDMI dispensa autorização, descrição duplicada removida, periféricos distinguem defeito de pedido novo, trilha horizontal concluída. Futuro: Meus chamados com acesso do solicitante, avisos do TI e ajuda rápida. Autorização remota em O continua aguardando publicação/verificação 0.8 caso o usuário ainda não tenha feito.

- 0.8.2: conferir teclado de data/horário em celular real e escolhas com exemplos; próxima evidência 73. Emulação não confirma comportamento do teclado físico.

- 0.8.3: conferir calendário/relógio único e indicador de envio em uso real. Próxima evidência 87; testes locais não gravaram no Google.

- 0.8.4: retestar em Android real pergunta atual e troca calendário/relógio com teclado aberto. Sem nova implantação Apps Script. Próxima evidência 95.

- 0.8.5: conferir no celular real os dois temas e teclado após atualização; próximos prints EVID-99 em diante. Sem atualização Apps Script.

- 0.8.6: conferir a nova direção em celular real nos dois temas. Próxima evidência EVID-103. Sem nova implantação Apps Script.
