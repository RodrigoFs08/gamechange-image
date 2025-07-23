const { PrismaClient } = require('./src/generated/prisma');
require('dotenv').config();

async function testDatabaseFix() {
  console.log('🔍 Testando correção do banco de dados...\n');
  
  const prisma = new PrismaClient();
  
  try {
    await prisma.$connect();
    console.log('✅ Conexão com banco estabelecida');
    
    // Teste 1: Criar registro SEM originalUrl (deve funcionar agora)
    console.log('\n🔍 Teste 1: Criando registro sem originalUrl...');
    const generation1 = await prisma.generation.create({
      data: {
        prompt: 'Teste sem imagem original',
        generatedUrl: 'https://storage.googleapis.com/test/test1.png',
        user: 'test-user'
      }
    });
    console.log('✅ Registro criado com sucesso:', generation1.id);
    
    // Teste 2: Criar registro COM originalUrl
    console.log('\n🔍 Teste 2: Criando registro com originalUrl...');
    const generation2 = await prisma.generation.create({
      data: {
        prompt: 'Teste com imagem original',
        originalUrl: 'https://storage.googleapis.com/test/original.png',
        generatedUrl: 'https://storage.googleapis.com/test/test2.png',
        user: 'test-user'
      }
    });
    console.log('✅ Registro criado com sucesso:', generation2.id);
    
    // Teste 3: Verificar registros criados
    console.log('\n🔍 Teste 3: Verificando registros...');
    const generations = await prisma.generation.findMany({
      where: { user: 'test-user' },
      orderBy: { createdAt: 'desc' },
      take: 5
    });
    
    console.log(`✅ ${generations.length} registros encontrados:`);
    generations.forEach((gen, index) => {
      console.log(`   ${index + 1}. ID: ${gen.id}`);
      console.log(`      Prompt: ${gen.prompt}`);
      console.log(`      Original: ${gen.originalUrl || 'N/A'}`);
      console.log(`      Generated: ${gen.generatedUrl}`);
      console.log(`      User: ${gen.user}`);
      console.log('');
    });
    
    // Limpar registros de teste
    console.log('🧹 Limpando registros de teste...');
    await prisma.generation.deleteMany({
      where: { user: 'test-user' }
    });
    console.log('✅ Registros de teste removidos');
    
    console.log('\n🎉 Todos os testes passaram! O banco está funcionando corretamente.');
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
    console.error('Detalhes:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabaseFix(); 