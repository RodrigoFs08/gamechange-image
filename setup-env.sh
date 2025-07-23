#!/bin/bash

echo "🚀 Configurando ambiente de desenvolvimento..."

# Criar arquivo .env.local se não existir
if [ ! -f .env.local ]; then
    echo "📝 Criando arquivo .env.local..."
    cat > .env.local << EOF
# JWT
JWT_SECRET=juYZvXgEwKB6ERpb1gnpQ19IiyOiS/X3wFBUM6mCVEeaF+IE41fMY3EYhhdT76BS
mLYTCyXXR5zwyY72UjuHEQ==

# OpenAI
OPENAI_API_KEY=sua_chave_openai_aqui

# Google Cloud Storage
GOOGLE_CLOUD_PROJECT_ID=seu_projeto_id
GOOGLE_CLOUD_BUCKET_NAME=seu_bucket_name
GOOGLE_CLOUD_KEYFILE=./gcs-keyfile.json

# Database (Coolify PostgreSQL - URL Pública para Dev Local)
DATABASE_URL=postgres://postgres:ozmtQYEOdBSzU99M66wDYujcLM5moj7strVh3M7DnWKRED8WZte55Q5J3qvvKbsT@46.202.144.114:5433/postgres

# App
NEXT_PUBLIC_BASE_URL=http://localhost:3000
EOF
    echo "✅ Arquivo .env.local criado!"
else
    echo "ℹ️  Arquivo .env.local já existe"
fi

echo ""
echo "🔧 Próximos passos:"
echo "1. Configure suas chaves de API no arquivo .env.local"
echo "2. Execute: npm run db:generate"
echo "3. Execute: npm run db:migrate"
echo "4. Execute: npm run dev"
echo ""
echo "🎉 Ambiente configurado com sucesso!" 