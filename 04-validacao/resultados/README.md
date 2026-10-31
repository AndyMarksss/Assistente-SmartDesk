# Resultados da validação com usuários

**Sessões de 30/10/2026:** números em [`resultados-sessoes-2026-10-30.md`](resultados-sessoes-2026-10-30.md), a partir das fichas transcritas em [EVID-307](../../05-evidencias/EVID-307_fichas-sessoes-p01-p05-transcricao.md). Ninguém enviou chamado, então as abas *Validação — Tarefas* e *Validação — Resumo* não puxam nada. A aba *Sessões* também não registrou essas sessões (a causa não foi identificada), então todos os números vêm das fichas e o tempo não foi medido. A planilha não vem para cá, porque a aba *Chamados* tem nomes e e-mails.

Os dados das sessões ficam na planilha do SmartDesk (Google Planilhas), em quatro abas:

| Aba | Quem preenche | O que tem |
|---|---|---|
| **Sessões** | O próprio SmartDesk, sozinho | Uma linha anônima por atendimento: código do participante, dispositivo, última etapa alcançada, como escolheu o caminho (botões ou relato), o que fez com o rascunho, o alerta, a pergunta e as dicas da IA, voltas, número do chamado, tempo até enviar, nota de facilidade (1 a 5) e o comentário "o que faltou". Sem nome, e-mail nem relato. |
| **Validação — Tarefas** | Quem facilita (a partir da ficha) | Uma linha por participante × situação (rodízio já preenchido). Digite o número do chamado na coluna F e o resto das métricas vem da aba Sessões. Preencha "Caminho certo?", "Concluiu sem ajuda?", "Precisou corrigir?", "Clareza", "Usaria novamente?" e as observações. |
| **Validação — Participantes** | Quem facilita | Perfil, uso de tecnologia, dispositivo, como pede ajuda hoje e as respostas da conversa final. |
| **Validação — Resumo** | Fórmulas | Indicadores (concluíram sem ajuda, caminho certo, tempo médio, facilidade, clareza, usariam de novo, recomendação, sessões não concluídas) e o quadro *Critérios de decisão*, com as metas escritas antes dos testes. |

A hipótese de problema não está na planilha: conte-a pelas fichas ("Relatou dificuldade no jeito atual?") e aplique a regra de decisão da [parte teórica](../../06-documentacao/parte-teorica-hipoteses-e-validacao.md#7-regra-de-decisão-definida-antes-das-sessões), seção 7.

As abas de validação são criadas pela função `prepararPlanilhaDeValidacao` (arquivo *Validacao* do Apps Script); a aba Sessões aparece no primeiro atendimento.

Numa próxima rodada, baixe a planilha (Arquivo → Fazer download → Microsoft Excel) para fora do repositório e traga para cá só os dados anônimos da aba *Sessões*, com a data no nome. O roteiro completo está em [`../roteiros/roteiro-sessao-usuarios.md`](../roteiros/roteiro-sessao-usuarios.md).
