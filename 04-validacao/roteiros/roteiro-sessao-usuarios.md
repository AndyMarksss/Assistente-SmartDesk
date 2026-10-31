# Roteiro das sessões com usuários — SmartDesk 0.12 (revisado para a 0.12.18)

Teste com pelo menos 5 potenciais usuários reais (funcionários da escola que abrem chamados para a TI). Cada sessão leva cerca de 20 minutos: 3 situações no SmartDesk e uma conversa curta no fim. Este roteiro substitui o `roteiro-teste-base.md`.

> **Como as sessões aconteceram (30/10/2026):** as cinco pessoas fizeram o teste juntas, numa sala, depois de uma apresentação; cada uma usou o próprio aparelho, pelo link sem código de participante, foi até o resumo sem enviar e digitou a própria ficha. As diferenças em relação a este roteiro e o efeito de cada uma estão no [README do case](../../06-documentacao/case/README.md#4-experimento).

## Antes do primeiro dia

Os itens 1 a 3 foram feitos em 19/10/2026 (EVID-212 a EVID-216).

1. **Escreva a hipótese e as metas antes de testar.** Na planilha do SmartDesk, aba *Validação — Resumo*, preencha "Hipótese" e "Meta" no quadro *Critérios de decisão* (ex.: concluíram sem ajuda ≥ 80%). Depois dos testes, a coluna "Atingiu?" se preenche sozinha.
2. **Prepare a planilha:** no editor do Apps Script, rode uma vez `prepararPlanilhaDeValidacao` (arquivo *Validacao*). Ela cria as abas *Validação — Tarefas*, *Validação — Participantes* e *Validação — Resumo* ao lado de *Sessões*.
3. **Limpe os testes antigos:** rode `removerChamadoDeTeste` (#010 e #013).
4. **Recrute 5 pessoas** de setores diferentes, com pelo menos uma que use pouco tecnologia e pelo menos uma que faça o teste no celular. Anote só o código (P01…P05), nunca o nome. Veja "Recrutamento", abaixo.
5. **Imprima** o [kit das sessões](../registros/kit-impressao-sessoes.pdf) (A4, 14 páginas): recrutamento e agenda, guia da sessão, uma ficha pronta para cada participante (com o link, o e-mail fictício e as 3 situações dele) e os cartões para recortar. A fonte é [`kit-impressao-sessoes.html`](../registros/kit-impressao-sessoes.html).
6. **Ensaie uma vez** com o link `?p=P00`, parando no resumo (sem enviar), para ver o selo "Teste P00" e o caminho. Os indicadores só contam os códigos da aba *Validação — Participantes*, então o ensaio não entra na conta.
7. **Critério da hipótese de problema:** pelo menos 3 de 5 relatam dificuldade no jeito atual (aprovado em 29/10/2026; [parte teórica](../../06-documentacao/parte-teorica-hipoteses-e-validacao.md), seção 6). A regra de decisão começa por ele; com exatamente 2 de 5, o resultado é inconclusivo (seção 7).

## Recrutamento

- **Quem:** funcionários que pedem ajuda à TI (não a equipe de TI), um por setor, de 5 setores diferentes. Comece pelas Coordenações e Orientações, que são os setores que mais pedem, e complete com outros. Pelo menos 1 pessoa que usa pouca tecnologia e pelo menos 1 que faça o teste no próprio celular. Evite quem já viu ou ajudou a montar o SmartDesk.
- **Convite** (WhatsApp ou pessoalmente):
  > Oi, [nome]! Tudo bem? Estou fazendo um trabalho da faculdade sobre um jeito novo de pedir ajuda à TI aqui da escola. Você toparia me ajudar por uns 20 minutos? É só tentar abrir 3 pedidos de mentira num sistema, no computador ou no celular, enquanto eu observo. Quem está sendo avaliado é o sistema, não você, e eu não anoto o seu nome. Pode ser [dia] às [hora], aí no seu setor?
- **Não conte** que foi você quem fez o sistema nem o que acha dos formulários de hoje: as pessoas tendem a elogiar para agradar ou a repetir o que ouviram.
- **Quando:** horários calmos (fora da entrada, do intervalo e da saída); as 5 cabem em um ou dois dias.

## Antes de cada sessão

Desde a 0.13.0, quem abre um chamado recebe o ticket por e-mail, mas os e-mails de teste (p01@exemplo.com) nunca recebem: é esperado que nada chegue, e o comprovante diz só que a equipe usará o e-mail para o retorno.

Abra o link de ensaio (`?p=P00`) e conte um relato qualquer em "Descrever com minhas palavras" até aparecer o rascunho, sem enviar. O primeiro pedido à IA depois de um tempo parado pode passar dos 20 s que o chat espera, e o rascunho viria vazio para o participante. Esse aquecimento também não entra na conta.

## Rodízio das situações

Cenários CT-01 a CT-11 da Matriz Mestre. Cada um aparece pelo menos uma vez; os mais importantes, duas.

| Participante | Link (abrir numa janela anônima nova) | Situações |
|---|---|---|
| P01 | https://andymarksss.github.io/Assistente-SmartDesk/?p=P01 | CT-01, CT-04, CT-09 |
| P02 | https://andymarksss.github.io/Assistente-SmartDesk/?p=P02 | CT-02, CT-05, CT-07 |
| P03 | https://andymarksss.github.io/Assistente-SmartDesk/?p=P03 | CT-03, CT-08, CT-10 |
| P04 | https://andymarksss.github.io/Assistente-SmartDesk/?p=P04 | CT-06, CT-11, CT-01 |
| P05 | https://andymarksss.github.io/Assistente-SmartDesk/?p=P05 | CT-04, CT-02, CT-09 |

Mais participantes: P06, P07… com as situações que tiveram mais dificuldade. Extras opcionais, se sobrar tempo: **X1** "O ar-condicionado da sala está pingando" (assunto que não é de TI: a pessoa percebe?) e **X2** "Veja em que pé está o chamado que você acabou de abrir" (acompanhamento).

## Durante a sessão

1. **Abra uma janela anônima nova** com o link do participante e confira o selo "Teste P0x" ao lado do status da IA, no topo do chat. Cada participante tem a própria janela: as métricas e os chamados ficam marcados com o código.
2. **Fala de abertura** (adapte):
   > Obrigado por ajudar. Estou testando um sistema para pedir ajuda à TI — quem está sendo avaliado é o sistema, não você. Vou te dar algumas situações; peça ajuda como faria no dia a dia. Vá falando em voz alta o que pensa. Não vou ajudar no começo, porque quero ver onde o sistema confunde. Use o nome "Participante Teste" e o e-mail p01@exemplo.com (com o seu número). Nada que você digitar é sobre você, e o registro guarda só o código P01. As situações são inventadas: se o sistema sugerir passos para tentar, imagine que não resolveram e siga com o pedido. Tudo bem?
3. **Para cada situação:**
   - Entregue o cartão. A pessoa escolhe como quer pedir: pelos botões ou contando com as próprias palavras. Não sugira.
   - Não ajude. Se a pessoa travar por mais de 1 minuto, ajude e marque "Com ajuda".
   - Anote na ficha: número do chamado, se chegou ao tipo certo, se precisou corrigir, hesitações e frases ditas em voz alta.
   - Se a pessoa tocar em "Resolveu! Não preciso do chamado", não corrija: marque na ficha "Resolveu pelas dicas" e anote o que ela disse.
   - No fim do chat (depois do envio ou do "Resolveu!"), a pessoa responde sozinha "Quão fácil foi…?" (1 a 5). Pergunte em voz alta: "De 1 a 5, quão claras foram as perguntas do sistema?" e "Usaria de novo?".
   - Para a próxima situação, use "Novo atendimento" na mesma janela.
4. **Conversa final (5 min):**
   - Como você pede ajuda à TI hoje? Quanto tempo isso costuma levar?
   - Já teve alguma dificuldade para pedir ajuda pelos formulários de hoje? Qual? (Não sugira respostas; é a hipótese de problema.)
   - Comparando com o jeito de hoje, o SmartDesk foi mais fácil, igual ou mais difícil? Por quê?
   - O que mais gostou? O que mudaria?
   - Usaria no dia a dia? (Sim / Talvez / Não)
   - De 0 a 10, quanto recomendaria para um colega?

## Depois das sessões

1. Passe a ficha para a planilha: aba *Validação — Tarefas* (o número do chamado na coluna F puxa caminho, forma de escolha, rascunho da IA, tempo, voltas e nota) e aba *Validação — Participantes*.
2. Leia a aba *Sessões*: atendimentos de participantes que pararam antes de enviar mostram em que etapa desistiram (coluna "Última etapa").
3. Conte, pelas fichas, quantos participantes relataram dificuldade com o jeito atual: é a hipótese de problema, a primeira condição da regra de decisão. Registre no diário de validação. Com exatamente 2 de 5, faça só a conversa final com mais 3 funcionários de outros setores antes de decidir (parte teórica, seção 7).
4. Veja *Validação — Resumo* e o quadro de critérios. Escreva a síntese (padrões que se repetiram em 2 ou mais pessoas) no [diário de validação](../registros/diario-validacao.md).
5. Baixe a planilha (Arquivo → Fazer download → Microsoft Excel) para `04-validacao/resultados/` e registre as evidências (EVID-###).
6. Só então rode `removerChamadosDosParticipantes` no editor, para tirar os chamados de teste da fila da TI (a aba *Sessões* fica).

## Cuidados

- Nada de dados pessoais reais: códigos P01…, nome e e-mail fictícios. Prints sem rosto nem tela de outros sistemas.
- Só os e-mails p01@exemplo.com a p05@exemplo.com. Um e-mail inventado como a@b.com recebe o ticket de verdade, porque b.com é um domínio que existe.
- Avise a equipe de TI: os chamados dos testes chegam com a tag "Teste P0x" e não devem ser atendidos.
- O site público aceita até 5 chamados por janela e 60 por dia; a IA tem cota diária própria. Não rode avaliações automáticas no dia dos testes.

## Cartões de situação (recortar)

| Cartão | Situação lida pelo participante | Observação para quem facilita |
|---|---|---|
| CT-01 | O projetor da sala não mostra a imagem do meu notebook. | Ambíguo: projetor ou cabo HDMI? |
| CT-02 | Preciso de caixa de som e microfone para uma palestra na sexta-feira. | Data, horário e "é evento?"; pelo relato, o "Entendi" e o complemento (local, atividade e pessoas) |
| CT-03 | Acabou o toner magenta da impressora do setor. | Cor e modelo |
| CT-04 | A impressora está prendendo as folhas. | Papel atolado; dicas: pelo relato, logo depois do rascunho; pelos botões, antes de enviar |
| CT-05 | Esqueci a senha do meu e-mail institucional. | Resetar senha |
| CT-06 | Preciso reservar um Chromebook para amanhã. | Data e período; local, atividade e pessoas |
| CT-07 | Meu computador está muito lento e trava quando abro os programas. | Lentidão; pode ter dicas |
| CT-08 | Meu notebook conecta no Wi-Fi mas a internet fica caindo. | Wi-Fi; pode ter dicas |
| CT-09 | Preciso alterar uma nota no Mentor Web. | Três níveis: TI › Mentor Web › Alteração de notas |
| CT-10 | Sou do Financeiro e o QuickBooks está apresentando erro. | Setor nesta situação: **Financeiro** |
| CT-11 | Sou da Coordenação do Infantil e preciso acessar as câmeras. | Setor nesta situação: **Coordenação EI (Infantil)** |
| X1 | O ar-condicionado da sala está pingando. | Não é TI: pelo relato, o chat indica a manutenção do prédio; pelos botões, o que a pessoa faz? |
| X2 | Veja em que pé está o chamado que você acabou de abrir. | Acompanhar um chamado (número + e-mail) |
