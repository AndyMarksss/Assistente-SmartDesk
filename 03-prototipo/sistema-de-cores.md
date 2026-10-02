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
