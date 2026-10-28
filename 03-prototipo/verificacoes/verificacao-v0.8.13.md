# Verificação 0.8.13

Rodapé centralizado com margens automáticas e espaço simétrico para rolagem. Luz segue computador → robô → som/imagem. Personagem SVG próprio nas mensagens e cabeçalho; moldura e bolhas refinadas, tamanho móvel de avatar 32px.

Sete suítes passaram, incluindo 211 verificações de integração. Rodapé medido: diferença de zero pixels entre centro do texto/caixa e centro da área de resposta, em desktop e 390×844. SVG do personagem carregado nos avatares e cabeçalho nos dois temas, sem overflow lateral. Trajeto do sinal corrigido para coincidir com as duas ramificações desenhadas, com pathLength=100, dasharray 3/97 e offset de animação -100. Movimento reduzido e dois ciclos decorativos preservados. Capturas estáticas não comprovam o movimento; trajeto e propriedades foram conferidos no DOM/CSS. Fluxos de dados não alterados; sem envio real ao Google.
