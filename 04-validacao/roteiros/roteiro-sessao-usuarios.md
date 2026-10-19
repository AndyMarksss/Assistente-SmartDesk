# Roteiro das sessões com usuários — SmartDesk 0.12

Teste com pelo menos 5 potenciais usuários reais (funcionários da escola que abrem chamados para a TI). Cada sessão leva cerca de 20 minutos: 3 situações no SmartDesk e uma conversa curta no fim. Este roteiro substitui o `roteiro-teste-base.md`.

## Antes do primeiro dia

1. **Escreva a hipótese e as metas antes de testar.** Na planilha do SmartDesk, aba *Validação — Resumo*, preencha "Hipótese" e "Meta" no quadro *Critérios de decisão* (ex.: concluíram sem ajuda ≥ 80%). Depois dos testes, a coluna "Atingiu?" se preenche sozinha.
2. **Prepare a planilha:** no editor do Apps Script, rode uma vez `prepararPlanilhaDeValidacao` (arquivo *Validacao*). Ela cria as abas *Validação — Tarefas*, *Validação — Participantes* e *Validação — Resumo* ao lado de *Sessões*.
3. **Limpe os testes antigos:** rode `removerChamadoDeTeste` (#010 e #013).
4. **Recrute 5 pessoas** de setores diferentes, com pelo menos uma que use pouco tecnologia e pelo menos uma que faça o teste no celular. Anote só o código (P01…P05), nunca o nome.
5. **Imprima** uma [ficha de observação](../registros/ficha-observacao.md) por participante e os cartões de situação (fim deste roteiro).
6. **Ensaie uma vez** com o link `?p=P00`, parando no resumo (sem enviar), para ver o selo "Teste P00" e o caminho. Os indicadores só contam os códigos da aba *Validação — Participantes*, então o ensaio não entra na conta.

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
   > Obrigado por ajudar. Estou testando um sistema para pedir ajuda à TI — quem está sendo avaliado é o sistema, não você. Vou te dar algumas situações; peça ajuda como faria no dia a dia. Vá falando em voz alta o que pensa. Não vou ajudar no começo, porque quero ver onde o sistema confunde. Use o nome "Participante Teste" e o e-mail p01@exemplo.com (com o seu número). Nada que você digitar é sobre você, e o registro guarda só o código P01. Tudo bem?
3. **Para cada situação:**
   - Entregue o cartão. A pessoa escolhe como quer pedir: pelos botões ou contando com as próprias palavras. Não sugira.
   - Não ajude. Se a pessoa travar por mais de 1 minuto, ajude e marque "Com ajuda".
   - Anote na ficha: número do chamado, se chegou ao tipo certo, se precisou corrigir, hesitações e frases ditas em voz alta.
   - No fim do chat, a pessoa responde sozinha "Quão fácil foi abrir este chamado?" (1 a 5). Pergunte em voz alta: "De 1 a 5, quão claras foram as perguntas do sistema?" e "Usaria de novo?".
   - Para a próxima situação, use "Novo atendimento" na mesma janela.
4. **Conversa final (5 min):**
   - Como você pede ajuda à TI hoje? Quanto tempo isso costuma levar?
   - Comparando com o jeito de hoje, o SmartDesk foi mais fácil, igual ou mais difícil? Por quê?
   - O que mais gostou? O que mudaria?
   - Usaria no dia a dia? (Sim / Talvez / Não)
   - De 0 a 10, quanto recomendaria para um colega?

## Depois das sessões

1. Passe a ficha para a planilha: aba *Validação — Tarefas* (o número do chamado na coluna F puxa caminho, forma de escolha, rascunho da IA, tempo, voltas e nota) e aba *Validação — Participantes*.
2. Leia a aba *Sessões*: atendimentos de participantes que pararam antes de enviar mostram em que etapa desistiram (coluna "Última etapa").
3. Veja *Validação — Resumo* e o quadro de critérios. Escreva a síntese (padrões que se repetiram em 2 ou mais pessoas) no [diário de validação](../registros/diario-validacao.md).
4. Baixe a planilha (Arquivo → Fazer download → Microsoft Excel) para `04-validacao/resultados/` e registre as evidências (EVID-###).
5. Só então rode `removerChamadosDosParticipantes` no editor, para tirar os chamados de teste da fila da TI (a aba *Sessões* fica).

## Cuidados

- Nada de dados pessoais reais: códigos P01…, nome e e-mail fictícios. Prints sem rosto nem tela de outros sistemas.
- Avise a equipe de TI: os chamados dos testes chegam com a tag "Teste P0x" e não devem ser atendidos.
- O site público aceita até 5 chamados por janela e 60 por dia; a IA tem cota diária própria. Não rode avaliações automáticas no dia dos testes.

## Cartões de situação (recortar)

| Cartão | Situação lida pelo participante | Observação para quem facilita |
|---|---|---|
| CT-01 | O projetor da sala não mostra a imagem do meu notebook. | Ambíguo: projetor ou cabo HDMI? |
| CT-02 | Preciso de caixa de som e microfone para uma palestra na sexta-feira. | Data, horário e "é evento?" |
| CT-03 | Acabou o toner magenta da impressora do setor. | Cor e modelo |
| CT-04 | A impressora está prendendo as folhas. | Papel atolado; dicas antes de enviar |
| CT-05 | Esqueci a senha do meu e-mail institucional. | Resetar senha |
| CT-06 | Preciso reservar um Chromebook para amanhã. | Data e período |
| CT-07 | Meu computador está muito lento e trava quando abro os programas. | Lentidão |
| CT-08 | Meu notebook conecta no Wi-Fi mas a internet fica caindo. | Wi-Fi |
| CT-09 | Preciso alterar uma nota no Mentor Web. | Três níveis: TI › Mentor Web › Alteração de notas |
| CT-10 | Sou do Financeiro e o QuickBooks está apresentando erro. | Setor nesta situação: **Financeiro** |
| CT-11 | Sou da Coordenação do Infantil e preciso acessar as câmeras. | Setor nesta situação: **Coordenação EI (Infantil)** |
| X1 | O ar-condicionado da sala está pingando. | Não é TI: o que a pessoa faz? |
| X2 | Veja em que pé está o chamado que você acabou de abrir. | Acompanhar um chamado (número + e-mail) |
