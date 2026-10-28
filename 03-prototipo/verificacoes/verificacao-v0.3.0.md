# Verificação técnica — SmartDesk 0.3.0

Data: 2026-10-01. Realizada pelo assistente, com dados fictícios. Não são resultados de validação acadêmica com usuários.

- Font Awesome local carregado; família computada Font Awesome 6 Free e ícones presentes visualmente.
- Tema claro/escuro alternado pelo cabeçalho; escolha escura persistiu após recarregar a página.
- Contraste medido no navegador: tema claro 5,71:1 a 11,92:1 para os textos inspecionados; tema escuro 7,22:1 a 13,62:1, incluindo rótulos do resumo. Combinações examinadas acima de 4,5:1. Não é uma auditoria completa de acessibilidade.
- Desktop 1280×900 e celular 390×844, sem transbordamento horizontal. Botão de tema e novo atendimento visíveis no celular. Rolagem ajustada para manter última pergunta visível após escolhas.
- Percurso completo: iniciar, nome fictício Alex, Secretaria, relato de papel atolado, confirmação, local fictício, e-mail inválido rejeitado, e-mail fictício válido, resumo. Nome perguntado uma vez, empresas ausentes, texto liberado por etapa.
- 21 verificações automatizadas: análise local, bloqueio por setor, validação, origem, bloqueio de .env/server/histórico, assets locais, Gemini simulado, envio sem nome/e-mail, credencial apenas no cabeçalho, rejeição de categoria proibida e fallback por falha/limite.
- Nenhuma chamada externa ao Gemini e nenhuma chave real utilizada. Teste real pendente de configuração pelo usuário.
- Download do resumo não foi reavaliado nesta versão; limitação de confirmação no navegador integrado permanece registrada na versão 0.2.0.

Repetir testes: `node server/tests/integration.cjs`, dentro de 03-prototipo. Gemini usado nesses testes é simulado, mesmo se uma chave real existir no .env.

Evidências: EVID-009 (escuro), EVID-010 (claro), EVID-011 (início pessoal no celular). Próxima evidência útil: Gemini · análise com IA após resposta real com relato fictício, sem revelar chave.
