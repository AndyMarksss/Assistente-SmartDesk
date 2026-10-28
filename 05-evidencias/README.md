# 05 · Evidências

Prints e registros de cada etapa do projeto, numerados em sequência (**EVID-001** a **EVID-292** até 28/10/2026). Eles mostram o que foi construído, testado e decidido, e quando.

| Arquivo | Para que serve |
|---|---|
| [`indice-evidencias.md`](indice-evidencias.md) | Lista de todas as evidências, com etapa, descrição e origem. Comece por aqui. |
| [`checklist-evidencias.md`](checklist-evidencias.md) | As mesmas evidências agrupadas por data e versão. |
| [`manifesto-evidencias.json`](manifesto-evidencias.json) | Versão em dados: data da captura, data de inclusão, origem e SHA-256 de cada arquivo (para provar que não foi alterado). O campo `proximo_numero` indica a próxima evidência. |
| `confirmacao-pages-v0.9.2.md`, `diagnostico-publicacao-pages-v0.9.2.md` | Registros da publicação no GitHub Pages. |

## Como ler

- **Nome:** `EVID-###_descricao-curta.ext`. A numeração é global e nunca se repete; uma evidência nunca é sobrescrita.
- **Origem:** cada item diz se é print do autor, captura feita pelo assistente de IA no navegador ou registro de execução.
- **O que as evidências não são:** até aqui, nenhuma é resultado de sessão com usuários. São registros de construção, testes técnicos e verificações. Os resultados das sessões entram depois, com o código do participante (P01…).
