"use client"

import { useState, useEffect } from "react"
import SearchBar from "../components/SearchBar"
import ActionButtons from "../components/ActionButtons"
import SchedulingTable from "../components/SchedulingTable"
import SchedulingModal from "../components/SchedulingModal"
import DetailsModal from "../components/DetailsModal"
import type { Agendamento } from "../types/agendamento"
import { useAuth } from "@/components/AuthContext";

interface SchedulingDashboardProps {
  onNavigate: () => void
  onLogout: () => void
  currentUser: string
}

const BASE_URL = "http://192.168.200.157:8080/agendamentos"

export default function SchedulingDashboard({ onNavigate }: SchedulingDashboardProps) {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAgendamento, setSelectedAgendamento] = useState<Agendamento | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { user, logout, clearCache } = useAuth();

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`${BASE_URL}/secretaria/30`)
        console.log('Retorno de SecretariaID:', response);
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
    
    // const interval = setInterval(loadData, 10000)
    // return () => clearInterval(interval)
  }, [])

  const handleRowClick = (agendamento: Agendamento) => {
    // Esta função será chamada apenas para seleção de linha,
    // o botão já lidou com sua própria lógica e stopPropagation
    setSelectedAgendamento(agendamento);
  };

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

  const termo = searchTerm.trim().toLowerCase();

  const filteredAgendamentos =
    termo === ""
      ? agendamentos
      : agendamentos.filter((agendamento) =>
          agendamento.usuarioNome?.toLowerCase().includes(termo) ||
          agendamento.senha?.toLowerCase().includes(termo) ||
          agendamento.servicoNome?.toLowerCase().includes(termo)
        );

  const handleOpenDetails = (agendamento: Agendamento) => {
    setSelectedAgendamento(agendamento)
    setShowDetailsModal(true)
  }


  // console.log('Total de agendamentos antes do filtro:', filteredAgendamentos.length)

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-8 shadow-md">
  <div className="header-content">
    <h1 className="text-2xl font-semibold mb-1 -tracking-wide">Painel de Agendamentos</h1>
    <p className="text-sm text-white/80">Centro Avançado de Apoio - São Luís</p>
  </div>
    <button onClick={clearCache}>Sair</button>
</header>

      <main className="flex-1 overflow-auto p-6 lg:p-12 flex flex-col gap-6">
        <div className="flex gap-4 items-center bg-white p-5 rounded-lg shadow-sm border border-gray-200 flex-wrap">
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
          <ActionButtons
            selectedAgendamento={selectedAgendamento}
            setAgendamentos={setAgendamentos}
            setSelectedAgendamento={setSelectedAgendamento}
            onCallPriority={() => handleCall("prioridade")}
            onFinalize={() => console.log("Finalizar")}
            onCancel={() => handleCancelAppointment()}
          />
        </div>

        <SchedulingTable
          setAgendamentos={setAgendamentos}
          onSelectAgendamento={handleOpenDetails}
          agendamentos={filteredAgendamentos}
          selectedAgendamento={selectedAgendamento}
          // onSelectAgendamento={setSelectedAgendamento}
          isLoading={isLoading}
        />
      </main>

      {showDetailsModal && selectedAgendamento && (
        <DetailsModal
          agendamento={selectedAgendamento}
          onClose={() => setShowDetailsModal(false)}
        />
      )}
    </div>
  )
}