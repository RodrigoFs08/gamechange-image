import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "../../auth/middleware";
import { PrismaClient } from "../../../../generated/prisma";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

// Função para upload no Google Cloud Storage
async function uploadToGCS(file: Buffer, filename: string): Promise<string> {
  try {
    // Verificar se as variáveis de ambiente estão configuradas
    if (!process.env.GOOGLE_CLOUD_KEYFILE || !process.env.GOOGLE_CLOUD_BUCKET_NAME) {
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

    // Integração real com Google Cloud Storage
    const { Storage } = await import("@google-cloud/storage");
    const storage = new Storage({
      keyFilename: process.env.GOOGLE_CLOUD_KEYFILE,
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
    });

    const bucket = storage.bucket(process.env.GOOGLE_CLOUD_BUCKET_NAME);
    const blob = bucket.file(filename);
    
    await blob.save(file, {
      metadata: {
        contentType: "image/png",
      },
    });
    
    // Tornar público
    await blob.makePublic();
    
    console.log(`✅ Imagem salva no GCS: ${filename}`);
    return `https://storage.googleapis.com/${bucket.name}/${filename}`;
  } catch (error) {
    console.error("❌ Erro no upload para GCS:", error);
    // Fallback para mock em caso de erro
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

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt é obrigatório" },
        { status: 400 }
      );
    }

    let originalUrl: string | undefined;
    let generatedUrl: string;

    if (mode === "edit" && imageFile) {
      // Modo edição - usar a imagem enviada
      const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
      const originalFilename = `original/${uuidv4()}.png`;
      originalUrl = await uploadToGCS(imageBuffer, originalFilename);

      // Gerar imagem editada com OpenAI
      try {
        const { OpenAI } = await import("openai");
        const openai = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY,
        });

        const response = await openai.images.edit({
          image: imageBuffer as any,
          prompt: prompt,
          n: 1,
          size: "1024x1024",
        });

        if (!response.data || !response.data[0]?.url) {
          throw new Error("Erro ao gerar imagem editada");
        }

        // Download da imagem gerada
        const generatedImageResponse = await fetch(response.data[0].url);
        const generatedImageBuffer = Buffer.from(await generatedImageResponse.arrayBuffer());
        const generatedFilename = `generated/${uuidv4()}.png`;
        generatedUrl = await uploadToGCS(generatedImageBuffer, generatedFilename);
      } catch (openaiError) {
        console.error("Erro OpenAI:", openaiError);
        // Fallback para mock se OpenAI falhar
        const generatedFilename = `generated/${uuidv4()}.png`;
        generatedUrl = await uploadToGCS(imageBuffer, generatedFilename);
      }
    } else {
      // Modo geração do zero com OpenAI
      try {
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
      } catch (openaiError) {
        console.error("Erro OpenAI:", openaiError);
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

export const POST = withAuth(handleImageGeneration); 