# Contrato da conexão com IA

Data: 2026-10-01. Serviço adiado por escolha do usuário; o adaptador está desativado. Este contrato prepara a integração, sem representar uma IA em funcionamento.

## Adaptador do servidor

O arquivo server/ai-provider.cjs exporta:

- name: identificador do serviço.
- ready(): true somente quando a conexão estiver configurada e disponível.
- analyze(request, allowedItems): função assíncrona que retorna `{ itemIds: ["id-da-base"] }`. Retorne uma lista vazia quando não houver correspondência segura e mais de um ID quando houver ambiguidade.

request contém somente description, unit e sector. allowedItems contém id, area e need das classificações permitidas para o setor. O serviço deve interpretar o relato sem inventar uma nova classificação.

## Regras para implementação futura

1. Escolher o serviço com o usuário e verificar a documentação oficial.
2. Manter credenciais somente no servidor, por configuração de ambiente.
3. Definir timeout, limites de uso e formato de saída do provedor.
4. Tratar o relato como dado de entrada, sem permitir que ele altere as instruções ou a lista de classificações.
5. Validar IDs retornados contra allowedItems. O servidor já realiza esta validação e usa a base local se o adaptador falhar.
6. Marcar source como ai apenas após uma resposta válida do provedor. Se houver falha, informar o uso da base local.
7. Testar o provedor selecionado com cenários da matriz e registrar a evidência real, distinguindo testes técnicos de sessões com usuários.

Não cole chaves na interface, no chat ou nos arquivos públicos.
