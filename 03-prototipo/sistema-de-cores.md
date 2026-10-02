# Sistema de cores — SmartDesk 0.8.6

Direção explicitamente escolhida: tecnológico e preciso, grafite, neutros frios e violeta.

## Princípios aplicados

- Matiz: família fria azul/violeta, sem espalhar violeta por toda a superfície. Neutros pouco saturados sustentam a leitura; maior saturação indica ação e identidade.
- Luminosidade: planos diferentes para cenário, conversa, mensagens e resposta. Profundidade pela cor, sem sombras fortes.
- Harmonia: azul acinzentado e violeta próximos no círculo cromático; hierarquia garantida por luminosidade, contorno e posição, além do matiz. Não atribuir emoções universais às cores.
- Proporção: maior área em neutros; violeta concentrado em ação principal, foco e etapa atual. Isso é decisão de composição, não fórmula universal de porcentagens.
- Vidro: cabeçalho e dock translúcidos, texto e mensagens sobre cores sólidas para contraste previsível.
- Significado: histórico do usuário azul acinzentado, bot neutro, pergunta atual com detalhe violeta; ação secundária neutra, primária violeta. Não há legenda que o usuário precise decorar.
- Acessibilidade: ✓, números, rótulos e mensagens de erro complementam a cor. Foco visível e bordas dos campos.

## Papéis e tokens

| Papel | Claro | Escuro | Uso |
|---|---|---|---|
| Cenário | #E4E9F0 | #0E131B | Plano recuado |
| Conversa | #F2F5F9 | #171E28 | Canvas de leitura |
| Bot | #FFFFFF | #263140 | Conteúdo do assistente |
| Usuário | #E3E8F8 | #31445F | Respostas já dadas |
| Campo | #F9FBFF | #101722 | Lugar para digitar |
| Violeta | #6240CA | #B9A6FF | Ação principal |
| Texto | #202B3B | #EDF2FA | Leitura |
| Texto secundário | #536176 | #B4C0D1 | Contexto e exemplos |

## Verificação de contraste

22 pares calculados pela luminância relativa WCAG: textos ≥4,5:1 e borda/foco ≥3:1. Bot claro 14,28:1, bot escuro 11,71:1; botão principal claro 6,76:1 e escuro 7,98:1. Resultado detalhado em contraste-v0.8.6.json. Isto verifica esses pares, não equivale a auditoria completa de conformidade WCAG. Estados de hover, componentes externos e dispositivo real têm limites de verificação distintos.

## Referências consultadas

- [Adobe: harmonias e círculo cromático](https://www.adobe.com/uk/creativecloud/design/discover/color-wheel.html)
- [Material: papéis de cor e superfícies tonais](https://github.com/material-components/material-components-android/blob/master/docs/theming/Color.md)
- [W3C: contraste mínimo de texto](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum)
- [W3C: uso da cor acompanhado de outros sinais](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html)
- [W3C: contraste de componentes](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html)

## Presença e movimento 0.8.7
A paleta por função permanece. A personalidade vem de ilustração própria, órbitas, superfícies translúcidas e avatares. Movimento de entrada é breve (0,36–0,38s); flutuação de 5s e rotação de 30s são opcionais, com botão de pausa persistente. Movimento reduzido tem prioridade. Decorações não interceptam toque nem entram na leitura assistiva.

## 0.8.8 — Planos e gestão
Cenário grafite com luz violeta e azul; vidro de 64–75% de superfície sobre cenário visível. Mensagens ficam sólidas para leitura. Cor de etapa acompanha rótulo: azul em atendimento, âmbar aguardando, verde discreto finalizado. Animações do cenário, entradas e gráfico respeitam movimento reduzido; pausa removida por instrução direta.

## 0.8.9 — Criatividade com hierarquia
Abertura redesenhada como uma central de apoio: painel com título, texto e ilustração do assistente conectado a computador, conexão, impressão e som. Cena com formas geométricas, vidro nos dispositivos e sinais curtos animados; decoração sem cliques ou anúncios assistivos. Fundo com textura de pontos discreta substitui órbitas grandes. Resumo lateral usa linha de acompanhamento; ajuda azul, ação violeta e mensagens neutras. Composição centralizada no desktop e compacta no mobile, incluindo 360×740. Painel recebe o mesmo vocabulário visual, novos planos de cor e indicadores com menos decoração.

152 verificações de integração passaram. 34 pares de tokens de cor medidos nos dois temas, sem falhas nos limites usados (4,5:1 texto normal; 3:1 título grande e borda de opção). Essa medição não é auditoria WCAG completa e não avalia todo pixel das transparências. Chat conferido em 1366×900, 390×844 e 360×740: sem overflow lateral; na tela menor o título e ambos os botões de 44px permanecem visíveis. Início, nome fictício, e-mail, setor e quatro áreas conferidos; nenhum chamado real enviado. Cena usa pointer-events:none e aria-hidden; connection-flow calculado no navegador. Gestão conferida nos dois temas e mobile sem overflow do documento; quadro mantém rolagem própria. Movimento reduzido preservado em CSS, sem simulação do sistema. Teclado físico/virtual real não retestado.
## Fundamentos aplicados
Paleta restrita de azul/índigo/violeta sobre neutros, inspirada em harmonia de cores próximas; saturação e luminosidade separam ações, orientação e superfícies. Esses são critérios de projeto, não garantia de preferência ou facilidade para todos os usuários.
- [Adobe: cor no design de interfaces móveis](https://blog.adobe.com/en/publish/2016/10/19/xd-essentials-the-power-of-color-in-mobile-app-design)
- [Material: papéis de cor](https://github.com/material-components/material-components-android/blob/master/docs/theming/Color.md)
- [W3C: contraste](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
- [W3C: informação além da cor](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html)

## 0.8.10 — Separação de planos por luminosidade
Corrigido título local: separadores > do caminho canônico viram travessões no assunto interno, mantendo categoria e descrição originais. O cliente normaliza também a resposta recebida de versões anteriores do servidor. Falha de envio anuncia explicitamente que o recebimento não foi confirmado, preserva dados/ID e oferece Tentar enviar novamente. Nenhuma confirmação é mostrada antes de uma resposta de sucesso. Abertura permanece no topo, sem rolagem automática ocultando o título. Planos definidos por luminosidade: cenário recuado azul cinza/grafite, navegação intermediária, painel e mensagens elevados, pergunta atual em azul e resposta em lavanda/violeta. Mesmo vocabulário no painel. Vidro localizado na ilustração, sem sombras novas.

211 verificações de integração passaram, incluindo validade do assunto local nos 57 caminhos e ida de Wi-Fi até o adaptador fictício. 34 pares de cores medidos com limites 4,5:1 para texto e 3:1 para borda de opção, todos aprovados; não representa auditoria WCAG completa. Conferência visual nos dois temas em 1280×720 e chat escuro em 390×844 sem overflow lateral. Falha 502, aviso de envio imediato, nova tentativa e confirmação #TESTE-LOCAL conferidos pelo navegador em servidor isolado 4174, sem chamado real no Google. Painel escuro conferido com simulações. Servidor local 4173 reiniciado para carregar a correção. Teclado real e contraste de todos os pixels transparentes não retestados.
