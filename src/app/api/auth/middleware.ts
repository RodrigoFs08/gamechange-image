import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function verifyToken(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return { error: "Token não fornecido", status: 401 };
    }

    const token = authHeader.substring(7);
    
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || "fallback-secret-key"
    ) as any;

    return { user: decoded };
  } catch (error) {
    return { error: "Token inválido", status: 401 };
  }
}

export function withAuth(handler: Function) {
  return async (request: NextRequest) => {
    const authResult = verifyToken(request);
    
    if (authResult.error) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    // Adicionar usuário ao request
    (request as any).user = authResult.user;
    
    return handler(request);
  };
} 