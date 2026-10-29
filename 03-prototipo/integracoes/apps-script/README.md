# Apps Script do SmartDesk

No GitHub Pages, o Apps Script faz as integrações: IA (Gemini), recebimento dos chamados na planilha *SmartDesk — Chamados*, anexos no Drive, acompanhamento, painel de gestão, métricas das sessões e ticket por e-mail. A chave do Gemini e o token ficam só nas propriedades do script, nunca no repositório.

| Arquivo | O que faz |
|---|---|
| `Code.gs` | Recebe o chamado, numera (#001, #002…) e grava na planilha; `doGet` responde a `/exec?api=health` com a versão. |
| `Gestao.gs` | `doPost`, a entrada das operações; painel de gestão (lista e etapas) e métricas da aba Sessões. |
| `Avisos.gs` | Ticket por e-mail na abertura e um aviso a cada mudança de etapa (0.13.0): sem texto livre, sem repetir a última etapa avisada, no máximo 10 avisos do chamado em 24 horas e nunca para domínios de teste. O resultado fica na aba *Avisos*, sem o endereço. `autorizarAvisosPorEmail` autoriza o envio. |
| `Pages.gs` | Ponte com o GitHub Pages: responde só à origem do site publicado. |
| `Portal.gs` | Operações do chat publicado: sessão técnica sem senha, IA com cota por sessão e por dia, anexos, acompanhamento e limites da avaliação pública. |
| `PortalShared.gs` | **Gerado** por `npm run build:apps-script`: matriz, regras, textos e instruções da IA copiados do protótipo. Não editar à mão. |
| `Schema.gs` | Setores, áreas e caminhos usados para validar os pedidos. |
| `Validacao.gs` | `prepararPlanilhaDeValidacao`: cria as abas de validação das sessões com usuários. |
| `Diagnostico.gs` | Funções para rodar no editor: `diagnosticarIA`, `removerChamadoDeTeste` e `removerChamadosDosParticipantes`. |
| `appsscript.json` | Manifesto de referência: fuso e escopos usados (desde a 0.13.0, também o envio de e-mail). O do projeto publicado guarda o acesso do app da Web e detecta os escopos sozinho. |
| `public-config.json` | Endereço `/exec` que o site do Pages usa. |

## Publicar uma versão nova

1. Em `03-prototipo`, rode `npm run build:apps-script` (refaz o `PortalShared.gs`).
2. Copie os `.gs` por cima dos arquivos da pasta clonada com o `clasp`. Não troque o `appsscript.json` do projeto, que guarda o acesso do app da Web. Ele não lista escopos: o Apps Script detecta sozinho o que o código usa (na 0.13.0, o envio de e-mail).
3. Rode `clasp push`.
4. Se a versão pede uma permissão nova (a 0.13.0 pede o envio de e-mail), abra o editor, rode a função que a usa (`autorizarAvisosPorEmail`) e aceite a permissão. Faça isso **antes** de implantar: sem a autorização, o app da Web deixa de responder.
5. Rode `clasp deploy --deploymentId <implantação existente>`. Use sempre a mesma implantação, para o endereço `/exec` não mudar.
6. Confira `/exec?api=health`: a resposta traz a versão nova.

## Guias antigos

Registram como cada versão foi instalada ou atualizada à mão, antes do `clasp`. Ficam como histórico; os passos de hoje são os de cima.

| Guia | Versão |
|---|---|
| [`INSTALAR-GOOGLE.md`](INSTALAR-GOOGLE.md) | 0.6.0: primeira instalação do receptor, da planilha e da pasta de anexos |
| [`DIAGNOSTICO-GOOGLE.md`](DIAGNOSTICO-GOOGLE.md) | 01/10/2026: primeiro envio real |
| [`ATUALIZAR-GESTAO.md`](ATUALIZAR-GESTAO.md) | 0.7: gestão e e-mail |
| [`ATUALIZAR-v0.8.md`](ATUALIZAR-v0.8.md) | 0.8 |
| [`PUBLICAR-PORTAL-v0.9.0.md`](PUBLICAR-PORTAL-v0.9.0.md) | 0.9.0: portal no Apps Script, substituído na 0.9.1 |
| [`APLICAR-CORRECAO-PAGES-v0.9.1.md`](APLICAR-CORRECAO-PAGES-v0.9.1.md) | 0.9.1: interface de volta ao Pages |
| [`AVALIAR-SEM-SENHA-v0.9.2.md`](AVALIAR-SEM-SENHA-v0.9.2.md) | 0.9.2: avaliação sem senha |
| [`ATUALIZAR-v0.10.0.md`](ATUALIZAR-v0.10.0.md) | 0.10.0: rotas de IA e limites da avaliação pública |
