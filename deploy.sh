#!/bin/bash

echo "🚀 Iniciando deploy do Game Change Images..."

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ Erro: package.json não encontrado. Execute este script no diretório raiz do projeto."
    exit 1
fi

# Verificar se o git está configurado
if [ ! -d ".git" ]; then
    echo "❌ Erro: Repositório Git não encontrado. Configure o Git primeiro."
    exit 1
fi

# Verificar se as variáveis de ambiente estão configuradas
if [ ! -f ".env.local" ]; then
    echo "⚠️  Aviso: Arquivo .env.local não encontrado. Execute ./setup-env.sh primeiro."
fi

echo "📦 Instalando dependências..."
npm install

echo "🔧 Gerando cliente Prisma..."
npm run db:generate

echo "🏗️  Fazendo build da aplicação..."
npm run build

echo "✅ Build concluído com sucesso!"

echo ""
echo "🎯 Próximos passos para deploy no Coolify:"
echo "1. Faça push para o GitHub:"
echo "   git add ."
echo "   git commit -m 'Deploy ready'"
echo "   git push origin main"
echo ""
echo "2. No Coolify:"
echo "   - Crie um novo projeto"
echo "   - Selecione 'Git Repository'"
echo "   - Configure o repositório: seu-usuario/gamechange-images"
echo "   - Configure as variáveis de ambiente"
echo "   - Ative o Auto Deploy"
echo ""
echo "3. Configure as variáveis de ambiente no Coolify:"
echo "   - DATABASE_URL (URL interna do Coolify)"
echo "   - JWT_SECRET"
echo "   - OPENAI_API_KEY"
echo "   - GOOGLE_CLOUD_PROJECT_ID"
echo "   - GOOGLE_CLOUD_BUCKET_NAME"
echo "   - GOOGLE_CLOUD_KEYFILE"
echo "   - NEXT_PUBLIC_BASE_URL"
echo ""
echo "🎉 Projeto pronto para deploy!" 