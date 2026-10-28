# Verificação 0.12.0

Data: 2026-10-19. `npm test` com dez suítes aprovadas. Testes novos:
- métricas locais em arquivo, com campos fora da lista recusados, sem nome e com comentário limpo;
- participante "p07" normalizado para P07 e "Maria" ignorado;
- coluna P e listagem no Apps Script simulado;
- aba Sessões com uma linha por atendimento, atualizada (e não duplicada) a cada etapa;
- abas de validação com o rodízio dos 11 cenários e as fórmulas;
- receptor 0.11.4 aceito pelo servidor local.

`version:check` e `format:check` aprovados. Apps Script na versão 15 da mesma implantação; saúde `"version":"0.12.0"`.

## Servidor local (envio ao Google desligado)

Link `?p=1` → selo "Teste P01". As métricas gravadas em `server/data/sessoes.jsonl` seguiram a ordem início → identificação → caminho (botões, Impressora › Papel Atolado) → resumo. Contaram 1 volta e registraram "seguiu para o chamado" nas dicas.

## GitHub Pages (Apps Script real)

Participante técnico P99, cenário de papel atolado pelos botões:
- selo "Teste P99";
- dicas → seguir → sem anexo → resumo → envio do chamado **#015**;
- pergunta "Quão fácil foi abrir este chamado?" com as 6 opções; resposta 5 e comentário de teste;
- as 9 gravações de métricas voltaram `stored: true`;
- o painel mostrou o #015 com a tag "Teste P99".

O #015 e a linha P99 da aba Sessões são de teste. A função `removerChamadosDosParticipantes` remove o chamado ao fim das sessões. Os indicadores da aba *Validação — Resumo* contam só os códigos listados em *Validação — Participantes*, por isso o P99 fica fora da conta.

Evidências EVID-209 a EVID-211.
