# Verificação 0.13.0

Data: 2026-10-29. `npm test` com todas as suítes aprovadas, e `version:check` e `format:check` aprovados.

## Testes automáticos (Apps Script simulado, nenhum e-mail real)

- Chamados sem e-mail ou com domínio de teste (example.com) não mandam nada; a aba *Avisos* registra "Não enviado: e-mail fictício".
- Abertura com e-mail comum: um e-mail, com o remetente "SmartDesk — TI", o assunto "Chamado #NNN recebido — SmartDesk", "Pedido: Impressora › Solicitação de Toner / Tinta" e "Etapa atual: Novos chamados — na fila da equipe de TI".
- O e-mail não traz nome, assunto, descrição nem respostas do chamado (texto e HTML).
- Repetir o mesmo envio devolve o mesmo número e não manda outro e-mail.
- Etapas: "Em atendimento" manda o aviso; a mesma etapa de novo não manda. "Aguardando terceiros" e a volta para "Em atendimento" mandam os dois; "Agendado" e a volta para "Em atendimento" no dia, também.
- Sem cota: a etapa muda e o aviso fica "Não enviado: cota de e-mails do dia esgotada". Se o chamado volta para a última etapa avisada, nada sai (a pessoa já sabe); a próxima etapa diferente avisa.
- Limite: com 10 avisos do chamado em 24 horas, o 11º fica "Não enviado: limite de 10 avisos do chamado em 24 horas"; avisos de outro dia não contam.
- Falha no envio: o chamado é gravado mesmo assim, com "Não enviado: falha no envio".
- A aba *Avisos* não guarda nenhum endereço.
- Domínios de teste: p01@exemplo.com, a@teste.com.br, b@site.test e c@sub.example.org não recebem; ana@gmail.com, ti@colegio.com.br e x@contest.com recebem.
- Recibo: o portal devolve `emailSent: false` para ficticio@example.com, e o servidor local traduz `notice: "sent"` em `emailSent: true`.

## No navegador (servidor local, envio ao Google desligado)

Envio simulado no navegador (número #999, sem gravar no Google), com o recibo dizendo que o e-mail saiu: o comprovante mostra "Enviamos o comprovante para {e-mail}, e você recebe um aviso a cada mudança de etapa. Para ver a situação depois, use “Acompanhar um chamado” com este número." Rodapé 0.13.0, nenhum erro no console.

## Pendente

- `clasp push` feito em 29/10 às 15:03 (10 arquivos, com o novo `Avisos`), sobre um projeto remoto idêntico à 0.12.18; o manifesto publicado ficou como estava. Falta autorizar o envio no editor (`autorizarAvisosPorEmail`) e só depois rodar o `clasp deploy`.
- Conferir um e-mail real: um chamado de teste no Pages com um e-mail verdadeiro do usuário e uma mudança de etapa no painel.
