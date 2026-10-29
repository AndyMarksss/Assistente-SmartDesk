# Hospedagem

**Atual (desde a 0.9.2):** chat e painel no GitHub Pages; o Apps Script faz só as integrações (IA, planilha, anexos, acompanhamento, gestão, métricas e ticket por e-mail). A avaliação não pede senha, e nenhum servidor local é necessário. O Apps Script é publicado sempre na mesma implantação, para o endereço `/exec` não mudar ([como publicar](integracoes/apps-script/README.md)). Desde a 0.12.16, o painel publicado lista todos os chamados da planilha, com nome e e-mail de outras pessoas abreviados e anexos sem link.

## Histórico

- **0.8.15:** servidor Node hospedado no Render (`render.yaml`), com acesso de avaliação.
- **0.9.0:** portal servido pelo próprio Apps Script, substituído na 0.9.1.
- **0.9.1 e 0.9.2:** a interface volta ao GitHub Pages e o Apps Script passa a receber só as operações; na 0.9.2, a avaliação fica sem senha ([guia da época](integracoes/apps-script/AVALIAR-SEM-SENHA-v0.9.2.md)). Naquela versão, a gestão pública mostrava só os chamados da própria sessão.
