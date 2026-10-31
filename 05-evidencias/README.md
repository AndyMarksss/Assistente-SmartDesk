# 05 · Evidências

Prints e registros de cada etapa do projeto, numerados em sequência (**EVID-001** a **EVID-311** até 31/10/2026). Eles mostram o que foi construído, testado e decidido, e quando.

## As que importam para a validação

| Evidência | O que mostra |
|---|---|
| [EVID-216](EVID-216_hipotese-e-metas-antes-dos-testes.png) | Hipótese e metas escritas na planilha em 19/10/2026, antes de qualquer sessão (indicadores zerados) |
| [EVID-212](EVID-212_planilha-validacao-criada.png) a [EVID-214](EVID-214_aba-participantes.png) | Planilha de validação preparada: rodízio de 15 tarefas e participantes P01 a P05 |
| [EVID-307](EVID-307_fichas-sessoes-p01-p05-transcricao.md) | **As cinco fichas das sessões com usuários reais (30/10/2026)**, transcritas com todas as marcações e falas |
| [EVID-301](EVID-301_email-ticket-abertura-0-13-0.png) a [EVID-306](EVID-306_acompanhamento-030-agendado-0-13-0.webp) | O protótipo testado funcionando de ponta a ponta: ticket por e-mail, mudança de etapa no painel e acompanhamento |
| [EVID-308](EVID-308_abertura-chat-0-13-1.png) a [EVID-311](EVID-311_resumo-antes-de-enviar-0-13-1.png) | As telas do chat publicado (0.13.1) usadas como figuras no README de entrega: abertura, como pedir, rascunho da IA e resumo |

As demais registram a construção do protótipo, versão a versão.

| Arquivo | Para que serve |
|---|---|
| [`indice-evidencias.md`](indice-evidencias.md) | Lista de todas as evidências, com etapa, descrição e origem. Comece por aqui. |
| [`checklist-evidencias.md`](checklist-evidencias.md) | As mesmas evidências agrupadas por data e versão. |
| [`manifesto-evidencias.json`](manifesto-evidencias.json) | Versão em dados: data da captura, data de inclusão, origem e SHA-256 de cada arquivo (para provar que não foi alterado). O campo `proximo_numero` indica a próxima evidência. |
| `confirmacao-pages-v0.9.2.md`, `diagnostico-publicacao-pages-v0.9.2.md` | Registros da publicação no GitHub Pages. |

## Como ler

- **Nome:** `EVID-###_descricao-curta.ext`. A numeração é global e nunca se repete; uma evidência nunca é sobrescrita.
- **Origem:** cada item diz se é print do autor, captura feita pelo assistente de IA no navegador ou registro de execução.
- **O que as evidências são:** até a EVID-306, registros de construção, testes técnicos e verificações. A EVID-307 é a primeira com sessões de usuários reais (P01 a P05, em 30/10/2026). As EVID-308 a EVID-311 são as telas do README de entrega, com dados fictícios.
