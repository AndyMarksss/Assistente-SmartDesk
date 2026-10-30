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

## Publicação e teste real (29/10/2026)

- O usuário rodou `autorizarAvisosPorEmail` no editor ("Avisos por e-mail autorizados. Envios restantes hoje: 100") e só depois implantou a @35. `/exec?api=health` → 0.13.0, depois de alguns segundos ainda mostrando 0.12.18.
- Depois do `git push` (1feed22), o Pages serve o `app.js` com o texto novo do comprovante.
- Chamado de teste #030 (`?p=P99`, e-mail real do autor, Audiovisual › Caixa de Som):
  - chegou "Chamado #030 recebido — SmartDesk", com o remetente "SmartDesk — TI", número, data, setor, pedido e etapa, sem o texto do pedido (EVID-301);
  - no painel publicado, Em atendimento e depois Agendado: chegaram os dois avisos (EVID-302 a EVID-305);
  - o acompanhamento no chat mostra Agendado (EVID-306).
- O chamado foi aberto numa aba que ainda tinha o chat 0.12.18: o comprovante mostrou o texto antigo. O e-mail saiu do mesmo jeito, porque quem envia é o Apps Script. O texto novo do comprovante foi conferido no servidor local.
- A volta para "Em atendimento" depois de "Aguardando terceiros" ou "Agendado" e o limite de 10 avisos em 24 horas foram conferidos nos testes automáticos, não no teste real.
- O chamado #030 sai da planilha com `removerChamadosDosParticipantes`, junto com os das sessões.
