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

export default function HistoryPage() {
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [promptFilter, setPromptFilter] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchHistory();
    // eslint-disable-next-line
  }, [page, pageSize]);

  async function fetchHistory(filters = {}) {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
        ...(promptFilter && { prompt: promptFilter }),
        ...(from && { from }),
        ...(to && { to }),
        ...filters,
      });
      const res = await fetch(`/api/image/history?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Erro ao buscar histórico");
      setData(result.data);
      setTotal(result.total);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleFilter(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    fetchHistory({ page: 1 });
  }

  function handleDownload(url: string) {
    window.open(url, "_blank");
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden" style={{ background: '#0A0A0A', fontFamily: 'Garet, Arial, Helvetica, sans-serif' }}>
      {/* Blobs/gradientes animados */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-[#E50900]/40 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute top-1/2 right-0 w-[300px] h-[300px] bg-[#7F0500]/30 rounded-full blur-2xl animate-pulse-slow2" />
        <div className="absolute bottom-0 left-1/2 w-[500px] h-[200px] bg-[#E50900]/20 rounded-full blur-2xl animate-pulse-slow3" />
      </div>
      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-2 mb-4">
          <Image src="/logogamechange.svg" alt="Logo Game Change" width={70} height={70} />
        </div>
        <div className="w-full bg-[rgba(20,20,20,0.85)] rounded-2xl shadow-xl p-8 flex flex-col gap-6 border border-[#7F0500]/30 backdrop-blur-md">
          <h1 className="text-2xl font-bold text-center mb-2" style={{ color: COLORS.primary }}>Histórico de Gerações</h1>
          <form onSubmit={handleFilter} className="flex flex-col sm:flex-row gap-4 items-end justify-center">
            <div className="flex flex-col gap-1">
              <label className="text-xs" style={{ color: COLORS.contrast }}>Prompt</label>
              <input
                type="text"
                value={promptFilter}
                onChange={e => setPromptFilter(e.target.value)}
                className="rounded border px-2 py-1 text-sm"
                style={{ borderColor: COLORS.neutral, color: COLORS.contrast }}
                placeholder="Buscar por prompt"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs" style={{ color: COLORS.contrast }}>De</label>
              <input
                type="date"
                value={from}
                onChange={e => setFrom(e.target.value)}
                className="rounded border px-2 py-1 text-sm"
                style={{ borderColor: COLORS.neutral, color: COLORS.contrast }}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs" style={{ color: COLORS.contrast }}>Até</label>
              <input
                type="date"
                value={to}
                onChange={e => setTo(e.target.value)}
                className="rounded border px-2 py-1 text-sm"
                style={{ borderColor: COLORS.neutral, color: COLORS.contrast }}
              />
            </div>
            <button
              type="submit"
              className="bg-[var(--primary)] text-white font-semibold px-4 py-2 rounded hover:bg-[var(--highlight)] transition-colors"
              style={{ background: COLORS.primary }}
            >
              Filtrar
            </button>
          </form>
          {error && <div className="text-red-600 text-sm text-center">{error}</div>}
          {loading ? (
            <div className="text-center text-[var(--neutral)]">Carregando...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {data.length === 0 && <div className="col-span-full text-center text-[var(--neutral)]">Nenhum registro encontrado.</div>}
              {data.map((item, idx) => (
                <div key={item.id || idx} className="flex flex-col gap-2 items-center bg-[var(--background)] rounded-lg p-4 shadow border border-[var(--neutral)]" style={{ borderColor: COLORS.neutral }}>
                  <div className="flex gap-2">
                    <div className="flex flex-col items-center">
                      <span className="text-xs mb-1" style={{ color: COLORS.neutral }}>Original</span>
                      <Image src={item.originalUrl} alt="Original" width={80} height={80} className="rounded shadow" />
                      <button onClick={() => handleDownload(item.originalUrl)} className="text-xs underline mt-1" style={{ color: COLORS.neutral }}>Download</button>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-xs mb-1" style={{ color: COLORS.neutral }}>Gerada</span>
                      <Image src={item.generatedUrl} alt="Gerada" width={80} height={80} className="rounded shadow" />
                      <button onClick={() => handleDownload(item.generatedUrl)} className="text-xs underline mt-1" style={{ color: COLORS.neutral }}>Download</button>
                    </div>
                  </div>
                  <div className="text-xs text-center text-[var(--neutral)]" style={{ color: COLORS.neutral }}>
                    Prompt: {item.prompt}
                  </div>
                  <div className="text-xs text-center text-[var(--neutral)]" style={{ color: COLORS.neutral }}>
                    {new Date(item.createdAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 rounded bg-[var(--neutral)] text-white disabled:opacity-50"
              style={{ background: COLORS.neutral }}
            >
              Anterior
            </button>
            <span className="text-sm" style={{ color: COLORS.contrast }}>
              Página {page} de {Math.max(1, Math.ceil(total / pageSize))}
            </span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={page * pageSize >= total}
              className="px-3 py-1 rounded bg-[var(--neutral)] text-white disabled:opacity-50"
              style={{ background: COLORS.neutral }}
            >
              Próxima
            </button>
          </div>
          <button
            onClick={() => router.push("/dashboard")}
            className="text-xs text-center text-[var(--neutral)] underline mt-4"
            style={{ color: COLORS.neutral }}
          >
            Voltar ao Dashboard
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