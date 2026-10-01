# SmartDesk — protótipo 0.5.0

Chat guiado para organizar uma solicitação com poucas digitações. As escolhas usam a **Matriz Mestre de Chamados**: 25 setores, quatro áreas e 57 classificações. O protótipo acadêmico não pede unidade ou empresa.

## Iniciar

É necessário Node.js com `process.loadEnvFile` (versão 22 ou superior). Dentro de `03-prototipo`, execute `node server/server.cjs` e abra http://127.0.0.1:4173/. A chave fica somente em `.env`, no servidor. Nunca compartilhe esse arquivo. O modelo configurado permanece `gemini-3.5-flash-lite`; não há troca automática de modelo nem configuração de faturamento.

## Percurso implementado

1. Iniciar atendimento e informar nome/apelido.
2. Selecionar um dos 25 setores cadastrados.
3. Escolher Audiovisual, Impressora, Google ou TI e navegar pelas opções da matriz.
4. Preencher apenas os dados necessários para a escolha. Cor de toner e perguntas de sim/não usam botões; datas e horários usam controles próprios.
5. Escrever a descrição e adicionar anexos, se desejar.
6. Revisar o assunto curto sugerido pelo Gemini e o resumo completo.
7. Salvar um rascunho local com os arquivos ou baixar um resumo de texto.

QuickBooks aparece somente para **Financeiro**; câmeras, somente para **Coordenação EI (Infantil)**. As permissões são verificadas também no servidor. O percurso foi reconstruído a partir da matriz fornecida, não de uma nova leitura dos prints dos formulários.

## Papel da IA

A IA adapta a pergunta sobre a descrição usando apenas os rótulos escolhidos. Depois sugere um assunto de até 80 caracteres usando a descrição, o setor e as escolhas padronizadas. Ela não altera a categoria nem reescreve a descrição. O texto digitado é tratado como dado do chamado; não há chat livre, ferramentas ou execução de comandos pelo modelo. Nome, e-mails dos campos, demais dados complementares e anexos não são encaminhados ao Gemini. Evite inserir dados pessoais na própria descrição durante as demonstrações.

Sem resposta válida da IA, um assunto padrão permite continuar. A interface informa quando a sugestão vem da IA ou da alternativa local.

## Anexos e armazenamento

Até cinco arquivos; 10 MB por arquivo e 20 MB somados. Formatos: PNG, JPG/JPEG, WEBP, GIF, PDF, TXT, DOCX e XLSX. Os anexos ficam em memória até escolher **Salvar rascunho com anexos**. Fechar ou recarregar o navegador antes de salvar perde o atendimento em andamento.

O servidor salva em `server/data/rascunhos/<identificador>/`: `chamado.json` e os arquivos de anexos. Essas pastas não são servidas pelo navegador e são ignoradas pelo Git. **Nenhum chamado é encaminhado ao suporte.** Baixar o resumo gera apenas texto, sem os arquivos anexos. Ainda não há login, gestão de chamados, antivírus para anexos ou envio para um sistema externo; use dados fictícios neste MVP local.

## Organização e verificação

`assets/js/knowledge-base.js` guarda os caminhos e os dados necessários; `flows.js`, as áreas e setores; `app.js`, o diálogo; `server/ticket-service.cjs`, a validação e os rascunhos; `server/ai-provider.cjs`, o Gemini. Font Awesome local e temas claro/escuro foram preservados.

Execute `node server/tests/integration.cjs` para verificar as regras com IA simulada, sem chamadas ao Google. A exportação textual da matriz e sua origem ficam em `02-matriz-e-regras/exportacoes` no projeto. A versão anterior está preservada em `versoes/v0.4.0-antes-formularios-guiados`, sem `.env`.
