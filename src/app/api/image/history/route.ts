import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "../../auth/middleware";
import { PrismaClient } from "../../../../generated/prisma";

const prisma = new PrismaClient();

// Histórico agora usa apenas dados reais do banco

async function handleHistory(request: NextRequest) {
  try {
    const user = (request as any).user;
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "6");
    const promptFilter = searchParams.get("prompt") || "";
    const from = searchParams.get("from") || "";
    const to = searchParams.get("to") || "";

    // Buscar do banco de dados
    const where: any = {};
    
    if (promptFilter) {
      where.prompt = {
        contains: promptFilter,
        mode: 'insensitive'
      };
    }
    
    if (from || to) {
      where.createdAt = {};
      if (from) where.createdAt.gte = new Date(from);
      if (to) where.createdAt.lte = new Date(to);
    }

    const [data, total] = await Promise.all([
      prisma.generation.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.generation.count({ where })
    ]);

    console.log(`📊 Histórico: ${data.length} registros encontrados`);

    return NextResponse.json({
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error: any) {
    console.error("Erro ao buscar histórico:", error);
    return NextResponse.json(
      { error: error.message || "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export const GET = withAuth(handleHistory); 