# 🚀 Guia de Deploy - Game Change Images no Coolify

## 📋 Pré-requisitos

- VPS na Hostinger com Coolify instalado
- Acesso SSH à VPS
- Domínio configurado (opcional, mas recomendado)
- Repositório GitHub configurado
- Personal Access Token do GitHub

## 🔧 Configuração Inicial

### 1. Configurar Repositório GitHub

```bash
# Faça push do projeto para o GitHub
git remote add origin https://github.com/seu-usuario/gamechange-images.git
git add .
git commit -m "Initial commit"
git push -u origin main

# Execute o script de deploy
./deploy.sh
```

### 2. Configurar Variáveis de Ambiente

Configure as seguintes variáveis no Coolify:

```env
# Database (URL interna do Coolify)
DATABASE_URL="postgres://postgres:ozmtQYEOdBSzU99M66wDYujcLM5moj7strVh3M7DnWKRED8WZte55Q5J3qvvKbsT@wkoooogk08c408k8wgow8kos:5432/postgres"

# JWT
JWT_SECRET="juYZvXgEwKB6ERpb1gnpQ19IiyOiS/X3wFBUM6mCVEeaF+IE41fMY3EYhhdT76BS"

# OpenAI
OPENAI_API_KEY="sua_chave_openai_aqui"

# Google Cloud Storage
GOOGLE_CLOUD_PROJECT_ID="seu_projeto_id"
GOOGLE_CLOUD_BUCKET_NAME="seu_bucket_name"
GOOGLE_CLOUD_KEYFILE="./gcs-keyfile.json"

# App
NEXT_PUBLIC_BASE_URL="https://seu-dominio.com"
NODE_ENV="production"
```

## 🐳 Deploy no Coolify

### Opção 1: Deploy com Git Repository (Recomendado)

1. **Acesse o Coolify** na sua VPS
2. **Crie um novo projeto**
3. **Selecione "Git Repository"**
4. **Configure o repositório:**
   - Repository: `seu-usuario/gamechange-images`
   - Branch: `main`
   - Build Pack: `Dockerfile`
   - Docker Compose File: `docker-compose.yml`

5. **Configure as variáveis de ambiente no Coolify:**
   - `DATABASE_URL` (URL interna do Coolify)
   - `JWT_SECRET`
   - `OPENAI_API_KEY`
   - `GOOGLE_CLOUD_PROJECT_ID`
   - `GOOGLE_CLOUD_BUCKET_NAME`
   - `GOOGLE_CLOUD_KEYFILE`
   - `NEXT_PUBLIC_BASE_URL`
   - `NODE_ENV`

6. **Configure o banco de dados:**
   - Use o banco PostgreSQL já criado no Coolify
   - URL interna: `postgres://postgres:ozmtQYEOdBSzU99M66wDYujcLM5moj7strVh3M7DnWKRED8WZte55Q5J3qvvKbsT@wkoooogk08c408k8wgow8kos:5432/postgres`

7. **Ative o Auto Deploy:**
   - ✅ Enable Auto Deploy
   - ✅ Enable Webhook
   - Branch: `main`

### Opção 2: Deploy com Docker Compose

1. **Crie um novo projeto no Coolify**
2. **Selecione "Docker Compose"**
3. **Configure o repositório Git**
4. **Configure as variáveis de ambiente**
5. **Configure o banco de dados PostgreSQL**
6. **Ative o Auto Deploy**

## 🗄️ Configuração do Banco de Dados

### Banco já configurado no Coolify

O banco PostgreSQL já está configurado com as seguintes credenciais:
- **URL Interna**: `postgres://postgres:ozmtQYEOdBSzU99M66wDYujcLM5moj7strVh3M7DnWKRED8WZte55Q5J3qvvKbsT@wkoooogk08c408k8wgow8kos:5432/postgres`
- **URL Externa**: `postgres://postgres:ozmtQYEOdBSzU99M66wDYujcLM5moj7strVh3M7DnWKRED8WZte55Q5J3qvvKbsT@46.202.144.114:5433/postgres`

### Tabelas criadas:
- ✅ `Generation` - Tabela principal
- ✅ `_prisma_migrations` - Controle de migrações

## 🔄 Migrações do Banco

As migrações já foram aplicadas. Se precisar executar novamente:

```bash
# Via Coolify Terminal ou SSH
npx prisma migrate deploy
npx prisma db seed
```

## 🤖 Deploy Automático

### Configuração do Webhook

O projeto está configurado para deploy automático via webhook do GitHub:

1. **Configure no Coolify:**
   - ✅ Enable Auto Deploy
   - ✅ Enable Webhook
   - Branch: `main`

2. **Teste o deploy automático:**
   ```bash
   # Faça uma alteração e push
   git add .
   git commit -m "Test deploy"
   git push origin main
   ```

## 🌐 Configuração de Domínio

1. **Configure o domínio no Coolify**
2. **Atualize o NEXT_PUBLIC_BASE_URL:**
   ```env
   NEXT_PUBLIC_BASE_URL="https://seu-dominio.com"
   ```

3. **Configure SSL/HTTPS no Coolify**

## 🔒 Configurações de Segurança

### Gerar Chaves Secretas

```bash
# Gerar JWT_SECRET
openssl rand -base64 32
```

### Configurar Google Cloud Storage

1. Acesse [Google Cloud Console](https://console.cloud.google.com)
2. Crie um projeto
3. Configure Cloud Storage
4. Crie um bucket
5. Configure as credenciais

## 📊 Monitoramento

### Health Check
- Endpoint: `https://seu-dominio.com/api/health`
- Configure no Coolify para monitoramento

### Logs
- Acesse os logs via Coolify Dashboard
- Monitore erros e performance

## 🔧 Troubleshooting

### Problemas Comuns

1. **Erro de conexão com banco:**
   - Verifique `DATABASE_URL`
   - Execute migrações: `npx prisma migrate deploy`

2. **Erro de build:**
   - Verifique se todas as dependências estão no `package.json`
   - Limpe cache: `npm run build -- --no-cache`

3. **Erro de autenticação:**
   - Verifique `JWT_SECRET`
   - Verifique `NEXT_PUBLIC_BASE_URL`

### Comandos Úteis

```bash
# Verificar logs
docker-compose logs -f app

# Reiniciar serviços
docker-compose restart

# Acessar container
docker-compose exec app sh

# Executar migrações
docker-compose exec app npx prisma migrate deploy
```

## 📈 Escalabilidade

### Para Produção

1. **Use banco de dados externo** (já configurado)
2. **Configure backup automático**
3. **Use CDN para assets estáticos**
4. **Configure rate limiting**
5. **Monitore performance**

### Variáveis de Ambiente de Produção

```env
NODE_ENV=production
DATABASE_URL=postgres://postgres:ozmtQYEOdBSzU99M66wDYujcLM5moj7strVh3M7DnWKRED8WZte55Q5J3qvvKbsT@wkoooogk08c408k8wgow8kos:5432/postgres
JWT_SECRET=sua-chave-secreta
OPENAI_API_KEY=sua-chave-openai
GOOGLE_CLOUD_PROJECT_ID=seu-projeto-id
GOOGLE_CLOUD_BUCKET_NAME=seu-bucket
NEXT_PUBLIC_BASE_URL=https://seu-dominio.com
```

## 🎉 Deploy Concluído!

Após o deploy, sua aplicação estará disponível em:
- **URL:** `https://seu-dominio.com`
- **Admin:** Acesse via Coolify Dashboard

### Próximos Passos

1. ✅ Teste todas as funcionalidades
2. ✅ Configure backup do banco
3. ✅ Configure monitoramento
4. ✅ Configure alertas
5. ✅ Documente procedimentos de manutenção 