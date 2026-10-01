var SMARTDESK_SCHEMA = {
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
      ]
    },
    {
      "id": "AV-002",
      "area": "Audiovisual",
      "need": "Caixa de Som / Microfone",
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
      ]
    },
    {
      "id": "AV-003",
      "area": "Audiovisual",
      "need": "Caixa de Som / Microfone / Projetor",
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
      ]
    },
    {
      "id": "AV-004",
      "area": "Audiovisual",
      "need": "Caixa de Som / Projetor",
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
      ]
    },
    {
      "id": "AV-005",
      "area": "Audiovisual",
      "need": "Microfone",
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
      ]
    },
    {
      "id": "AV-006",
      "area": "Audiovisual",
      "need": "Projetor",
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
      ]
    },
    {
      "id": "AV-007",
      "area": "Audiovisual",
      "need": "Troca de cabo HDMI",
      "fields": [
        {
          "id": "descricao-do-problema",
          "label": "Descrição do problema",
          "type": "text",
          "required": true
        }
      ]
    },
    {
      "id": "IMP-001",
      "area": "Impressora",
      "need": "Configurar Scanner",
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
        }
      ]
    },
    {
      "id": "IMP-002",
      "area": "Impressora",
      "need": "Grampo da Impressora",
      "fields": [
        {
          "id": "modelo",
          "label": "Modelo da impressora",
          "type": "text",
          "required": true
        }
      ]
    },
    {
      "id": "IMP-003",
      "area": "Impressora",
      "need": "Instalar Impressora",
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
        }
      ]
    },
    {
      "id": "IMP-004",
      "area": "Impressora",
      "need": "Lâmpada da Estufa",
      "fields": [
        {
          "id": "modelo",
          "label": "Modelo da impressora",
          "type": "text",
          "required": true
        },
        {
          "id": "erro-apresentado",
          "label": "Erro apresentado",
          "type": "text",
          "required": true
        }
      ]
    },
    {
      "id": "IMP-005",
      "area": "Impressora",
      "need": "Manchando folhas",
      "fields": [
        {
          "id": "modelo",
          "label": "Modelo da impressora",
          "type": "text",
          "required": true
        }
      ]
    },
    {
      "id": "IMP-006",
      "area": "Impressora",
      "need": "Não imprime",
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
          "id": "mensagem-de-erro",
          "label": "Mensagem de erro",
          "type": "text",
          "required": true
        }
      ]
    },
    {
      "id": "IMP-007",
      "area": "Impressora",
      "need": "Não liga",
      "fields": [
        {
          "id": "modelo",
          "label": "Modelo da impressora",
          "type": "text",
          "required": true
        }
      ]
    },
    {
      "id": "IMP-008",
      "area": "Impressora",
      "need": "Papel Atolado",
      "fields": [
        {
          "id": "modelo",
          "label": "Modelo da impressora",
          "type": "text",
          "required": true
        },
        {
          "id": "mensagem-do-visor",
          "label": "Mensagem do visor",
          "type": "text",
          "required": true
        }
      ]
    },
    {
      "id": "IMP-009",
      "area": "Impressora",
      "need": "Scanner não funciona",
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
          "id": "erro",
          "label": "Erro",
          "type": "text",
          "required": true
        }
      ]
    },
    {
      "id": "IMP-010",
      "area": "Impressora",
      "need": "Solicitação de Toner / Tinta",
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
        }
      ]
    },
    {
      "id": "GOO-001",
      "area": "Google",
      "need": "Agendas",
      "fields": [
        {
          "id": "conta",
          "label": "E-mail da conta envolvida",
          "type": "email",
          "required": true
        }
      ]
    },
    {
      "id": "GOO-002",
      "area": "Google",
      "need": "Apresentações",
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
      ]
    },
    {
      "id": "GOO-003",
      "area": "Google",
      "need": "Classroom",
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
      ]
    },
    {
      "id": "GOO-004",
      "area": "Google",
      "need": "Documentos",
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
      ]
    },
    {
      "id": "GOO-005",
      "area": "Google",
      "need": "Drive",
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
      ]
    },
    {
      "id": "GOO-006",
      "area": "Google",
      "need": "Dúvidas",
      "fields": [
        {
          "id": "conta",
          "label": "E-mail da conta envolvida",
          "type": "email",
          "required": true
        }
      ]
    },
    {
      "id": "GOO-007",
      "area": "Google",
      "need": "Gmail",
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
      ]
    },
    {
      "id": "GOO-008",
      "area": "Google",
      "need": "Grupos",
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
      ]
    },
    {
      "id": "GOO-009",
      "area": "Google",
      "need": "Planilhas",
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
      ]
    },
    {
      "id": "GOO-010",
      "area": "Google",
      "need": "Reserva de Chromebook",
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
      ]
    },
    {
      "id": "GOO-011",
      "area": "Google",
      "need": "Resetar senha",
      "fields": [
        {
          "id": "e-mail-da-conta",
          "label": "E-mail da conta envolvida",
          "type": "email",
          "required": true
        }
      ]
    },
    {
      "id": "GOO-012",
      "area": "Google",
      "need": "Sites",
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
      ]
    },
    {
      "id": "TI-001",
      "area": "TI",
      "need": "Dúvidas",
      "fields": []
    },
    {
      "id": "TI-002",
      "area": "TI",
      "need": "Sugestão de melhoria",
      "fields": [
        {
          "id": "sistema-processo",
          "label": "Sistema/processo",
          "type": "text",
          "required": true
        }
      ]
    },
    {
      "id": "TI-003",
      "area": "TI",
      "need": "Outros",
      "fields": []
    },
    {
      "id": "TI-COMP-001",
      "area": "TI",
      "need": "COMPUTADOR > Headset / Fone de Ouvido",
      "fields": [
        {
          "id": "computador",
          "label": "Identificação do computador",
          "type": "text",
          "required": true
        }
      ]
    },
    {
      "id": "TI-COMP-002",
      "area": "TI",
      "need": "COMPUTADOR > Leitor de CD/DVD",
      "fields": [
        {
          "id": "computador",
          "label": "Identificação do computador",
          "type": "text",
          "required": true
        }
      ]
    },
    {
      "id": "TI-COMP-003",
      "area": "TI",
      "need": "COMPUTADOR > Não liga",
      "fields": [
        {
          "id": "equipamento",
          "label": "Identificação do equipamento",
          "type": "text",
          "required": true
        }
      ]
    },
    {
      "id": "TI-COMP-004",
      "area": "TI",
      "need": "COMPUTADOR > Problemas com lentidão",
      "fields": [
        {
          "id": "computador",
          "label": "Identificação do computador",
          "type": "text",
          "required": true
        }
      ]
    },
    {
      "id": "TI-COMP-005",
      "area": "TI",
      "need": "COMPUTADOR > Programas (software)",
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
      ]
    },
    {
      "id": "TI-COMP-006",
      "area": "TI",
      "need": "COMPUTADOR > Reserva de Notebook",
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
      ]
    },
    {
      "id": "TI-COMP-007",
      "area": "TI",
      "need": "COMPUTADOR > Troca de Mouse",
      "fields": [
        {
          "id": "computador",
          "label": "Identificação do computador",
          "type": "text",
          "required": true
        }
      ]
    },
    {
      "id": "TI-COMP-008",
      "area": "TI",
      "need": "COMPUTADOR > Troca de Teclado",
      "fields": [
        {
          "id": "computador",
          "label": "Identificação do computador",
          "type": "text",
          "required": true
        }
      ]
    },
    {
      "id": "TI-NET-001",
      "area": "TI",
      "need": "INTERNET > Computador não está conectado à rede",
      "fields": [
        {
          "id": "computador",
          "label": "Identificação do computador",
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
      ]
    },
    {
      "id": "TI-NET-002",
      "area": "TI",
      "need": "INTERNET > Criar Login de acesso Internet",
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
      ]
    },
    {
      "id": "TI-NET-003",
      "area": "TI",
      "need": "INTERNET > Problemas com Wi-Fi",
      "fields": [
        {
          "id": "dispositivo",
          "label": "Dispositivo",
          "type": "text",
          "required": true
        },
        {
          "id": "rede",
          "label": "Rede",
          "type": "text",
          "required": true
        }
      ]
    },
    {
      "id": "TI-INT-001",
      "area": "TI",
      "need": "INTRANET > Atualização",
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
      ]
    },
    {
      "id": "TI-INT-002",
      "area": "TI",
      "need": "INTRANET > Solicitação",
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
      ]
    },
    {
      "id": "TI-INT-003",
      "area": "TI",
      "need": "INTRANET > Sugestão",
      "fields": []
    },
    {
      "id": "TI-MENT-001",
      "area": "TI",
      "need": "MENTOR WEB > Criação de Login",
      "fields": [
        {
          "id": "perfil",
          "label": "Perfil",
          "type": "text",
          "required": true
        }
      ]
    },
    {
      "id": "TI-MENT-002",
      "area": "TI",
      "need": "MENTOR WEB > Erro no relatório",
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
      ]
    },
    {
      "id": "TI-MENT-003",
      "area": "TI",
      "need": "MENTOR WEB > Alteração de notas",
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
      ]
    },
    {
      "id": "TI-MENT-004",
      "area": "TI",
      "need": "MENTOR WEB > Encerramento de diário",
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
      ]
    },
    {
      "id": "TI-MENT-005",
      "area": "TI",
      "need": "MENTOR WEB > Erro no sistema",
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
      ]
    },
    {
      "id": "TI-MENT-006",
      "area": "TI",
      "need": "MENTOR WEB > Remanejamento de aluno",
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
      ]
    },
    {
      "id": "TI-MENT-007",
      "area": "TI",
      "need": "MENTOR WEB > Solicitação de Relatório",
      "fields": [
        {
          "id": "descricao-do-relatorio",
          "label": "Descrição do relatório",
          "type": "text",
          "required": true
        }
      ]
    },
    {
      "id": "TI-MENT-008",
      "area": "TI",
      "need": "MENTOR WEB > Solicitação de acesso a relatório",
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
      ]
    },
    {
      "id": "TI-QB-001",
      "area": "TI",
      "need": "QUICKBOOKS > Erro no sistema",
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
      ]
    },
    {
      "id": "TI-QB-002",
      "area": "TI",
      "need": "QUICKBOOKS > Instalação",
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
      ]
    },
    {
      "id": "TI-CAM-001",
      "area": "TI",
      "need": "CÂMERAS > Acesso às Câmeras",
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
      ]
    }
  ]
};
