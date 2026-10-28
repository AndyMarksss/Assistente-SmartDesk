# Verificação 0.12.9

Data: 2026-10-20. `npm test` com dez suítes aprovadas, `version:check` e `format:check` aprovados.

## Tela do usuário (1864×958), temas claro e escuro

- Ícones do fundo: 8 visíveis, nenhum encostando em robozinho das mensagens (na abertura e na conversa); lateral livre medida de 226 px de cada lado.
- Barra lateral sem rolagem, com o cartão "Seu chamado", a dica e "O que a TI atende".
- Cartão "Seu chamado": 0/4 "Vamos começar" na abertura; 4/4 "Quase pronto" depois de escolher Impressora › Papel Atolado.

## Barra lateral em 19 tamanhos

Sem rolagem para os lados nem para baixo de 2560×1440 a 1024×650; até 600 px de altura a barra dá lugar ao layout do celular. Com nome, e-mail, setor e necessidade longos na tela do usuário, "O que a TI atende" sai e a barra continua sem rolar.

## Varredura de layout

Abertura, áreas e data nos 12 tamanhos e painel de gestão (quadro, detalhe e busca), temas escuro e claro: 128 medições, sem rolagem lateral (da página ou dentro de elementos), rolagem da barra, elementos fora da tela, texto cortado, botões cobertos ou sobrepostos.

Evidências EVID-243 a EVID-249.
