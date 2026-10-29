# Retorno e acompanhamento — proposta para decisão futura

> **Situação na 0.13.0:** a 0.11.0 implementou um acompanhamento simples: com o número e o e-mail usados no envio, a pessoa vê só a etapa do chamado. Desde a 0.13.0, ela também recebe o ticket por e-mail na abertura e um aviso a cada mudança de etapa, só com número, setor, pedido e etapa (`integracoes/apps-script/Avisos.gs`). Ainda não há troca de mensagens com a equipe. O texto abaixo é de antes disso, e o portal com link temporário continua sendo a proposta para depois do MVP.

Implementado agora: coleta e validação do e-mail institucional depois do nome; revisão do e-mail junto com os dados; encaminhamento ao receptor; coluna N no Apps Script atualizado. O MVP acadêmico valida o formato, sem restringir a um domínio corporativo. Não envia mensagens automáticas.

Recomendação para a próxima etapa: portal do solicitante com acesso por link temporário enviado ao e-mail verificado. Cada chamado terá linha do tempo com mensagens públicas; notas internas visíveis só para a equipe. O e-mail será uma notificação com número, etapa e link para acompanhar/responder pelo portal.

Comparação: responder diretamente por e-mail é familiar, mas exige tratar caixa de entrada, remetente, associação ao chamado, anexos e respostas automáticas. Responder no portal concentra o histórico e facilita autorização, mas requer implementar acesso e notificações. Para este protótipo, o portal oferece uma evolução mais controlável.

Regras propostas: não liberar consulta apenas por número/e-mail; tokens aleatórios, armazenados como hash, com expiração e uso único para criar sessão; limitar tentativas; validar posse do e-mail antes de exibir conteúdo; bloquear acesso a outros chamados; anexos continuam privados. Separar mensagens públicas de notas internas.

Etapas futuras: validar a preferência com usuários; definir prazo de link e domínio institucional; implementar autenticação/autorizações; notificações por Apps Script com cotas verificadas; portal com histórico/resposta; testes com dados fictícios; depois validar com participantes. Nenhuma preferência de usuário real ou resultado foi preenchido.
