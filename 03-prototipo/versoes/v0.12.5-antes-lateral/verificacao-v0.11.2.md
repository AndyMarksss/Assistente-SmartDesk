# Verificação 0.11.2

Data: 2026-10-14. `npm test` com dez suítes aprovadas; `version:check` e `format:check` aprovados. Conferência em Edge sem janela, 1536×940, servidor local, tema escuro.

- Camada da luz: `z-index: 0`, altura igual à do chat (902 px), mistura normal, opacidade 1 com o cursor dentro do chat.
- Com cor de teste vermelha: cursor no fundo abaixo do card ilumina só o fundo; card, mensagem, trilha de etapas e área de botões continuam por cima, sem a luz.
- Cores reais: fundo (17, 24, 40) → (53, 56, 89) perto do cursor; fundo à esquerda do card (16, 23, 39) → (44, 48, 75); área de botões (83, 84, 105) sem mudança; card (34, 52, 72) → (42, 56, 82), só o que passa pelo vidro.
- Olhar do robô da 0.11.1 sem mudança.

Evidências EVID-203 e EVID-204.
