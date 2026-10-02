# Versão atual do SmartDesk

**0.8.13**

A fonte da versão é package.json. Os rodapés do chat e do painel, package-lock.json e este documento são sincronizados por npm run version:update -- NOVA_VERSAO.

A cada entrega com mudanças no código ou interface, incrementar a versão, executar a sincronização e registrar o que mudou em CHANGELOG.md e no relatório de verificação. Ajustes e correções incrementam o último número; funcionalidades novas podem incrementar o número intermediário. Documentos históricos preservam a versão original.

Exemplo: npm run version:update -- 0.8.13. Para verificar a consistência antes do commit: npm run version:check.
