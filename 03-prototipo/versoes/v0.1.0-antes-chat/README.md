# SmartDesk — Protótipo inicial

Versão 0.1.0. Primeira etapa prática do MVP: entrada, análise e classificação sugerida, com confirmação, correção e edição do relato.

## Como abrir

Abra index.html em um navegador atualizado. Não é necessário instalar dependências nem iniciar um servidor. HTML, CSS e JavaScript ficam separados e não dependem de serviços externos.

## O que está disponível

- Nome, e-mail, unidade, setor, descrição e seleção opcional de anexo.
- Verificação de campos obrigatórios e formato de e-mail.
- Transição para análise e classificação por regras e palavras-chave.
- Tratamento de múltiplas correspondências e relato sem correspondência.
- Confirmação ou correção manual da classificação.
- Interface responsiva e navegação por teclado.

## Base inicial e limites

A base de demonstração contém 14 necessidades de Audiovisual, Impressora, Google e TI. Ela usa exemplos citados no planejamento e não é uma importação da Matriz Mestre.

Os quatro setores sugeridos são exemplos; o usuário pode digitar outro setor. A lista oficial de 25 setores ainda deve ser incorporada.

QuickBooks e Câmeras usam, nesta demonstração, as restrições por setor mencionadas no planejamento: Financeiro e Coordenação EI. Isto não constitui controle de acesso de um sistema em produção.

Os casos ambíguos exigem escolha. Não há porcentagem de confiança nem serviço de IA externo. A pausa da tela de análise é apenas uma transição visual.

O formulário verifica o formato do e-mail, sem confirmar vínculo institucional. O anexo é selecionado localmente e não enviado ou lido. Os dados ficam apenas na sessão da página, sem persistência nem criação de chamados. Para testes iniciais, use dados fictícios.

## Próxima etapa

Conferir e incorporar a matriz original, as regras condicionais e a lista de setores. Depois implementar perguntas complementares, triagem, resolução, resumo e avaliação. Não registrar testes com usuários como concluídos antes da realização.

## Arquivos

- index.html: interface.
- assets/css/style.css: visual e responsividade.
- assets/js/knowledge-base.js: unidades, exemplos de setores e base inicial.
- assets/js/classifier.js: normalização, correspondência e filtros por setor.
- assets/js/flows.js: etapas implementadas e previstas.
- assets/js/app.js: campos, transições e confirmação.
- assets/img: reservado para imagens.
- src e versoes: pastas anteriores preservadas.

## Verificação manual

1. Enviar campos vazios e conferir mensagens e foco no primeiro campo inválido.
2. Usar dados fictícios e o relato “Minha impressora está prendendo as folhas”.
3. Conferir Impressora / Papel atolado e confirmar.
4. Voltar, usar “Preciso de internet e toner” e escolher entre as necessidades.
5. Usar um relato sem palavra-chave e conferir a escolha manual.
6. Corrigir a classificação e editar o relato sem perder o que foi preenchido.
7. Conferir a interface em tela estreita e com teclado.

Os testes de implementação não substituem a validação acadêmica com usuários.
