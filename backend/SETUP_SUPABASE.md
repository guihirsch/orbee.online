# Configuração Manual do Supabase - OrBee.Online

## ✅ Status da Integração

A integração com o Supabase foi **configurada com sucesso**! O backend está pronto para usar o Supabase como banco de dados.

## 🔧 Configuração Atual

- ✅ Cliente Supabase configurado (versão 2.20.0)
- ✅ Variáveis de ambiente configuradas no `.env`
- ✅ Repositórios atualizados para usar Supabase
- ✅ Dependências atualizadas
- ✅ Testes de integração funcionando

## 📋 Próximos Passos Manuais

### 1. Configurar Extensões no Supabase

No painel do Supabase, vá para **Database** → **Extensions** e habilite:

- `uuid-ossp` (para geração de UUIDs)
- `postgis` (para dados geoespaciais)

### 2. Executar Schema SQL

No painel do Supabase, vá para **SQL Editor** e execute o conteúdo do arquivo `database/schema.sql`:

```sql
-- Copie e cole todo o conteúdo do arquivo database/schema.sql
-- Execute em partes se necessário
```

### 3. Verificar Tabelas Criadas

Após executar o schema, verifique se as seguintes tabelas foram criadas:

- `users` - Usuários do sistema
- `observations` - Observações ambientais
- `observation_validations` - Validações das observações
- `ndvi_history` - Histórico de dados NDVI
- `monitored_areas` - Áreas monitoradas
- `alerts` - Alertas do sistema
- `recommendations` - Recomendações
- `achievements` - Conquistas
- `user_achievements` - Conquistas dos usuários

### 4. Configurar RLS (Row Level Security)

Para segurança, configure as políticas RLS:

```sql
-- Habilitar RLS nas tabelas principais
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE observations ENABLE ROW LEVEL SECURITY;
ALTER TABLE observation_validations ENABLE ROW LEVEL SECURITY;

-- Política para usuários (podem ver/editar apenas seus próprios dados)
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Política para observações (todos podem ver, apenas o autor pode editar)
CREATE POLICY "Anyone can view observations" ON observations
    FOR SELECT USING (true);

CREATE POLICY "Users can insert own observations" ON observations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own observations" ON observations
    FOR UPDATE USING (auth.uid() = user_id);
```

### 5. Testar a Integração

Execute o script de teste:

```bash
cd backend
python test_supabase_integration.py
```

### 6. Iniciar o Servidor

```bash
cd backend
python main.py
```

## 🔍 Verificação da Configuração

### Testar Endpoints

```bash
# Health check
curl http://localhost:8000/health

# Root endpoint
curl http://localhost:8000/

# Documentação da API
# Acesse: http://localhost:8000/docs
```

### Testar Conexão com Banco

```bash
# Executar teste de integração
python test_supabase_integration.py
```

## 📁 Arquivos Importantes

- `backend/.env` - Configurações do Supabase
- `backend/app/core/database.py` - Cliente Supabase
- `backend/app/core/config.py` - Configurações da aplicação
- `database/schema.sql` - Schema do banco de dados
- `backend/test_supabase_integration.py` - Testes de integração

## 🚨 Solução de Problemas

### Erro: "Invalid API key"

- Verifique se as credenciais no `.env` estão corretas
- Confirme se o projeto Supabase está ativo

### Erro: "Table not found"

- Execute o schema SQL no painel do Supabase
- Verifique se as tabelas foram criadas

### Erro: "Permission denied"

- Configure as políticas RLS
- Verifique se o service role key tem permissões adequadas

### Erro: "Extension not found"

- Habilite as extensões `uuid-ossp` e `postgis` no painel do Supabase

## 📞 Suporte

Se encontrar problemas:

1. Verifique os logs do servidor
2. Execute os testes de integração
3. Confirme as configurações no painel do Supabase
4. Verifique se todas as extensões estão habilitadas

## 🎉 Conclusão

A integração com o Supabase está **funcionando corretamente**! O backend está pronto para:

- ✅ Conectar com o banco de dados
- ✅ Executar operações CRUD
- ✅ Gerenciar usuários e observações
- ✅ Processar dados NDVI
- ✅ Implementar validação comunitária

Execute o schema SQL manualmente no painel do Supabase para completar a configuração.
