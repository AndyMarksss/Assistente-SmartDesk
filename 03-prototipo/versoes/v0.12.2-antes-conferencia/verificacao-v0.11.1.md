# Verificação 0.11.1

Data: 2026-10-14. `npm test` com dez suítes aprovadas; `version:check` e `format:check` aprovados. Saúde do Apps Script: `"version":"0.11.1"` (versão 11 da mesma implantação). Conferência em Edge sem janela, 1440×900, servidor local.

- **Olhar:** cursor à esquerda, à direita, acima e abaixo do robô → `--gaze-x/--gaze-y` de −8/+8 e −7/+7 e `transform` do grupo dos olhos igual (matrix com translate); cursor sobre o robô → deslocamento quase nulo; cursor saindo da janela → volta a 0. Montagem das quatro direções conferida.
- **Luz:** com a cor da luz trocada por vermelho forte para o teste, ela aparece sobre o cabeçalho e as etapas (cursor no alto) e sobre a área de resposta e a conversa (cursor embaixo). Antes, a camada tinha 380 px de altura (medido: `height: 380px` vindo de visual-depth.css). Com as cores reais, tema escuro: fundo da área de resposta perto do cursor (70, 64, 102) contra (42, 39, 68) longe dele. Tema claro: (220, 213, 246) contra (238, 235, 252).
- `is-lit` liga dentro do chat e desliga fora dele (cursor sobre a lateral) e ao sair da janela.

Evidências EVID-201 e EVID-202.
