# Pendências

## O que falta para a entrega (atualizado em 30/10/2026; prazo: 31/10 às 23h59)

O enunciado pede três entregáveis: parte teórica, parte prática e vídeo pitch. A parte teórica, o Lean Canvas e o protótipo estão prontos. O resto segue uma ordem, porque cada etapa depende da anterior:

**sessões → parte prática → roteiro do vídeo → gravação → PDF e envio**

### 1. Antes das sessões

- [x] Enviar ao GitHub os commits locais (feito em 29/10).
- [x] (29/10, implantação @35) Publicar o Apps Script da 0.13.0: rodar `autorizarAvisosPorEmail` no editor e aceitar o envio de e-mail **antes** do `clasp deploy`.
- [x] (29/10, chamado #030, EVID-301 a EVID-306) Conferir o ticket por e-mail: um chamado de teste no Pages com `?p=P99` e o seu e-mail real, uma mudança de etapa no painel e os dois e-mails na caixa de entrada (o chamado P99 sai com `removerChamadosDosParticipantes`).
- [x] (29/10) Ensaiar no celular com `?p=P00` até o resumo, sem enviar. O ensaio pediu o robô de volta no celular (0.13.1).
- [x] (30/10) Recrutar 5 funcionários de setores diferentes: pelo menos 1 que usa pouca tecnologia e 1 que faça o teste no celular.
- [x] (30/10) Imprimir o kit das sessões: `04-validacao/registros/kit-impressao-sessoes.pdf` (A4, 14 páginas, com as fichas P01 a P05 já preenchidas com link, e-mail e situações, e os cartões para recortar).

### 2. Sessões

- [x] (30/10, em grupo e até o resumo, sem enviar: limitações em `04-validacao/registros/diario-validacao.md`) Fazer as 5 sessões pelo [roteiro](../04-validacao/roteiros/roteiro-sessao-usuarios.md): aquecer a IA antes de cada uma e não mexer no chat nesses dias.

### 3. Parte prática

- [x] (30/10) Fichas transcritas (EVID-307) e números calculados em `04-validacao/resultados/resultados-sessoes-2026-10-30.md`. As abas *Validação* não se aplicam: sem chamado, elas não puxam os dados.
- [x] (30/10) Planilha baixada (fora da pasta do SmartDesk). A aba *Sessões* não tem registro das sessões, então o tempo não foi medido.
- [x] (30/10: problema confirmado, 1 meta atingida → **pivotar**, decisão do autor) Contar a hipótese de problema e aplicar a [regra de decisão](../06-documentacao/parte-teorica-hipoteses-e-validacao.md#7-regra-de-decisão-definida-antes-das-sessões). Com exatamente 2 de 5, fazer a conversa final com mais 3 pessoas antes de seguir.
- [x] (30/10, rascunho; a decisão continua aberta) Escrever a síntese no [diário de validação](../04-validacao/registros/diario-validacao.md): padrões em 2 ou mais pessoas, observado separado de interpretado e comparação entre hipóteses e resultados.
- [x] (EVID-307) Guardar as evidências das sessões em `05-evidencias` (prints da planilha e fichas, só com os códigos P01…).
- [ ] Exportar a planilha para `04-validacao/resultados` e só depois rodar `removerChamadosDosParticipantes`.
- [x] (30/10, `canvas/lean-canvas-pos-sessoes.png`) Marcar no Lean Canvas o que se confirmou.
- [x] Não se aplica: com a decisão de pivotar, o protótipo entregue é a versão testada (0.13.1), sem ajustes.
- [x] (30/10, rascunho em `06-documentacao/case/README.md`; falta só o link do vídeo) Escrever o README de entrega do case.

### 4. Roteiro do vídeo

- [x] (30/10, `07-pitch/roteiro/roteiro-pitch.md`) Escrever o roteiro de até 4 minutos a partir dos resultados da parte prática, com os seis pontos do enunciado.

### 5. Gravação

- [ ] Gravar e publicar com link (YouTube não listado, Loom ou Google Drive) e abrir o link numa janela anônima.
- [ ] Pôr o link do vídeo no README de entrega e no README da raiz.

### 6. PDF e envio

- [ ] Gerar o PDF da entrega, com a parte teórica, a parte prática e os links do sistema e do vídeo, como na entrega anterior do curso.
- [ ] Enviar.

## Histórico

As seções abaixo são as pendências anotadas em cada etapa, mantidas como estavam. Muitas já foram resolvidas (o [diário do projeto](diario-do-projeto.md) registra quando); o que ainda vale está na lista acima.

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

- 0.8.7: conferir presença e movimento no celular real, incluindo pausa. Próximas evidências a partir de EVID-109. Sem atualização Apps Script.

- 0.8.8: conferir abertura móvel e gestão no celular real; sem atualização Apps Script. Próxima evidência: EVID-120.

- 0.8.9: avaliar abertura e escolhas no celular real; captar os dois prints nos temas preferidos. Próxima EVID-129. Sem atualização Apps Script.

- 0.8.10: conferir tema preferido no celular real e um envio de Wi-Fi pelo servidor local. Sem nova implantação Apps Script. Próximo print: área de resposta junto à pergunta atual no mobile; próxima EVID-138.

- 0.8.11: conferir teclado real no mobile, alternância calendário/relógio e visibilidade da pergunta. Próximo print: pergunta atual e área de resposta com teclado aberto. Próxima EVID-143. Sem nova publicação de Apps Script.

- 0.8.12: versão visível no rodapé do chat e gestão. Próxima entrega deve incrementar e sincronizar versão. Próximo print: campo com teclado aberto no aparelho real, EVID-145.

- 0.8.13: conferir circuito luminoso ao recarregar, robô nas mensagens e rodapé central no aparelho real. Próximo print: pergunta/campo com teclado aberto; EVID-151.

- 0.8.14: conferir ajuda acompanhada, pergunta inteira após opções/campos e teclado real no celular. Próximo print: pergunta e campo após teclado abrir; EVID-161.

- 0.8.15: usuário exige custo zero e integrações reais. Preparação hospedagem/Pages concluída; criar conta Render Free sem cartão/faturamento, configurar ambiente privado e URL pública, conferir um chamado de avaliação online. Próximo print EVID-162: confirmação online com número, sem senha/token/chave; não repetir evidências locais como prova remota.

- 0.9.0: migração do código para Apps Script preparada; usuário aplicará arquivos no navegador próprio. Publicar nova versão na implantação existente, configurar chave/senha privadas, conferir Google real e URL /exec no Pages. Não usar Render ou repetir configuração da planilha.

## Correção 0.9.1
Aplicar cinco scripts atualizados/criados, conferir propriedades/manifesto e atualizar implantação existente. Testar chamado fictício real pelo Pages sem sair do domínio. Endpoint /exec público fornecido pelo usuário e registrado; nenhuma validação remota de envio nesta revisão.

## 0.9.2 — acesso direto
Frontend Pages sem senha. Aplicar Portal.gs, Pages.gs e PortalShared.gs e publicar nova versão Google. Testar envio fictício e isolamento do painel. Guia em 03-prototipo/integracoes/apps-script/AVALIAR-SEM-SENHA-v0.9.2.md.

## 0.10.0 — atmosfera e IA
Apps Script 0.10.0 publicado (versão 5) pelo clasp em 2026-10-14; publicar o Pages e conferir o fluxo completo pelo site público. Conferir no celular real o desempenho do desfoque, o seletor de setor e as dicas. Próxima evidência: EVID-189 (Pages 0.10.0 com dicas da IA e chamado fictício confirmado). Validação com usuários continua pendente.

## 0.10.1
Caminho público conferido: IA, envio e painel pelo GitHub Pages. Chamado de teste #010 fica na planilha (pode ser cancelado pelo painel local, se quiser). Próxima evidência: EVID-191. Pendente: conferir em celular real.

## 0.11.0
Executar `removerChamadoDeTeste` no editor do Apps Script para apagar os chamados de teste #010 e #013 (lista em NUMEROS). Conferir no celular real o arraste do painel (no toque, abre detalhes) e o combobox de setor. Validação com usuários continua pendente.

## 0.11.3
Concluir a avaliação da IA quando a cota do Gemini renovar: `node avaliar-ia.cjs --rodada depois` (retoma de onde parou), `node avaliar-ia.cjs --rodada controle-depois --banco relatos-controle.json`, percurso dos 57 caminhos (`node navegador-cdp.cjs percorrer-botoes.cjs`) e `node gerar-relatorio.cjs antes,depois controle-antes,controle-depois`. A cota é da chave local (500 pedidos por dia); o site público usa outra chave. Executar `removerChamadoDeTeste` (#010 e #013).

## 0.11.4
Avaliação técnica da IA concluída. Pendentes: executar `removerChamadoDeTeste` (#010 e #013) no editor do Apps Script; conferir no celular real; teste com usuários reais.

## 0.12.0
Antes das sessões: escrever hipótese e metas (aba *Validação — Resumo*), rodar `prepararPlanilhaDeValidacao`, `removerChamadoDeTeste` (#010 e #013) e recrutar 5 participantes. Depois: síntese, decisão, exportar a planilha para `04-validacao/resultados` e rodar `removerChamadosDosParticipantes`.

## 0.12.1
Feitos pelo usuário em 2026-10-19: `prepararPlanilhaDeValidacao`, `removerChamadoDeTeste` (#010 e #013) e hipótese e metas na aba *Validação — Resumo* (EVID-212 a EVID-216), antes de qualquer sessão. Falta: ensaio no celular real com `?p=P00`, recrutar 5 participantes e realizar as sessões; depois, síntese, decisão, exportar a planilha e rodar `removerChamadosDosParticipantes`. Não alterar o chat durante as sessões.

## 0.12.2
Responsividade revisada em 12 tamanhos (EVID-220 a EVID-222). Continua pendente o ensaio no celular real com `?p=P00` antes das sessões: a varredura usa tamanhos de tela simulados e não mostra o teclado do aparelho.
