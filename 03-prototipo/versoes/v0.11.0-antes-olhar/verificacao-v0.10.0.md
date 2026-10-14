# Verificação 0.10.0

Data: 2026-10-14. Versão anterior preservada em `versoes/v0.9.2-antes-experiencia-ia`, sem `.env` nem dados locais.

## Testes automatizados

`npm test`: dez suítes aprovadas. A suíte de integração passou com 223 verificações (antes falhava por usar a data fixa 2026-10-05). Novas verificações:

- `/api/assist`: no máximo uma pergunta; pergunta que pede senha é descartada; até três dicas, sem links ou HTML; dicas só nos caminhos permitidos (papel atolado sim, redefinição de senha não); sem IA, nada é inventado; nome, e-mail e textos livres dos campos não chegam ao modelo.
- `/api/analyze`: ID fora da lista do setor faz cair na base local; ID permitido volta como sugestão da IA.
- Apps Script simulado: revisão e análise com as mesmas regras; 5 chamados por sessão (o 6.º recebe 429; repetir o mesmo ID não consome cota); IA para de ser chamada após 40 usos na sessão, sem marcar a IA como indisponível; PNG com conteúdo de texto é recusado; 4 anexos são recusados; limitador por minuto bloqueia com 100 aberturas e libera no minuto seguinte.
- `npm run version:check` e `npm run format:check` aprovados.

## Navegador (servidor local)

Servidor local com o Gemini real e o envio ao Google **desligado** (nenhum chamado foi gravado na planilha). Dados fictícios.

- Desktop 1366×820, temas escuro e claro: vidro, aurora, trilha com progresso, seletor de setor com busca, cartão de IA e atalhos, sugestão de caminho, pergunta de complemento, dicas, revisão e comprovante.
- O Gemini real sugeriu "Papel Atolado" e "Internet › Problemas com Wi-Fi" para relatos livres; fez pergunta de complemento para "o computador está ruim"; deu três dicas seguras para papel atolado e lentidão; não deu dicas para reserva de Chromebook; ignorou uma tentativa de injeção no relato.
- Falha de envio mostrou a mensagem de recebimento não configurado e manteve os dados; o comprovante foi conferido com uma resposta de sucesso simulada no próprio navegador (#TESTE-LOCAL), que não comprova recebimento no Google.
- "Lembrar meus dados" salvou nome, e-mail e setor no navegador; o novo atendimento ofereceu "Continuar como Teste" e foi direto às áreas. "Sou outra pessoa" apaga os dados.
- "Resolveu! Não preciso mais" encerrou sem envio; "Voltar uma etapa" trouxe as dicas de volta sem nova chamada à IA.
- Viewport 375×812 emulado: sem rolagem lateral (largura do documento = 375 px), seletor em duas colunas, cartões de área em duas colunas.
- Painel de gestão com o mesmo vidro e simulações locais.

## Contraste dos pares novos

Calculado pela luminância relativa WCAG sobre as cores sólidas equivalentes. Todos ≥ 4,5:1 após o ajuste do selo IA (que media 4,39 e 4,13 e passou a usar fundo de ação sólido: 6,76 claro e 7,98 escuro). Exemplos: texto sobre gradiente de ação 6,76–9,12; chip Pronto 6,03/5,56; rótulos do resumo 5,88/9,06; dicas 11,30/13,17; número do comprovante 5,43–7,25; título rosa da abertura 6,80/7,22. Não é auditoria completa: transparências sobre a aurora variam pixel a pixel.

## Limites desta verificação

- O Apps Script real ainda não foi atualizado; as rotas novas e as cotas no Google foram testadas apenas com serviços simulados.
- Teclado físico/virtual e desempenho do desfoque em celular real não foram conferidos (emulação não comprova aparelho).
- Movimento reduzido e transparência reduzida estão implementados em CSS, mas não foram simulados no sistema.
- Nenhuma destas verificações é validação com usuários.

Evidências: EVID-179 a EVID-188.
