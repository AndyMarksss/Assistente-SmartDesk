# Verificação 0.11.0

Data: 2026-10-14. `npm test` com dez suítes aprovadas (223 verificações de integração); `version:check` e `format:check` aprovados. Saúde do Apps Script: `"version":"0.11.0"` (versões 9 e 10 da mesma implantação, /exec inalterado).

## Servidor local, Gemini real, envio ao Google desligado

Capturas em Edge sem janela (390×844 a 2x e 1440×1000), dados fictícios.

- **Rascunho pela IA:** relato "projetor e caixa de som para a reunião de pais na sexta-feira às 9h30, no auditório, evento com apresentação" → tipo Caixa de Som / Projetor; data 16/10/2026 (sexta), 09:30 e evento "Sim" preenchidos; só o link do roteiro foi perguntado, com "Enviar o link depois". Sem pergunta de autorização de compra (corrigido em `safeExtract`/`selectItem`).
- **Papel atolado pelas escolhas:** "Não sei o modelo" e "Não aparece nada" como respostas rápidas; a pergunta do visor explica o que procurar ("Atolamento bandeja 2"); detalhes opcionais; dicas "Antes de enviar o chamado…" com "Não resolveu, seguir com o chamado" e "Resolveu! Não preciso do chamado"; resumo completo.
- **Coerência:** relato de impressora no caminho de Wi-Fi gerou o alerta e "Escolher outro tipo" manteve o relato (conferido antes da compactação desta sessão, mesmo código).
- **Painel:** skeleton com 8 cartões e distribuição/autoatendimento vazios durante a troca de origem; kanban com 7 colunas numa linha em 1280 e 1440 px, sem rolagem lateral (scrollWidth = clientWidth); em 375 px, duas colunas. Arraste com Pointer Events: cartão-fantasma sob o cursor, coluna de destino destacada, cartão movido, aviso "#SIM-… movido para Finalizado." e animação de chegada.
- **Correções feitas durante a conferência:** o cartão-fantasma não aparecia (regra `.ticket-card` mais específica anulava `position: fixed`, e a transição atrasava o movimento); o botão do painel no cabeçalho do chat ficava estreito no celular; o skeleton deixava à vista a distribuição da origem anterior.
- Acompanhamento de chamado devolve 503 local (depende do Google), como esperado.
