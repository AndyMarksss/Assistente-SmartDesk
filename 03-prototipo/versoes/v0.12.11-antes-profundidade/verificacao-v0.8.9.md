# Verificação 0.8.9

Abertura redesenhada como uma central de apoio: painel com título, texto e ilustração do assistente conectado a computador, conexão, impressão e som. Cena com formas geométricas, vidro nos dispositivos e sinais curtos animados; decoração sem cliques ou anúncios assistivos. Fundo com textura de pontos discreta substitui órbitas grandes. Resumo lateral usa linha de acompanhamento; ajuda azul, ação violeta e mensagens neutras. Composição centralizada no desktop e compacta no mobile, incluindo 360×740. Painel recebe o mesmo vocabulário visual, novos planos de cor e indicadores com menos decoração.

152 verificações de integração passaram. 34 pares de tokens de cor medidos nos dois temas, sem falhas nos limites usados (4,5:1 texto normal; 3:1 título grande e borda de opção). Essa medição não é auditoria WCAG completa e não avalia todo pixel das transparências. Chat conferido em 1366×900, 390×844 e 360×740: sem overflow lateral; na tela menor o título e ambos os botões de 44px permanecem visíveis. Início, nome fictício, e-mail, setor e quatro áreas conferidos; nenhum chamado real enviado. Cena usa pointer-events:none e aria-hidden; connection-flow calculado no navegador. Gestão conferida nos dois temas e mobile sem overflow do documento; quadro mantém rolagem própria. Movimento reduzido preservado em CSS, sem simulação do sistema. Teclado físico/virtual real não retestado.
## Fundamentos aplicados
Paleta restrita de azul/índigo/violeta sobre neutros, inspirada em harmonia de cores próximas; saturação e luminosidade separam ações, orientação e superfícies. Esses são critérios de projeto, não garantia de preferência ou facilidade para todos os usuários.
- [Adobe: cor no design de interfaces móveis](https://blog.adobe.com/en/publish/2016/10/19/xd-essentials-the-power-of-color-in-mobile-app-design)
- [Material: papéis de cor](https://github.com/material-components/material-components-android/blob/master/docs/theming/Color.md)
- [W3C: contraste](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
- [W3C: informação além da cor](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html)
