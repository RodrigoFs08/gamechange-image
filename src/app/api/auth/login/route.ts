import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// Usuários fixos do sistema
const USERS = [
  { username: "admin", password: "123", name: "Administrador" },
  { username: "rodrigo", password: "gamechangeapp1", name: "Rodrigo" },
  { username: "weslley", password: "gamechangeapp", name: "Weslley" },
  { username: "user1", password: "123", name: "Usuário 1" },
  { username: "user2", password: "123", name: "Usuário 2" },
  { username: "user3", password: "123", name: "Usuário 3" },
];

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Validação básica
    if (!username || !password) {
      return NextResponse.json(
        { error: "Usuário e senha são obrigatórios" },
        { status: 400 }
      );
    }

    // Verificar credenciais
    const user = USERS.find(
      (u) => u.username === username && u.password === password
    );

    if (!user) {
      return NextResponse.json(
        { error: "Usuário ou senha inválidos" },
        { status: 401 }
      );
    }

    // Gerar token JWT
    const token = jwt.sign(
      { 
        username: user.username, 
        name: user.name,
        id: user.username 
      },
      process.env.JWT_SECRET || "fallback-secret-key",
      { expiresIn: "24h" }
    );

    return NextResponse.json({
      token,
      name: user.name,
      username: user.username,
    });
  } catch (error) {
    console.error("Erro no login:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
} 