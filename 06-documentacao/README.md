# 06 · Documentação da entrega

Os documentos pedidos pelo enunciado da disciplina.

| Entregável | Arquivo | Situação |
|---|---|---|
| **Parte teórica**: hipóteses e estratégia de validação | [`parte-teorica-hipoteses-e-validacao.md`](parte-teorica-hipoteses-e-validacao.md) | Pronta: escrita antes das sessões; regra de decisão aprovada em 28/10/2026, critério da hipótese de problema e casos que faltavam na regra em 29/10/2026 |
| **Canvas de Produto** (Lean Canvas) | [`canvas/`](canvas/README.md) | Pronto: hipóteses (29/10) e versão depois das sessões (30/10) |
| Fluxo do atendimento: árvore de decisões completa, passo a passo com os textos exatos e visão geral com os pontos de IA | [`fluxo/`](fluxo/README.md) | Pronto (protótipo 0.13.0; o fluxo é o mesmo na 0.13.1) |
| **README de entrega do case**: problema, hipóteses, experimento, evidências, resultados, aprendizados e decisão | [`case/README.md`](case/README.md) | Pronto, com 10 figuras: telas do chat (EVID-308 a EVID-311), e-mail, painel, planilha, gráficos em [`case/imagens`](case/imagens/graficos.html) e Lean Canvas |
| **Vídeo pitch** (3 min 58 s) | <https://drive.google.com/file/d/1hxUTYfH406xa7dd3I3ivs85zVpHdv-Vp/view> ([roteiro](../07-pitch/README.md)) | Gravado e publicado em 31/10/2026 |
| **PDF da entrega**: README do case e parte teórica, com os links do sistema e do vídeo | [`case/smartdesk-entrega.pdf`](case/smartdesk-entrega.pdf) | Gerado em 31/10/2026 |

O PDF sai dos dois Markdown (README do case e parte teórica). Se um deles mudar, gere o PDF de novo na raiz do repositório com `node 06-documentacao/gerar-pdf-entrega.cjs ../Entrega` (usa o Edge do Windows). Com a pasta no fim, o script também grava nela a cópia do PDF para enviar e um `README.md` autocontido: o README do case com as imagens embutidas e os links apontando para o GitHub, para abrir fora do repositório.

[`roteiro-readme.md`](roteiro-readme.md) é o esqueleto que guiou o README de entrega. Ele é diferente do [README da raiz](../README.md): o da raiz apresenta o projeto no GitHub, e o de entrega conta o case com os resultados reais.
