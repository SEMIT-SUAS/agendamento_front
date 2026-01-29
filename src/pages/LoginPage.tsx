"use client";

import { useAuth } from "@/components/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();

  const [loginValue, setLoginValue] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const user = await login(loginValue, senha);

    if (!user) {
      setError("Email/CPF ou senha inválidos. Tente novamente.");
      return;
    }

    // ajuste as rotas conforme teu sistema
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[400px] h-[400px] -top-48 -right-24 rounded-full bg-white/10 backdrop-blur-sm"></div>
        <div className="absolute w-[300px] h-[300px] -bottom-36 -left-24 rounded-full bg-white/10 backdrop-blur-sm"></div>
        <div className="absolute w-[200px] h-[200px] top-1/2 left-1/4 -translate-y-1/2 rounded-full bg-white/10 backdrop-blur-sm"></div>
      </div>

      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 via-green-400 to-blue-600"></div>

      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute top-10 right-10 w-64 h-64 border-8 border-blue-600 rounded-full"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 border-8 border-blue-600 rounded-full"></div>
      </div>

      <div className="w-full max-w-[440px] relative z-10">
        <div className="bg-white rounded-[2rem] shadow-2xl shadow-blue-900/10 p-10 border border-slate-100">
          <div className="text-center mb-10">
            <div className="flex justify-center">
              <img
                src="/logo-prefeitura.png"
                alt="Prefeitura de São Luís"
                className="h-30 w-auto object-contain"
              />
            </div>

            <div className="h-1 w-12 bg-blue-600 mx-auto mb-5"></div>

            <h1 className="text-xl font-black text-slate-800 uppercase tracking-tight">
              Acesso ao <span className="text-blue-600">Sistema</span>
            </h1>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">
              ffffffffffsdfdfsdf
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                E-mail ou CPF
              </label>
              <input
                id="login"
                type="text"
                value={loginValue}
                onChange={(e) => setLoginValue(e.target.value)}
                placeholder="seu@email.com ou CPF"
                required
                autoComplete="username"
                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#667eea] focus:ring-4 focus:ring-[#667eea]/10 transition-all bg-white placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#667eea] focus:ring-4 focus:ring-[#667eea]/10 transition-all bg-white placeholder:text-gray-400"
              />
            </div>

            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                <svg width="18" height="18" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
                  <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="2" />
                  <path d="M8 4V9M8 11V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <span className="text-sm">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98] mt-4 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? "Autenticando..." : "Entrar no Sistema"}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-slate-50 pt-8">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
              © 2026 Prefeitura de São Luís <br />
              <span className="text-blue-500">Secretaria Municipal de Tecnologia da Informação</span>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .absolute > div { display: none; }
          .p-12 { padding: 2rem 1.5rem; }
        }
      `}</style>
    </div>
  );
}
