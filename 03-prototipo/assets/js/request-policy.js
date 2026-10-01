"use strict";
(function(desk){
const fullName=value=>typeof value==='string'&&value.trim().length<=100&&/^[\p{L}\p{M}]+(?:[’'\-][\p{L}\p{M}]+)*(?:\s+[\p{L}\p{M}]+(?:[’'\-][\p{L}\p{M}]+)*)+$/u.test(value.trim())&&value.trim().split(/\s+/).filter(p=>!['de','da','do','das','dos','e'].includes(p.toLowerCase())).length>=2;
const needsAuthorization=(item,description='')=>/troca|compra|aquisiç|novo|nova/i.test(item.need)||/\b(comprar|compra|adquirir|aquisição)\b/i.test(description)||/\b(teclado|mouse|headset|fone|notebook|computador|monitor|equipamento|kit)\b.{0,50}\b(novo|nova|novos|novas|sem fio)\b/i.test(description);
desk.requestPolicy={fullName,needsAuthorization};
})(window.SmartDesk=window.SmartDesk||{});
