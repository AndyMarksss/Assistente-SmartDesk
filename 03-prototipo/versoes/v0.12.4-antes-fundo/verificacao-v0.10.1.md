# Verificação 0.10.1

Data: 2026-10-14. Objetivo do usuário: o avaliador só abre o GitHub Pages; uso local com `npm start`.

## Site público (GitHub Pages + Apps Script real)

Conferido no navegador integrado, em https://andymarksss.github.io/Assistente-SmartDesk/, com dados fictícios e autorização do usuário para um chamado de teste:

- Abertura direta, sem senha: rodapé 0.10.0 (antes desta correção), "IA pronta para ajudar" e envio conectado ao Google.
- Antes da autorização do Apps Script: assunto e análise caíam na alternativa local (Gemini indisponível). Depois de o dono executar `diagnosticarIA` e autorizar (HTTP 200 do Gemini): "Descrever com minhas palavras" sugeriu Papel Atolado pela IA; a revisão deu três dicas seguras; um relato vago recebeu pergunta de complemento.
- Envio: o primeiro envio gravou o chamado #010 com 1 anexo TXT, mas o chat mostrou falha por falta de `status` no recibo. Após publicar a correção (versão 6), "Tentar enviar novamente" com o mesmo ID devolveu #010 sem duplicar e o comprovante apareceu.
- Painel em "Chamados desta avaliação": antes da versão 7 ficava em "Carregando chamados…"; depois mostrou o #010 com 1 anexo nas 7 colunas, e a mudança para "Em atendimento" foi salva no Google Planilhas.
- Saúde pública do Apps Script: `"version":"0.10.1"`.

## Local

`npm start` sobe em http://127.0.0.1:4173 com IA pronta e envio configurado (status conferido, nenhum envio feito). `npm test`: dez suítes aprovadas, com novas verificações do recibo do portal (`status: "enviado"` e mesmo ID) e das etapas na listagem pública. `version:check` e `format:check` aprovados.

## Limites

O chamado #010 é teste fictício e permanece na planilha (etapa Em atendimento). Celular real e movimento/transparência reduzidos do sistema não foram conferidos. Nada disto é validação com usuários.

Evidências: EVID-189 e EVID-190.
