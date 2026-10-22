# Atualizar o Apps Script — SmartDesk 0.10.0

> **Aplicado em 2026-10-14** pelo clasp com a conta pessoal: Portal, PortalShared e Diagnostico atualizados no projeto existente e publicados como **versão 5** da mesma implantação (/exec inalterado). A saúde pública responde `"version":"0.10.0"`. Os passos abaixo ficam como referência para reaplicar manualmente.

A versão 0.10.0 traz duas rotas novas de IA (sugestão de caminho e revisão do relato) e limites de uso para a avaliação pública. O site no Pages só usa essas funções depois que o Apps Script for atualizado. Sem a atualização, o chat continua funcionando: o atalho de relato usa as palavras-chave da matriz e a etapa de revisão da IA é pulada.

## Ordem recomendada

1. Atualize o Apps Script (passos abaixo).
2. Depois, publique o frontend no Pages (push na branch main).

## O que trocar no editor do Apps Script

Substitua o conteúdo inteiro de **dois** arquivos pelo conteúdo destes arquivos do projeto:

- `integracoes/apps-script/Portal.gs`
- `integracoes/apps-script/PortalShared.gs`

Os demais (`Code.gs`, `Gestao.gs`, `Pages.gs`, `Schema.gs`, `Diagnostico.gs`, `appsscript.json`) não mudaram. Não execute configurador nem diagnóstico. Preserve todas as propriedades do script (`SMARTDESK_SHEET_ID`, `SMARTDESK_FOLDER_ID`, `SMARTDESK_TOKEN`, `GEMINI_API_KEY`, `GEMINI_MODEL`, `SMARTDESK_PAGES_ORIGIN`). Nenhuma propriedade nova é necessária.

Depois: **Implantar → Gerenciar implantações → editar a implantação existente → Nova versão** → descrição "SmartDesk 0.10.0 — IA e limites" → Implantar. Executar como você, acesso Qualquer pessoa, mantendo a mesma URL /exec.

## Limites da avaliação pública

| Limite | Valor |
| --- | --- |
| Chamados novos por sessão | 5 (repetir o mesmo envio não conta) |
| Chamadas de IA por sessão | 40 |
| Chamados novos por dia | 60 |
| Chamadas de IA por dia | 600 |
| Anexos por chamado | 3, até 5 MB somados |
| Novas sessões por minuto | 100 |

Os contadores diários ficam em propriedades `QUOTA_<data>_<tipo>`, criadas e limpas automaticamente pelo próprio script. Os anexos também precisam ter conteúdo coerente com a extensão (uma imagem .png precisa começar como PNG, por exemplo). Para mudar um limite, edite `PORTAL_LIMITS` no topo de `Portal.gs` e publique nova versão.

## Como conferir

Abra https://andymarksss.github.io/Assistente-SmartDesk/ em janela privada, depois de publicar o Pages 0.10.0:

1. O rodapé mostra **v0.10.0**.
2. Na etapa de áreas, toque em **Descrever com minhas palavras** e escreva um problema fictício (ex.: "a impressora está prendendo as folhas"). Devem aparecer caminhos sugeridos com o selo **IA**.
3. Siga até a descrição com um relato vago (ex.: "o computador está ruim"). A IA deve fazer uma pergunta de complemento, com a opção **Pular esta pergunta**.
4. Em um defeito (papel atolado, lentidão, Wi-Fi), devem aparecer até três dicas e as opções **Continuar com o chamado** e **Resolveu! Não preciso mais**.
5. Envie um chamado fictício com um anexo TXT pequeno e confira número na planilha e arquivo privado no Drive.

Nunca use dados pessoais reais nos testes públicos.
