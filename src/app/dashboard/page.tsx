"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const COLORS = {
  primary: "#7F0500",
  highlight: "#E50900",
  background: "#FAFDF6",
  neutral: "#A49FA6",
  contrast: "#26231C",
};

export default function DashboardPage() {
  const [user, setUser] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userName = localStorage.getItem("user");
    if (!token) {
      router.replace("/login");
    } else {
      setUser(userName);
    }
  }, [router]);

  function handleNovaGeracao() {
    router.push("/generate");
  }

  function handleHistorico() {
    router.push("/history");
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.replace("/login");
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden" style={{ background: '#0A0A0A', fontFamily: 'Garet, Arial, Helvetica, sans-serif' }}>
      {/* Blobs/gradientes animados */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-[#E50900]/40 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute top-1/2 right-0 w-[300px] h-[300px] bg-[#7F0500]/30 rounded-full blur-2xl animate-pulse-slow2" />
        <div className="absolute bottom-0 left-1/2 w-[500px] h-[200px] bg-[#E50900]/20 rounded-full blur-2xl animate-pulse-slow3" />
      </div>
      <div className="relative z-10 w-full max-w-lg flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-2 mb-4">
          <Image src="/logogamechange.svg" alt="Logo Game Change" width={70} height={70} />
        </div>
        <div className="w-full bg-[rgba(20,20,20,0.85)] rounded-2xl shadow-xl p-8 flex flex-col gap-6 border border-[#7F0500]/30 backdrop-blur-md">
          <h1 className="text-2xl font-bold text-center" style={{ color: COLORS.primary }}>
            Bem-vindo{user ? `, ${user}` : ""}!
          </h1>
          <p className="text-center text-[var(--contrast)]" style={{ color: COLORS.contrast }}>
            Gere imagens com IA de forma simples e rápida.<br />
            Escolha uma opção abaixo:
          </p>
          <div className="flex flex-col gap-4">
            <button
              onClick={handleNovaGeracao}
              className="bg-[#E50900] text-white font-bold py-3 rounded-xl text-lg shadow-lg hover:bg-[#7F0500] transition-colors"
              style={{ fontFamily: 'Garet, Arial, Helvetica, sans-serif' }}
            >
              Nova Geração de Imagem
            </button>
            <button
              onClick={handleHistorico}
              className="bg-[#A49FA6] text-white font-bold py-3 rounded-xl text-lg shadow-lg hover:bg-[#E50900] transition-colors"
              style={{ fontFamily: 'Garet, Arial, Helvetica, sans-serif' }}
            >
              Ver Histórico
            </button>
          </div>
          <button
            onClick={handleLogout}
            className="text-xs text-center text-[var(--neutral)] underline mt-4"
            style={{ color: COLORS.neutral }}
          >
            Sair
          </button>
        </div>
      </div>
      {/* Animations */}
      <style jsx global>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.15); }
        }
        .animate-pulse-slow { animation: pulse-slow 7s infinite alternate; }
        .animate-pulse-slow2 { animation: pulse-slow 9s infinite alternate; }
        .animate-pulse-slow3 { animation: pulse-slow 11s infinite alternate; }
      `}</style>
    </div>
  );
} 