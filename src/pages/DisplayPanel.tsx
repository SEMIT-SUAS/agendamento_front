"use client"

import { useState, useEffect } from "react"
import type { Agendamento } from "../types/agendamento"

interface DisplayPanelProps {
  onNavigate: () => void
  onLogout: () => void
  currentUser: string
}

const BASE_URL = "http://192.168.200.180:8080/agendamentos"

export default function DisplayPanel({ onNavigate, onLogout, currentUser }: DisplayPanelProps) {
  const [ultimaChamada, setUltimaChamada] = useState<Agendamento | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/ultima-chamada`)

        if (response.status === 204) {
          setUltimaChamada(null)
          return
        }

        const data = await response.json()
        setUltimaChamada(data)
      } catch (error) {
        console.error("Erro ao carregar última chamada:", error)
      }
    }

    loadData()
    const interval = setInterval(loadData, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#0a1628] to-[#1a2a40] text-white font-sans">
      {/* Header com logout */}
      <div className="flex justify-end items-center gap-4 p-5 lg:p-8 bg-black/20 border-b border-white/10">
        <div className="text-sm text-white/90 font-medium">
          {currentUser}
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-md text-white text-sm font-medium cursor-pointer transition-all duration-200 backdrop-blur hover:bg-white/20 hover:border-white/40 hover:-translate-y-0.5 active:translate-y-0"
          onClick={onLogout}
        >
          <svg 
            className="w-4 h-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
            />
          </svg>
          Sair
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center p-10 m-10 rounded-2xl bg-white/2 backdrop-blur border border-white/10 shadow-2xl shadow-black/30">
        <div 
          className="text-[120px] font-bold text-[#00f5d4] mb-6 -tracking-tighter leading-none"
          style={{ textShadow: '0 0 40px rgba(0, 245, 212, 0.5)' }}
        >
          {ultimaChamada?.senha || "---"}
        </div>

        <div className="flex flex-col gap-4">
          <div 
            className="text-4xl font-semibold text-white"
            style={{ textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)' }}
          >
            {ultimaChamada?.usuarioNome || "Nenhuma chamada ainda"}
          </div>

          {ultimaChamada && (
            <>
              <div className="text-xl text-white/80 opacity-90">
                Serviço: {ultimaChamada.servicoNome || "-"}
              </div>
              <div className="text-lg text-[#ffd166] font-medium">
                Tipo: {ultimaChamada.tipoAtendimento || ultimaChamada.usuarioTipo || "-"}
              </div>
              <div className="text-sm text-white/60 opacity-70">
                {ultimaChamada.horaChamada
                  ? `Chamado em: ${new Date(ultimaChamada.horaChamada).toLocaleString("pt-BR")}`
                  : ""}
              </div>
            </>
          )}
        </div>

        <button
          className="mt-10 px-7 py-3 bg-white/10 text-white border border-white/30 rounded-md text-sm font-medium cursor-pointer transition-all duration-200 backdrop-blur hover:bg-white/20 hover:border-white/50 hover:-translate-y-0.5"
          onClick={onNavigate}
        >
          Voltar ao Painel
        </button>
      </div>
    </div>
  )
}