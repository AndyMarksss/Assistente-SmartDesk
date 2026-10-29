# Verificação 0.12.18

Data: 2026-10-29. `npm test` com todas as suítes aprovadas, inclusive a nova `fluxo-ia.cjs`, e `version:check` e `format:check` aprovados.

O que a suíte nova confere:

- tipo "dúvida" no GOO-006;
- aval: toner e defeito com compra no relato não pedem; "Outros" com headset novo pede;
- telefone com DDD;
- horário de hoje que já passou;
- assuntos de outras equipes;
- nos 57 caminhos: nenhuma abertura com "questão no"; nenhuma descrição de pedido com "desde quando"; nenhuma com "para quando" quando já há data ou período; nenhuma abertura com "algumas perguntas" sem dados;
- reservas do notebook e do Chromebook com a mesma pergunta;
- período letivo no encerramento de diário;
- `flowQuestion`;
- `safeExtract` (entendimento sem marcação e sem link, dicas só em defeito, horário passado descartado, evento só com "evento" no relato);
- `validateAnswers` com telefone e horário;
- a IA recebe `perguntaDoFluxo` e `dicasPermitidas`;
- `/api/extract` chamado num caminho sem campos (TI-INT-003).

## IA

### Extração (`/api/extract`)

Os 57 relatos claros de `04-validacao/avaliacao-ia/relatos.json`, comparados com a rodada final da 0.11.4.

| | 0.11.4 | 0.12.18 (1ª rodada) | 0.12.18 (final) |
|---|---|---|---|
| Campos esperados certos | 79 de 80 | 80 de 80 | 79 de 80: a finalidade de "cria login de wifi pro estagiario" (#126) veio vazia e será perguntada; na 1ª rodada veio "pro estagiario" |
| Campos a mais | 5 | 7: "É para um evento? = Não" em "aula de educação física" (#1) e num kit para o auditório (#9) | 5: os mesmos 4 textos da 0.11.4 (todos com a informação do relato) e "07:00" para "na primeira aula" (#18) |

A 1ª rodada mostrou o "Não" inventado em "É para um evento?". A instrução passou a dizer que aula, reunião, filme ou apresentação "não bastam para concluir que é ou que não é um evento". Além disso, `safeExtract` só aceita a resposta quando o relato fala em evento. A rodada final pegou outra invenção: 07:00 para "na primeira aula", embora a instrução peça horário explícito. Por isso o horário também só é aceito quando o relato diz a hora ("14h", "9:30", "7 horas", "meio-dia").

As duas redes, reaplicadas às 208 respostas das três rodadas (0.11.4 e as duas da 0.12.18) sem gastar cota, descartaram exatamente os três valores inventados (dois "Não" em evento e o 07:00) e mantiveram as outras 205, inclusive todas as certas.

Nas 57 respostas da rodada final:

- entendimento em todas;
- relato completo em 49;
- incompleto em 8, todos de reserva: seis de Audiovisual e Chromebook sem local, atividade ou pessoas, mais a reserva de notebook ("reserva note pra sexta");
- outro pedido em nenhuma (os relatos claros têm um pedido só);
- dicas em 12 defeitos simples, por exemplo em "Não imprime": conferir o cabo, desligar e ligar, conferir a impressora selecionada.

### Relato completo?

Pergunta de descrição do caminho conferida pela IA, em quatro relatos. Na primeira versão, a IA marcava como incompleto o erro do QuickBooks só por não dizer "desde quando", que é opcional ("Se puder, diga…"). A instrução passou a ignorar o que vem depois de "se puder" ou "por exemplo" e, na dúvida, contar como completo. Depois disso, as quatro respostas saíram certas:

| Caminho | Relato | Completo? |
|---|---|---|
| TI-COMP-005 | "O QuickBooks está dando erro na hora de abrir o lançamento" | sim |
| AV-004 | "Preciso de projetor e caixa de som na sexta às 14h" | não (falta local, atividade e pessoas) |
| TI-COMP-006 | "Preciso reservar um notebook para amanhã de manhã" | não |
| GOO-010 | "Quero reservar 20 chromebooks para a aula de redação do 8º ano na sala 12, quinta de manhã" | sim |

## Conversa no servidor local (IA real, envio ao Google desligado)

Os envios abaixo foram simulados no navegador.

**Reserva** ("Preciso de projetor e caixa de som na sexta às 14h"):

- rascunho "Entendi: você precisa de projetor e caixa de som na sexta às 14h", com data 30/10/2026 (sexta) e 14:00 preenchidas;
- "É para um evento?" e "Mais detalhes" como "Vou perguntar";
- depois do "Não": "Para completar o chamado, mais um detalhe. Como vai ser o uso? Conte o local, a atividade e para quantas pessoas…", com "Já contei tudo";
- resposta "Palestra no auditório para 80 pessoas" em "Perguntas do assistente" no resumo;
- a revisão não fez pergunta;
- "Corrigir um dado → Nome" voltou ao resumo sem nova chamada de assunto: só `/api/metrics`, nenhuma `/api/subject`.

**Defeito simples** ("O mouse do meu computador está falhando…"):

- rascunho com "Defeito no item que uso";
- logo depois, "Antes de completar o chamado, vale tentar estes passos rápidos:" com dois passos, antes de qualquer dado;
- "Resolveu!" levou a "Uma pergunta rápida: quão fácil foi resolver por aqui?" e, depois, a "Voltou a acontecer — abrir o chamado";
- o chamado continuou em "Quem usa o equipamento que está com defeito?";
- a revisão não repetiu as dicas, e o fluxo foi direto aos anexos.

**Dois pedidos** ("A impressora da secretaria está com papel atolado e também preciso de um mouse novo…"):

- rascunho de Papel Atolado com o aviso "Você também contou outro pedido…" e "Na verdade é: Computador › Troca de Mouse";
- a 1ª tentativa pediu aval da liderança no chamado da impressora; corrigido;
- depois do envio, "Abrir o outro pedido que você contou" montou o rascunho de Troca de Mouse como item novo, sem repetir o aviso.

**Fora da TI** ("O ar-condicionado da sala 3 está pingando água no chão"): "Pelo que você contou, isso parece ser assunto da manutenção do prédio, não da TI: vale procurar essa equipe…", e volta às áreas.

**Correção de setor no resumo** (Financeiro, QuickBooks › Erro no sistema, revisão e assunto simulados no navegador):

- trocar o setor para Secretaria mostrou "QuickBooks › Erro no sistema é atendido só para o setor Financeiro. Com o setor Secretaria, este tipo de atendimento não fica disponível.", com "Mudar para Secretaria e escolher outro tipo" e "Manter o setor Financeiro";
- "Manter" voltou ao resumo com o setor Financeiro.

**QuickBooks no setor Secretaria:** a IA sugeriu "Computador › Programas (software)" com o nome do programa preenchido. "Corrigir meu setor" só aparece quando a IA não acha nenhum caminho.

## Desenhos do fluxo (06-documentacao/fluxo)

- `node gerar-caminhos.cjs`: 57 caminhos, dicas em 28, setor restrito em 3, 111 perguntas de dados.
- Árvore horizontal: 613 nós, 7560 × 8579, 0 sobreposições.
- Árvore vertical: 613 nós, 3278 × 15774, 0 sobreposições.
- Passo a passo: 353 passos, 160 ligações, 0 links quebrados.
- Visão geral: 42 caixas, 0 sobrepostas.
- Imagens refeitas: árvores inteiras e por parte, 7 do passo a passo e 2 da visão geral.

Evidências EVID-293 a EVID-298 (servidor local, 1920 × 912).

## Pages (depois de publicar)

Apps Script @34, `/exec?api=health` → 0.12.18. Nenhum chamado enviado.

**1ª tentativa, logo depois do deploy:** o rascunho da reserva veio sem o "Entendi" e com os dados como "Vou perguntar". A chamada passou dos 20 s que o chat espera, provavelmente porque o Apps Script ainda estava frio. É o comportamento previsto sem IA, e o chamado segue normalmente.

**Medição direta, com o Apps Script já aquecido:** identificar levou 7,6 s, e o rascunho 8,0 a 8,5 s, sempre com o entendimento, o relato completo/incompleto e as dicas.

**Os quatro cenários, em seguida** (tempo do relato ao rascunho):

| Cenário | Tempo | Resultado |
|---|---|---|
| Reserva | 25 s | "Entendi: …", data e horário preenchidos, "Mais detalhes: Vou perguntar" e, depois do "Não", o complemento |
| Mouse | 22 s | dois passos seguros antes de qualquer dado |
| Dois pedidos | 17 s | aviso "Você também contou outro pedido" |
| Ar-condicionado | 9 s | orientação para a manutenção do prédio |

**O que ficou impreciso no cenário de dois pedidos:**

- o entendimento citou os dois pedidos;
- a extração pôs "secretaria" em "Modelo da impressora" (de "a impressora da secretaria") e "Papel Atolado" em "Mensagem do visor".

Os dois dados aparecem no rascunho para a pessoa conferir ("Corrigir os dados"). No teste local, o mesmo relato deixou o modelo para perguntar: a extração varia de uma chamada para outra.

Evidências do Pages: EVID-299 e EVID-300.
