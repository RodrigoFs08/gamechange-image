# Game Change Images

App para geração e edição de imagens com IA usando OpenAI e Google Cloud Storage.

## 🚀 Funcionalidades

- ✅ **Login com usuários fixos** (Rodrigo, Weslley, Admin, etc.)
- ✅ **Geração de imagens do zero** usando DALL-E 3
- ✅ **Edição de imagens existentes** 
- ✅ **Upload de imagens** por drag & drop
- ✅ **Histórico de gerações** com filtros e paginação
- ✅ **Interface moderna** com tema escuro e logo Game Change
- ✅ **Autenticação JWT** segura

## 👥 Usuários Disponíveis

| Usuário | Senha | Nome |
|---------|-------|------|
| `rodrigo` | `gamechangeapp1` | Rodrigo |
| `weslley` | `gamechangeapp` | Weslley |
| `admin` | `123` | Administrador |
| `user1` | `123` | Usuário 1 |
| `user2` | `123` | Usuário 2 |
| `user3` | `123` | Usuário 3 |

## 🛠️ Configuração

### 1. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# JWT
JWT_SECRET=juYZvXgEwKB6ERpb1gnpQ19IiyOiS/X3wFBUM6mCVEeaF+IE41fMY3EYhhdT76BS
mLYTCyXXR5zwyY72UjuHEQ==

# OpenAI
OPENAI_API_KEY=sua_chave_openai_aqui

# Google Cloud Storage
GOOGLE_CLOUD_PROJECT_ID=seu_projeto_id
GOOGLE_CLOUD_BUCKET_NAME=seu_bucket_name
GOOGLE_CLOUD_KEYFILE=./gcs-keyfile.json

# Database (Supabase)
DATABASE_URL=sua_url_do_supabase_aqui

# App
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 2. Google Cloud Storage

1. Baixe o arquivo `gcs-keyfile.json` do Google Cloud Console
2. Coloque na raiz do projeto
3. Configure as variáveis de ambiente

### 3. OpenAI

1. Obtenha sua API key em [platform.openai.com](https://platform.openai.com)
2. Adicione no arquivo `.env`

## 🚀 Como Rodar

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm run build
npm start
```

### Docker
```bash
docker-compose up -d
```

## 📱 Como Usar

1. **Acesse:** `http://localhost:3000/login`
2. **Faça login** com um dos usuários disponíveis
3. **No Dashboard:**
   - Clique em "Nova Geração de Imagem"
   - Escolha entre "Editar Imagem" ou "Gerar do Zero"
   - Digite o prompt desejado
   - Clique em gerar
4. **Visualize o histórico** de todas as gerações

## 🏗️ Estrutura do Projeto

```
gamechangeimages/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/          # Autenticação JWT
│   │   │   └── image/         # Upload e histórico
│   │   ├── dashboard/         # Dashboard principal
│   │   ├── generate/          # Geração de imagens
│   │   ├── history/           # Histórico
│   │   └── login/             # Tela de login
│   └── generated/             # Arquivos gerados
├── public/                    # Assets estáticos
├── prisma/                    # Schema do banco
└── docker-compose.yml         # Configuração Docker
```

## 🎨 Tecnologias

- **Frontend:** Next.js 15, React, Tailwind CSS
- **Backend:** Next.js API Routes
- **Autenticação:** JWT
- **IA:** OpenAI DALL-E 3
- **Storage:** Google Cloud Storage
- **Banco:** PostgreSQL (Supabase)
- **Deploy:** Docker, docker-compose

## 🔧 Status Atual

- ✅ Login funcionando (usuários fixos)
- ✅ Upload de imagens (OpenAI + Google Cloud Storage)
- ✅ Geração do zero (OpenAI + Google Cloud Storage)
- ✅ Histórico (banco de dados real)
- ✅ Interface completa
- ✅ Integração real com OpenAI
- ✅ Integração real com Google Cloud Storage
- ✅ Banco de dados real
- ✅ Fallbacks para casos de erro

## 📞 Suporte

Para dúvidas ou problemas, entre em contato com a equipe Game Change.
