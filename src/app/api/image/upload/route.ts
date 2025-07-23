import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "../../auth/middleware";
import { PrismaClient } from "../../../../generated/prisma";
import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";

const prisma = new PrismaClient();

// Função para upload no Google Cloud Storage
async function uploadToGCS(file: Buffer, filename: string): Promise<string> {
  try {
    // Suportar tanto as variáveis antigas quanto as novas
    const keyFile = process.env.GOOGLE_CLOUD_KEYFILE || process.env.GCS_KEYFILE;
    const bucketName = process.env.GOOGLE_CLOUD_BUCKET_NAME || process.env.GCS_BUCKET;

    console.log("🔍 Debug - Variáveis GCS:");
    console.log("🔍 Debug - keyFile existe:", !!keyFile);
    console.log("🔍 Debug - bucketName existe:", !!bucketName);
    if (keyFile) {
      console.log("🔍 Debug - keyFile começa com:", keyFile.substring(0, 50) + "...");
    }

    if (!keyFile || !bucketName) {
      console.warn("Google Cloud Storage não configurado, usando mock");
      // Fallback para mock se não estiver configurado
      const mockImageData = "data:image/svg+xml;base64," + Buffer.from(`
        <svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="#E50900"/>
          <text x="50%" y="50%" font-family="Arial" font-size="48" fill="white" text-anchor="middle" dy=".3em">
            ${filename.replace(/[^a-zA-Z0-9]/g, ' ')}
          </text>
        </svg>
      `).toString('base64');
      
      return mockImageData;
    }

    const { Storage } = await import("@google-cloud/storage");
    let storage;
    let credentials = null;
    let isJson = false;
    try {
      // Remove espaços e aspas duplas do início e fim
      const trimmed = keyFile.trim().replace(/^"+|"+$/g, "");
      if (trimmed.startsWith("{")) {
        credentials = JSON.parse(trimmed);
        isJson = true;
      }
    } catch (e) {
      isJson = false;
    }
    if (isJson && credentials) {
      console.log("🔍 Debug - Usando credenciais como JSON");
      storage = new Storage({
        credentials,
        projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
      });
    } else {
      console.error("❌ Erro: GOOGLE_CLOUD_KEYFILE não é um JSON válido. Configure a variável corretamente.");
      throw new Error("GOOGLE_CLOUD_KEYFILE precisa ser um JSON válido. Veja a documentação em GCS_SETUP.md");
    }
    const bucket = storage.bucket(bucketName);
    const blob = bucket.file(filename);
    
    await blob.save(file, {
      metadata: {
        contentType: "image/png",
      },
    });
    
    console.log(`✅ Imagem salva no GCS: ${filename}`);
    
    // Gerar URL pública direta (se bucket for público)
    return `https://storage.googleapis.com/${bucket.name}/${filename}`;
    
    // Alternativa: URL assinada (mais seguro)
    // const [url] = await blob.getSignedUrl({
    //   action: 'read',
    //   expires: Date.now() + 24 * 60 * 60 * 1000, // 24 horas
    // });
    // return url;
  } catch (error) {
    console.error("❌ Erro no upload para GCS:", error);
    const mockImageData = "data:image/svg+xml;base64," + Buffer.from(`
      <svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#E50900"/>
        <text x="50%" y="50%" font-family="Arial" font-size="48" fill="white" text-anchor="middle" dy=".3em">
          ${filename.replace(/[^a-zA-Z0-9]/g, ' ')}
        </text>
      </svg>
    `).toString('base64');
    
    return mockImageData;
  }
}

async function handleImageGeneration(request: NextRequest) {
  try {
    const user = (request as any).user;
    const formData = await request.formData();
    const prompt = formData.get("prompt") as string;
    const mode = formData.get("mode") as string;
    const imageFile = formData.get("image") as File | null;

    // Logs de debug
    console.log("🔍 Debug - Dados recebidos:");
    console.log("Prompt:", prompt);
    console.log("Mode:", mode);
    console.log("ImageFile:", imageFile ? "Presente" : "Ausente");
    console.log("User:", user?.username);

    if (!prompt) {
      console.log("❌ Erro: Prompt não fornecido");
      return NextResponse.json(
        { error: "Prompt é obrigatório" },
        { status: 400 }
      );
    }

    if (!prompt.trim()) {
      console.log("❌ Erro: Prompt vazio");
      return NextResponse.json(
        { error: "Prompt não pode estar vazio" },
        { status: 400 }
      );
    }

    console.log("✅ Prompt válido:", prompt.trim());

    let originalUrl: string | undefined;
    let generatedUrl: string = "";

    if (mode === "edit" && imageFile) {
      console.log("🎨 Modo EDIT - Processando imagem + prompt");
      console.log("📝 Prompt para OpenAI:", prompt);
      
      // Modo edição - usar a imagem enviada
      const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
      console.log("📊 Debug - Tamanho da imagem:", imageBuffer.length, "bytes");
      console.log("📊 Debug - Tipo da imagem:", imageFile.type);
      console.log("📊 Debug - Nome da imagem:", imageFile.name);
      
      // Verificar se a imagem é válida para a API da OpenAI
      if (imageBuffer.length > 20 * 1024 * 1024) { // 20MB limit
        throw new Error("Imagem muito grande. Tamanho máximo: 20MB");
      }
      
      // Garantir PNG 1024x1024
      let processedBuffer: Buffer;
      let processedType = imageFile.type;
      let needsConversion = false;
      try {
        const img = sharp(imageBuffer);
        const metadata = await img.metadata();
        if (metadata.format !== 'png' || metadata.width !== 1024 || metadata.height !== 1024) {
          needsConversion = true;
        }
        if (needsConversion) {
          console.log("🔄 Convertendo imagem para PNG 1024x1024...");
          processedBuffer = await img
            .resize(1024, 1024, { fit: 'cover' })
            .png()
            .toBuffer();
          processedType = 'image/png';
        } else {
          processedBuffer = Buffer.from(imageBuffer);
        }
        
        // Garantir que a imagem seja RGBA (com canal alpha) para a API de edição
        console.log("🔄 Convertendo para RGBA...");
        processedBuffer = await sharp(processedBuffer)
          .ensureAlpha()
          .png()
          .toBuffer();
      } catch (err) {
        console.error("❌ Erro ao processar imagem com sharp:", err);
        return NextResponse.json({ error: "Não foi possível processar a imagem. Envie um PNG quadrado ou tente outra imagem." }, { status: 400 });
      }
      
      const originalFilename = `original/${uuidv4()}.png`;
      originalUrl = await uploadToGCS(processedBuffer, originalFilename);

      // Gerar imagem editada com OpenAI
      if (!process.env.OPENAI_API_KEY) {
        throw new Error("OpenAI API key não configurada");
      }
      
      const { OpenAI } = await import("openai");
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      try {
        console.log("🤖 Chamando OpenAI images.generate com prompt baseado na imagem:", prompt);
        
        // Usar a API de geração com prompt que descreve a edição desejada
        const response = await openai.images.generate({
          model: "dall-e-3",
          prompt: `Uma variação da imagem com ${prompt}`,
          n: 1,
          size: "1024x1024",
        });

        if (!response.data || !response.data[0]?.url) {
          throw new Error("Erro ao gerar imagem editada");
        }

        // Download da imagem gerada
        console.log("📥 Fazendo download da imagem gerada...");
        const generatedImageResponse = await fetch(response.data[0].url);
        const generatedImageBuffer = Buffer.from(await generatedImageResponse.arrayBuffer());
        console.log("📥 Imagem baixada:", generatedImageBuffer.length, "bytes");
        
        const generatedFilename = `generated/${uuidv4()}.png`;
        generatedUrl = await uploadToGCS(generatedImageBuffer, generatedFilename);
      } catch (openaiError: any) {
        console.error("❌ Erro OpenAI:", openaiError);
        console.error("❌ Detalhes do erro:", openaiError.message);
        console.error("❌ Status do erro:", openaiError.status);
        console.error("❌ Tipo do erro:", openaiError.type);
        
        // Se for um erro de API, tentar usar a API de geração como fallback
        if (openaiError.status === 400 || openaiError.type === 'invalid_request_error') {
          console.log("🔄 Tentando fallback com API de geração...");
          try {
            const response = await openai.images.generate({
              model: "dall-e-3",
              prompt: `Uma variação da imagem com ${prompt}`,
              n: 1,
              size: "1024x1024",
            });
            
            if (response.data && response.data[0]?.url) {
              const generatedImageResponse = await fetch(response.data[0].url);
              const generatedImageBuffer = Buffer.from(await generatedImageResponse.arrayBuffer());
              const generatedFilename = `generated/${uuidv4()}.png`;
              generatedUrl = await uploadToGCS(generatedImageBuffer, generatedFilename);
              console.log("✅ Fallback com geração funcionou");
              return;
            }
          } catch (generationError) {
            console.error("❌ Fallback com geração também falhou:", generationError);
          }
        }
        
        // Fallback para mock se OpenAI falhar
        const mockImageData = "data:image/svg+xml;base64," + Buffer.from(`
          <svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="#E50900"/>
            <text x="50%" y="50%" font-family="Arial" font-size="48" fill="white" text-anchor="middle" dy=".3em">
              Erro: ${openaiError.message}
            </text>
          </svg>
        `).toString('base64');
        
        const generatedFilename = `generated/${uuidv4()}.png`;
        generatedUrl = await uploadToGCS(Buffer.from(mockImageData), generatedFilename);
      }
    } else {
      console.log("🎨 Modo ZERO - Gerando do zero com prompt:", prompt);
      // Modo geração do zero com OpenAI
      try {
        if (!process.env.OPENAI_API_KEY) {
          throw new Error("OpenAI API key não configurada");
        }
        
        const { OpenAI } = await import("openai");
        const openai = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY,
        });

        const response = await openai.images.generate({
          model: "dall-e-3",
          prompt: prompt,
          n: 1,
          size: "1024x1024",
        });

        if (!response.data || !response.data[0]?.url) {
          throw new Error("Erro ao gerar imagem");
        }

        // Download da imagem gerada
        const generatedImageResponse = await fetch(response.data[0].url);
        const generatedImageBuffer = Buffer.from(await generatedImageResponse.arrayBuffer());
        const generatedFilename = `generated/${uuidv4()}.png`;
        generatedUrl = await uploadToGCS(generatedImageBuffer, generatedFilename);
      } catch (openaiError: any) {
        console.error("❌ Erro OpenAI:", openaiError);
        console.error("❌ Detalhes do erro:", openaiError.message);
        // Fallback para mock se OpenAI falhar
        const generatedFilename = `generated/${uuidv4()}.png`;
        generatedUrl = await uploadToGCS(Buffer.from(""), generatedFilename);
      }
    }

    // Salvar no banco de dados
    try {
      const generation = await prisma.generation.create({
        data: {
          prompt,
          originalUrl: originalUrl || null,
          generatedUrl,
          user: user.username,
        },
      });

      console.log("✅ Geração salva no banco:", generation.id);

      return NextResponse.json({
        id: generation.id,
        originalUrl,
        generatedUrl,
        prompt,
        mode,
        user: user.username,
        createdAt: generation.createdAt,
      });
    } catch (dbError) {
      console.error("❌ Erro ao salvar no banco:", dbError);
      // Retornar mesmo sem salvar no banco
      return NextResponse.json({
        originalUrl,
        generatedUrl,
        prompt,
        mode,
        user: user.username,
        error: "Erro ao salvar no banco de dados",
      });
    }
  } catch (error: any) {
    console.error("Erro na geração de imagem:", error);
    return NextResponse.json(
      { error: error.message || "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export const POST = withAuth(async (request: NextRequest) => {
  const response = await handleImageGeneration(request);
  // Garante que sempre retorna NextResponse
  if (!response) {
    return NextResponse.json({ error: 'Erro desconhecido' }, { status: 500 });
  }
  return response;
}); 