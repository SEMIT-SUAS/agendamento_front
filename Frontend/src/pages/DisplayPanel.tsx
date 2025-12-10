"use client"

import { useState, useEffect } from "react"
import "../styles/display-panel.css"
import type { Agendamento } from "../types/agendamento"

interface DisplayPanelProps {
  onNavigate: () => void
}

const BASE_URL = "http://192.168.200.34:8080/agendamentos"

export default function DisplayPanel({ onNavigate }: DisplayPanelProps) {
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
    <div className="display-panel">
      <div className="display-content">
        <div className="senha-display">{ultimaChamada?.senha || "---"}</div>

        <div className="info-display">
          <div className="usuario">{ultimaChamada?.usuarioNome || "Nenhuma chamada ainda"}</div>

          {ultimaChamada && (
            <>
              <div className="servico">Serviço: {ultimaChamada.servicoNome || "-"}</div>
              <div className="tipo">Tipo: {ultimaChamada.tipoAtendimento || ultimaChamada.usuarioTipo || "-"}</div>
              <div className="hora">
                {ultimaChamada.horaChamada
                  ? `Chamado em: ${new Date(ultimaChamada.horaChamada).toLocaleString("pt-BR")}`
                  : ""}
              </div>
            </>
          )}
        </div>

        <button className="back-button" onClick={onNavigate}>
          Voltar ao Painel
        </button>
      </div>
    </div>
  )
}
