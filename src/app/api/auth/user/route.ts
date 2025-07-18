import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "../middleware";

export async function GET(request: NextRequest) {
  const authResult = verifyToken(request);
  
  if (authResult.error) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status }
    );
  }

  return NextResponse.json({
    user: authResult.user,
  });
} 