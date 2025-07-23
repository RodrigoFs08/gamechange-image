# 🚀 Início Rápido - Game Change Images

## ⚡ Configuração Rápida (2 minutos)

### 1. Configurar Ambiente
```bash
# Execute o script de configuração
./setup-env.sh
```

### 2. Instalar Dependências
```bash
npm install
```

### 3. Configurar Banco de Dados
```bash
# Gerar cliente Prisma
npm run db:generate

# Executar migrações
npm run db:migrate
```

### 4. Configurar APIs (Obrigatório)
Edite o arquivo `.env.local` e configure:
- `OPENAI_API_KEY` - Sua chave da OpenAI
- `GOOGLE_CLOUD_PROJECT_ID` - ID do projeto Google Cloud
- `GOOGLE_CLOUD_BUCKET_NAME` - Nome do bucket
- `GOOGLE_CLOUD_KEYFILE` - Caminho para o arquivo de credenciais

### 5. Executar Projeto
```bash
npm run dev
```

## 🗄️ Banco de Dados Configurado

### URLs Configuradas:
- **Desenvolvimento Local**: `postgres://postgres:ozmtQYEOdBSzU99M66wDYujcLM5moj7strVh3M7DnWKRED8WZte55Q5J3qvvKbsT@46.202.144.114:5433/postgres`
- **Produção**: `postgres://postgres:ozmtQYEOdBSzU99M66wDYujcLM5moj7strVh3M7DnWKRED8WZte55Q5J3qvvKbsT@wkoooogk08c408k8wgow8kos:5432/postgres`

## 🔧 Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Banco de dados
npm run db:studio    # Interface visual do banco
npm run db:push      # Push de mudanças (dev)
npm run db:migrate   # Executar migrações (prod)

# Build e produção
npm run build
npm run start
```

## 🐛 Troubleshooting

### Erro de Conexão com Banco
```bash
# Testar conexão
npm run db:studio

# Se der erro, verifique:
# 1. Se a URL está correta no .env.local
# 2. Se o banco está rodando no Coolify
# 3. Se a porta 5433 está acessível
```

### Erro de Migração
```bash
# Resetar banco (cuidado!)
npm run db:reset

# Ou fazer push direto
npm run db:push
```

## 📱 Acessos

- **Aplicação**: http://localhost:3000
- **Prisma Studio**: http://localhost:5555 (após `npm run db:studio`)

## 🎯 Próximos Passos

1. Configure suas APIs no `.env.local`
2. Teste a geração de imagens
3. Configure o deploy no Coolify
4. Configure domínio personalizado

---

**🎉 Pronto! Seu projeto está configurado com o banco do Coolify!** 