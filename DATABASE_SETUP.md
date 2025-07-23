# Configuração do Banco de Dados no Coolify

## 📋 Pré-requisitos
- Acesso ao painel do Coolify
- Projeto já configurado no Coolify

## 🗄️ Criando o Banco de Dados

### 1. Acesse o Coolify
1. Faça login no painel do Coolify
2. Vá para a seção "Resources" ou "Databases"

### 2. Criar Novo Banco
1. Clique em "New Database" ou "Add Database"
2. Selecione **PostgreSQL**
3. Escolha a versão **15** ou **16**

### 3. Configurações
```
Nome do Banco: postgres
Usuário: postgres
Senha: ozmtQYEOdBSzU99M66wDYujcLM5moj7strVh3M7DnWKRED8WZte55Q5J3qvvKbsT
Porta: 5432
Host: wkoooogk08c408k8wgow8kos
```

### 4. String de Conexão Configurada
A URL interna do Coolify já está configurada:
```
postgres://postgres:ozmtQYEOdBSzU99M66wDYujcLM5moj7strVh3M7DnWKRED8WZte55Q5J3qvvKbsT@wkoooogk08c408k8wgow8kos:5432/postgres
```

## 🔧 Configurando o Projeto

### 1. Variáveis de Ambiente

#### Para Desenvolvimento Local (.env.local)
```bash
DATABASE_URL=postgres://postgres:ozmtQYEOdBSzU99M66wDYujcLM5moj7strVh3M7DnWKRED8WZte55Q5J3qvvKbsT@46.202.144.114:5433/postgres
```

#### Para Produção (Docker/Coolify)
```bash
DATABASE_URL=postgres://postgres:ozmtQYEOdBSzU99M66wDYujcLM5moj7strVh3M7DnWKRED8WZte55Q5J3qvvKbsT@wkoooogk08c408k8wgow8kos:5432/postgres
```

### 2. Executar Migrações
```bash
# Gerar cliente Prisma
npm run db:generate

# Executar migrações
npm run db:migrate

# (Opcional) Popular dados iniciais
npm run db:seed
```

## 🚀 Comandos Úteis

```bash
# Gerar cliente Prisma
npm run db:generate

# Fazer push das mudanças (desenvolvimento)
npm run db:push

# Executar migrações (produção)
npm run db:migrate

# Abrir Prisma Studio
npm run db:studio

# Resetar banco (cuidado!)
npm run db:reset

# Executar seed
npm run db:seed
```

## 🔒 Segurança

### Variáveis de Ambiente
- **Desenvolvimento**: Use `.env.local`
- **Produção**: Configure no Coolify

### Backup
- Configure backups automáticos no Coolify
- Recomendado: backup diário

## 🐛 Troubleshooting

### Erro de Conexão
1. Verifique se a string de conexão está correta
2. Confirme se o banco está rodando
3. Verifique firewall/network policies

### Erro de Migração
1. Execute `npm run db:generate` primeiro
2. Verifique se todas as migrações estão aplicadas
3. Use `npm run db:reset` se necessário (cuidado!)

## 📊 Monitoramento

### No Coolify
- Acesse as métricas do banco
- Monitore uso de CPU e memória
- Configure alertas

### Logs
- Verifique logs do banco no Coolify
- Monitore logs da aplicação

## 🔄 Ambientes

### Desenvolvimento
- Use o mesmo banco ou crie um separado
- Configure `DATABASE_URL` no `.env.local`
- **Para desenvolvimento local:** Use a URL externa do banco
- **Para containers:** Use a URL interna

### Produção
- Configure `DATABASE_URL` no Coolify
- Use variáveis de ambiente do Coolify
- Use a URL interna para comunicação entre containers

## 🌐 URLs Internas vs Externas

### URL Interna (Atual)
```
postgres://postgres:ozmtQYEOdBSzU99M66wDYujcLM5moj7strVh3M7DnWKRED8WZte55Q5J3qvvKbsT@wkoooogk08c408k8wgow8kos:5432/postgres
```
- ✅ Funciona dentro do Coolify
- ✅ Comunicação entre containers
- ❌ Não funciona para desenvolvimento local

### URL Externa (Para Dev Local)
```
postgres://postgres:ozmtQYEOdBSzU99M66wDYujcLM5moj7strVh3M7DnWKRED8WZte55Q5J3qvvKbsT@46.202.144.114:5433/postgres
```
- ✅ Funciona para desenvolvimento local
- ✅ Acesso público configurado
- ✅ Porta 5433 (diferente da interna) 