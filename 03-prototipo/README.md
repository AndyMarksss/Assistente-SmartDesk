# 03 · Protótipo do SmartDesk

Código do chat de atendimento, do painel de gestão, do servidor local e da integração com o Google. A versão atual está em [`VERSAO.md`](VERSAO.md) e aparece no rodapé do chat e do painel. O que mudou em cada versão fica no [`CHANGELOG.md`](CHANGELOG.md), e como cada uma foi conferida, em [`verificacoes/`](verificacoes/README.md).

- **Chat:** <https://andymarksss.github.io/Assistente-SmartDesk/>
- **Painel:** <https://andymarksss.github.io/Assistente-SmartDesk/admin.html>

## Como funciona

| Camada | Onde roda | O que faz |
|---|---|---|
| Interface (`index.html`, `admin.html`, `assets/`) | GitHub Pages ou servidor local | Chat, painel, temas claro e escuro, sem etapa de compilação |
| API | Apps Script (`integracoes/apps-script`) no Pages; `server/` no local | IA, envio do chamado, anexos, acompanhamento, gestão e métricas |
| Dados | Planilha *SmartDesk — Chamados* e pasta de anexos no Drive | Um chamado por linha (#001, #002…), abas *Sessões* e *Validação* |

Regras, instruções da IA e validação são escritas uma vez, em `assets/js` e `server/`, e copiadas para o Apps Script por `scripts/build-apps-script.cjs` (gera `PortalShared.gs`). Assim, o Pages e o servidor local se comportam igual.

## Estrutura

| Caminho | Conteúdo |
|---|---|
| `index.html`, `admin.html` | Chat e painel de gestão |
| `assets/js` | `app.js` (atendimento), `admin.js` (painel), `knowledge-base.js` (Matriz Mestre), `classifier.js` e `request-policy.js` (regras), `chat-view.js`, `form-controls.js`, `attachments.js`, `client-api.js`, `pages-transport.js` e os demais módulos descritos em [`arquitetura.md`](arquitetura.md) |
| `assets/css` | Camadas carregadas em ordem. No chat: `style`, `responsive`, `visual-depth`, `personality`, `identity`, `atmosphere` e `motion`; no painel, `admin` entra no lugar de `responsive` e `personality`. `motion.css` vem por último e concentra todas as animações |
| `server/` | Servidor local (`server.cjs`), recebimento (`ticket-service.cjs`), validação (`ticket-validation.cjs`), IA (`ai-provider.cjs`), Google (`google-storage.cjs`), gestão (`management.cjs`) e o [contrato da IA](server/contrato-ia.md) |
| `server/tests/` | Suítes de teste (`npm test`); `fixtures/v0.8.10-dados` guarda os dados da versão anterior à refatoração, usados no teste de equivalência |
| `integracoes/apps-script/` | Código do Apps Script (`*.gs`) e guias de instalação e publicação |
| `scripts/` | `build-pages.cjs` (monta o site do Pages sem arquivos privados), `build-apps-script.cjs` e `update-version.cjs` |
| `verificacoes/` | Um relatório por versão e auditorias de contraste e layout |
| [`sistema-de-cores.md`](sistema-de-cores.md), [`estrategia-retorno-cliente.md`](estrategia-retorno-cliente.md) | Papéis das cores e proposta de retorno ao solicitante |
| [`hospedagem.md`](hospedagem.md), `render.yaml` | Histórico: hospedagem Node no Render (0.8.15), substituída pelo GitHub Pages com Apps Script na 0.9.1 |

## Rodar localmente

Requisitos: Node.js 22 ou superior. Nesta pasta:

```bash
npm ci
npm start
```

- Chat: <http://127.0.0.1:4173/> · painel: <http://127.0.0.1:4173/admin.html>. O Live Server (porta 5500) mostra a tela, mas não tem a API.
- Configuração no `.env` (modelo em `.env.example`; nunca vai para o Git):
  - `GEMINI_API_KEY` e `GEMINI_MODEL`: IA. Sem a chave, o chat segue pelos botões.
  - `SMARTDESK_APPS_SCRIPT_URL` e `SMARTDESK_APPS_SCRIPT_TOKEN`: envio para a planilha.
- O painel local abre com 12 chamados fictícios de demonstração, separados dos chamados reais.

## Testes e conferências

```bash
npm test
```

Roda todas as suítes em `server/tests` (integração, Apps Script simulado, portal do Pages, gestão, autorização, datas, hospedagem, refatoração e experiência), com Google e IA simulados, sem criar chamados reais. Antes de cada commit:

```bash
npm run format:check
```

```bash
npm run version:check
```

## Publicar

- **Site (GitHub Pages):** todo push na `main` que muda `03-prototipo/` dispara o workflow `.github/workflows/pages.yml`, que roda `build-pages.cjs` e publica.
- **Apps Script:** `npm run build:apps-script`, depois copiar os `.gs` para a pasta do `clasp`, rodar `clasp push` e `clasp deploy` na **mesma implantação**, para o endereço `/exec` não mudar. Conferir em `/exec?api=health`.
- **Nova versão:** `npm run version:update -- X.Y.Z`, registrar no `CHANGELOG.md` e criar `verificacoes/verificacao-vX.Y.Z.md`.

## IA

| Rota | Para quê |
|---|---|
| `/api/analyze` | Sugere até 3 caminhos para um relato livre (a pessoa confirma) |
| `/api/extract` | Preenche o rascunho com o que a pessoa já disse (data, horário, opções, textos) |
| `/api/assist` | No máximo uma pergunta sobre o que falta, alerta de incoerência e até 3 dicas seguras |
| `/api/subject` | Assunto curto do chamado (fica só na planilha) |

As instruções ficam em `server/ai-provider.cjs`, e o que entra e sai do modelo, em [`server/contrato-ia.md`](server/contrato-ia.md). Nome, e-mail, textos livres dos campos e anexos não vão para a IA. A avaliação técnica está em [`../04-validacao/avaliacao-ia`](../04-validacao/avaliacao-ia/README.md).

## Limites

- **Site público:** até 5 chamados por janela e 60 por dia; IA com 40 pedidos por sessão e 600 por dia; até 3 anexos com 5 MB no total, com o conteúdo conferido pela extensão.
- **Servidor local:** até 5 anexos, 10 MB cada e 20 MB no total (PNG, JPG, WEBP, GIF, PDF, TXT, DOCX e XLSX).
- **Fora do MVP:** login, avisos por e-mail ao solicitante, antivírus nos anexos e integração com o sistema oficial de chamados da escola.

## Cópias de versões

Antes de cada versão, uma cópia do protótipo é salva em `versoes/`, só no computador do autor (a pasta está no `.gitignore`). O histórico completo está no Git.
