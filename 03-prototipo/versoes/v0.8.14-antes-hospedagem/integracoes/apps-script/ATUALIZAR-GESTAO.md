# Ativar gestão e e-mail — versão 0.7

O painel local está disponível em http://127.0.0.1:4173/admin.html. A demonstração fica separada do Google.

1. No projeto Apps Script SmartDesk — Recebimento, substitua o conteúdo de Código.gs pelo Code.gs desta pasta. Preserve Schema.gs.
2. Adicione Gestao.gs com o conteúdo do arquivo homônimo. Ele passa a conter a única função doPost; Código.gs contém receberChamado_. Não publique só um dos arquivos.
3. Salve e atualize a implantação existente: Implantar → Gerenciar implantações → Editar → Nova versão → Implantar. Mantenha a mesma URL e token no .env.
4. No painel, selecione Chamados do Google e clique Atualizar. Confira #001 antes de testar mudança de etapa.

Migração: as 13 colunas originais e linhas anteriores são preservadas. O e-mail fica na coluna N (14); se N já estiver ocupada com outro cabeçalho, a migração para e pede revisão. Chamados antigos permanecem sem e-mail. Recebido aparece como Novos chamados no kanban. Recebendo é envio incompleto e não permite mudança de etapa. As mudanças gravam a coluna Status com bloqueio de concorrência e verificação da etapa anterior.

O envio de e-mails ainda não foi implementado. O e-mail é coletado para contato futuro, nunca enviado ao Gemini. Enquanto a implantação antiga estiver ativa, ela não salva a nova coluna de e-mail nem atende a gestão.

O servidor atende apenas localhost. Antes de disponibilizar a outras pessoas, implementar autenticação de administradores, autorização por chamado e implantação segura.

Referências: [Content Service](https://developers.google.com/apps-script/guides/content) e [Lock Service](https://developers.google.com/apps-script/reference/lock/).
