# SmartDesk — Protótipo 0.4.0

Chat guiado do projeto acadêmico: boas-vindas, nome/apelido, setor de exemplo, relato, classificação confirmada, local, e-mail e resumo. Os nomes das empresas foram retirados da versão acadêmica. O recurso de organizações poderá ser retomado em uma futura implementação corporativa; as versões anteriores estão preservadas.

## Usar

Com Node.js 22.16+ instalado, abra um terminal nesta pasta e execute `node server/server.cjs`. Abra http://127.0.0.1:4173/. O botão no cabeçalho alterna temas claros e escuros, com preferência salva no navegador. Os ícones Font Awesome Free 6.7.2 são locais, sem necessidade de CDN em tempo de uso.

## Configurar Gemini

1. Abra o arquivo `.env` nesta pasta, ao lado de `index.html`. Se não existir, copie `.env.example` com esse nome.
2. Preencha `GEMINI_API_KEY=` com sua chave do Google AI Studio, sem espaços antes ou depois.
3. Mantenha `GEMINI_MODEL=gemini-3.5-flash-lite`.
4. Salve e reinicie o servidor: no terminal que o iniciou, Ctrl+C e `node server/server.cjs`. Atualize a página.

“Gemini configurado” indica que o servidor encontrou a chave. “Gemini · análise com IA” aparece somente após uma resposta válida do serviço. Sem chave ou em falha/limite, a análise usa regras locais e identifica isso. Não há troca automática de modelo, repetição automática de chamada ou ativação de faturamento.

O plano gratuito tem cotas e depende da elegibilidade do projeto no Google. Confira a [tabela oficial](https://ai.google.dev/gemini-api/docs/pricing#gemini-3.5-flash-lite). Esta configuração não assegura gratuidade se o projeto já estiver em modalidade paga.

A chave permanece no servidor. `.env` é ignorado pelo Git e bloqueado no servidor web; nunca coloque a chave em `app.js`, HTML ou capturas. Nome, e-mail e histórico da conversa não são enviados ao Gemini. Relato e setor são enviados ao Google quando a integração está configurada; não inclua dados pessoais/sigilosos no relato. Use dados fictícios durante a demonstração acadêmica.

## Limites atuais

Base parcial com 14 classificações e quatro setores de exemplo; não representa a matriz oficial completa. IA aplicada à classificação do relato, seguida de confirmação do usuário. Triagem detalhada, envio real de chamados e avaliação com usuários ainda pendentes. Não foram preenchidos resultados de validação.

## Evidências

Capturas e índices ficam em `../05-evidencias`. A chave nunca deve aparecer no print. Para esta versão, registrar o início pessoal em ambos os temas e, após configurar a chave, a classificação com indicador de análise por Gemini.

## Atualização visual e Gemini — 2026-10-01

Identidade lavanda, ameixa e rosa nos dois temas; robô Font Awesome, cartões suaves e sidebar adaptada ao tema. O usuário confirmou Free tier sem faturamento; modelo atualizado manualmente para gemini-3.5-flash-lite após indisponibilidade do antigo para novos usuários. Resposta real do Google e classificação de papel atolado conferidas no chat, EVID-015. Não há ativação de faturamento ou troca automática. A [modalidade gratuita](https://ai.google.dev/gemini-api/docs/pricing#gemini-3.5-flash-lite) está sujeita às cotas do projeto.
