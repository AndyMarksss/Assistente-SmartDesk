# Verificação 0.12.1

Data: 2026-10-19. `npm test` com dez suítes aprovadas (inclui a regra de movimento só em `motion.css`), `version:check` e `format:check` aprovados. Apps Script republicado só para alinhar a versão (versão 16 da mesma implantação); saúde `"version":"0.12.1"`.

## Servidor local (envio ao Google desligado)

- Abertura: 1 robô inline no lugar da imagem; nenhuma `<img>` restante nos avatares de mensagem; mensagens do usuário sem robô.
- Depois de "Como funciona?" (4 mensagens do SmartDesk): só a última tinha animações ativas (antena e piscada); as três anteriores, nenhuma. Os 4 robôs tinham IDs de gradiente diferentes.
- Quadros congelados (Edge sem janela, 390×844, tema escuro e claro): repouso, pulinho, boca aberta, olhos fechados, antena acesa, orelha acenando e olhos de lado ao pensar. A boca foi suavizada depois do primeiro quadro, que ficava em "V".
- Console sem erros novos ao recarregar.

Evidências EVID-218 e EVID-219.
