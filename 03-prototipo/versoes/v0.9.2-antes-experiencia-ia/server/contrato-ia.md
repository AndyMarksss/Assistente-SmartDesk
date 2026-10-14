# Contrato da IA — chat guiado (0.5.0)

- Fonte de opções: Matriz Mestre fornecida pelo usuário, leitura em 2026-10-01. 25 setores, quatro áreas, 57 caminhos e dez regras cadastradas. A tabela completa é preservada na exportação; o MVP aplica as ramificações, dados necessários e restrições de setor. Triagem automática e avaliação posterior continuam pendentes.
- `POST /api/next-prompt`: recebe setor e ID permitido; o servidor fornece à IA somente área e necessidade oficiais. Retorna uma frase curta para pedir a descrição, ou uma frase predefinida se a IA falhar.
- `POST /api/subject`: recebe setor, ID, respostas estruturadas e descrição. Valida a seleção e os campos. Encaminha à IA a descrição como dado, rótulos oficiais e respostas de opções fechadas. Retorna `subject`, `source`, `fallback` e o ID selecionado pelo usuário. Assunto validado até 80 caracteres; sem alteração da classificação e da descrição.
- Não envia nomes, e-mails de campos, textos complementares ou anexos à IA. Dados pessoais que o próprio usuário incluir na descrição serão transmitidos com ela; usar dados fictícios nos testes.
- Não há conversa livre, ferramentas, execução de comandos, envio de e-mails nem instruções do usuário ao modelo. A instrução do servidor trata a descrição como conteúdo a resumir. Saídas passam por validação e entram na interface com `textContent`. A qualidade semântica do assunto ainda exige revisão pelo usuário.
- `POST /api/drafts`: salva o chamado revisado e anexos localmente, sem consultar IA e sem envio externo. Seleção, campos e anexos são verificados no servidor; arquivos têm nomes internos independentes do nome enviado. O texto original da descrição fica em `chamado.json`.
- O adaptador antigo de classificação permanece como código histórico compatível, mas não é carregado nem utilizado pelo novo percurso da interface.
- Chave lida apenas pelo servidor, nunca entregue à página. Manter o modelo definido na configuração e o projeto gratuito sem faturamento. Nenhuma tentativa automática em modelos alternativos.

## Atualização 0.6.0

O assunto não aparece na conversa ou no cartão de revisão; é enviado ao receptor com o chamado. Descrição continua literal. Local retirado da base operacional por instrução direta. `POST /api/tickets` valida campos/anexos e envia pelo servidor ao Apps Script; token apenas no corpo desse pedido servidor-servidor, nunca na página. `google-storage.cjs` exige URL HTTPS de implantação /exec. Confirmação de envio somente com resposta válida contendo ID e número do chamado; indisponibilidade conserva os dados no cliente. Rascunho local continua como API histórica, não como ação do novo fluxo.
