# Verificação 0.12.3

Data: 2026-10-20. `npm test` com dez suítes aprovadas (casos novos em `experience.cjs`), `version:check` e `format:check` aprovados.

## Regras (testes automáticos)

- "Teremos um evento… sistema de som" + "Não só caixa de som, preciso de microfone também" em Caixa de Som → sugere Caixa de Som / Microfone.
- "som e projetor no auditório, sem microfone" em Caixa de Som → Caixa de Som / Projetor (o microfone negado não entra).
- "projetor, caixa de som e microfone" em Projetor → Caixa de Som / Microfone / Projetor.
- "não vamos precisar de microfone" e "somente" não disparam; cabo HDMI fica fora.
- Evento: "Teremos um evento" com "Não" → confirma; "Não é um evento, é uma aula", resposta "Sim" ou "aula de música" → não confirma.

## Atendimento do print, reproduzido (servidor local com Gemini real, envio desligado)

Relato do usuário, Corrigir os dados, "Não" no evento e a resposta sobre o microfone:
1. Em "Você vai usar os equipamentos em um evento?", o "Sim" entendido pela IA aparece destacado.
2. Com "Não", o chat avisa: "No seu relato aparece um evento, mas a resposta… foi Não. É para um evento?" (respondido "Não é um evento" no teste).
3. Depois da resposta sobre o microfone: "Você também citou microfone… quer mudar o pedido para Caixa de Som / Microfone?" → Mudar.
4. Resumo: **Audiovisual › Caixa de Som / Microfone**, data, horário e evento mantidos, sem o ícone de IA nos dados respondidos pela pessoa. A IA voltou a perguntar o local, que ainda faltava.

Pelos botões (Caixa de Som, descrição "vamos precisar de microfone também"): a sugestão aparece antes da revisão da IA; com "Manter Caixa de Som", o atendimento segue sem repetir a pergunta.

Evidências EVID-223 a EVID-225.
