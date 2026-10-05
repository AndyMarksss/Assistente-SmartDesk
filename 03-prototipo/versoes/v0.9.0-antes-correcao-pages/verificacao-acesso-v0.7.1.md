# Verificação 0.7.1

Os prints enviados mostram acesso via Live Server 5500, onde /api não é executada. Confirmado pelo retorno HTML/vazio e pela URL visível. A implantação Google versão 2 foi publicada pelo usuário; consulta real ao servidor 4173 retornou um chamado #001. No navegador, selecionar Chamados do Google apresentou total 1, abertos 1 e cartão #001 em Novos chamados com um anexo.

Navegação real para http://127.0.0.1:5500/03-prototipo/admin.html encaminhou automaticamente para http://127.0.0.1:4173/admin.html, apresentando 12 simulações. Não houve nova criação de chamados Google nem alteração de etapa real. Regressão de leitura JSON protegida por verificação de Content-Type e tratamento de resposta vazia.

Ainda não foi confirmado envio novo com e-mail à coluna N nem mudança de etapa real. Próximo teste sugerido: chamado fictício pelo cliente na porta 4173, com e-mail de exemplo, e conferência do contato na planilha.
