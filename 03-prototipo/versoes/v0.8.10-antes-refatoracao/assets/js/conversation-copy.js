"use strict";
(function(desk){
 const tool=item=>item.path?.[item.path.length-1]||item.need;
 function opening(item){
  if(item.id==='AV-007')return 'Entendi. Vamos registrar o problema com o cabo HDMI para a equipe verificar.';
  if(item.area==='Audiovisual')return 'Vamos combinar os detalhes para a equipe preparar os equipamentos no dia certo.';
  if(item.area==='Impressora')return item.id==='IMP-010'?'Vamos separar as informações do toner ou da tinta que você precisa.':'Vamos olhar essa questão da impressora. Primeiro, preciso de alguns detalhes para a equipe saber por onde começar.';
  if(item.area==='Google')return 'Vamos ver essa questão no '+tool(item)+'. Me passe alguns detalhes para a equipe encontrar o que está acontecendo.';
  if(desk.requestPolicy.asksEquipmentIntent(item))return 'Certo. Antes dos detalhes, me ajuda a entender o que você precisa com esse equipamento.';
  if(item.need.includes('Reserva'))return 'Vamos organizar essa reserva. Me diga quando você vai precisar do equipamento.';
  return 'Entendi. Vou te fazer algumas perguntas para a equipe conseguir avaliar isso com você.';
 }
 const prompts={
 'descricao-do-problema':'O que acontece quando você usa o cabo HDMI? Conte também em qual sala ou equipamento ele está conectado.',
 modelo:'Qual é o modelo da impressora? Se não souber, pode escrever “não sei”.',
 cor:'Qual cor de toner ou tinta você precisa?',data:'Em qual dia você vai precisar? Digite a data ou use o calendário, como preferir.',horario:'E a que horas? Pode digitar o horário, por exemplo 09:30.',evento:'Você vai usar os equipamentos em um evento?',roteiro:'Você tem o link do roteiro do evento? Cole aqui para a equipe se preparar.',
 'mensagem-do-visor':'O que aparece no visor da impressora? Se não aparecer nada, pode me dizer isso.',
 'mensagem-de-erro':'Aparece alguma mensagem de erro? Me conte o que ela diz; se não aparecer, escreva “não aparece”.',
 'erro-apresentado':'O que acontece quando você tenta usar? Se aparecer um erro, me diga o texto da mensagem.',erro:'Que erro você está vendo? Pode descrever com suas palavras.',
 conta:'Qual é o e-mail da conta em que isso acontece?', 'e-mail-da-conta':'De qual conta você precisa recuperar o acesso? Informe o e-mail, sem enviar a senha.',
 'link-ou-nome-do-arquivo':'Qual arquivo está envolvido? Pode mandar o link ou o nome dele.',arquivo:'Qual documento está envolvido? Me passe o nome ou o link.',
 'link-ou-nome-do-recurso':'Qual pasta ou arquivo do Drive está envolvido? Pode informar o nome ou o link.',
 'link-ou-nome-da-planilha':'Qual planilha está envolvida? Me passe o nome ou o link.', 'link-ou-nome-do-site':'Em qual site isso acontece? Pode informar o nome ou o endereço.',
 turma:'Qual é a turma?',grupo:'Qual é o grupo envolvido?',periodo:'Em qual período você vai precisar?', 'horario-periodo':'Em qual horário ou período você vai precisar?',
 programa:'Qual programa está envolvido?',equipamento:'Qual equipamento precisa de atendimento? Diga quem usa e, se souber, o modelo.',
 'tipo-de-conexao':'Esse computador usa cabo de rede ou Wi-Fi?',dispositivo:'Em qual dispositivo o Wi-Fi está dando problema?',rede:'Qual é o nome da rede Wi-Fi?',
 finalidade:'Para que você precisa desse acesso?', 'sistema-processo':'Qual sistema ou processo você gostaria de melhorar?',
 'pagina-secao':'Qual página ou seção precisa ser atualizada?', 'conteudo-novo':'O que você gostaria de colocar nessa página?',secao:'Em qual seção da intranet você precisa de ajuda?', 'arquivos-links':'Quais arquivos ou links fazem parte dessa solicitação?',
 perfil:'Qual perfil de acesso essa pessoa precisa?',relatorio:'Qual relatório está envolvido?', 'descricao-do-relatorio':'Que informações você precisa nesse relatório?',usuario:'Qual usuário está com essa dificuldade? Informe o login, sem enviar a senha.',
 'aluno-turma':'Qual é o aluno e a turma envolvidos?',aluno:'Qual é o nome do aluno?',disciplina:'Qual é a disciplina?', 'turma-atual':'Em qual turma o aluno está agora?', 'turma-destino':'Para qual turma ele vai?',responsavel:'Qual é o nome do responsável?', 'email-responsavel':'Qual é o e-mail do responsável?', 'contato-responsavel':'Qual telefone a equipe pode usar para falar com o responsável?'
 };
 function field(item,f){if(f.id==='data'&&item.area==='Audiovisual')return 'Para qual dia vamos preparar os equipamentos? Digite a data ou escolha no calendário.';return prompts[f.id]||'Pode me informar '+f.label.charAt(0).toLowerCase()+f.label.slice(1)+'?';}
 function description(item,intent=''){if(intent==='purchase')return 'Qual item você quer solicitar e para qual atividade? Conte o que ele precisa ter para te ajudar no trabalho.';if(intent==='repair')return 'O que deixou de funcionar nesse equipamento? Me conte desde quando e o que acontece quando você tenta usar.';if(item.id==='AV-007')return 'Quer ajustar o relato? Conte o que acontece com o cabo HDMI e onde ele está conectado.';
  if(item.id==='IMP-010')return 'Há algum detalhe sobre essa solicitação de toner ou tinta que a equipe precisa saber? Conte aqui.';
  if(item.need.includes('Reserva')||item.area==='Audiovisual')return 'Como você pretende usar os equipamentos? Conte o que a equipe precisa preparar para te atender.';
  if(item.area==='Impressora')return 'Me conta o que acontece quando você tenta usar a impressora. Desde quando está assim e como isso está afetando seu trabalho?';
  if(item.area==='Google')return 'O que você está tentando fazer e o que acontece nessa hora? Conte com suas palavras; não precisa usar termos técnicos.';
  return 'Agora, me conta um pouco mais: o que aconteceu ou o que você precisa? Se puder, diga desde quando e como isso afeta seu trabalho.';
 }
 desk.conversationCopy={opening,field,description};
})(window.SmartDesk=window.SmartDesk||{});
