# Fluxo proposto para o MVP

Origem: conversa Metodologias Ágeis - Andy, etapa 3. Este registro resume uma proposta de planejamento; ainda precisa ser conferido contra a matriz original e não comprova implementação.

## Caminho principal

1. Identificação e relato.
2. Análise da solicitação.
3. Classificação sugerida, com confirmação ou correção pelo usuário.
4. Perguntas complementares conforme a classificação.
5. Orientação e triagem.
6. Se resolveu: confirmação de resolução. Se não resolveu: resumo do chamado.
7. Avaliação da experiência.

## Entrada proposta

- Nome e e-mail institucional.
- Unidade organizacional: Colégio Anglo Morumbi ou Start Anglo Panamby.
- Setor conforme a lista da planilha.
- Descrição do problema em linguagem livre.
- Anexo: comportamento a confirmar para o MVP.
- Ação principal: Analisar solicitação.

## Base de classificação

A proposta anterior usa regras, palavras-chave e contexto. Confirmar os dados da planilha antes de implementar. Registrar neste arquivo os campos, botões, mensagens, transições e exceções de cada tela conforme forem definidos.

## Ficha para detalhar cada tela

- Tela:
- Objetivo:
- Campos e obrigatoriedade:
- Mensagens de validação:
- Ações disponíveis:
- Próxima tela:
- Regras condicionais:
- Caso sem correspondência ou com dúvida:
- Evidência prevista:

## Revisão de 2026-10-01 — Chat guiado

A interface passa a ser conversacional por instrução do usuário. O registro anterior permanece como histórico. Unidade e setor são escolhidos em botões; o relato libera a digitação. A classificação é confirmada ou corrigida dentro do chat. Local, nome e e-mail são coletados uma pergunta por vez, e o resumo é revisado na própria conversa. A versão 0.2.0 implementa esse percurso com base local parcial. IA real, matriz completa, triagem e avaliação estão pendentes.

## Revisão 2026-10-01 — Versão acadêmica 0.3.0

Convite pessoal para iniciar → nome/apelido → saudação personalizada → setor de exemplo ou não informar → relato digitado → Gemini, se configurado, ou análise local identificada → confirmação/correção → local → e-mail genérico para resumo → revisão. Empresas não são solicitadas. Nome não é solicitado novamente. Temas e botões de escolha não reiniciam a conversa; novo atendimento reinicia os dados temporários.

## Percurso implementado em 0.5.0 (2026-10-01)

Iniciar → nome → setor da lista → área → necessidade pelas opções da matriz → campos específicos → descrição literal → anexos opcionais → assunto curto da IA → revisão → salvar rascunho local / baixar resumo.

Este percurso substitui, no MVP atual, a classificação inicial a partir de texto livre. Fluxos anteriores permanecem como histórico de planejamento. Triagem para resolução e avaliação posterior ainda não estão implementadas.

## Fluxo atual 0.6.0

Início → nome → setor → área → opções/dados necessários (sem local) → descrição → anexos opcionais → revisão direta → Enviar → confirmação com número → Novo atendimento. Assunto gerado internamente. Voltar restaura uma etapa anterior, sem pergunta de confirmação. Recebimento depende de implantação Google.
