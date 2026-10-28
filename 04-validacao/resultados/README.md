# Resultados da validação com usuários

Os dados das sessões ficam na planilha do SmartDesk (Google Planilhas), em quatro abas:

| Aba | Quem preenche | O que tem |
|---|---|---|
| **Sessões** | O próprio SmartDesk, sozinho | Uma linha anônima por atendimento: código do participante, dispositivo, última etapa alcançada, como escolheu o caminho (botões ou relato), o que fez com o rascunho, o alerta, a pergunta e as dicas da IA, voltas, número do chamado, tempo até enviar, nota de facilidade (1 a 5) e o comentário "o que faltou". Sem nome, e-mail nem relato. |
| **Validação — Tarefas** | Quem facilita (a partir da ficha) | Uma linha por participante × situação (rodízio já preenchido). Digite o número do chamado na coluna F e o resto das métricas vem da aba Sessões. Preencha "Caminho certo?", "Concluiu sem ajuda?", "Precisou corrigir?", "Clareza", "Usaria novamente?" e as observações. |
| **Validação — Participantes** | Quem facilita | Perfil, uso de tecnologia, dispositivo, como pede ajuda hoje e as respostas da conversa final. |
| **Validação — Resumo** | Fórmulas | Indicadores (concluíram sem ajuda, caminho certo, tempo médio, facilidade, clareza, usariam de novo, recomendação, sessões não concluídas) e o quadro *Critérios de decisão*, com as metas escritas antes dos testes. |

As abas de validação são criadas pela função `prepararPlanilhaDeValidacao` (arquivo *Validacao* do Apps Script); a aba Sessões aparece no primeiro atendimento.

Ao terminar, baixe a planilha (Arquivo → Fazer download → Microsoft Excel) para esta pasta, com a data no nome, e registre as evidências. O roteiro completo está em [`../roteiros/roteiro-sessao-usuarios.md`](../roteiros/roteiro-sessao-usuarios.md).
