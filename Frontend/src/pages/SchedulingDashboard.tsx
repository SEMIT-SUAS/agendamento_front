"use client"

import { useState, useEffect } from "react"
import SearchBar from "../components/SearchBar"
import ActionButtons from "../components/ActionButtons"
import SchedulingTable from "../components/SchedulingTable"
import SchedulingModal from "../components/SchedulingModal"
import DetailsModal from "../components/DetailsModal"
import type { Agendamento } from "../types/agendamento"
import "../styles/scheduling-dashboard.css"

interface SchedulingDashboardProps {
  onNavigate: () => void
}

const BASE_URL = "http://192.168.200.34:8080/agendamentos"

export default function SchedulingDashboard({ onNavigate }: SchedulingDashboardProps) {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAgendamento, setSelectedAgendamento] = useState<Agendamento | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`${BASE_URL}/listar-todos`)
        const data = await response.json()
        const lista = Array.isArray(data) ? data : data.content || data.data || []
        setAgendamentos(lista)

        // Auto-select em atendimento
        const emAtendimento = lista.find((e: Agendamento) => e.situacao === "EM_ATENDIMENTO")
        if (emAtendimento) {
          setSelectedAgendamento(emAtendimento)
        }
      } catch (error) {
        console.error("Erro ao carregar agendamentos:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
    const interval = setInterval(loadData, 10000)
    return () => clearInterval(interval)
  }, [])

  const handleCall = async (tipo: "normal" | "prioridade") => {
    try {
      const response = await fetch(`${BASE_URL}/chamar/${tipo}`, { method: "POST" })
      const text = await response.text()

      let data
      try {
        data = JSON.parse(text)
      } catch {
        data = null
      }

      if (response.ok) {
        if (data?.agendamento) {
          setSelectedAgendamento(data.agendamento)
        }
        // Reload the list
        const listResponse = await fetch(`${BASE_URL}/listar-todos`)
        const listData = await listResponse.json()
        const lista = Array.isArray(listData) ? listData : listData.content || []
        setAgendamentos(lista)
      }
    } catch (error) {
      console.error("Erro ao chamar:", error)
      alert("Erro ao chamar agendamento")
    }
  }

  const handleCancelAppointment = async () => {
    if (!selectedAgendamento?.agendamentoId) return
    if (!confirm(`Cancelar a senha ${selectedAgendamento.senha}?`)) return

    try {
      const response = await fetch(`${BASE_URL}/cancelar/${selectedAgendamento.agendamentoId}`, {
        method: "PUT",
      })

      if (response.ok) {
        alert("Agendamento cancelado com sucesso!")
        setSelectedAgendamento(null)
        // Reload
        const listResponse = await fetch(`${BASE_URL}/listar-todos`)
        const listData = await listResponse.json()
        const lista = Array.isArray(listData) ? listData : listData.content || []
        setAgendamentos(lista)
      }
    } catch (error) {
      console.error("Erro ao cancelar:", error)
      alert("Erro ao cancelar agendamento")
    }
  }

  const handleShowDetails = async () => {
    if (!selectedAgendamento?.agendamentoId) return

    try {
      const response = await fetch(`${BASE_URL}/detalhes`)
      const dados = await response.json()

      const detalhe = dados.find(
        (a: Agendamento) => Number(a.agendamentoId) === Number(selectedAgendamento.agendamentoId),
      )

      if (detalhe) {
        setSelectedAgendamento(detalhe)
        setShowDetailsModal(true)
      }
    } catch (error) {
      console.error("Erro ao buscar detalhes:", error)
      alert("Erro ao buscar detalhes")
    }
  }

  const filteredAgendamentos = agendamentos.filter(
    (agendamento) =>
      agendamento.usuarioNome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agendamento.senha?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agendamento.servicoNome?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="scheduling-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Painel de Agendamentos</h1>
          <p>Centro Avançado de Apoio - São Luís</p>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="controls-section">
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
          <ActionButtons
            selectedAgendamento={selectedAgendamento}
            onCallNormal={() => handleCall("normal")}
            onCallPriority={() => handleCall("prioridade")}
            onFinalize={() => console.log("Finalizar")}
            onCancel={() => handleCancelAppointment()}
          />
        </div>

        <SchedulingTable
          agendamentos={filteredAgendamentos}
          selectedAgendamento={selectedAgendamento}
          onSelectAgendamento={setSelectedAgendamento}
          isLoading={isLoading}
        />
      </main>

      {selectedAgendamento && (
        <SchedulingModal
          agendamento={selectedAgendamento}
          onClose={() => setSelectedAgendamento(null)}
          onShowDetails={handleShowDetails}
          onCancel={handleCancelAppointment}
        />
      )}

      {showDetailsModal && selectedAgendamento && (
        <DetailsModal agendamento={selectedAgendamento} onClose={() => setShowDetailsModal(false)} />
      )}
    </div>
  )
}
