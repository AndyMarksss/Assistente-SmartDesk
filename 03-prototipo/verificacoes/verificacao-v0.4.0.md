# Verificação técnica 0.4.0

2026-10-01, assistente. Não é validação acadêmica com usuários.

- Temas claro/escuro conferidos visualmente; lavanda, ameixa, rosa discreto; robô Font Awesome carregado.
- Oito combinações de texto medidas por tema: claro 4,71:1 a 14,01:1; escuro 7,39:1 a 15,98:1. Todas acima de 4,5:1, sem constituir auditoria completa de acessibilidade.
- Desktop 1440x1000 e celular 390x844. Celular sem transbordamento horizontal; botões de tema e novo atendimento acessíveis, campo para nome liberado.
- 21 testes simulados do servidor passaram após a alteração visual; teste por regra local de papel atolado também conferido no navegador.
- Chave carregada após reiniciar servidor. Consulta real de modelos retornou 200. Gemini 2.5 Flash-Lite retornou 404 por indisponibilidade a novos usuários. Fallback local identificado corretamente.
- Atualização para Gemini 3.5 Flash-Lite e teste rejeitados pela revisão automática por risco de custo. A tentativa rejeitada não foi executada. Confirmação do projeto gratuito pedida ao usuário. .env preservado intacto pelo assistente, sem leitura em saídas ou cópia histórica.
- EVID-012 a EVID-014 documentam interface, não classificação real de IA. Próxima evidência EVID-015 após resolver modelo/plano e obter resposta válida do Google.
## 2026-10-01 — Conexão Gemini concluída

O usuário confirmou explicitamente Free tier sem faturamento. Com essa confirmação e a tabela oficial mostrando entrada/saída gratuitas nessa modalidade, a atualização foi autorizada pela revisão automática. Modelo atualizado para gemini-3.5-flash-lite, chave preservada. Resposta real 200 com printer-paper, e chat mostrou Gemini · análise com IA e Impressora / Papel atolado. EVID-015 registrada; próximo número EVID-016. 21 testes simulados repetidos e aprovados após a atualização. A interrupção e pendência anteriores estão resolvidas; não houve ativação de faturamento ou mudança automática de modelo.

Referência: [preços oficiais](https://ai.google.dev/gemini-api/docs/pricing#gemini-3.5-flash-lite).
