# Verificação 0.12.17

Data: 2026-10-28. `npm test` com todas as suítes aprovadas (novos casos: a revisão recebe "Mensagem do visor (respondido)" e "Data do atendimento: dd/mm/aaaa (dia)"; "Qual mensagem aparece no visor?" e "Em qual horário exato…" são descartadas quando já respondidas; "Qual equipamento você precisa?" é descartada no Audiovisual; "Em qual sala será a reunião?" passa), `version:check` e `format:check` aprovados. Filtro de repetição conferido em 30 perguntas (repetidas e úteis), sem erro.

## IA — todas as requisições (detalhes em 04-validacao/avaliacao-ia/relatorio-requisicoes-v0.12.17.md)

| Requisição | Antes | Depois |
|---|---|---|
| Revisão (`/api/assist`), 57 caminhos + 5 casos-limite | 37 perguntas em 62; 12 voltavam a dado respondido ou não faziam sentido; 1 alerta falso | 23 perguntas em 62; 0 repetidas; 1 alerta (correto) |
| Assunto (`/api/subject`) | sem acento em parte dos casos, "Outros na Secretaria", "Manutenção" num empréstimo, Audiovisual sem um dos itens | 57 de 57 com a instrução nova (direto no Gemini, com espera longa; ver abaixo) |
| Identificação (`/api/analyze`) | 57/57 na 0.11.4 | 28/28 hoje, sem mudança de instrução |
| Extração (`/api/extract`) | 99% na 0.11.4 | 27 caminhos hoje, datas relativas resolvidas a partir de 28/10 |

No fim da tarde o Gemini passou a responder em 10–30 s (15 s para um "ok"); o servidor desiste em 12 s e cai no assunto local. Por isso a rodada de assuntos foi feita direto no Gemini, com os mesmos dados e a mesma instrução, esperando até 90 s (`assuntos-espera-longa.cjs`).

Caminho Audiovisual completo na conversa (local, IA real), com data, horário, evento e o relato "Vai ter apresentação dos alunos para os pais em vários ambientes da escola." (parecido com o do #014): a IA perguntou "Em quais locais da escola será utilizada a caixa de som e o microfone?", sem voltar ao horário.

Troca de tipo depois do alerta (caso do #017, revisão simulada só na primeira chamada): Wi-Fi → "Sem mais detalhes" → "Escolher outro tipo" → "Computador não está conectado à rede" → resumo com "INTERNET > Computador não está conectado à rede. Tipo de conexão: Cabo."; a IA real perguntou "Em qual sala ou local está este computador?".

## Quadro (14 chamados fictícios em "Novos chamados", lista de teste sobre a demonstração local)

| Janela | Quadro | Coluna que rola | Outras colunas |
|---|---|---|---|
| 1920 × 912 (usuário) | 753 px, cabe | 4 inteiros + metade | mesma altura (727 px), cartões iguais (139 px) |
| 1864 × 958 | 753 px, cabe | 4 + metade | idem |
| 1440 × 900 | 718 px, cabe | 3 + metade | idem (cartões de 171 px) |
| 1366 × 768 | 718 px, cabe | 3 + metade | idem |
| 1280 × 720 | 539 px, cabe | 2 + metade | idem |
| 390 × 844 (celular, colunas em linhas) | rola a página | 4 + metade | iguais por linha |

Arrastar um cartão de "Em atendimento" para a coluna que rola: "#SIM-002 movido para Novos chamados.", contagem 15, cartão à vista (devolvido depois à etapa original).

## Primeira tela do chat (conversa.scrollHeight ≤ clientHeight)

17 tamanhos × sem e com dados salvos. 0.12.16: 10 de 34 rolavam (1920 × 912: 11 px; 1024 × 700 com dados salvos: 122 px; 375 × 667 e 390 × 664 com dados salvos: 3 e 6 px). 0.12.17: 0 de 34 — nível 1 em 1920 × 912 e 1536 × 730, 2 em 1280 × 720, 3 em 1024 × 700 e nos celulares com dados salvos que rolavam, 5 em 1024 × 700 com dados salvos; nos outros, sem ajuste.

## Varreduras

Painel nos 12 tamanhos, dois temas, comparado com a 0.12.16: nenhum achado novo. Chat (36 medições por tema): nenhum achado novo no claro; no escuro, o rótulo "SmartDesk" (10 px) da primeira mensagem passou a ser medido em três celulares deitados, porque agora a mensagem aparece na primeira tela.

Evidências EVID-285 a EVID-292.
