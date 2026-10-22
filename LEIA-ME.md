# SmartDesk

Projeto acadêmico de Metodologias Ágeis e Validação de Produtos.

A prioridade atual é desenhar e construir o MVP, guardar evidências durante o trabalho e preparar a validação. A versão 0.2.0 já implementa um chat guiado com escolhas, relato, classificação e resumo revisável. A IA real e a validação com usuários ainda estão pendentes.

## Onde trabalhar

| Pasta | Uso |
| --- | --- |
| 01-planejamento | Decisões, pendências e fluxo das telas |
| 02-matriz-e-regras | Planilha original, exportações e scripts da base de classificação |
| 03-prototipo | Código, imagens e versões do MVP |
| 04-validacao | Roteiros, registros das sessões e resultados reais |
| 05-evidencias | Prints e outros registros das etapas |
| 06-documentacao | Estrutura da documentação futura e anexos |
| 07-pitch | Slides e roteiro da apresentação |
| 08-referencias | Enunciado e fontes utilizadas |

## Próxima etapa prática

1. Localizar a planilha SmartDesk - Matriz Mestre de Chamados e registrar seu link em 08-referencias/fontes/contexto-e-fontes.md.
2. Conferir a matriz, as regras condicionais, os setores e os cenários antes de levar os dados ao protótipo.
3. Revisar o fluxo em 01-planejamento/fluxos-e-telas/fluxo-mvp.md.
4. Continuar o MVP a partir de 03-prototipo/index.html e assets, conforme o Passo 4. Conferir e incorporar a matriz completa antes de validar.
5. Guardar evidências de cada etapa e registrar mudanças no changelog.

## Como manter o histórico

- Preserve originais e exporte cópias datadas para trabalhar.
- Nomeie evidências como AAAA-MM-DD_etapa_descricao_v01.png.
- Atualize decisões e mudanças conforme o projeto evoluir.
- Preencha resultados somente depois dos testes reais.
- Use códigos como P01 para participantes e evite expor nomes e e-mails em prints destinados à entrega.

## Atualização 2026-10-01 — SmartDesk 0.3.0

Protótipo atual em 03-prototipo: chat com início pessoal, Font Awesome, botão claro/escuro e integração Gemini preparada. Empresas retiradas da versão acadêmica; histórico preservado. A chave deve ser preenchida somente em 03-prototipo/.env e o servidor reiniciado. Leia 03-prototipo/README.md. Análise real ainda não verificada. Evidências atuais até EVID-011; próximo número EVID-012.

## Protótipo atualizado — 0.5.0 (2026-10-01)

Chat guiado pelos 25 setores, quatro áreas e 57 caminhos da matriz. Descrição e anexo após escolhas; Gemini sugere assunto curto e permite revisão. Execute conforme [README do protótipo](03-prototipo/README.md). Rascunhos ficam locais e não são enviados ao suporte. Evidências atuais: EVID-016 a EVID-019; próxima captura sugerida: lista de setores aberta.

## Atualização 0.6.0

Chat com mensagens suaves, correção de etapa anterior, campos pausados e revisão simplificada. Envio preparado para Google Planilhas/Drive por Apps Script; ativação pendente. Consulte [instalação Google](03-prototipo/integracoes/apps-script/INSTALAR-GOOGLE.md). Use http://127.0.0.1:4173/, com o servidor local iniciado, para IA e envio.

## Entrega online com integrações reais — 0.8.15

Código preparado para hospedagem Node gratuita e entrada GitHub Pages. Configuração pública ainda pendente; seguir [guia de hospedagem](03-prototipo/hospedagem.md). Professor acessará por link e acesso de avaliação, sem terminal. Chaves/token somente no ambiente privado do servidor.

## Entrega escolhida — Apps Script 0.9.0

Esta decisão substitui Render 0.8.15. Apps Script existente executa interface e integrações, sem servidor local na avaliação. Pages encaminha para o Google. Seguir [publicação do portal](03-prototipo/integracoes/apps-script/PUBLICAR-PORTAL-v0.9.0.md). Não criar planilha/pasta ou token novos. Código adaptado/testado com mocks; aplicação e verificação pública pendentes do usuário.

## Entrega corrigida 0.9.1
Chat e painel hospedados no GitHub Pages; Apps Script somente integrações. Esta instrução substitui a arquitetura 0.9.0. Guia 03-prototipo/integracoes/apps-script/APLICAR-CORRECAO-PAGES-v0.9.1.md.

## 0.9.2 — acesso direto
Frontend Pages sem senha. Aplicar Portal.gs, Pages.gs e PortalShared.gs e publicar nova versão Google. Testar envio fictício e isolamento do painel. Guia em 03-prototipo/integracoes/apps-script/AVALIAR-SEM-SENHA-v0.9.2.md.

## 0.10.0 — atmosfera, IA e fluxo
Visual em vidro com aurora, luz sob o cursor e animações; IA sugere caminhos a partir de um relato livre, pergunta um complemento e dá dicas seguras; seletor de setor com busca, atalhos, comprovante com cópia e opção de lembrar os dados no dispositivo. Avaliação pública com cotas. Apps Script 0.10.0 publicado pelo clasp (conta pessoal, versão 5 da mesma implantação). O avaliador só abre o GitHub Pages; uso local com npm start. Verificação em 03-prototipo/verificacao-v0.10.0.md; evidências EVID-179 a EVID-188.

## 0.11.0 — fluxos revisados
A IA monta o rascunho do chamado a partir do relato e só pergunta o que falta; perguntas da IA entram na descrição; dicas aparecem antes do envio, com "Resolveu!" registrado sem dados pessoais. Acompanhamento de chamado por número e e-mail. Painel com skeleton, kanban colorido com tags e arrastar e soltar, e estatística de autoatendimento. Robô animado, setor com busca, calendário/relógio visíveis. Apps Script 0.11.0 publicado (versão 10). Verificação em 03-prototipo/verificacao-v0.11.0.md.

## 0.11.1
Robô da abertura acompanha o cursor com os olhos; a luz do cursor passou a cobrir o chat inteiro. Verificação em 03-prototipo/verificacao-v0.11.1.md.

## 0.11.2
A luz do cursor fica só no fundo do chat (atrás de card, etapas e botões), cobrindo o fundo inteiro. Verificação em 03-prototipo/verificacao-v0.11.2.md.

## 0.11.3
Avaliação técnica da IA com relatos fictícios (04-validacao/avaliacao-ia): 96% de caminho certo na 1ª sugestão com a instrução anterior; instrução ajustada com glossário; sem IA, o relato livre vira opções. Atenção à cota diária do Gemini (500 pedidos por projeto no plano gratuito): a avaliação esgotou a da chave local; o site público usa outra chave e seguiu com IA. Verificação em 03-prototipo/verificacao-v0.11.3.md.

## 0.11.4
Avaliação da IA concluída: 99% de caminho certo na 1ª sugestão, extração 99%, 57/57 caminhos chegam ao resumo pelos botões, revisão sem alertas falsos e sem perguntas de dados pessoais. Verificação em 03-prototipo/verificacao-v0.11.4.md.

## 0.12.0 — teste com usuários
O SmartDesk registra métricas anônimas de cada atendimento (aba Sessões), aceita o código do participante no link (`?p=P01`) e pergunta a facilidade no fim. Kit das sessões em `04-validacao/roteiros/roteiro-sessao-usuarios.md`. Verificação em 03-prototipo/verificacao-v0.12.0.md.

## 0.12.1
O robozinho ao lado das mensagens agora se mexe (só o da mensagem mais recente). Verificação em 03-prototipo/verificacao-v0.12.1.md.

## 0.12.2
Responsividade revisada em 12 tamanhos de tela, do celular pequeno ao monitor grande, nos dois temas. Verificação em 03-prototipo/verificacao-v0.12.2.md.

## 0.12.3
Conferências do pedido: equipamento a mais citado no relato (sugere o tipo que junta tudo) e evento contraditório. Verificação em 03-prototipo/verificacao-v0.12.3.md.

## 0.12.4
O quadro da abertura não inclina mais com o mouse; só os olhos do robô acompanham. Verificação em 03-prototipo/verificacao-v0.12.4.md.

## 0.12.5
Fundo do chat com rede de conexões, ícones de TI em contorno e luzes suaves, só atrás da conversa. Verificação em 03-prototipo/verificacao-v0.12.5.md.

## 0.12.6
Luz do cursor menor e barra lateral com trilha de progresso, dicas que se revezam e luz suave. Verificação em 03-prototipo/verificacao-v0.12.6.md.

## 0.12.7
Barra lateral sem rolagem em nenhum tamanho, com "O que a TI atende" e uma pequena rede no espaço livre. Verificação em 03-prototipo/verificacao-v0.12.7.md.

## 0.12.8
Tema claro com cores limpas e "O que a TI atende" como lista informativa. Verificação em 03-prototipo/verificacao-v0.12.8.md.

## 0.12.9
Tema claro redesenhado, cartão "Seu chamado" na barra lateral e ícones do fundo fora da coluna das mensagens. Verificação em 03-prototipo/verificacao-v0.12.9.md.

## 0.12.10
Barra lateral com profundidade e cartões no mesmo padrão, dicas com setas e arrastar, e hover do botão principal sem piscar. Verificação em 03-prototipo/verificacao-v0.12.10.md.

## 0.12.11
Painel de gestão redesenhado: barra lateral em cartão com a fila por etapa (atalho para as colunas), indicadores com ícone e parte no total, áreas em ordem com a líder em destaque e títulos que já dizem a conclusão. No chat, as dicas trocam sem sobrepor o texto. Verificação em 03-prototipo/verificacao-v0.12.11.md.

## 0.12.12
Painel com profundidade (quadro em painel, colunas rebaixadas, cartões elevados) e cor só para etapa; áreas e etiquetas em neutro e "Agendado" com tom próprio. Verificação em 03-prototipo/verificacao-v0.12.12.md.

## 0.12.13
Cartões do quadro neutros com a etapa no cabeçalho da coluna, modal de detalhes redesenhado e aviso no painel publicado de que ele mostra só os chamados enviados naquela aba. Os chamados de teste não chegaram à planilha (o último é o #015). Verificação em 03-prototipo/verificacao-v0.12.13.md.

## 0.12.14
Modal de detalhes sem a faixa colorida no topo. Verificação em 03-prototipo/verificacao-v0.12.14.md.

## 0.12.15
Painel interativo e compacto: indicadores, áreas e categorias filtram tudo, o gráfico desce de área para categoria e o quadro aparece na primeira tela. Verificação em 03-prototipo/verificacao-v0.12.15.md.
