"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const COLORS = {
  primary: "#7F0500",
  highlight: "#E50900",
  background: "#FAFDF6",
  neutral: "#A49FA6",
  contrast: "#26231C",
};

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao autenticar");
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", data.name);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ background: '#0A0A0A', fontFamily: 'Garet, Arial, Helvetica, sans-serif' }}>
      {/* Blobs/gradientes animados */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-[#E50900]/40 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute top-1/2 right-0 w-[300px] h-[300px] bg-[#7F0500]/30 rounded-full blur-2xl animate-pulse-slow2" />
        <div className="absolute bottom-0 left-1/2 w-[500px] h-[200px] bg-[#E50900]/20 rounded-full blur-2xl animate-pulse-slow3" />
      </div>
      <div className="relative z-10 w-full max-w-sm flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-2 mb-4">
          <Image src="/logogamechange.svg" alt="Logo Game Change" width={80} height={80} />
        </div>
        <form
          onSubmit={handleLogin}
          className="w-full bg-[rgba(20,20,20,0.85)] rounded-2xl shadow-xl p-8 flex flex-col gap-6 border border-[#7F0500]/30 backdrop-blur-md"
        >
          <h1 className="text-2xl font-bold text-center" style={{ color: COLORS.primary }}>Game Change Images</h1>
          <div className="flex flex-col gap-2">
            <label htmlFor="username" className="font-medium text-sm" style={{ color: COLORS.contrast }}>Usuário</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="rounded-xl border-2 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#E50900] bg-black/40 text-white placeholder:text-[#A49FA6]"
              style={{ borderColor: COLORS.neutral, color: COLORS.contrast }}
              required
              autoFocus
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="font-medium text-sm" style={{ color: COLORS.contrast }}>Senha</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="rounded-xl border-2 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#E50900] bg-black/40 text-white placeholder:text-[#A49FA6]"
              style={{ borderColor: COLORS.neutral, color: COLORS.contrast }}
              required
            />
          </div>
          {error && <div className="text-red-600 text-sm text-center font-semibold">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="bg-[#E50900] text-white font-bold py-3 rounded-xl text-lg shadow-lg hover:bg-[#7F0500] transition-colors disabled:opacity-60"
            style={{ fontFamily: 'Garet, Arial, Helvetica, sans-serif' }}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
          <div className="text-xs text-center text-[var(--neutral)]" style={{ color: COLORS.neutral }}>
            © Game Change - Inovação ao seu alcance
          </div>
        </form>
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