"use client"

import { useAuth } from "@/components/AuthContext";
import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom";
import { Routes, Route, Navigate } from "react-router-dom"

// interface LoginPageProps {
//   onLogin: (username: string) => void
// }

export default function LoginPage() {
  const navigate = useNavigate();

    // const { user, login, isLoading } = useAuth();
  const [login, setEmail] = useState("")
  const [senha, setPassword] = useState("")
  const [error, setError] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        // console.log("Enviando login:", { email, password });
        // const success = await login(email, password);

        // if (!success) {
        // setError('Email ou senha inválidos. Tente novamente.');
        // }

        // setIsSubmitting(false);

        try {
          const response = await fetch('http://localhost:8080/gerenciador/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              login,
              senha,
            }),
          });

          if (!response.ok) {
            throw new Error('Login inválido');
          }

          const data = await response.json();
          console.log('Login sucesso:', data);

          if(data.perfil === "ADMIN") navigate("/")
          // aqui você pode salvar token, redirecionar, etc.

        } catch (err) {
          setError('Email ou senha inválidos. Tente novamente.');
        } finally {
          setIsSubmitting(false);
        }
    };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 relative overflow-hidden">
      
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[400px] h-[400px] -top-48 -right-24 rounded-full bg-white/10 backdrop-blur-sm"></div>
        <div className="absolute w-[300px] h-[300px] -bottom-36 -left-24 rounded-full bg-white/10 backdrop-blur-sm"></div>
        <div className="absolute w-[200px] h-[200px] top-1/2 left-1/4 -translate-y-1/2 rounded-full bg-white/10 backdrop-blur-sm"></div>
      </div>

     <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 via-green-400 to-blue-600"></div>

      {/* Marca d'água sutil ou formas geométricas que lembram azulejos */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute top-10 right-10 w-64 h-64 border-8 border-blue-600 rounded-full"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 border-8 border-blue-600 rounded-full"></div>
      </div>

      <div className="w-full max-w-[440px] relative z-10">
        <div className="bg-white rounded-[2rem] shadow-2xl shadow-blue-900/10 p-10 border border-slate-100">
          
          {/* Cabeçalho Institucional */}
          <div className="text-center mb-10">
            {/* Logo da Prefeitura */}
            <div className="flex justify-center">
               <img src="/logo-prefeitura.png" alt="Prefeitura de São Luís" className="h-30 w-auto object-contain" />
            </div>
            
            <div className="h-1 w-12 bg-blue-600 mx-auto mb-5"></div>
            
            <h1 className="text-xl font-black text-slate-800 uppercase tracking-tight">
              Acesso ao <span className="text-blue-600">Sistema</span>
            </h1>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">
              ffffffffffsdfdfsdf
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                value={login}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                autoComplete="email"
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
                onChange={(e) => setPassword(e.target.value)}
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
                  <path
                    d="M8 4V9M8 11V12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="text-sm">{error}</span>
              </div>
            )}

            <button
              type="submit"
              //disabled={isLoading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98] mt-4 flex items-center justify-center gap-2"
            > Entrar
              {/*isLoading ? "Autenticando..." : "Entrar no Sistema"*/}
            </button>
          </form>


          {/* Demo info */}
          <div className="mt-8 text-center border-t border-slate-50 pt-8">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
              © 2026 Prefeitura de São Luís <br/> 
              <span className="text-blue-500">Secretaria Municipal de Tecnologia da Informação</span>
            </p>
          </div>
        </div>
      </div>

      {/* Responsive - hide circles on mobile */}
      <style>{`
        @media (max-width: 640px) {
          .absolute > div {
            display: none;
          }
          .p-12 {
            padding: 2rem 1.5rem;
          }
        }
      `}</style>
    </div>
  )
}