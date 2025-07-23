import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

interface DecodedToken {
  user: string;
  iat: number;
  exp: number;
}

interface AuthResult {
  error?: string;
  status?: number;
  user?: DecodedToken;
}

export function verifyToken(request: NextRequest): AuthResult {
  try {
    const authHeader = request.headers.get("authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return { error: "Token não fornecido", status: 401 };
    }

    const token = authHeader.substring(7);
    
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || "fallback-secret-key"
    ) as DecodedToken;

    return { user: decoded };
  } catch {
    return { error: "Token inválido", status: 401 };
  }
}

export function withAuth(handler: (request: NextRequest) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    const authResult = verifyToken(request);
    
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    // Adicionar usuário ao request
    (request as NextRequest & { user: DecodedToken }).user = authResult.user!;
    
    return handler(request);
  };
} 