"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const COLORS = {
  primary: "#7F0500",
  highlight: "#E50900",
  background: "#0A0A0A",
  glass: "rgba(20,20,20,0.85)",
  neutral: "#A49FA6",
  contrast: "#FAFDF6",
};

export default function GeneratePage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ originalUrl?: string; generatedUrl: string; prompt: string } | null>(null);
  const [mode, setMode] = useState<'edit' | 'zero'>('edit');
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] || null;
    setFile(f);
    setResult(null);
    setError("");
    if (f) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(f);
    } else {
      setPreview(null);
    }
  }

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      if (mode === 'edit') {
        if (!file) throw new Error("Selecione uma imagem.");
      }
      
      // Validação mais robusta do prompt
      const trimmedPrompt = prompt.trim();
      if (!trimmedPrompt) {
        throw new Error("Digite um prompt válido.");
      }
      
      if (trimmedPrompt.length < 3) {
        throw new Error("O prompt deve ter pelo menos 3 caracteres.");
      }
      
      // Logs de debug
      console.log("🔍 Debug - Dados sendo enviados:");
      console.log("Prompt original:", prompt);
      console.log("Prompt trimmed:", trimmedPrompt);
      console.log("Mode:", mode);
      console.log("File:", file ? "Presente" : "Ausente");
      
      const formData = new FormData();
      if (mode === 'edit' && file) formData.append("image", file);
      formData.append("prompt", trimmedPrompt);
      formData.append("mode", mode);
      
      // Verificar se os dados foram adicionados ao FormData
      console.log("🔍 Debug - FormData contents:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value instanceof File ? "File" : value);
      }
      
      const token = localStorage.getItem("token");
      const res = await fetch("/api/image/upload", {
        method: "POST",
        headers: { 
          Authorization: `Bearer ${token}`,
          // Removendo Content-Type para deixar o browser definir automaticamente para FormData
        },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao gerar imagem");
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleDownload(url: string) {
    window.open(url, "_blank");
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden" style={{ background: COLORS.background, fontFamily: 'Garet, Arial, Helvetica, sans-serif' }}>
      {/* Blobs/gradientes animados */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-[#E50900]/40 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute top-1/2 right-0 w-[300px] h-[300px] bg-[#7F0500]/30 rounded-full blur-2xl animate-pulse-slow2" />
        <div className="absolute bottom-0 left-1/2 w-[500px] h-[200px] bg-[#E50900]/20 rounded-full blur-2xl animate-pulse-slow3" />
      </div>
      <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col gap-8 items-center justify-center p-4">
        {/* Logo Game Change */}
        <div className="flex flex-col items-center gap-2 mb-2">
          <Image src="/logogamechange.svg" alt="Logo Game Change" width={70} height={70} />
        </div>
        {/* Alternador de modo */}
        <div className="flex gap-2 mb-2">
          <button
            type="button"
            className={`px-4 py-2 rounded-l-xl font-bold text-sm transition-colors ${mode === 'edit' ? 'bg-[#E50900] text-white' : 'bg-black/40 text-[#A49FA6]'}`}
            onClick={() => setMode('edit')}
          >
            Imagem+Prompt
          </button>
          <button
            type="button"
            className={`px-4 py-2 rounded-r-xl font-bold text-sm transition-colors ${mode === 'zero' ? 'bg-[#E50900] text-white' : 'bg-black/40 text-[#A49FA6]'}`}
            onClick={() => { setMode('zero'); setFile(null); setPreview(null); }}
          >
            Gerar do Zero
          </button>
        </div>
        <form onSubmit={handleGenerate} className="w-full flex flex-col gap-6 items-center bg-[rgba(20,20,20,0.85)] rounded-2xl shadow-xl p-8 border border-[#7F0500]/30 backdrop-blur-md">
          <h1 className="text-2xl font-bold text-center mb-2" style={{ color: COLORS.highlight }}>{mode === 'edit' ? 'Nova Imagem+Prompt' : 'Geração de Imagem do Zero'}</h1>
          {/* Upload por ícone (apenas modo edição) */}
          {mode === 'edit' && (
            <div className="flex flex-col items-center gap-2 w-full">
              <input
                ref={inputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleFileChange}
                className="hidden"
                id="upload-image"
              />
              <label htmlFor="upload-image" className="cursor-pointer flex flex-col items-center justify-center w-24 h-24 rounded-full bg-[#E50900]/30 hover:bg-[#E50900]/60 transition-colors border-2 border-dashed border-[#E50900] shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="#E50900" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m0 0L8 8m4-4l4 4M4 20h16" />
                </svg>
                <span className="text-xs mt-1 text-[#E50900]">Upload</span>
              </label>
              {preview && (
                <div className="flex justify-center mt-2">
                  <Image src={preview} alt="Preview" width={120} height={120} className="rounded shadow border-2 border-[#E50900]/60" />
                </div>
              )}
            </div>
          )}
          {/* Prompt grande */}
          <div className="flex flex-col gap-2 w-full">
            <label className="font-medium text-sm" style={{ color: COLORS.contrast }}>Prompt</label>
            <textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              className="rounded-xl border-2 px-4 py-3 min-h-[64px] text-base focus:outline-none focus:ring-2 focus:ring-[#E50900] bg-black/40 text-white placeholder:text-[#A49FA6]"
              style={{ borderColor: COLORS.highlight, fontFamily: 'Garet, Arial, Helvetica, sans-serif' }}
              placeholder={mode === 'edit' ? "Descreva a edição desejada..." : "Descreva a imagem que deseja criar do zero..."}
              required
              maxLength={300}
            />
          </div>
          {error && <div className="text-red-500 text-sm text-center font-semibold">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-[#E50900] text-white font-bold py-3 rounded-xl text-lg shadow-lg hover:bg-[#7F0500] transition-colors disabled:opacity-60"
            style={{ fontFamily: 'Garet, Arial, Helvetica, sans-serif' }}
          >
            {loading ? (
              <svg className="animate-spin mr-2 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            )}
            {loading ? (mode === 'edit' ? "Processando..." : "Gerando...") : (mode === 'edit' ? "Processar Imagem+Prompt" : "Gerar Imagem")}
          </button>
        </form>
        {result && (
          <div className="w-full flex flex-col gap-4 items-center bg-[rgba(20,20,20,0.85)] rounded-2xl shadow-xl p-6 border border-[#E50900]/30 backdrop-blur-md mt-4">
            <h2 className="text-lg font-semibold text-center" style={{ color: COLORS.highlight }}>Resultado</h2>
            <div className="flex flex-col sm:flex-row gap-6 items-center justify-center">
              {result.originalUrl && (
                <div className="flex flex-col items-center">
                  <span className="text-xs mb-1" style={{ color: COLORS.neutral }}>Original</span>
                  <Image src={result.originalUrl} alt="Original" width={180} height={180} className="rounded-xl shadow border-2 border-[#E50900]/60" />
                  <button onClick={() => handleDownload(result.originalUrl!)} className="text-xs underline mt-1" style={{ color: COLORS.neutral }}>Download</button>
                </div>
              )}
              <div className="flex flex-col items-center">
                <span className="text-xs mb-1" style={{ color: COLORS.neutral }}>{mode === 'edit' ? 'Gerada' : 'Criada'}</span>
                <Image src={result.generatedUrl} alt="Gerada" width={180} height={180} className="rounded-xl shadow border-2 border-[#E50900]/60" />
                <button onClick={() => handleDownload(result.generatedUrl)} className="text-xs underline mt-1" style={{ color: COLORS.neutral }}>Download</button>
              </div>
            </div>
            <div className="text-xs text-center text-[var(--neutral)]" style={{ color: COLORS.neutral }}>
              Prompt: {result.prompt}
            </div>
          </div>
        )}
        <button
          onClick={() => router.push("/dashboard")}
          className="text-xs text-center text-[var(--neutral)] underline mt-4"
          style={{ color: COLORS.neutral }}
        >
          Voltar ao Dashboard
        </button>
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