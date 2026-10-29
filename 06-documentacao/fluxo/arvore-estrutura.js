"use strict";
// Estrutura da árvore de decisões completa do SmartDesk 0.12.18, usada pelos dois desenhos:
// arvore-completa.html (horizontal) e arvore-vertical.html. Os 57 tipos de pedido vêm do bloco
// "passos" de cada página (gerar-caminhos.cjs); o resto foi tirado de app.js e request-policy.js.
// N = um nó; Seq = blocos em sequência; Par = um nó de decisão com ramos que depois convergem.
// vgap só vale no horizontal; wrap: true deixa o vertical quebrar os ramos em linhas.
window.ARVORE = (function () {
  const passos = JSON.parse(document.getElementById("passos").textContent);
  const N = (kind, title, sub, o = {}) => ({ t: "node", kind, title, sub, ...o });
  const Seq = (...items) => ({ t: "seq", items: items.flat().filter(Boolean) });
  const Par = (dec, branches, o = {}) => ({ t: "par", dec, branches: branches.map((b) => (b.block ? b : { block: b })), ...o });
  const L = (label, block) => ({ label, block });
  const opt = (text, sub, o) => N("opt", text, sub, o);
  const ref = (text) => N("ref", text);

  // ------------------------------------------------------------ 57 caminhos
  const flagText = (n) =>
    [n.setores ? "só " + n.setores.join(", ") : "", n.descricaoOpcional ? "descrição opcional" : "", n.tipo].filter(Boolean).join(" · ");
  const control = (c) => {
    const quick = c.rapidas && c.rapidas.length ? " · ou: " + c.rapidas.join(" / ") : "";
    if (c.tipo === "date") return "📅 calendário · Hoje / Amanhã / próximos dias úteis";
    if (c.tipo === "time") return "🕘 relógio ou HH:MM · para hoje, só horário que não passou";
    if (c.tipo === "url") return "⌨ link" + quick;
    if (c.tipo === "email") return "⌨ e-mail" + quick;
    if (c.tipo === "tel") return "⌨ telefone com DDD";
    return "⌨ digitação" + quick;
  };
  const plain = (p) => (Array.isArray(p) ? p.map((x) => x.se + ": " + x.texto).join(" | ") : p);
  function quemUsa(n, variant) {
    const hw = n.defeitoOuNovo;
    const title = hw ? (variant === "novo" ? "Quem vai usar o item novo?" : "Quem usa o equipamento?") : "Quem usa o computador?";
    const mine = hw ? (variant === "novo" ? "É para mim" : "Eu uso esse equipamento") : "Eu uso este computador";
    return Par(N("dec", title, "", { tip: title }), [
      opt(mine),
      Seq(opt("Outra pessoa"), N("step", "Nome e sobrenome de quem usa", "⌨ digitação")),
      Seq(opt("Uso compartilhado"), N("step", "Onde fica o equipamento?", "⌨ digitação")),
    ]);
  }
  function fieldBlock(n, c, variant) {
    if (c.tipo === "computador") return quemUsa(n, variant);
    if (c.opcoes) {
      const deps = n.campos.filter((d) => d.se && d.se.campo === c.id);
      return Par(
        N("dec", c.rotulo, "", { tip: plain(c.pergunta) }),
        c.opcoes.map((o) => {
          const mine = deps.filter((d) => d.se.valor === o.botao);
          return mine.length ? Seq(opt(o.botao), ...mine.map((d) => fieldBlock(n, d, variant))) : opt(o.botao);
        }),
      );
    }
    return N("step", c.rotulo, control(c), { tip: plain(c.pergunta) });
  }
  function descBlock(n, variant) {
    const d = n.descricao;
    if (!d) return null;
    if (variant === "novo") return N("step", "Descrição do item novo", "⌨ obrigatória", { tip: d.compra });
    if (d.opcional)
      return Par(N("dec", "Descrição (opcional)", "", { tip: d.pergunta }), [
        opt("Escreve detalhes"),
        Seq(opt("Sem mais detalhes"), N("sys", "Descrição automática", "necessidade + dados")),
      ]);
    return N("step", "Descrição", "⌨ obrigatória · no relato com IA, só se faltar algo", { tip: d.pergunta });
  }
  const chain = (n, variant) => [...n.campos.filter((c) => !c.se).map((c) => fieldBlock(n, c, variant)), descBlock(n, variant)];
  function needBlock(n) {
    const head = N("need", n.nome, "", { id: "need-" + n.id, need: n, flags: flagText(n), tip: n.abertura });
    if (!n.intencao) return Seq(head, ...chain(n, ""));
    return Seq(
      head,
      Par(N("rule dec", "Defeito ou item novo?", "", { tip: n.intencao.pergunta }), [
        Seq(opt("Meu item está com defeito"), ...chain(n, "defeito")),
        Seq(opt("Quero um item novo ou diferente"), ...chain(n, "novo")),
      ]),
    );
  }
  const of = (area, grupo) => passos.filter((n) => n.area === area && (grupo === undefined || n.grupo === grupo));
  const needsPar = (title, list) => Par(N("dec", title, list.length + (list.length > 1 ? " opções" : " opção")), list.map(needBlock), { vgap: 16, wrap: true });
  const tiGroups = ["Computador", "Internet", "Intranet", "Mentor Web", "QuickBooks", "Câmeras"];
  const restricted = { QuickBooks: "só Financeiro", Câmeras: "só Coordenação EI (Infantil)" };

  // ------------------------------------------------------------ faixa 1: início → 57 caminhos
  const faixa1 = Seq(
    Par(N("start", "Boas-vindas", "quadro de boas-vindas e saudação", { id: "inicio" }), [
      Seq(opt("Como funciona?"), N("sys", "Três mensagens explicam o atendimento"), ref("↺ volta às opções")),
      Seq(
        opt("Acompanhar um chamado"),
        N("step", "Número do chamado", "⌨ ex.: #012", { tip: "Vamos consultar seu chamado. Qual é o número dele? Ele aparece no comprovante, por exemplo #012." }),
        N("step", "E-mail usado na abertura", "⌨ e-mail · ou: Usar {e-mail}", { tip: "E qual e-mail você usou ao abrir o chamado? Ele confirma que o chamado é seu." }),
        Par(N("sys dec", "Encontrou?", "consulta número + e-mail"), [opt("Sim: etapa, área e categoria"), opt("Não encontrou")]),
        Par(N("dec", "E agora?"), [
          Seq(
            opt("Abrir um novo chamado"),
            Par(N("sys dec", "Tem dados salvos?", "neste dispositivo"), [
              Seq(opt("Não"), ref("→ Nome e sobrenome")),
              Seq(
                opt("Sim"),
                Par(N("dec", "Usar os dados salvos?", "Seus dados estão salvos neste dispositivo…"), [
                  Seq(opt("Continuar como {Andy}"), ref("→ Qual tipo de ajuda?")),
                  Seq(opt("Sou outra pessoa"), N("sys", "Apaga os dados salvos"), ref("→ Nome e sobrenome")),
                ]),
              ),
            ]),
          ),
          Seq(opt("Consultar outro chamado"), ref("↺ Número do chamado")),
        ]),
      ),
      Seq(
        opt("Sim, vamos começar", "sem dados salvos"),
        N("step", "Nome e sobrenome", "⌨ digitação", { id: "nome", tip: "Vamos começar por você: qual é seu nome e sobrenome?" }),
        N("step", "E-mail institucional", "⌨ e-mail", { tip: "Qual é o seu e-mail institucional? Vamos guardá-lo para o retorno deste chamado." }),
        N("step", "Setor", "lista com busca (25 setores)", { tip: "Agora, em qual setor você trabalha?" }),
      ),
      Seq(opt("Continuar como {Andy}", "com dados salvos"), N("sys", "Usa nome, e-mail e setor salvos")),
      Seq(opt("Sou outra pessoa", "com dados salvos"), N("sys", "Apaga os dados salvos"), ref("→ Nome e sobrenome")),
    ]),
    Par(N("dec", "Qual tipo de ajuda?", "área pelos botões ou relato livre", { id: "tipo", tip: "Qual tipo de ajuda você precisa? Escolha a área ou conte com suas palavras." }), [
      Seq(
        opt("✦ Descrever com minhas palavras"),
        N("ai", "Relato livre", "⌨ o que, quando e onde", { tip: "Conte com suas palavras o que você precisa: o que aconteceu ou o que vai acontecer, quando e onde. Eu monto o rascunho do chamado e você confere antes de seguir." }),
        Par(N("ai dec", "IA identifica o tipo", "até 3, só os permitidos ao setor"), [
          Seq(
            opt("Identificou"),
            N("ai", "IA monta o rascunho", "preenche os dados ditos, diz o que entendeu e confere se o relato responde à pergunta de descrição", { id: "rascunho" }),
            Par(N("ai dec", "Outro pedido no relato?", "um chamado para cada pedido"), [
              opt("Não"),
              Seq(opt("Sim"), N("ai", "Avisa: este primeiro, o outro depois do envio", "Você também contou outro pedido…")),
            ]),
            Par(N("ai dec", "Rascunho para conferir", "Entendi: {o que a pessoa precisa}. Montei este rascunho…"), [
              Seq(
                opt("Está certo, continuar"),
                Par(N("ai dec", "Defeito simples com dicas?", "antes dos dados: se resolver, não preenche nada"), [
                  Seq(
                    opt("Sim"),
                    N("ai", "Passos seguros para tentar", "1 a 3 passos, sem ferramentas"),
                    Par(N("dec", "Os passos resolveram?"), [
                      Seq(opt("Resolveu! Não preciso do chamado"), ref("→ Fim sem chamado, com a nota de facilidade (faixa 2)")),
                      Seq(opt("Não resolveu, completar o chamado"), ref("→ dados que faltam da necessidade")),
                    ]),
                  ),
                  Seq(opt("Não"), ref("→ dados que faltam da necessidade")),
                ]),
              ),
              Seq(opt("Corrigir os dados"), ref("→ todos os dados da necessidade, preenchidos")),
              Seq(opt("Na verdade é: {outra sugestão}"), ref("↺ IA monta o rascunho")),
              Seq(opt("Escolher pelas opções"), ref("↺ Qual tipo de ajuda?")),
            ]),
          ),
          Seq(
            opt("IA indisponível"),
            Par(N("rule dec", "Sugestões por palavras-chave", "até 3 da Matriz Mestre"), [
              Seq(opt("Escolhe uma"), ref("→ dados da necessidade (pula a descrição)")),
              Seq(opt("Escolher pelas opções"), ref("↺ Qual tipo de ajuda?")),
            ]),
          ),
          Seq(
            opt("Não identificou"),
            Par(N("rule dec", "Para onde orientar?", "relato sem caminho da TI"), [
              Seq(opt("Assunto de outra equipe", "manutenção, RH, Secretaria ou Financeiro"), N("sys", "Indica a equipe certa"), ref("↺ Qual tipo de ajuda? (relato guardado)")),
              Seq(
                opt("Atendimento de outro setor", "ex.: QuickBooks, só Financeiro"),
                Par(N("dec", "O setor está certo?"), [
                  Seq(opt("Corrigir meu setor"), N("step", "Setor", "lista com busca"), ref("↺ IA identifica o tipo")),
                  Seq(opt("Escolher pelas opções"), ref("↺ Qual tipo de ajuda?")),
                ]),
              ),
              Seq(opt("Nenhum dos dois"), ref("↺ Qual tipo de ajuda? (relato guardado)")),
            ]),
          ),
        ]),
      ),
      Seq(opt("Audiovisual"), needsPar("Qual necessidade?", of("Audiovisual"))),
      Seq(opt("Impressora"), needsPar("Qual necessidade?", of("Impressora"))),
      Seq(opt("Google"), needsPar("Qual necessidade?", of("Google"))),
      Seq(
        opt("TI"),
        Par(N("dec", "Qual opção de TI?", "só as permitidas ao setor"), [
          ...of("TI", "").map(needBlock),
          ...tiGroups.map((g) => Seq(opt(g, restricted[g]), needsPar("Qual necessidade?", of("TI", g)))),
        ], { vgap: 16, wrap: true }),
      ),
    ], { wrap: true }),
  );

  // ------------------------------------------------------------ faixa 2: conferências e revisão da IA
  const faixa2 = Seq(
    Par(N("ai dec", "O relato responde à pergunta de descrição?", "só no relato com IA; a IA conferiu no rascunho", { id: "complemento" }), [
      opt("Sim, ou caminho pelos botões"),
      Seq(
        opt("Não, ou a IA não conferiu"),
        N("step", "Complemento: a pergunta de descrição do caminho", "⌨ a mesma dos botões · ou: Já contei tudo", { tip: "Para completar o chamado, mais um detalhe. Como vai ser o uso? Conte o local, a atividade e para quantas pessoas, para a equipe preparar tudo." }),
      ),
    ]),
    Par(N("rule dec", "Conferências do pedido", "regra fixa, sem IA", { id: "conferencias" }), [
      Seq(
        opt("Citou outro equipamento", "só Audiovisual"),
        Par(N("rule dec", "Mudar o pedido?", "Você também citou {microfone}…"), [Seq(opt("Mudar para a combinação"), N("sys", "Pergunta os dados que faltam"), ref("↺ Conferências")), opt("Manter")]),
      ),
      Seq(
        opt("Relato fala em evento com “Não”"),
        Par(N("rule dec", "É para um evento?", "No seu relato aparece um evento…"), [Seq(opt("Sim, é para um evento"), N("sys", "Pergunta o link do roteiro"), ref("↺ Conferências")), opt("Não é um evento")]),
      ),
      opt("Nada a conferir"),
    ]),
    Par(N("ai dec", "IA confere o chamado", "recebe o que já foi respondido; nunca nome, e-mail ou anexos", { id: "ia" }), [
      Seq(opt("IA indisponível"), ref("→ pula para Compra ou item novo?")),
      Seq(
        opt("Relato não combina com o tipo"),
        Par(N("ai dec", "Alerta: escolher outro tipo?", "Antes de continuar, uma conferência…"), [Seq(opt("Escolher outro tipo"), ref("↺ Qual tipo de ajuda?")), opt("Está certo assim")]),
      ),
      opt("Combina"),
    ]),
    Par(N("ai dec", "Falta algo essencial?", "pergunta repetida é descartada pelo servidor"), [
      Seq(
        opt("Sim: uma pergunta"),
        Par(N("dec", "Resposta à pergunta da IA"), [
          Seq(opt("Responder"), N("sys", "Entra na descrição", "e as conferências rodam de novo")),
          Seq(opt("Não sei"), N("sys", "“Não soube informar.”", "e as conferências rodam de novo")),
          opt("Pular esta pergunta"),
        ]),
      ),
      opt("Não: sem pergunta"),
    ]),
    Par(N("ai dec", "Defeito simples com dicas?", "28 caminhos; nunca item novo; não repete as dicas do rascunho"), [
      Seq(
        opt("Sim"),
        N("ai", "Passos seguros para tentar", "1 a 3 passos, sem ferramentas"),
        Par(N("dec", "Os passos resolveram?"), [
          Seq(
            opt("Resolveu! Não preciso do chamado"),
            N("end", "Fim sem chamado", "registrado como “Resolvi sozinho”", { id: "resolveu" }),
            Par(N("dec", "Quão fácil foi resolver?", "nota de 1 a 5 · uma vez por conversa"), [
              Seq(opt("Nota de 1 a 5"), N("step", "Comentário", "⌨ opcional · ou: Nada a acrescentar")),
              opt("Prefiro não responder"),
            ]),
            Par(N("dec", "E agora?"), [Seq(opt("Novo atendimento"), ref("↺ Boas-vindas")), Seq(opt("Voltou a acontecer"), ref("→ continua de onde parou"))]),
          ),
          opt("Não resolveu, seguir"),
        ]),
      ),
      opt("Não: sem dicas"),
    ]),
  );

  // ------------------------------------------------------------ faixa 3: aval, anexos, resumo, envio e fim
  const faixa3 = Seq(
    Par(N("rule dec", "Compra ou item novo?", "item novo ou pedido que fala em comprar; nunca defeito nem toner", { id: "compra" }), [
      opt("Não"),
      Seq(
        opt("Sim"),
        Par(N("rule dec", "Aval da liderança", "o sistema nunca aprova sozinho"), [Seq(opt("Já foi autorizado"), N("step", "Nome de quem autorizou", "⌨ nome e sobrenome")), Seq(opt("Ainda não tenho autorização"), N("sys", "Fica pendente"))]),
      ),
    ]),
    Par(N("dec", "Anexos (opcional)", "Quer anexar uma foto ou arquivo?", { id: "anexos" }), [
      opt("Continuar sem / com os anexos"),
      Seq(
        opt("Adicionar anexo"),
        N("sys", "Seletor de arquivos", "até 3 · 5 MB no total"),
        Par(N("sys dec", "Arquivo aceito?"), [Seq(opt("Sim"), ref("↺ Anexos, com o arquivo")), Seq(opt("Não"), N("sys", "Aviso: tipo, tamanho ou limite"), ref("↺ Anexos"))]),
      ),
      Seq(opt("✕ Remover arquivo"), ref("↺ Anexos")),
    ]),
    N("ai", "IA escreve o assunto", "só para a planilha; sem IA, “Área — Necessidade”; não refaz se o pedido não mudou", { id: "assunto" }),
    Par(N("dec", "Resumo para conferir", "Confira seu chamado antes de enviar:", { id: "resumo" }), [
      opt("Enviar chamado"),
      Seq(
        opt("Corrigir um dado"),
        Par(N("dec", "Qual dado corrigir?", "o valor atual vem preenchido"), [
          opt("Nome"),
          opt("E-mail"),
          Seq(
            opt("Setor"),
            Par(N("rule dec", "O pedido vale para o novo setor?", "ex.: QuickBooks é só do Financeiro"), [
              opt("Sim"),
              Seq(
                opt("Não"),
                Par(N("dec", "O setor combina com o pedido?"), [
                  Seq(opt("Mudar o setor e escolher outro tipo"), ref("↺ Qual tipo de ajuda? (relato guardado)")),
                  Seq(opt("Manter o setor"), ref("↺ Resumo")),
                ]),
              ),
            ]),
          ),
          opt("Cada dado do pedido"),
          opt("Descrição"),
          opt("Respostas ao assistente"),
          opt("Voltar ao resumo"),
        ]),
        N("sys", "Pronto, atualizei o resumo.", "refaz o assunto se o pedido mudou"),
        ref("↺ Resumo"),
      ),
      Seq(opt("Revisar anexos", "só com anexos"), ref("↺ Anexos")),
    ]),
    Par(N("sys dec", "Envio confirmado?", "só com o número devolvido pela planilha", { id: "envio" }), [
      Seq(
        opt("Não"),
        Par(N("dec", "Envio não confirmado", "seus dados continuam aqui"), [Seq(opt("Tentar enviar novamente"), ref("↺ Envio")), Seq(opt("Corrigir um dado"), ref("↺ Resumo")), Seq(opt("Revisar anexos"), ref("↺ Anexos"))]),
      ),
      Seq(
        opt("Sim"),
        N("step", "Comprovante", "número do chamado (ex.: #024)"),
        Par(N("dec", "Quão fácil foi?", "nota de 1 a 5 · uma vez por conversa"), [
          Seq(opt("5 · Muito fácil  ·  4 · Fácil"), N("step", "Algo poderia ser ainda mais fácil?", "⌨ opcional · ou: Nada a acrescentar")),
          Seq(opt("3 · Mais ou menos  ·  2 · Difícil  ·  1 · Muito difícil"), N("step", "O que faltou ou atrapalhou?", "⌨ opcional · ou: Nada a acrescentar")),
          opt("Prefiro não responder"),
        ]),
        N("end", "Atendimento enviado"),
        Par(N("dec", "E agora?"), [
          Seq(opt("Abrir o outro pedido que você contou", "se a IA viu dois pedidos"), N("ai", "IA monta o rascunho do outro pedido", "mesmo relato e mesmos dados"), ref("↺ Rascunho para conferir")),
          Seq(opt("Novo atendimento"), ref("↺ Boas-vindas")),
          Seq(opt("Lembrar meus dados", "se não estão salvos"), N("sys", "Dados salvos neste dispositivo"), ref("↺ E agora?")),
          Seq(opt("Esquecer meus dados", "se estão salvos"), N("sys", "Dados apagados"), ref("↺ E agora?")),
          Seq(opt("Fecha a página"), N("end", "Fim", "", { stop: true })),
        ]),
      ),
    ]),
  );

  return [
    { block: faixa1, title: "1 · Do início até o tipo de pedido", sub: "boas-vindas, acompanhamento, identificação, tipo de ajuda (botões ou relato com IA) e os 57 tipos de pedido com todos os seus dados e escolhas" },
    { block: faixa2, title: "2 · Complemento, conferências e revisão da IA", sub: "todos os 57 caminhos chegam aqui" },
    { block: faixa3, title: "3 · Aval, anexos, resumo, envio e fim", sub: "" },
  ];
})();
