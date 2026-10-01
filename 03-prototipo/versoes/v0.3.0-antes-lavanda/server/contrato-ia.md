# Integração Gemini

O navegador envia somente `description` e `sector` ao servidor local em `/api/analyze`. O servidor filtra as categorias permitidas ao setor e envia relato, setor e lista de categorias ao Gemini pelo endpoint `generateContent`, com chave no cabeçalho `x-goog-api-key`.

A resposta estruturada contém `itemIds`, lista de IDs. IDs fora da base ou proibidos pelo setor são rejeitados pelo servidor. Zero IDs significa desconhecido, um significa sugestão, vários exigem escolha. O relato é tratado como dado na instrução do sistema; nenhuma ferramenta ou ação externa é concedida ao modelo.

Tempo máximo de chamada: 12 segundos. Falha, limite ou resposta inválida retornam a análise local com `fallback:true`, nunca uma falsa confirmação de IA. Sem chave não há chamada externa. `/api/status` revela apenas disponibilidade da configuração, sem testar a chave, sem exibir credenciais.

O arquivo `.env` é local, ignorado pelo Git e nunca servido. Nome, e-mail, local e histórico não entram no pedido ao Google. Relatos ainda podem conter informações digitadas pelo usuário; a interface pede dados fictícios no experimento.

Documentação consultada em 2026-10-01: [generateContent](https://ai.google.dev/api/generate-content?hl=en), [saída estruturada e migração](https://ai.google.dev/gemini-api/docs/migrate-to-interactions), [preços](https://ai.google.dev/gemini-api/docs/pricing).
