# Retorno e acompanhamento — proposta para decisão futura

Implementado agora: coleta e validação do e-mail institucional depois do nome; revisão do e-mail junto com os dados; encaminhamento ao receptor; coluna N no Apps Script atualizado. O MVP acadêmico valida o formato, sem restringir a um domínio corporativo. Não envia mensagens automáticas.

Recomendação para a próxima etapa: portal do solicitante com acesso por link temporário enviado ao e-mail verificado. Cada chamado terá linha do tempo com mensagens públicas; notas internas visíveis só para a equipe. O e-mail será uma notificação com número, etapa e link para acompanhar/responder pelo portal.

Comparação: responder diretamente por e-mail é familiar, mas exige tratar caixa de entrada, remetente, associação ao chamado, anexos e respostas automáticas. Responder no portal concentra o histórico e facilita autorização, mas requer implementar acesso e notificações. Para este protótipo, o portal oferece uma evolução mais controlável.

Regras propostas: não liberar consulta apenas por número/e-mail; tokens aleatórios, armazenados como hash, com expiração e uso único para criar sessão; limitar tentativas; validar posse do e-mail antes de exibir conteúdo; bloquear acesso a outros chamados; anexos continuam privados. Separar mensagens públicas de notas internas.

Etapas futuras: validar a preferência com usuários; definir prazo de link e domínio institucional; implementar autenticação/autorizações; notificações por Apps Script com cotas verificadas; portal com histórico/resposta; testes com dados fictícios; depois validar com participantes. Nenhuma preferência de usuário real ou resultado foi preenchido.
