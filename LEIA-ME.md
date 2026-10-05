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
