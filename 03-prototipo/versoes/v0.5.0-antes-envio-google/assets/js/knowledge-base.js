"use strict";
window.SmartDesk=window.SmartDesk||{};
window.SmartDesk.knowledgeBase={
  "version": "0.5.0",
  "source": "SmartDesk - Matriz Mestre de Chamados, leitura 2026-10-01. 57 classificações, 25 setores, 10 regras.",
  "sourceUrl": "https://docs.google.com/spreadsheets/d/1k8lGahTOPdZwf0XIOKoD0R3JoFY2HWU-DTC9oz1B-hc/edit",
  "sectors": [
    "Cobrança",
    "Compras",
    "Coordenação",
    "Coordenação EI (Infantil)",
    "Orientação EI (Infantil)",
    "Coordenação EFAI (Fundamental I)",
    "Orientação EFAI (Fundamental I)",
    "Coordenação EFAF (Fundamental II)",
    "Orientação EFAF (Fundamental II)",
    "Coordenação EM (Médio)",
    "Orientação EM (Médio)",
    "Direção",
    "Enfermaria",
    "Esporte",
    "Financeiro",
    "Inspetoria",
    "Limpeza",
    "Marketing",
    "Portaria",
    "Recursos Humanos",
    "Sala Maker",
    "Secretaria",
    "Setor de Provas",
    "TE",
    "TI"
  ],
  "items": [
    {
      "id": "AV-001",
      "area": "Audiovisual",
      "need": "Caixa de Som",
      "path": [
        "Caixa de Som"
      ],
      "keywords": [
        "caixa de som",
        "som",
        "áudio",
        "alto-falante",
        "preciso de som"
      ],
      "fields": [
        {
          "id": "data",
          "label": "Data do atendimento",
          "type": "date",
          "required": true
        },
        {
          "id": "horario",
          "label": "Horário do atendimento",
          "type": "time",
          "required": true
        },
        {
          "id": "local",
          "label": "Local do atendimento",
          "type": "text",
          "required": true
        },
        {
          "id": "evento",
          "label": "É para um evento?",
          "type": "choice",
          "options": [
            "Sim",
            "Não"
          ],
          "required": true
        },
        {
          "id": "roteiro",
          "label": "Link do roteiro do evento",
          "type": "url",
          "required": true,
          "when": {
            "field": "evento",
            "equals": "Sim"
          }
        }
      ],
      "source": {
        "question": "Você precisa somente de caixa de som ou também de microfone/projetor?",
        "complementary": "Qual a data? Qual o horário? Qual o local? É para um evento?",
        "data": "Data, horário, local, setor, descrição",
        "rule": "Se for evento, solicitar link do roteiro"
      }
    },
    {
      "id": "AV-002",
      "area": "Audiovisual",
      "need": "Caixa de Som / Microfone",
      "path": [
        "Caixa de Som / Microfone"
      ],
      "keywords": [
        "caixa de som",
        "microfone",
        "mic",
        "áudio",
        "apresentação",
        "palestra"
      ],
      "fields": [
        {
          "id": "data",
          "label": "Data do atendimento",
          "type": "date",
          "required": true
        },
        {
          "id": "horario",
          "label": "Horário do atendimento",
          "type": "time",
          "required": true
        },
        {
          "id": "local",
          "label": "Local do atendimento",
          "type": "text",
          "required": true
        },
        {
          "id": "evento",
          "label": "É para um evento?",
          "type": "choice",
          "options": [
            "Sim",
            "Não"
          ],
          "required": true
        },
        {
          "id": "roteiro",
          "label": "Link do roteiro do evento",
          "type": "url",
          "required": true,
          "when": {
            "field": "evento",
            "equals": "Sim"
          }
        }
      ],
      "source": {
        "question": "Além da caixa de som e do microfone, você também precisa de projetor?",
        "complementary": "Qual a data? Qual o horário? Qual o local? É para um evento?",
        "data": "Data, horário, local, setor, descrição",
        "rule": "Se for evento, solicitar link do roteiro"
      }
    },
    {
      "id": "AV-003",
      "area": "Audiovisual",
      "need": "Caixa de Som / Microfone / Projetor",
      "path": [
        "Caixa de Som / Microfone / Projetor"
      ],
      "keywords": [
        "caixa de som",
        "microfone",
        "projetor",
        "telão",
        "áudio",
        "apresentação"
      ],
      "fields": [
        {
          "id": "data",
          "label": "Data do atendimento",
          "type": "date",
          "required": true
        },
        {
          "id": "horario",
          "label": "Horário do atendimento",
          "type": "time",
          "required": true
        },
        {
          "id": "local",
          "label": "Local do atendimento",
          "type": "text",
          "required": true
        },
        {
          "id": "evento",
          "label": "É para um evento?",
          "type": "choice",
          "options": [
            "Sim",
            "Não"
          ],
          "required": true
        },
        {
          "id": "roteiro",
          "label": "Link do roteiro do evento",
          "type": "url",
          "required": true,
          "when": {
            "field": "evento",
            "equals": "Sim"
          }
        }
      ],
      "source": {
        "question": "Você precisa dos três equipamentos: caixa de som, microfone e projetor?",
        "complementary": "Qual a data? Qual o horário? Qual o local? É para um evento?",
        "data": "Data, horário, local, setor, descrição",
        "rule": "Se evento = Sim, solicitar link do roteiro"
      }
    },
    {
      "id": "AV-004",
      "area": "Audiovisual",
      "need": "Caixa de Som / Projetor",
      "path": [
        "Caixa de Som / Projetor"
      ],
      "keywords": [
        "caixa de som",
        "projetor",
        "apresentação",
        "telão",
        "vídeo",
        "áudio"
      ],
      "fields": [
        {
          "id": "data",
          "label": "Data do atendimento",
          "type": "date",
          "required": true
        },
        {
          "id": "horario",
          "label": "Horário do atendimento",
          "type": "time",
          "required": true
        },
        {
          "id": "local",
          "label": "Local do atendimento",
          "type": "text",
          "required": true
        },
        {
          "id": "evento",
          "label": "É para um evento?",
          "type": "choice",
          "options": [
            "Sim",
            "Não"
          ],
          "required": true
        },
        {
          "id": "roteiro",
          "label": "Link do roteiro do evento",
          "type": "url",
          "required": true,
          "when": {
            "field": "evento",
            "equals": "Sim"
          }
        }
      ],
      "source": {
        "question": "Você também precisará de microfone?",
        "complementary": "Qual a data? Qual o horário? Qual o local? É para um evento?",
        "data": "Data, horário, local, setor, descrição",
        "rule": "Se evento = Sim, solicitar link do roteiro"
      }
    },
    {
      "id": "AV-005",
      "area": "Audiovisual",
      "need": "Microfone",
      "path": [
        "Microfone"
      ],
      "keywords": [
        "microfone",
        "mic",
        "falar",
        "palestra",
        "apresentação"
      ],
      "fields": [
        {
          "id": "data",
          "label": "Data do atendimento",
          "type": "date",
          "required": true
        },
        {
          "id": "horario",
          "label": "Horário do atendimento",
          "type": "time",
          "required": true
        },
        {
          "id": "local",
          "label": "Local do atendimento",
          "type": "text",
          "required": true
        },
        {
          "id": "evento",
          "label": "É para um evento?",
          "type": "choice",
          "options": [
            "Sim",
            "Não"
          ],
          "required": true
        },
        {
          "id": "roteiro",
          "label": "Link do roteiro do evento",
          "type": "url",
          "required": true,
          "when": {
            "field": "evento",
            "equals": "Sim"
          }
        }
      ],
      "source": {
        "question": "Você precisa apenas do microfone ou também de caixa de som?",
        "complementary": "Qual a data? Qual o horário? Qual o local? É para um evento?",
        "data": "Data, horário, local, setor, descrição",
        "rule": "Se evento = Sim, solicitar link do roteiro"
      }
    },
    {
      "id": "AV-006",
      "area": "Audiovisual",
      "need": "Projetor",
      "path": [
        "Projetor"
      ],
      "keywords": [
        "projetor",
        "projeção",
        "telão",
        "apresentação",
        "imagem"
      ],
      "fields": [
        {
          "id": "data",
          "label": "Data do atendimento",
          "type": "date",
          "required": true
        },
        {
          "id": "horario",
          "label": "Horário do atendimento",
          "type": "time",
          "required": true
        },
        {
          "id": "local",
          "label": "Local do atendimento",
          "type": "text",
          "required": true
        },
        {
          "id": "evento",
          "label": "É para um evento?",
          "type": "choice",
          "options": [
            "Sim",
            "Não"
          ],
          "required": true
        },
        {
          "id": "roteiro",
          "label": "Link do roteiro do evento",
          "type": "url",
          "required": true,
          "when": {
            "field": "evento",
            "equals": "Sim"
          }
        }
      ],
      "source": {
        "question": "Você precisa utilizar/reservar um projetor ou está enfrentando um problema com um projetor existente?",
        "complementary": "Qual a data? Qual o horário? Qual o local? É para um evento?",
        "data": "Data, horário, local, setor, descrição",
        "rule": "Se for problema técnico, diferenciar Projetor de cabo HDMI"
      }
    },
    {
      "id": "AV-007",
      "area": "Audiovisual",
      "need": "Troca de cabo HDMI",
      "path": [
        "Troca de cabo HDMI"
      ],
      "keywords": [
        "hdmi",
        "cabo hdmi",
        "cabo do projetor",
        "sem imagem",
        "cabo quebrado",
        "mau contato"
      ],
      "fields": [
        {
          "id": "local",
          "label": "Local do atendimento",
          "type": "text",
          "required": true
        },
        {
          "id": "descricao-do-problema",
          "label": "Descrição do problema",
          "type": "text",
          "required": true
        }
      ],
      "source": {
        "question": "O problema está no cabo HDMI ou você não consegue confirmar se é o cabo ou o projetor?",
        "complementary": "Em qual local está o equipamento? Há dano aparente? Já foi testado novamente?",
        "data": "Local, descrição do problema, setor",
        "rule": "Se houver dúvida entre HDMI e Projetor, solicitar confirmação"
      }
    },
    {
      "id": "IMP-001",
      "area": "Impressora",
      "need": "Configurar Scanner",
      "path": [
        "Configurar Scanner"
      ],
      "keywords": [
        "configurar scanner",
        "configuração scanner",
        "digitalizar",
        "escanear"
      ],
      "fields": [
        {
          "id": "modelo",
          "label": "Modelo da impressora",
          "type": "text",
          "required": true
        },
        {
          "id": "local",
          "label": "Local do atendimento",
          "type": "text",
          "required": true
        },
        {
          "id": "computador",
          "label": "Identificação do computador",
          "type": "text",
          "required": true
        }
      ],
      "source": {
        "question": "Você precisa configurar o scanner pela primeira vez ou ele já funcionava anteriormente?",
        "complementary": "Qual é o modelo da impressora? Em qual computador será configurado?",
        "data": "Modelo, local, computador, setor, descrição",
        "rule": "Se nunca foi configurado, tratar como configuração"
      }
    },
    {
      "id": "IMP-002",
      "area": "Impressora",
      "need": "Grampo da Impressora",
      "path": [
        "Grampo da Impressora"
      ],
      "keywords": [
        "grampo",
        "grampeador",
        "grampear",
        "acabou grampo"
      ],
      "fields": [
        {
          "id": "modelo",
          "label": "Modelo da impressora",
          "type": "text",
          "required": true
        },
        {
          "id": "local",
          "label": "Local do atendimento",
          "type": "text",
          "required": true
        }
      ],
      "source": {
        "question": "A solicitação é reposição de grampos ou existe falha no grampeador?",
        "complementary": "Qual é o modelo da impressora? Qual o local?",
        "data": "Modelo, local, setor, descrição",
        "rule": "Diferenciar suprimento de defeito"
      }
    },
    {
      "id": "IMP-003",
      "area": "Impressora",
      "need": "Instalar Impressora",
      "path": [
        "Instalar Impressora"
      ],
      "keywords": [
        "instalar impressora",
        "adicionar impressora",
        "configurar impressora",
        "nova impressora"
      ],
      "fields": [
        {
          "id": "modelo",
          "label": "Modelo da impressora",
          "type": "text",
          "required": true
        },
        {
          "id": "computador",
          "label": "Identificação do computador",
          "type": "text",
          "required": true
        },
        {
          "id": "local",
          "label": "Local do atendimento",
          "type": "text",
          "required": true
        }
      ],
      "source": {
        "question": "A impressora já está instalada em outros computadores?",
        "complementary": "Qual o computador? Qual impressora? Qual o local?",
        "data": "Modelo, computador, local, setor",
        "rule": "Se for instalação em novo computador, manter esta classificação"
      }
    },
    {
      "id": "IMP-004",
      "area": "Impressora",
      "need": "Lâmpada da Estufa",
      "path": [
        "Lâmpada da Estufa"
      ],
      "keywords": [
        "lâmpada da estufa",
        "estufa",
        "fusor",
        "lâmpada impressora"
      ],
      "fields": [
        {
          "id": "modelo",
          "label": "Modelo da impressora",
          "type": "text",
          "required": true
        },
        {
          "id": "local",
          "label": "Local do atendimento",
          "type": "text",
          "required": true
        },
        {
          "id": "erro-apresentado",
          "label": "Erro apresentado",
          "type": "text",
          "required": true
        }
      ],
      "source": {
        "question": "Existe alguma mensagem de erro ou falha de aquecimento?",
        "complementary": "Qual o modelo da impressora? Ela ainda consegue imprimir?",
        "data": "Modelo, local, erro apresentado, setor",
        "rule": "Encaminhar para suporte técnico"
      }
    },
    {
      "id": "IMP-005",
      "area": "Impressora",
      "need": "Manchando folhas",
      "path": [
        "Manchando folhas"
      ],
      "keywords": [
        "manchando",
        "manchas",
        "folha suja",
        "impressão suja",
        "riscos na folha"
      ],
      "fields": [
        {
          "id": "modelo",
          "label": "Modelo da impressora",
          "type": "text",
          "required": true
        },
        {
          "id": "local",
          "label": "Local do atendimento",
          "type": "text",
          "required": true
        }
      ],
      "source": {
        "question": "As manchas aparecem em todas as impressões?",
        "complementary": "Qual o modelo? Qual cor aparece na mancha? Desde quando ocorre?",
        "data": "Modelo, local, descrição, anexo recomendado",
        "rule": "Recomendar foto ou digitalização da folha"
      }
    },
    {
      "id": "IMP-006",
      "area": "Impressora",
      "need": "Não imprime",
      "path": [
        "Não imprime"
      ],
      "keywords": [
        "não imprime",
        "não está imprimindo",
        "impressão parada",
        "fila de impressão",
        "documento não sai"
      ],
      "fields": [
        {
          "id": "modelo",
          "label": "Modelo da impressora",
          "type": "text",
          "required": true
        },
        {
          "id": "local",
          "label": "Local do atendimento",
          "type": "text",
          "required": true
        },
        {
          "id": "computador",
          "label": "Identificação do computador",
          "type": "text",
          "required": true
        },
        {
          "id": "mensagem-de-erro",
          "label": "Mensagem de erro",
          "type": "text",
          "required": true
        }
      ],
      "source": {
        "question": "A impressora está ligada e aparece alguma mensagem de erro?",
        "complementary": "Outros usuários conseguem imprimir? O documento aparece na fila?",
        "data": "Modelo, local, computador, mensagem de erro, setor",
        "rule": "Tentar verificações simples antes do encaminhamento"
      }
    },
    {
      "id": "IMP-007",
      "area": "Impressora",
      "need": "Não liga",
      "path": [
        "Não liga"
      ],
      "keywords": [
        "não liga",
        "desligada",
        "sem energia",
        "impressora apagada"
      ],
      "fields": [
        {
          "id": "modelo",
          "label": "Modelo da impressora",
          "type": "text",
          "required": true
        },
        {
          "id": "local",
          "label": "Local do atendimento",
          "type": "text",
          "required": true
        }
      ],
      "source": {
        "question": "A impressora está conectada à energia e o botão de ligar não apresenta resposta?",
        "complementary": "Houve queda de energia? Outros equipamentos da tomada funcionam?",
        "data": "Modelo, local, setor, descrição",
        "rule": "Não orientar abertura do equipamento"
      }
    },
    {
      "id": "IMP-008",
      "area": "Impressora",
      "need": "Papel Atolado",
      "path": [
        "Papel Atolado"
      ],
      "keywords": [
        "papel atolado",
        "folha presa",
        "papel preso",
        "atolamento"
      ],
      "fields": [
        {
          "id": "modelo",
          "label": "Modelo da impressora",
          "type": "text",
          "required": true
        },
        {
          "id": "local",
          "label": "Local do atendimento",
          "type": "text",
          "required": true
        },
        {
          "id": "mensagem-do-visor",
          "label": "Mensagem do visor",
          "type": "text",
          "required": true
        }
      ],
      "source": {
        "question": "Existe papel visível preso na impressora?",
        "complementary": "O visor indica onde ocorreu o atolamento? O problema se repete?",
        "data": "Modelo, local, mensagem do visor, setor",
        "rule": "Orientar somente remoção segura de papel facilmente acessível"
      }
    },
    {
      "id": "IMP-009",
      "area": "Impressora",
      "need": "Scanner não funciona",
      "path": [
        "Scanner não funciona"
      ],
      "keywords": [
        "scanner não funciona",
        "não escaneia",
        "não digitaliza",
        "erro scanner"
      ],
      "fields": [
        {
          "id": "modelo",
          "label": "Modelo da impressora",
          "type": "text",
          "required": true
        },
        {
          "id": "computador",
          "label": "Identificação do computador",
          "type": "text",
          "required": true
        },
        {
          "id": "local",
          "label": "Local do atendimento",
          "type": "text",
          "required": true
        },
        {
          "id": "erro",
          "label": "Erro",
          "type": "text",
          "required": true
        }
      ],
      "source": {
        "question": "O scanner já funcionava neste computador anteriormente?",
        "complementary": "A impressão funciona normalmente? Existe mensagem de erro?",
        "data": "Modelo, computador, local, erro, setor",
        "rule": "Diferenciar configuração de falha"
      }
    },
    {
      "id": "IMP-010",
      "area": "Impressora",
      "need": "Solicitação de Toner / Tinta",
      "path": [
        "Solicitação de Toner / Tinta"
      ],
      "keywords": [
        "toner",
        "tinta",
        "cartucho",
        "acabou toner",
        "acabou tinta",
        "reposição"
      ],
      "fields": [
        {
          "id": "cor",
          "label": "Cor do toner / tinta",
          "type": "choice",
          "options": [
            "Preto",
            "Amarelo",
            "Ciano",
            "Magenta"
          ],
          "required": true
        },
        {
          "id": "modelo",
          "label": "Modelo da impressora",
          "type": "text",
          "required": true
        },
        {
          "id": "local",
          "label": "Local do atendimento",
          "type": "text",
          "required": true
        }
      ],
      "source": {
        "question": "Qual cor precisa ser substituída?",
        "complementary": "Qual é o modelo da impressora?",
        "data": "Cor, modelo, local, setor",
        "rule": "Exibir cores Preto, Amarelo, Ciano e Magenta"
      }
    },
    {
      "id": "GOO-001",
      "area": "Google",
      "need": "Agendas",
      "path": [
        "Agendas"
      ],
      "keywords": [
        "agenda",
        "google agenda",
        "calendário",
        "calendar",
        "convite"
      ],
      "fields": [
        {
          "id": "conta",
          "label": "E-mail da conta envolvida",
          "type": "email",
          "required": true
        }
      ],
      "source": {
        "question": "O problema é acesso, compartilhamento, criação ou utilização da agenda?",
        "complementary": "Qual agenda está envolvida? Existe mensagem de erro?",
        "data": "Conta, descrição, setor",
        "rule": "Solicitar detalhes suficientes antes do encaminhamento"
      }
    },
    {
      "id": "GOO-002",
      "area": "Google",
      "need": "Apresentações",
      "path": [
        "Apresentações"
      ],
      "keywords": [
        "google apresentações",
        "slides",
        "apresentação google"
      ],
      "fields": [
        {
          "id": "conta",
          "label": "E-mail da conta envolvida",
          "type": "email",
          "required": true
        },
        {
          "id": "link-ou-nome-do-arquivo",
          "label": "Link ou nome do arquivo",
          "type": "text",
          "required": true
        }
      ],
      "source": {
        "question": "O problema ocorre ao criar, editar, abrir ou compartilhar uma apresentação?",
        "complementary": "Qual arquivo está envolvido?",
        "data": "Conta, link ou nome do arquivo, descrição",
        "rule": "Solicitar link quando pertinente"
      }
    },
    {
      "id": "GOO-003",
      "area": "Google",
      "need": "Classroom",
      "path": [
        "Classroom"
      ],
      "keywords": [
        "classroom",
        "google classroom",
        "turma",
        "sala virtual"
      ],
      "fields": [
        {
          "id": "conta",
          "label": "E-mail da conta envolvida",
          "type": "email",
          "required": true
        },
        {
          "id": "turma",
          "label": "Turma",
          "type": "text",
          "required": true
        }
      ],
      "source": {
        "question": "A dificuldade é acessar uma turma, criar conteúdo ou visualizar atividades?",
        "complementary": "Qual turma está envolvida? Qual conta está sendo utilizada?",
        "data": "Conta, turma, descrição",
        "rule": ""
      }
    },
    {
      "id": "GOO-004",
      "area": "Google",
      "need": "Documentos",
      "path": [
        "Documentos"
      ],
      "keywords": [
        "google documentos",
        "docs",
        "documento google"
      ],
      "fields": [
        {
          "id": "conta",
          "label": "E-mail da conta envolvida",
          "type": "email",
          "required": true
        },
        {
          "id": "arquivo",
          "label": "Arquivo",
          "type": "text",
          "required": true
        }
      ],
      "source": {
        "question": "O problema é criação, edição, acesso ou compartilhamento?",
        "complementary": "Qual documento está envolvido?",
        "data": "Conta, arquivo, descrição",
        "rule": "Solicitar link quando pertinente"
      }
    },
    {
      "id": "GOO-005",
      "area": "Google",
      "need": "Drive",
      "path": [
        "Drive"
      ],
      "keywords": [
        "drive",
        "google drive",
        "arquivo",
        "pasta",
        "compartilhamento"
      ],
      "fields": [
        {
          "id": "conta",
          "label": "E-mail da conta envolvida",
          "type": "email",
          "required": true
        },
        {
          "id": "link-ou-nome-do-recurso",
          "label": "Link ou nome do recurso",
          "type": "text",
          "required": true
        }
      ],
      "source": {
        "question": "O problema envolve acesso, arquivo, pasta ou compartilhamento?",
        "complementary": "Qual arquivo ou pasta está envolvido?",
        "data": "Conta, link ou nome do recurso, descrição",
        "rule": "Solicitar link quando pertinente"
      }
    },
    {
      "id": "GOO-006",
      "area": "Google",
      "need": "Dúvidas",
      "path": [
        "Dúvidas"
      ],
      "keywords": [
        "dúvida google",
        "como fazer google",
        "ajuda google"
      ],
      "fields": [
        {
          "id": "conta",
          "label": "E-mail da conta envolvida",
          "type": "email",
          "required": true
        }
      ],
      "source": {
        "question": "Sobre qual serviço Google é a sua dúvida?",
        "complementary": "Descreva o que você está tentando fazer.",
        "data": "Conta, descrição, setor",
        "rule": ""
      }
    },
    {
      "id": "GOO-007",
      "area": "Google",
      "need": "Gmail",
      "path": [
        "Gmail"
      ],
      "keywords": [
        "gmail",
        "e-mail google",
        "email google",
        "mensagem",
        "caixa de entrada"
      ],
      "fields": [
        {
          "id": "conta",
          "label": "E-mail da conta envolvida",
          "type": "email",
          "required": true
        },
        {
          "id": "erro-apresentado",
          "label": "Erro apresentado",
          "type": "text",
          "required": true
        }
      ],
      "source": {
        "question": "O problema é enviar, receber, acessar ou organizar e-mails?",
        "complementary": "Aparece alguma mensagem de erro?",
        "data": "Conta, descrição, erro apresentado",
        "rule": "Se mencionar senha, verificar possibilidade de Resetar senha"
      }
    },
    {
      "id": "GOO-008",
      "area": "Google",
      "need": "Grupos",
      "path": [
        "Grupos"
      ],
      "keywords": [
        "google grupos",
        "grupo de email",
        "lista de distribuição",
        "grupo"
      ],
      "fields": [
        {
          "id": "conta",
          "label": "E-mail da conta envolvida",
          "type": "email",
          "required": true
        },
        {
          "id": "grupo",
          "label": "Grupo",
          "type": "text",
          "required": true
        }
      ],
      "source": {
        "question": "Você precisa criar, alterar ou acessar um grupo?",
        "complementary": "Qual é o nome ou endereço do grupo?",
        "data": "Conta, grupo, descrição",
        "rule": ""
      }
    },
    {
      "id": "GOO-009",
      "area": "Google",
      "need": "Planilhas",
      "path": [
        "Planilhas"
      ],
      "keywords": [
        "google planilhas",
        "sheets",
        "planilha google"
      ],
      "fields": [
        {
          "id": "conta",
          "label": "E-mail da conta envolvida",
          "type": "email",
          "required": true
        },
        {
          "id": "link-ou-nome-da-planilha",
          "label": "Link ou nome da planilha",
          "type": "text",
          "required": true
        }
      ],
      "source": {
        "question": "O problema é acesso, edição, fórmula ou compartilhamento?",
        "complementary": "Qual planilha está envolvida?",
        "data": "Conta, link ou nome da planilha, descrição",
        "rule": "Solicitar link quando pertinente"
      }
    },
    {
      "id": "GOO-010",
      "area": "Google",
      "need": "Reserva de Chromebook",
      "path": [
        "Reserva de Chromebook"
      ],
      "keywords": [
        "reservar chromebook",
        "reserva chromebook",
        "chromebook",
        "empréstimo chromebook"
      ],
      "fields": [
        {
          "id": "data",
          "label": "Data do atendimento",
          "type": "date",
          "required": true
        },
        {
          "id": "horario-periodo",
          "label": "Horário/período",
          "type": "text",
          "required": true
        }
      ],
      "source": {
        "question": "Para qual data você precisa do Chromebook?",
        "complementary": "Existe horário ou período específico?",
        "data": "Data, horário/período, setor, descrição",
        "rule": "Ao selecionar Reserva de Chromebook, solicitar Data"
      }
    },
    {
      "id": "GOO-011",
      "area": "Google",
      "need": "Resetar senha",
      "path": [
        "Resetar senha"
      ],
      "keywords": [
        "resetar senha",
        "esqueci senha",
        "senha google",
        "senha gmail",
        "não consigo entrar",
        "login"
      ],
      "fields": [
        {
          "id": "e-mail-da-conta",
          "label": "E-mail da conta envolvida",
          "type": "email",
          "required": true
        }
      ],
      "source": {
        "question": "Qual é o e-mail da conta que precisa ter a senha redefinida?",
        "complementary": "A senha foi esquecida ou está sendo recusada?",
        "data": "E-mail da conta, nome, setor",
        "rule": "Ao selecionar Resetar senha, solicitar E-mail"
      }
    },
    {
      "id": "GOO-012",
      "area": "Google",
      "need": "Sites",
      "path": [
        "Sites"
      ],
      "keywords": [
        "google sites",
        "site google",
        "página google sites"
      ],
      "fields": [
        {
          "id": "conta",
          "label": "E-mail da conta envolvida",
          "type": "email",
          "required": true
        },
        {
          "id": "link-ou-nome-do-site",
          "label": "Link ou nome do site",
          "type": "text",
          "required": true
        }
      ],
      "source": {
        "question": "O problema é acesso, edição, publicação ou criação do site?",
        "complementary": "Qual site está envolvido?",
        "data": "Conta, link ou nome do site, descrição",
        "rule": ""
      }
    },
    {
      "id": "TI-001",
      "area": "TI",
      "need": "Dúvidas",
      "path": [
        "Dúvidas"
      ],
      "keywords": [
        "dúvida",
        "dúvida de ti",
        "ajuda",
        "orientação",
        "como fazer"
      ],
      "fields": [],
      "source": {
        "question": "Sobre qual equipamento, sistema ou serviço é a sua dúvida?",
        "complementary": "Descreva o que você está tentando fazer.",
        "data": "Setor, descrição",
        "rule": ""
      }
    },
    {
      "id": "TI-002",
      "area": "TI",
      "need": "Sugestão de melhoria",
      "path": [
        "Sugestão de melhoria"
      ],
      "keywords": [
        "sugestão",
        "melhoria",
        "ideia",
        "melhorar sistema",
        "melhoria de processo"
      ],
      "fields": [
        {
          "id": "sistema-processo",
          "label": "Sistema/processo",
          "type": "text",
          "required": true
        }
      ],
      "source": {
        "question": "A melhoria é relacionada a qual sistema ou processo?",
        "complementary": "Qual problema atual essa melhoria resolveria?",
        "data": "Setor, sistema/processo, descrição",
        "rule": ""
      }
    },
    {
      "id": "TI-003",
      "area": "TI",
      "need": "Outros",
      "path": [
        "Outros"
      ],
      "keywords": [
        "outros",
        "outro problema",
        "não encontrei categoria"
      ],
      "fields": [],
      "source": {
        "question": "Você consegue explicar com mais detalhes o que precisa?",
        "complementary": "Existe algum equipamento ou sistema envolvido?",
        "data": "Setor, descrição",
        "rule": "Usar somente quando não houver classificação melhor"
      }
    },
    {
      "id": "TI-COMP-001",
      "area": "TI",
      "need": "COMPUTADOR > Headset / Fone de Ouvido",
      "path": [
        "COMPUTADOR",
        "Headset / Fone de Ouvido"
      ],
      "keywords": [
        "headset",
        "fone",
        "fone de ouvido",
        "áudio no fone",
        "microfone headset"
      ],
      "fields": [
        {
          "id": "computador",
          "label": "Identificação do computador",
          "type": "text",
          "required": true
        },
        {
          "id": "local",
          "label": "Local do atendimento",
          "type": "text",
          "required": true
        }
      ],
      "source": {
        "question": "O problema está no áudio, microfone ou no próprio equipamento?",
        "complementary": "O headset funciona em outro computador?",
        "data": "Computador, local, setor, descrição",
        "rule": ""
      }
    },
    {
      "id": "TI-COMP-002",
      "area": "TI",
      "need": "COMPUTADOR > Leitor de CD/DVD",
      "path": [
        "COMPUTADOR",
        "Leitor de CD/DVD"
      ],
      "keywords": [
        "cd",
        "dvd",
        "leitor cd",
        "leitor dvd",
        "drive óptico"
      ],
      "fields": [
        {
          "id": "computador",
          "label": "Identificação do computador",
          "type": "text",
          "required": true
        },
        {
          "id": "local",
          "label": "Local do atendimento",
          "type": "text",
          "required": true
        }
      ],
      "source": {
        "question": "O computador não reconhece o disco ou o leitor não abre?",
        "complementary": "Já foi testado outro CD/DVD?",
        "data": "Computador, local, setor, descrição",
        "rule": ""
      }
    },
    {
      "id": "TI-COMP-003",
      "area": "TI",
      "need": "COMPUTADOR > Não liga",
      "path": [
        "COMPUTADOR",
        "Não liga"
      ],
      "keywords": [
        "computador não liga",
        "pc não liga",
        "notebook não liga",
        "sem energia"
      ],
      "fields": [
        {
          "id": "equipamento",
          "label": "Identificação do equipamento",
          "type": "text",
          "required": true
        },
        {
          "id": "local",
          "label": "Local do atendimento",
          "type": "text",
          "required": true
        }
      ],
      "source": {
        "question": "Ao pressionar o botão, aparece alguma luz, som ou imagem?",
        "complementary": "O equipamento está conectado à energia?",
        "data": "Equipamento, local, setor, descrição",
        "rule": "Limitar orientação a verificações externas seguras"
      }
    },
    {
      "id": "TI-COMP-004",
      "area": "TI",
      "need": "COMPUTADOR > Problemas com lentidão",
      "path": [
        "COMPUTADOR",
        "Problemas com lentidão"
      ],
      "keywords": [
        "computador lento",
        "pc lento",
        "travando",
        "lentidão",
        "demora",
        "congelando"
      ],
      "fields": [
        {
          "id": "computador",
          "label": "Identificação do computador",
          "type": "text",
          "required": true
        },
        {
          "id": "local",
          "label": "Local do atendimento",
          "type": "text",
          "required": true
        }
      ],
      "source": {
        "question": "A lentidão acontece o tempo todo ou apenas em algum programa?",
        "complementary": "Quando começou? Qual programa costuma estar aberto?",
        "data": "Computador, local, setor, descrição",
        "rule": "Pode oferecer verificações simples"
      }
    },
    {
      "id": "TI-COMP-005",
      "area": "TI",
      "need": "COMPUTADOR > Programas (software)",
      "path": [
        "COMPUTADOR",
        "Programas (software)"
      ],
      "keywords": [
        "programa",
        "software",
        "aplicativo",
        "instalar programa",
        "erro programa"
      ],
      "fields": [
        {
          "id": "programa",
          "label": "Nome do programa",
          "type": "text",
          "required": true
        },
        {
          "id": "computador",
          "label": "Identificação do computador",
          "type": "text",
          "required": true
        }
      ],
      "source": {
        "question": "Você precisa instalar um programa ou está enfrentando erro em um programa existente?",
        "complementary": "Qual é o nome do programa?",
        "data": "Programa, computador, setor, descrição",
        "rule": "Diferenciar instalação de erro"
      }
    },
    {
      "id": "TI-COMP-006",
      "area": "TI",
      "need": "COMPUTADOR > Reserva de Notebook",
      "path": [
        "COMPUTADOR",
        "Reserva de Notebook"
      ],
      "keywords": [
        "reservar notebook",
        "reserva notebook",
        "empréstimo notebook"
      ],
      "fields": [
        {
          "id": "data",
          "label": "Data do atendimento",
          "type": "date",
          "required": true
        },
        {
          "id": "periodo",
          "label": "Período solicitado",
          "type": "text",
          "required": true
        }
      ],
      "source": {
        "question": "Para qual data e período você precisa do notebook?",
        "complementary": "Qual a finalidade da reserva?",
        "data": "Data, período, setor, descrição",
        "rule": ""
      }
    },
    {
      "id": "TI-COMP-007",
      "area": "TI",
      "need": "COMPUTADOR > Troca de Mouse",
      "path": [
        "COMPUTADOR",
        "Troca de Mouse"
      ],
      "keywords": [
        "mouse",
        "trocar mouse",
        "mouse quebrado",
        "mouse não funciona"
      ],
      "fields": [
        {
          "id": "computador",
          "label": "Identificação do computador",
          "type": "text",
          "required": true
        },
        {
          "id": "local",
          "label": "Local do atendimento",
          "type": "text",
          "required": true
        }
      ],
      "source": {
        "question": "O mouse parou completamente ou apresenta falhas intermitentes?",
        "complementary": "Já foi reconectado ou testado novamente?",
        "data": "Computador, local, setor, descrição",
        "rule": ""
      }
    },
    {
      "id": "TI-COMP-008",
      "area": "TI",
      "need": "COMPUTADOR > Troca de Teclado",
      "path": [
        "COMPUTADOR",
        "Troca de Teclado"
      ],
      "keywords": [
        "teclado",
        "trocar teclado",
        "teclado quebrado",
        "tecla não funciona"
      ],
      "fields": [
        {
          "id": "computador",
          "label": "Identificação do computador",
          "type": "text",
          "required": true
        },
        {
          "id": "local",
          "label": "Local do atendimento",
          "type": "text",
          "required": true
        }
      ],
      "source": {
        "question": "O teclado parou completamente ou apenas algumas teclas apresentam problema?",
        "complementary": "Já foi reconectado ou testado novamente?",
        "data": "Computador, local, setor, descrição",
        "rule": ""
      }
    },
    {
      "id": "TI-NET-001",
      "area": "TI",
      "need": "INTERNET > Computador não está conectado à rede",
      "path": [
        "INTERNET",
        "Computador não está conectado à rede"
      ],
      "keywords": [
        "sem internet",
        "sem rede",
        "cabo de rede",
        "computador desconectado",
        "rede cabeada"
      ],
      "fields": [
        {
          "id": "computador",
          "label": "Identificação do computador",
          "type": "text",
          "required": true
        },
        {
          "id": "local",
          "label": "Local do atendimento",
          "type": "text",
          "required": true
        },
        {
          "id": "tipo-de-conexao",
          "label": "Tipo de conexão",
          "type": "choice",
          "options": [
            "Cabo",
            "Wi-Fi"
          ],
          "required": true
        }
      ],
      "source": {
        "question": "A conexão é por cabo ou Wi-Fi?",
        "complementary": "Outros computadores próximos estão conectados normalmente?",
        "data": "Computador, local, tipo de conexão, setor",
        "rule": "Se for Wi-Fi, avaliar categoria Problemas com Wi-Fi"
      }
    },
    {
      "id": "TI-NET-002",
      "area": "TI",
      "need": "INTERNET > Criar Login de acesso Internet",
      "path": [
        "INTERNET",
        "Criar Login de acesso Internet"
      ],
      "keywords": [
        "criar login internet",
        "acesso internet",
        "usuário internet",
        "login wifi"
      ],
      "fields": [
        {
          "id": "finalidade",
          "label": "Finalidade",
          "type": "text",
          "required": true
        },
        {
          "id": "periodo",
          "label": "Período solicitado",
          "type": "text",
          "required": true
        }
      ],
      "source": {
        "question": "Para quem o acesso deve ser criado?",
        "complementary": "Qual a finalidade e período de utilização?",
        "data": "Nome, setor, finalidade, período",
        "rule": ""
      }
    },
    {
      "id": "TI-NET-003",
      "area": "TI",
      "need": "INTERNET > Problemas com Wi-Fi",
      "path": [
        "INTERNET",
        "Problemas com Wi-Fi"
      ],
      "keywords": [
        "wifi",
        "wi-fi",
        "wireless",
        "sem wifi",
        "wifi cai",
        "internet sem fio"
      ],
      "fields": [
        {
          "id": "dispositivo",
          "label": "Dispositivo",
          "type": "text",
          "required": true
        },
        {
          "id": "local",
          "label": "Local do atendimento",
          "type": "text",
          "required": true
        },
        {
          "id": "rede",
          "label": "Rede",
          "type": "text",
          "required": true
        }
      ],
      "source": {
        "question": "O dispositivo encontra a rede Wi-Fi?",
        "complementary": "Outros dispositivos no mesmo local estão funcionando?",
        "data": "Dispositivo, local, rede, setor",
        "rule": ""
      }
    },
    {
      "id": "TI-INT-001",
      "area": "TI",
      "need": "INTRANET > Atualização",
      "path": [
        "INTRANET",
        "Atualização"
      ],
      "keywords": [
        "atualizar intranet",
        "alteração intranet",
        "conteúdo intranet"
      ],
      "fields": [
        {
          "id": "pagina-secao",
          "label": "Página/seção",
          "type": "text",
          "required": true
        },
        {
          "id": "conteudo-novo",
          "label": "Conteúdo novo",
          "type": "text",
          "required": true
        }
      ],
      "source": {
        "question": "Qual conteúdo da intranet precisa ser atualizado?",
        "complementary": "Existe texto, imagem, link ou data para substituição?",
        "data": "Página/seção, conteúdo novo, setor",
        "rule": ""
      }
    },
    {
      "id": "TI-INT-002",
      "area": "TI",
      "need": "INTRANET > Solicitação",
      "path": [
        "INTRANET",
        "Solicitação"
      ],
      "keywords": [
        "solicitação intranet",
        "criar na intranet",
        "novo conteúdo intranet"
      ],
      "fields": [
        {
          "id": "secao",
          "label": "Seção",
          "type": "text",
          "required": true
        },
        {
          "id": "arquivos-links",
          "label": "Arquivos/links",
          "type": "text",
          "required": true
        }
      ],
      "source": {
        "question": "O que você gostaria que fosse criado ou incluído na intranet?",
        "complementary": "Em qual seção deverá aparecer?",
        "data": "Seção, descrição, arquivos/links, setor",
        "rule": ""
      }
    },
    {
      "id": "TI-INT-003",
      "area": "TI",
      "need": "INTRANET > Sugestão",
      "path": [
        "INTRANET",
        "Sugestão"
      ],
      "keywords": [
        "sugestão intranet",
        "melhoria intranet",
        "ideia intranet"
      ],
      "fields": [],
      "source": {
        "question": "Qual melhoria você sugere para a intranet?",
        "complementary": "Que problema essa melhoria resolveria?",
        "data": "Descrição, setor",
        "rule": ""
      }
    },
    {
      "id": "TI-MENT-001",
      "area": "TI",
      "need": "MENTOR WEB > Criação de Login",
      "path": [
        "MENTOR WEB",
        "Criação de Login"
      ],
      "keywords": [
        "mentor login",
        "criar login mentor",
        "usuário mentor"
      ],
      "fields": [
        {
          "id": "perfil",
          "label": "Perfil",
          "type": "text",
          "required": true
        }
      ],
      "source": {
        "question": "Para qual usuário o acesso ao Mentor deverá ser criado?",
        "complementary": "Qual é o perfil ou função do usuário?",
        "data": "Nome, setor, perfil",
        "rule": ""
      }
    },
    {
      "id": "TI-MENT-002",
      "area": "TI",
      "need": "MENTOR WEB > Erro no relatório",
      "path": [
        "MENTOR WEB",
        "Erro no relatório"
      ],
      "keywords": [
        "mentor relatório erro",
        "relatório mentor não funciona",
        "erro relatório"
      ],
      "fields": [
        {
          "id": "relatorio",
          "label": "Relatório",
          "type": "text",
          "required": true
        },
        {
          "id": "mensagem-de-erro",
          "label": "Mensagem de erro",
          "type": "text",
          "required": true
        }
      ],
      "source": {
        "question": "Qual relatório apresenta erro?",
        "complementary": "Existe mensagem de erro? O problema ocorre sempre?",
        "data": "Relatório, mensagem de erro, setor, anexo recomendado",
        "rule": ""
      }
    },
    {
      "id": "TI-MENT-003",
      "area": "TI",
      "need": "MENTOR WEB > Alteração de notas",
      "path": [
        "MENTOR WEB",
        "Alteração de notas"
      ],
      "keywords": [
        "alteração de notas",
        "mudar nota mentor",
        "corrigir nota"
      ],
      "fields": [
        {
          "id": "aluno-turma",
          "label": "Aluno/turma",
          "type": "text",
          "required": true
        },
        {
          "id": "disciplina",
          "label": "Disciplina",
          "type": "text",
          "required": true
        }
      ],
      "source": {
        "question": "Qual aluno/turma/disciplina está envolvido?",
        "complementary": "Qual alteração precisa ser realizada?",
        "data": "Aluno/turma, disciplina, descrição, solicitante",
        "rule": ""
      }
    },
    {
      "id": "TI-MENT-004",
      "area": "TI",
      "need": "MENTOR WEB > Encerramento de diário",
      "path": [
        "MENTOR WEB",
        "Encerramento de diário"
      ],
      "keywords": [
        "encerramento diário",
        "fechar diário",
        "diário mentor"
      ],
      "fields": [
        {
          "id": "turma",
          "label": "Turma",
          "type": "text",
          "required": true
        },
        {
          "id": "disciplina",
          "label": "Disciplina",
          "type": "text",
          "required": true
        },
        {
          "id": "periodo",
          "label": "Período solicitado",
          "type": "text",
          "required": true
        }
      ],
      "source": {
        "question": "Qual turma e disciplina estão envolvidas?",
        "complementary": "Qual período deve ser encerrado?",
        "data": "Turma, disciplina, período, setor",
        "rule": ""
      }
    },
    {
      "id": "TI-MENT-005",
      "area": "TI",
      "need": "MENTOR WEB > Erro no sistema",
      "path": [
        "MENTOR WEB",
        "Erro no sistema"
      ],
      "keywords": [
        "mentor erro",
        "mentor web erro",
        "sistema mentor",
        "mentor não funciona"
      ],
      "fields": [
        {
          "id": "usuario",
          "label": "Usuário",
          "type": "text",
          "required": true
        },
        {
          "id": "mensagem-de-erro",
          "label": "Mensagem de erro",
          "type": "text",
          "required": true
        }
      ],
      "source": {
        "question": "Qual ação você estava realizando quando o erro ocorreu?",
        "complementary": "Qual mensagem aparece? O erro pode ser reproduzido?",
        "data": "Usuário, descrição, mensagem de erro, anexo recomendado",
        "rule": ""
      }
    },
    {
      "id": "TI-MENT-006",
      "area": "TI",
      "need": "MENTOR WEB > Remanejamento de aluno",
      "path": [
        "MENTOR WEB",
        "Remanejamento de aluno"
      ],
      "keywords": [
        "remanejamento aluno",
        "mover aluno turma",
        "trocar turma mentor"
      ],
      "fields": [
        {
          "id": "aluno",
          "label": "Aluno",
          "type": "text",
          "required": true
        },
        {
          "id": "turma-atual",
          "label": "Turma atual",
          "type": "text",
          "required": true
        },
        {
          "id": "turma-destino",
          "label": "Turma destino",
          "type": "text",
          "required": true
        }
      ],
      "source": {
        "question": "Qual aluno precisa ser remanejado?",
        "complementary": "Qual é a turma atual e a turma de destino?",
        "data": "Aluno, turma atual, turma destino, setor",
        "rule": ""
      }
    },
    {
      "id": "TI-MENT-007",
      "area": "TI",
      "need": "MENTOR WEB > Solicitação de Relatório",
      "path": [
        "MENTOR WEB",
        "Solicitação de Relatório"
      ],
      "keywords": [
        "solicitação relatório mentor",
        "criar relatório mentor",
        "relatório"
      ],
      "fields": [
        {
          "id": "descricao-do-relatorio",
          "label": "Descrição do relatório",
          "type": "text",
          "required": true
        }
      ],
      "source": {
        "question": "Qual relatório é necessário?",
        "complementary": "Qual informação deve constar no relatório?",
        "data": "Descrição do relatório, setor",
        "rule": ""
      }
    },
    {
      "id": "TI-MENT-008",
      "area": "TI",
      "need": "MENTOR WEB > Solicitação de acesso a relatório",
      "path": [
        "MENTOR WEB",
        "Solicitação de acesso a relatório"
      ],
      "keywords": [
        "acesso relatório mentor",
        "liberar relatório",
        "permissão relatório"
      ],
      "fields": [
        {
          "id": "relatorio",
          "label": "Relatório",
          "type": "text",
          "required": true
        },
        {
          "id": "usuario",
          "label": "Usuário",
          "type": "text",
          "required": true
        }
      ],
      "source": {
        "question": "Qual relatório precisa ser liberado?",
        "complementary": "Para qual usuário o acesso deve ser concedido?",
        "data": "Relatório, usuário, setor",
        "rule": ""
      }
    },
    {
      "id": "TI-QB-001",
      "area": "TI",
      "need": "QUICKBOOKS > Erro no sistema",
      "path": [
        "QUICKBOOKS",
        "Erro no sistema"
      ],
      "keywords": [
        "quickbooks",
        "quick books",
        "erro quickbooks",
        "erro no financeiro"
      ],
      "fields": [
        {
          "id": "usuario",
          "label": "Usuário",
          "type": "text",
          "required": true
        },
        {
          "id": "mensagem-de-erro",
          "label": "Mensagem de erro",
          "type": "text",
          "required": true
        }
      ],
      "sectors": [
        "Financeiro"
      ],
      "source": {
        "question": "Qual mensagem de erro aparece no QuickBooks?",
        "complementary": "O sistema chega a abrir? Quando o problema começou?",
        "data": "Setor, usuário, mensagem de erro, anexo recomendado",
        "rule": "Disponibilizar este fluxo quando Setor = Financeiro"
      }
    },
    {
      "id": "TI-QB-002",
      "area": "TI",
      "need": "QUICKBOOKS > Instalação",
      "path": [
        "QUICKBOOKS",
        "Instalação"
      ],
      "keywords": [
        "instalar quickbooks",
        "instalação quickbooks",
        "quickbooks novo computador"
      ],
      "fields": [
        {
          "id": "usuario",
          "label": "Usuário",
          "type": "text",
          "required": true
        },
        {
          "id": "computador",
          "label": "Identificação do computador",
          "type": "text",
          "required": true
        }
      ],
      "sectors": [
        "Financeiro"
      ],
      "source": {
        "question": "Em qual computador o QuickBooks precisa ser instalado?",
        "complementary": "O usuário já possui acesso ao sistema?",
        "data": "Setor, usuário, computador",
        "rule": "Disponibilizar este fluxo quando Setor = Financeiro"
      }
    },
    {
      "id": "TI-CAM-001",
      "area": "TI",
      "need": "CÂMERAS > Acesso às Câmeras",
      "path": [
        "CÂMERAS",
        "Acesso às Câmeras"
      ],
      "keywords": [
        "câmera",
        "cameras",
        "acesso câmera",
        "gravação câmera",
        "infantil"
      ],
      "fields": [
        {
          "id": "aluno",
          "label": "Nome do aluno",
          "type": "text",
          "required": true
        },
        {
          "id": "turma",
          "label": "Turma do aluno",
          "type": "text",
          "required": true
        },
        {
          "id": "responsavel",
          "label": "Nome do responsável",
          "type": "text",
          "required": true
        },
        {
          "id": "email-responsavel",
          "label": "E-mail do responsável",
          "type": "email",
          "required": true
        },
        {
          "id": "contato-responsavel",
          "label": "Contato do responsável",
          "type": "tel",
          "required": true
        }
      ],
      "sectors": [
        "Coordenação EI (Infantil)"
      ],
      "source": {
        "question": "A solicitação é para acesso às câmeras do Infantil?",
        "complementary": "Qual é o nome e turma do aluno?",
        "data": "Nome e turma do aluno, nome do responsável, e-mail do responsável, contato do responsável",
        "rule": "Disponibilizar quando Setor = Coordenação EI (Infantil)"
      }
    }
  ],
  "rules": [
    {
      "": "0",
      "ID": "RC-001",
      "Gatilho": "Evento",
      "Condição": "Evento = Sim",
      "Ação": "Solicitar informações adicionais do evento",
      "Campos adicionais": "Data, horário, local e link do roteiro",
      "Origem / observação": "Regra existente nos formulários de Audiovisual/TI"
    },
    {
      "": "1",
      "ID": "RC-002",
      "Gatilho": "Setor Financeiro",
      "Condição": "Setor = Financeiro e relato relacionado a QuickBooks",
      "Ação": "Abrir fluxo específico de QuickBooks",
      "Campos adicionais": "Erro no sistema ou Instalação",
      "Origem / observação": "Regra existente no formulário de TI"
    },
    {
      "": "2",
      "ID": "RC-003",
      "Gatilho": "Coordenação EI",
      "Condição": "Setor = Coordenação EI (Infantil) e solicitação relacionada às câmeras",
      "Ação": "Abrir fluxo Acesso às Câmeras",
      "Campos adicionais": "Aluno/turma, responsável, e-mail e contato",
      "Origem / observação": "Regra existente no formulário de TI"
    },
    {
      "": "3",
      "ID": "RC-004",
      "Gatilho": "Reserva de Chromebook",
      "Condição": "Necessidade = Reserva de Chromebook",
      "Ação": "Solicitar data da reserva",
      "Campos adicionais": "Data",
      "Origem / observação": "Regra existente no formulário Google"
    },
    {
      "": "4",
      "ID": "RC-005",
      "Gatilho": "Resetar senha",
      "Condição": "Necessidade = Resetar senha",
      "Ação": "Solicitar conta afetada",
      "Campos adicionais": "E-mail",
      "Origem / observação": "Regra existente no formulário Google"
    },
    {
      "": "5",
      "ID": "RC-006",
      "Gatilho": "Toner / Tinta",
      "Condição": "Necessidade = Solicitação de Toner / Tinta",
      "Ação": "Solicitar dados do suprimento",
      "Campos adicionais": "Cor e modelo da impressora",
      "Origem / observação": "Regra existente no formulário Impressora"
    },
    {
      "": "6",
      "ID": "RC-007",
      "Gatilho": "Classificação incerta",
      "Condição": "SmartDesk detectar duas ou mais classificações plausíveis",
      "Ação": "Não decidir silenciosamente; perguntar ao usuário",
      "Campos adicionais": "Pergunta de desambiguação",
      "Origem / observação": "Regra proposta pelo SmartDesk"
    },
    {
      "": "7",
      "ID": "RC-008",
      "Gatilho": "Baixa confiança",
      "Condição": "Descrição sem informações suficientes",
      "Ação": "Solicitar mais contexto antes de classificar",
      "Campos adicionais": "Equipamento/sistema, sintoma e local",
      "Origem / observação": "Regra proposta pelo SmartDesk"
    },
    {
      "": "8",
      "ID": "RC-009",
      "Gatilho": "Problema resolvido",
      "Condição": "Usuário informar que a orientação resolveu",
      "Ação": "Encerrar fluxo sem gerar chamado",
      "Campos adicionais": "Registrar resultado da tentativa",
      "Origem / observação": "Regra proposta pelo SmartDesk"
    },
    {
      "": "9",
      "ID": "RC-010",
      "Gatilho": "Problema persiste",
      "Condição": "Usuário informar que a orientação não resolveu",
      "Ação": "Gerar resumo estruturado para o suporte",
      "Campos adicionais": "Categoria, necessidade, relato e testes realizados",
      "Origem / observação": "Regra proposta pelo SmartDesk"
    }
  ]
};
