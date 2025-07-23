import { PrismaClient } from '../src/generated/prisma'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')
  
  // Aqui você pode adicionar dados iniciais se necessário
  // Exemplo:
  // await prisma.generation.create({
  //   data: {
  //     prompt: "Exemplo de prompt",
  //     generatedUrl: "https://exemplo.com/imagem.jpg",
  //     user: "admin"
  //   }
  // })
  
  console.log('✅ Seed concluído com sucesso!')
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 