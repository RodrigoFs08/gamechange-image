# 🚀 Configuração para Produção

## 📋 Checklist de Configuração

### 1. **Variáveis de Ambiente (.env)**

```env
# JWT (OBRIGATÓRIO)
JWT_SECRET=juYZvXgEwKB6ERpb1gnpQ19IiyOiS/X3wFBUM6mCVEeaF+IE41fMY3EYhhdT76BS
mLYTCyXXR5zwyY72UjuHEQ==

# OpenAI (OBRIGATÓRIO)
OPENAI_API_KEY=sk-...

# Google Cloud Storage (OBRIGATÓRIO)
GOOGLE_CLOUD_PROJECT_ID=seu-projeto-id
GOOGLE_CLOUD_BUCKET_NAME=seu-bucket-name
GOOGLE_CLOUD_KEYFILE=./gcs-keyfile.json

# Database (OBRIGATÓRIO)
DATABASE_URL=postgresql://...

# App (OBRIGATÓRIO)
NEXT_PUBLIC_BASE_URL=https://seu-dominio.com
```

### 2. **Google Cloud Storage**

1. **Criar projeto no Google Cloud Console**
2. **Habilitar Cloud Storage API**
3. **Criar bucket público**
4. **Baixar arquivo de credenciais:**
   ```bash
   # Salvar como gcs-keyfile.json na raiz do projeto
   ```

### 3. **OpenAI**

1. **Criar conta em [platform.openai.com](https://platform.openai.com)**
2. **Gerar API Key**
3. **Adicionar no .env**

### 4. **Banco de Dados (Supabase)**

1. **Criar projeto no Supabase**
2. **Copiar DATABASE_URL**
3. **Executar migrações:**
   ```bash
   npx prisma db push
   npx prisma generate
   ```

### 5. **Deploy**

#### **Opção A: Docker**
```bash
docker-compose up -d
```

#### **Opção B: Vercel/Netlify**
```bash
npm run build
npm start
```

#### **Opção C: Coolify**
1. Conectar repositório
2. Configurar variáveis de ambiente
3. Deploy automático

## 🔒 Segurança

### **Usuários Fixos (Configuração Atual)**
- Rodrigo: `rodrigo` / `gamechangeapp1`
- Weslley: `weslley` / `gamechangeapp`
- Admin: `admin` / `123`
- User1: `user1` / `123`
- User2: `user2` / `123`
- User3: `user3` / `123`

### **Para Produção com Usuários Dinâmicos**
1. Implementar sistema de registro
2. Adicionar hash de senhas (bcrypt)
3. Configurar autenticação OAuth (Google, GitHub)

## 📊 Monitoramento

### **Logs Importantes**
- `✅ Geração salva no banco: [ID]`
- `✅ Imagem salva no GCS: [filename]`
- `📊 Histórico: [count] registros encontrados`
- `❌ Erro ao salvar no banco: [error]`
- `❌ Erro no upload para GCS: [error]`

### **Métricas Recomendadas**
- Número de gerações por dia
- Tempo médio de resposta
- Taxa de erro
- Uso de storage

## 🛠️ Manutenção

### **Backup do Banco**
```bash
# Backup automático (cron job)
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
```

### **Limpeza de Storage**
```bash
# Remover imagens antigas (opcional)
# Configurar lifecycle policy no GCS
```

### **Atualizações**
```bash
# Atualizar dependências
npm update

# Regenerar Prisma
npx prisma generate

# Aplicar migrações
npx prisma db push
```

## 🚨 Troubleshooting

### **Erro: "Can't reach database server"**
- Verificar DATABASE_URL
- Verificar conectividade de rede
- Verificar se o banco está ativo

### **Erro: "OpenAI API key invalid"**
- Verificar OPENAI_API_KEY
- Verificar limite de créditos
- Verificar região da API

### **Erro: "Google Cloud Storage not configured"**
- Verificar gcs-keyfile.json
- Verificar permissões do bucket
- Verificar variáveis de ambiente

### **Erro: "JWT secret not configured"**
- Gerar nova chave JWT
- Atualizar JWT_SECRET
- Reiniciar aplicação

## 📞 Suporte

Para problemas específicos:
1. Verificar logs da aplicação
2. Verificar status dos serviços externos
3. Contatar equipe Game Change 