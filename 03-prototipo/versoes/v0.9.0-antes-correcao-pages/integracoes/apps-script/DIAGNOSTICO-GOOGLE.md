# Diagnóstico do recebimento real

Em 2026-10-01, URL e token foram carregados pelo servidor sem exibir segredos. GET confirmou SmartDesk 0.6.0. POST do chamado fictício retornou erro interno do Apps Script, diferente de Não autorizado. Não houve confirmação de número. Isso não comprova ausência de escrita parcial: confira linhas com status Recebendo e não as apague.

O registro interno não está acessível pelo conector/navegador desta sessão. O novo código registra o motivo técnico sem imprimir o pedido, token ou anexos.

1. No projeto SmartDesk — Recebimento do Google, atualize Código.gs com o conteúdo local de Code.gs desta pasta.
2. Adicione um arquivo de script Diagnostico e cole Diagnostico.gs.
3. Execute **diagnosticarSmartDesk** e envie o registro de execução. Não mostre Propriedades do script ou .env.
4. Se funcionar, atualize a implantação existente: Implantar → Gerenciar implantações → editar → Nova versão → Implantar. Isso mantém a URL. Depois o servidor pode repetir o mesmo chamado de teste para confirmar o recebimento.

O diagnóstico usa o mesmo ID fictício da tentativa local e um TXT sem dados reais. Não cria outro chamado se aquela tentativa já foi concluída. Não altera a matriz nem os dados de outros chamados. A causa exata depende do registro; não trocar chave/token ou reconstruir planilhas sem evidência.
