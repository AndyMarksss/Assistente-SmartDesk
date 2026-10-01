# SmartDesk — Chat guiado

Versão 0.2.0, 2026-10-01. A experiência foi refeita conforme o pedido do usuário: conversa com escolhas padronizadas e digitação liberada apenas quando uma resposta livre é necessária.

## Como abrir

Para a conversa local, abra index.html no navegador. Para usar o ponto de conexão preparado para IA, inicie o servidor local com Node.js: `node server/server.cjs`, executado dentro de 03-prototipo. Acesse http://127.0.0.1:4173.

## Percurso implementado

1. O assistente oferece as unidades por botões.
2. Oferece setores de exemplo; “Outro setor” libera a digitação do nome.
3. Libera o campo para o relato do problema.
4. Analisa o relato e oferece confirmação, correção ou explicação adicional.
5. Se houver ambiguidade ou ausência de correspondência, oferece escolhas sem decidir silenciosamente.
6. Coleta o tipo de local por botões e a identificação do local por texto.
7. Pede nome e e-mail, uma pergunta por vez.
8. Apresenta o resumo, com download local, edição do relato e inclusão de detalhes.

A digitação permanece bloqueada durante escolhas e análise. Enter envia; Shift + Enter insere nova linha. Há navegação por teclado, indicador de etapa, contexto lateral e layout adaptado para celular.

## Situação da IA

O usuário escolheu decidir o serviço depois. A IA real ainda não está conectada. O indicador “Base local · demonstração” e a nota abaixo da conversa deixam isso explícito.

- assets/js/assistant-engine.js chama o servidor ou usa as regras locais quando o servidor não está disponível.
- server/server.cjs oferece POST /api/analyze e GET /api/status.
- server/ai-provider.cjs é o ponto de integração, desativado até a escolha do serviço.
- O adaptador futuro recebe relato, unidade, setor e as classificações permitidas. Deve devolver IDs dessas classificações, conforme contrato-ia.md.
- O servidor valida a saída antes de marcar a análise como proveniente de IA.
- Nome, e-mail e anexos não fazem parte da requisição de análise.

Nenhuma chamada a provedor externo foi feita nesta etapa. Não há chave de API nos arquivos públicos.

## Limites atuais

A base inicial mantém as 14 necessidades da versão anterior, com quatro exemplos de setores e alternativa para digitar outro. Não é a matriz oficial completa. QuickBooks e Câmeras seguem as restrições por setor citadas no planejamento. A triagem e a avaliação acadêmica ainda não foram implementadas. O resumo é local: nenhum chamado é enviado e os dados não são persistidos ao recarregar. Use dados fictícios nas verificações.

## Histórico e arquivos

Os arquivos substituídos foram copiados para versoes/v0.1.0-antes-chat, preservando a primeira interface. O código atual usa index.html, assets/css/style.css, assets/js/app.js, flows.js, knowledge-base.js, classifier.js e assistant-engine.js. A pasta src original foi preservada.

As capturas históricas EVID-004 e EVID-005 continuam válidas como registro da versão anterior. Consulte o manifesto para as evidências da versão atual.
