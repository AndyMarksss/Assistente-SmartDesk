"use strict";
(function (desk) {
  const tool = (item) => item.path?.[item.path.length - 1] || item.need;
  function opening(item) {
    if (item.id === "AV-007")
      return "Entendi. Vamos registrar o problema com o cabo HDMI para a equipe verificar.";
    if (item.area === "Audiovisual")
      return "Vamos combinar os detalhes para a equipe preparar os equipamentos no dia certo.";
    if (item.area === "Impressora")
      return item.id === "IMP-010"
        ? "Vamos separar as informações do toner ou da tinta que você precisa."
        : "Vamos olhar essa questão da impressora. Primeiro, preciso de alguns detalhes para a equipe saber por onde começar.";
    if (item.area === "Google")
      return (
        "Vamos ver essa questão no " +
        tool(item) +
        ". Me passe alguns detalhes para a equipe encontrar o que está acontecendo."
      );
    if (desk.requestPolicy.asksEquipmentIntent(item))
      return "Certo. Antes dos detalhes, me ajuda a entender o que você precisa com esse equipamento.";
    if (item.need.includes("Reserva"))
      return "Vamos organizar essa reserva. Me diga quando você vai precisar do equipamento.";
    return "Entendi. Vou te fazer algumas perguntas para a equipe conseguir avaliar isso com você.";
  }
  const prompts = {
    "descricao-do-problema":
      "O que acontece quando você usa o cabo HDMI? Conte também em qual sala ou equipamento ele está conectado.",
    modelo: "Qual é o modelo da impressora? Costuma estar escrito na frente dela.",
    cor: "Qual cor de toner ou tinta você precisa?",
    data: "Em qual dia você vai precisar? Digite a data ou toque no calendário.",
    horario: "E a que horas? Digite o horário, por exemplo 09:30, ou toque no relógio.",
    evento: "Você vai usar os equipamentos em um evento?",
    roteiro:
      "Tem o link do roteiro do evento? Cole aqui para a equipe se preparar. Se ainda não estiver pronto, pode enviar depois.",
    "mensagem-do-visor":
      "O que o visor da impressora mostra agora? Às vezes ele indica a bandeja ou um código, como “Atolamento bandeja 2”.",
    "mensagem-de-erro": "Aparece alguma mensagem de erro? Me diga o que ela diz.",
    "erro-apresentado":
      "O que acontece quando você tenta usar? Se aparecer um erro, me diga o texto da mensagem.",
    erro: "Que erro aparece? Pode descrever com suas palavras.",
    conta: "Em qual conta Google isso acontece?",
    "e-mail-da-conta":
      "De qual conta você precisa recuperar o acesso? Informe só o e-mail, nunca a senha.",
    "link-ou-nome-do-arquivo": "Qual arquivo está envolvido? Pode mandar o link ou o nome dele.",
    arquivo: "Qual documento está envolvido? Me passe o nome ou o link.",
    "link-ou-nome-do-recurso":
      "Qual pasta ou arquivo do Drive está envolvido? Pode informar o nome ou o link.",
    "link-ou-nome-da-planilha": "Qual planilha está envolvida? Me passe o nome ou o link.",
    "link-ou-nome-do-site": "Em qual site isso acontece? Pode informar o nome ou o endereço.",
    turma: "Qual é a turma?",
    grupo: "Qual é o grupo envolvido?",
    periodo: "Em qual período você vai precisar?",
    "horario-periodo": "Em qual horário ou período você vai precisar?",
    programa: "Qual programa está envolvido?",
    equipamento: "Qual equipamento não liga? Diga onde ele fica e, se souber, o modelo.",
    "tipo-de-conexao": "Esse computador usa cabo de rede ou Wi-Fi?",
    dispositivo: "Em qual dispositivo o Wi-Fi está dando problema?",
    rede: "Qual é o nome da rede Wi-Fi?",
    finalidade: "Para que você precisa desse acesso?",
    "sistema-processo": "Qual sistema ou processo você gostaria de melhorar?",
    "pagina-secao": "Qual página ou seção precisa ser atualizada?",
    "conteudo-novo": "O que você gostaria de colocar nessa página?",
    secao: "Em qual seção da intranet você precisa de ajuda?",
    "arquivos-links": "Quais arquivos ou links fazem parte dessa solicitação?",
    perfil: "Qual perfil de acesso essa pessoa precisa?",
    relatorio: "Qual relatório está envolvido?",
    "descricao-do-relatorio": "Que informações você precisa nesse relatório?",
    usuario: "Qual usuário está com essa dificuldade? Informe o login, sem enviar a senha.",
    "aluno-turma": "Qual é o aluno e a turma envolvidos?",
    aluno: "Qual é o nome do aluno?",
    disciplina: "Qual é a disciplina?",
    "turma-atual": "Em qual turma o aluno está agora?",
    "turma-destino": "Para qual turma ele vai?",
    responsavel: "Qual é o nome do responsável?",
    "email-responsavel": "Qual é o e-mail do responsável?",
    "contato-responsavel": "Qual telefone a equipe pode usar para falar com o responsável?",
  };
  function field(item, f) {
    if (f.id === "data" && item.area === "Audiovisual")
      return "Para qual dia vamos preparar os equipamentos? Digite a data ou toque no calendário.";
    return (
      prompts[f.id] ||
      "Pode me informar " + f.label.charAt(0).toLowerCase() + f.label.slice(1) + "?"
    );
  }
  // Respostas rápidas ao lado do campo: evitam digitar o óbvio e fecham caminhos sem saída.
  function quickReplies(item, f, context = {}) {
    const PENDING = desk.chatFormat?.PENDING_LINK || "Ainda não informado";
    if (f.id === "modelo")
      return [{ label: "Não sei o modelo", value: "Não sei", icon: "fa-question" }];
    if (f.id === "mensagem-do-visor")
      return [
        { label: "Não aparece nada", value: "Não aparece nada", icon: "fa-ban" },
        {
          label: "A impressora não tem visor",
          value: "A impressora não tem visor",
          icon: "fa-print",
        },
      ];
    if (["mensagem-de-erro", "erro", "erro-apresentado"].includes(f.id))
      return [{ label: "Não aparece mensagem", value: "Não aparece mensagem", icon: "fa-ban" }];
    if (["conta", "e-mail-da-conta"].includes(f.id) && context.email)
      return [
        { label: "Minha conta (" + context.email + ")", value: context.email, icon: "fa-user" },
      ];
    if (f.id === "roteiro")
      return [{ label: "Enviar o link depois", value: PENDING, icon: "fa-clock" }];
    if (f.id === "dispositivo")
      return ["Notebook", "Celular", "Chromebook", "Computador"].map((value) => ({
        label: value,
        value,
        icon: "fa-laptop",
      }));
    return [];
  }
  // Quando a necessidade já diz o problema, os detalhes extras são opcionais.
  const OPTIONAL_DETAILS = [
    "IMP-002",
    "IMP-004",
    "IMP-005",
    "IMP-006",
    "IMP-007",
    "IMP-008",
    "IMP-009",
    "IMP-010",
    "GOO-011",
    "TI-COMP-001",
    "TI-COMP-002",
    "TI-COMP-003",
    "TI-COMP-004",
    "TI-COMP-006",
    "TI-COMP-007",
    "TI-COMP-008",
    "TI-NET-001",
    "TI-NET-003",
  ];
  const detailsOptional = (item, intent = "") =>
    OPTIONAL_DETAILS.includes(item.id) && intent !== "purchase";
  function description(item, intent = "") {
    if (intent === "purchase")
      return "Qual item você quer solicitar e para qual atividade? Conte o que ele precisa ter para te ajudar no trabalho.";
    if (detailsOptional(item, intent))
      return "Quer acrescentar algum detalhe para a equipe? Por exemplo, desde quando acontece ou se já tentou algo. Se não tiver, toque em “Sem mais detalhes”.";
    if (item.id === "AV-007")
      return "Quer ajustar o relato? Conte o que acontece com o cabo HDMI e onde ele está conectado.";
    if (item.need.includes("Reserva") || item.area === "Audiovisual")
      return "Como vai ser o uso? Conte o local, a atividade e para quantas pessoas, para a equipe preparar tudo.";
    if (item.area === "Impressora")
      return "Me conta o que você precisa com a impressora e onde ela fica.";
    if (item.area === "Google")
      return "O que você está tentando fazer e o que acontece nessa hora? Conte com suas palavras; não precisa usar termos técnicos.";
    if (desk.requestPolicy.requestKind(item, intent) === "solicitação")
      return "Conte o que você precisa e para quando, com os detalhes que ajudam a equipe a atender.";
    return "Agora, me conta um pouco mais: o que aconteceu ou o que você precisa? Se puder, diga desde quando e como isso afeta seu trabalho.";
  }
  // Texto montado quando a pessoa não quer acrescentar nada: necessidade + dados informados.
  function autoDescription(item, answers) {
    const parts = (item.fields || [])
      .filter((f) => answers[f.id] && f.id !== "computador")
      .map((f) => f.label + ": " + desk.chatFormat.formatValue(f, answers[f.id]));
    return (item.need + (parts.length ? ". " + parts.join("; ") : "") + ".").replace(/\.\.$/, ".");
  }
  desk.conversationCopy = {
    opening,
    field,
    description,
    quickReplies,
    detailsOptional,
    autoDescription,
  };
})((window.SmartDesk = window.SmartDesk || {}));
