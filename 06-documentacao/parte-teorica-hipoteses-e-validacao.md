# SmartDesk — Hipóteses e Estratégia de Validação

**Curso:** Graduação IA e Automação Digital
**Disciplina:** Metodologias Ágeis e Validação de Produtos
**Aluno:** Anderson Barbosa Marques da Silva — RA 16732
**Entrega:** Parte teórica (escrita em 28 e 29/10/2026, antes das sessões com usuários)

> Tudo aqui foi escrito antes da primeira sessão com usuários. A regra de decisão (seção 7) foi aprovada em 28/10/2026; o critério da hipótese de problema (seção 6) e os casos que faltavam na regra foram aprovados em 29/10/2026. O que ainda não foi medido aparece como suposição, junto com a forma de conferir. Os resultados das sessões de 30/10/2026 e a decisão (pivotar) estão no [README do case](case/README.md).

## 1. Problema, público e oportunidade

**Problema.** Na escola onde trabalho no suporte de TI, os pedidos de ajuda chegam por quatro formulários separados, um por área: Audiovisual, Impressora, Google e TI. Para pedir ajuda, o funcionário precisa saber em qual formulário pedir e quais dados informar. Um pedido de caixa de som precisa de data, horário, local e se é para um evento. Um problema de impressora precisa do modelo e da mensagem do visor. Quando a pessoa erra o formulário ou deixa um dado de fora, a TI precisa voltar a falar com ela antes de começar a atender. Além dos formulários, os pedidos também chegam por WhatsApp, por e-mail e pessoalmente, e quase todo dia a TI precisa voltar a falar com alguém porque faltou um dado no pedido. Esses dois fatos vêm da minha rotina no suporte e não foram medidos; a conversa final de cada sessão confere se os funcionários veem o mesmo problema (seção 2).

**Público.**
- **Principal:** funcionários dos 25 setores da escola que pedem ajuda à TI (Secretaria, Coordenações e Orientações de cada segmento, Financeiro, Compras, Portaria, Enfermaria, entre outros). São pessoas com níveis muito diferentes de familiaridade com tecnologia. Pela minha rotina, as Coordenações e Orientações são os setores que mais pedem ajuda.
- **Secundário:** a equipe de TI, que recebe os chamados e precisa de pedidos completos e na área certa.

**Oportunidade.** O conhecimento de como atender já existe. Organizei a *Matriz Mestre de Chamados* a partir dos formulários atuais: 4 áreas, 57 caminhos de atendimento, 10 regras condicionais e os setores com regras próprias (por exemplo, só o Financeiro vê o QuickBooks e só a Coordenação do Infantil vê o acesso às câmeras). Hoje esse conhecimento está espalhado e depende de a pessoa saber o caminho. Um assistente pode usar essa matriz para conduzir a pessoa até o pedido certo. A IA generativa permite que a pessoa conte o problema com as próprias palavras e receba um rascunho já organizado, com custo zero no plano gratuito do Gemini.

## 2. Hipóteses

| Tipo | Hipótese | Como será verificada |
|---|---|---|
| **Problema** | Os funcionários têm dificuldade para saber onde e como pedir ajuda à TI, e os pedidos chegam incompletos ou na área errada. | Conversa final de cada sessão, sem sugerir respostas: "Como você pede ajuda à TI hoje? Quanto tempo isso costuma levar?" e "Já teve alguma dificuldade para pedir ajuda pelos formulários de hoje? Qual?". Critério na seção 6. |
| **Solução** | Funcionários da escola conseguem abrir um chamado completo pelo SmartDesk sozinhos, no caminho certo e em até 3 minutos. *(Escrita na planilha antes dos testes — EVID-216.)* | Observação das tarefas e métricas automáticas da aba *Sessões*. |
| **Valor** | Quem usa o SmartDesk prefere esse jeito ao atual e usaria de novo no dia a dia. | Nota de facilidade no fim do chat, "Usaria de novo?" e recomendação de 0 a 10 na conversa final. |

**Suposições que não serão testadas nesta rodada:** que a TI atende mais rápido com chamados completos (depende de uso real por semanas) e que as dicas de autoatendimento evitam chamados (o painel registra "Resolvi sozinho", mas 5 sessões não bastam para medir isso).

## 3. Solução proposta e definição do MVP

**Solução.** O SmartDesk é um chat de atendimento da TI. A pessoa escolhe o tipo de ajuda pelos botões, que seguem a Matriz Mestre, ou conta o problema com as próprias palavras. Em seguida, responde só ao que falta, confere um resumo e envia. Ela recebe um número para acompanhar o chamado depois.

**O MVP testado** (versão 0.13.0) está publicado em <https://andymarksss.github.io/Assistente-SmartDesk/> e tem:
- chat guiado com os 25 setores, 4 áreas e 57 caminhos, aplicando as regras por setor;
- "Descrever com minhas palavras": a IA (Gemini) diz o que entendeu e monta o rascunho do chamado a partir do relato; se faltar algo, o chat faz a mesma pergunta do caminho pelos botões. A pessoa confirma ou corrige. A IA também avisa quando o relato traz dois pedidos ou não é assunto da TI;
- em defeitos simples, passos seguros para tentar antes de abrir o chamado (no relato, logo depois do rascunho; pelos botões, antes do envio);
- revisão antes do envio: a IA faz no máximo uma pergunta sobre o que falta;
- resumo revisável e correção de qualquer dado antes de enviar;
- envio para uma planilha Google, com número sequencial e anexos no Drive;
- acompanhamento do chamado pelo número e pelo e-mail;
- ticket por e-mail na abertura e um aviso a cada mudança de etapa, só com número, setor, pedido e etapa (sem o texto do pedido);
- painel de gestão para a TI, com etapas e indicadores. Ele dá suporte à demonstração, mas não é objeto do experimento.

**Fora do MVP:** login, troca de mensagens entre a equipe e o solicitante, integração com o sistema oficial de chamados da escola, prazos de atendimento (SLA), mais de uma unidade e relatórios gerenciais.

**Limites do papel da IA:**
- a IA não abre conversa livre e não muda sozinha a classificação escolhida pela pessoa;
- nome, e-mail e anexos não são enviados ao modelo;
- toda sugestão da IA passa por confirmação humana;
- sem IA (cota esgotada ou falha), o atendimento continua pelos botões.

**Sobre o tamanho do MVP.** O protótipo ficou mais completo do que o menor experimento possível. Optei por um fluxo funcional com os 57 caminhos reais porque a hipótese de solução é sobre comportamento: "conseguem abrir sozinhos, no caminho certo". Uma maquete ou uma pesquisa de opinião não mostrariam isso. O custo dessa escolha foi tempo de construção antes de ouvir usuários, e esse risco é um aprendizado do projeto.

## 4. Como a IA foi usada no processo de discovery

| Etapa | Ferramenta | Uso | O que **não** foi feito pela IA |
|---|---|---|---|
| Planejamento do projeto e do MVP | ChatGPT (conversa de planejamento "Metodologias Ágeis — Andy") | Dividir o trabalho em etapas e propor o primeiro fluxo do MVP: relato, classificação sugerida e confirmada pela pessoa, perguntas complementares, orientação, resumo e avaliação ([`fluxo-mvp.md`](../01-planejamento/fluxos-e-telas/fluxo-mvp.md)). A conversa também tratou da planilha Matriz Mestre e das suas abas: matriz, regras, setores, cenários de teste e resultados ([fontes](../08-referencias/fontes/contexto-e-fontes.md)). Não ficou registro de quais partes da planilha foram feitas na conversa e quais à mão. | O conteúdo da matriz (os 57 caminhos com os dados de cada um, os 25 setores e as 10 regras) vem dos quatro formulários reais da escola. O fluxo proposto não foi usado como veio: virou chat guiado na 0.2, e a classificação por palavras-chave deu lugar às escolhas da matriz na 0.5. |
| Construção do protótipo em ciclos curtos | Codex (OpenAI) e Claude Code (Anthropic) | Implementar cada versão, testar e registrar evidências. | As decisões de produto (chat em vez de formulário, local fora do MVP, o papel restrito da IA) foram minhas. |
| Avaliação técnica da IA | Banco de 186 relatos fictícios e 30 de controle, escritos com apoio de IA | Medir se a IA identifica o caminho certo (99% na 1ª sugestão), extrai os dados (99%) e não faz perguntas repetidas (0 de 62 depois do ajuste da 0.12.17). | Não substitui pessoas: confere a ferramenta, não o valor para o usuário. |
| Roteiro e instrumentos das sessões | Claude Code | Estruturar o roteiro, a ficha de observação e as abas de validação com fórmulas. | A hipótese e as metas foram escritas por mim antes dos testes (EVID-216). |
| Síntese (depois das sessões) | Apoio de IA para organizar as anotações | Agrupar falas e padrões que se repetirem em 2 ou mais pessoas. | A interpretação e a decisão final serão minhas, a partir das evidências. |

A regra que segui: **a IA ajuda a construir e organizar, mas não valida.** Só as sessões com funcionários reais confirmam ou derrubam as hipóteses.

## 5. Experimento escolhido

**Tipo:** teste de usabilidade moderado com protótipo funcional, seguido de uma conversa curta (cerca de 20 minutos por pessoa).

**Participantes:** pelo menos 5 funcionários de setores diferentes, entre eles pelo menos uma pessoa que usa pouca tecnologia e pelo menos uma que faça o teste no celular. Cada pessoa é identificada só por um código (P01 a P05).

**Tarefas:** cada pessoa abre 3 chamados a partir de situações reais da Matriz Mestre (cenários CT-01 a CT-11, em rodízio; os mais importantes aparecem duas vezes). Exemplos: "O projetor da sala não mostra a imagem do meu notebook", "Preciso de caixa de som e microfone para uma palestra na sexta-feira" e "Esqueci a senha do meu e-mail institucional". A pessoa escolhe se usa os botões ou o relato livre, e eu não ajudo durante o primeiro minuto de dificuldade.

**Coleta:**
- Métricas automáticas e anônimas na aba *Sessões*: etapa alcançada, como escolheu o caminho, uso das sugestões da IA, voltas, tempo até enviar e nota de facilidade.
- Ficha de observação: caminho certo, se precisou de ajuda, hesitações e falas em voz alta.
- Conversa final: como pede ajuda hoje, se já teve dificuldade para pedir ajuda pelos formulários, comparação com o jeito atual, se usaria de novo e recomendação de 0 a 10.

**Por que este experimento:** a hipótese principal é sobre o que as pessoas *conseguem fazer*, não sobre o que dizem achar. Uma landing page ou um formulário de interesse mediriam intenção, mas não mostrariam se a pessoa chega ao caminho certo sozinha.

## 6. Critérios de sucesso

Metas definidas na aba *Validação — Resumo* antes dos testes (EVID-216):

| Indicador | Meta | Fonte |
|---|---|---|
| Concluíram sem ajuda | ≥ 80% das tarefas | Ficha de observação |
| Chegaram ao caminho certo | ≥ 80% das tarefas | Ficha + caminho registrado no chamado |
| Tempo médio até enviar | ≤ 180 s | Aba *Sessões* |
| Facilidade no chat | média ≥ 4 (de 1 a 5) | Nota no fim do chat |
| Usariam novamente | ≥ 80% | Conversa final |

**Hipótese de problema (aprovado em 29/10/2026, antes das sessões):** confirma-se se pelo menos 3 de 5 participantes relatarem alguma dificuldade no jeito atual (não saber o formulário certo, ter de completar informações ou esperar retorno). A pergunta é feita na conversa final, sem sugerir respostas, e marcada na ficha de observação. Com exatamente 2 de 5, o resultado é inconclusivo; com no máximo 1, a hipótese não se confirma (seção 7).

## 7. Regra de decisão (definida antes das sessões)

**Aprovada em 28/10/2026; completada e aprovada de novo em 29/10/2026**, as duas vezes antes da primeira sessão com usuários. A versão de 28/10 não dizia o que fazer com exatamente 2 de 5 relatando dificuldade, com 4 metas sem uma das duas obrigatórias ou com no máximo 1 meta atingida. Além disso, uma falha só de tempo ou só de facilidade cabia em Perseverar e em Ajustar ao mesmo tempo. A linha Abandonar passou a ser contada pela mesma pergunta da ficha ("Relatou dificuldade no jeito atual?").

**Ordem de leitura:** primeiro a hipótese de problema (Abandonar ou Inconclusivo). Se ela se confirmar, vale Pivotar quando a condição dele ocorrer, mesmo com as metas atingidas; senão, Perseverar; nos outros casos, Ajustar.

| Resultado | Decisão |
|---|---|
| A hipótese de problema se confirma e pelo menos 4 das 5 metas são atingidas, incluindo "concluíram sem ajuda" e "chegaram ao caminho certo" | **Perseverar:** seguir para um piloto com a equipe de TI e mais setores, corrigindo antes o que fez falhar a meta que ficou de fora, se houver. |
| A hipótese de problema se confirma, mas só 2 ou 3 metas são atingidas, ou 4 sem "concluíram sem ajuda" ou sem "chegaram ao caminho certo" | **Ajustar:** corrigir os pontos que travaram 2 ou mais pessoas e repetir o teste com novos participantes. |
| A hipótese de problema se confirma, mas "usariam novamente" fica abaixo de 50%, a maioria prefere o jeito atual mesmo concluindo as tarefas, ou no máximo 1 meta é atingida | **Pivotar:** manter o problema e mudar a forma da solução (por exemplo, só o relato livre com rascunho da IA dentro dos formulários atuais, ou um apoio de triagem para a equipe de TI). |
| A hipótese de problema não se confirma: no máximo 1 de 5 relata dificuldade no jeito atual | **Abandonar** a solução para os solicitantes e registrar o aprendizado. |
| Exatamente 2 de 5 relatam dificuldade | **Inconclusivo:** repetir só a conversa final com mais 3 funcionários de outros setores e decidir pelo total de 8. Com pelo menos 5 de 8 relatando dificuldade (a mesma proporção de 3 de 5), a hipótese se confirma e valem as linhas acima; com menos, vale Abandonar. |

Com 5 participantes, uma pessoa equivale a 20%. Por isso, os números servem para enxergar padrões e não têm valor estatístico. As falas e os comportamentos observados pesam junto com as metas.

## 8. Ciclos de aprendizado até aqui

O protótipo evoluiu em ciclos curtos de construir, medir e aprender, todos registrados no CHANGELOG e nas evidências:

- **0.1 → 0.2:** a primeira versão era um formulário. Mudei para um chat guiado, com uma pergunta por vez e texto liberado só quando necessário.
- **0.5:** a classificação livre do relato deu lugar às escolhas da Matriz Mestre. A IA ficou restrita a apoiar (assunto do chamado), sem decidir pela pessoa.
- **0.6:** tirei o campo "local", porque o setor já atende ao MVP. Coloquei a revisão antes do envio.
- **0.7:** e-mail de contato e o primeiro painel de gestão para a TI.
- **0.10 e 0.11:** a IA passou a montar o rascunho a partir do relato e a fazer uma pergunta de complemento, e incluí o acompanhamento por número.
- **0.11.3 e 0.11.4:** a avaliação técnica com relatos fictícios encontrou erros em relatos vagos e alertas falsos. Corrigi com um glossário dos sistemas da escola, e o resultado chegou a 99%.
- **0.12.0:** métricas anônimas por sessão, código de participante no link e planilha de validação com as metas.
- **0.12.17:** os meus próprios testes mostraram a IA perguntando de novo data e horário já respondidos. Uma nova verificação nos 57 caminhos levou essas repetições a zero.
- **0.12.18:** desenhei a árvore de decisões completa do atendimento e a analisei caminho por caminho. Ela mostrou 15 incoerências, como uma correção de setor que travava o envio e textos de defeito em pedidos, todas corrigidas. No relato livre, a IA passou a dizer o que entendeu, a perguntar o que faltar com as mesmas perguntas dos botões, a dar as dicas antes dos dados e a orientar quando há dois pedidos ou o assunto não é da TI.
- **0.13.0:** antes das sessões, decidi que quem abre um chamado recebe o ticket por e-mail e um aviso a cada mudança de etapa. O e-mail leva só número, setor, pedido e etapa: o site é público, e um e-mail com o texto livre deixaria qualquer pessoa mandar mensagens, pela conta que envia os avisos, para qualquer endereço.

Esses ciclos foram feitos com testes meus e avaliações técnicas. **Nenhum deles valida o produto:** a validação começa nas sessões com os funcionários.

## Referências do projeto

- Protótipo: <https://andymarksss.github.io/Assistente-SmartDesk/> · painel: <https://andymarksss.github.io/Assistente-SmartDesk/admin.html>
- Canvas: [`canvas/lean-canvas.md`](canvas/lean-canvas.md)
- Roteiro das sessões: [`../04-validacao/roteiros/roteiro-sessao-usuarios.md`](../04-validacao/roteiros/roteiro-sessao-usuarios.md)
- Avaliação técnica da IA: [`../04-validacao/avaliacao-ia/`](../04-validacao/avaliacao-ia/)
- Hipótese e metas escritas antes dos testes: [`EVID-216`](../05-evidencias/EVID-216_hipotese-e-metas-antes-dos-testes.png)
- Matriz Mestre (origem): [`../02-matriz-e-regras/exportacoes/matriz-mestre-2026-10-01/origem.md`](../02-matriz-e-regras/exportacoes/matriz-mestre-2026-10-01/origem.md)
