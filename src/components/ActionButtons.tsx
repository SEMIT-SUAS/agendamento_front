"use client"

import { Dispatch, SetStateAction, useEffect, useState, useMemo } from "react"
import type { Agendamento } from "../types/agendamento"
import { useAuth } from "./AuthContext"

interface ActionButtonsProps {
  setAgendamentos: Dispatch<SetStateAction<Agendamento[]>>
  setSelectedAgendamento: Dispatch<SetStateAction<Agendamento | null>>
  selectedAgendamento: Agendamento | null
  selectedByUser: boolean;
  onCallPriority: () => void
  onFinalize: () => void
  onCancel: () => void
}

const BASE_URL = "http://192.168.200.157:8080/agendamentos"

export default function ActionButtons({
  setSelectedAgendamento,
  setAgendamentos,
  selectedAgendamento,
  onCancel,
}: ActionButtonsProps) {

  const { user } = useAuth();
  const [agendamentosDetalhe, setAgendamentosDetalhe] = useState<Agendamento[]>([])
  const [selectedByUser, setSelectedByUser] = useState(false);

  const onCallNormal = async () => {
      try {
      // 🔹 Buscar detalhamento
          const detalheResponse = await fetch(`${BASE_URL}/detalhamento`)
          const data: Agendamento[] = await detalheResponse.json()

          setAgendamentosDetalhe(data)

          // ✅ FILTRA DIRETO NO DATA
          const agendamentosEmAtendimento = data.filter(
            a => a.situacao === "EM_ATENDIMENTO"
          )

          if (agendamentosEmAtendimento.length > 0) {
            alert("Já existe um agendamento em atendimento. Finalize-o antes de chamar outro.")
            return
          }

          // 🔹 Chamar normal
          const secretariaId = user?.secretaria.id.toString();
          const userId = user?.id.toString();

          const response = await fetch(`${BASE_URL}/chamar/normal/${secretariaId}/${userId}`, { method: "POST" })
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          let chamado
          try {
            chamado = await response.json() 
            console.log('Data Chamar Normal:', chamado); 
          } catch {
            chamado = null
          }

          // setAgendamento(data);
          setSelectedAgendamento(chamado);
          
          setAgendamentos(prev =>
            prev.map(p =>
              p.agendamentoId === chamado?.id
                ? { ...p, situacao: "EM_ATENDIMENTO" }
                : p
            )
          );

        } catch (error) {
          console.error("Erro ao chamar normal:", error)
          alert("Erro ao chamar agendamento")
        }
  }
  
  const onCallPriority = async () => {
      try {
          // 🔹 Buscar detalhamento
          const detalheResponse = await fetch(`${BASE_URL}/detalhamento`)
          const data: Agendamento[] = await detalheResponse.json()

          setAgendamentosDetalhe(data)

          // ✅ FILTRA DIRETO NO DATA
          const agendamentosEmAtendimento = data.filter(
            a => a.situacao === "EM_ATENDIMENTO"
          )

          if (agendamentosEmAtendimento.length > 0) {
            alert("Já existe um agendamento em atendimento. Finalize-o antes de chamar outro.")
            return
          }

          const secretariaId = user?.secretaria.id.toString();
          const userId = user?.id.toString();
          const response = await fetch(`${BASE_URL}/chamar/prioridade/${secretariaId}/${userId}`, { method: "POST" })
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          let chamada
          try {
            chamada = await response.json() 
            console.log('Data Chamar Prioridade:', chamada); 
          } catch {
            chamada = null
          }

          // setAgendamento(chamada);
          setSelectedAgendamento(chamada);
          
          setAgendamentos(prev =>
            prev.map(p =>
              p.agendamentoId === chamada?.id
                ? { ...p, situacao: "EM_ATENDIMENTO" }
                : p
            )
          );

        } catch (error) {
          console.error("Erro ao chamar prioridade:", error)
          alert("Erro ao chamar agendamento")
        }
  }

  const onFinalize = async () => {
  if (!selectedAgendamento) {
    console.log("Não existe agendamento selecionado para finalizar.")
    return
  }

  if (selectedAgendamento.situacao !== "EM_ATENDIMENTO") {
    console.log("Agendamento não está em atendimento.")
    return
  }

  try {
    console.log("Finalizando:", selectedAgendamento)

    const response = await fetch(
      `${BASE_URL}/finalizar/${selectedAgendamento.agendamentoId}`,
      { method: "PUT" }
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    setAgendamentos(prev =>
      prev.map(p =>
        p.agendamentoId === selectedAgendamento.agendamentoId
          ? { ...p, situacao: "FINALIZADO" }
          : p
      )
    )

    setSelectedAgendamento(null)

  } catch (error) {
    console.error("Erro ao finalizar:", error)
    alert("Erro ao finalizar atendimento")
  }
}

  const showCallButtons = selectedAgendamento === null ||
  selectedAgendamento.situacao === "FINALIZADO" ||
  selectedAgendamento.situacao === "AGENDADO"

  const showActionButtons =
    selectedAgendamento !== null &&
    selectedAgendamento.situacao === "EM_ATENDIMENTO"



 return (
  <div className="flex gap-3 items-center">

    {/* 🔵 Chamar Normal / Prioridade */}
    {showCallButtons && (
      <div className="flex gap-3 items-center">
        <button
          className="px-4 py-2.5 text-sm font-medium rounded-md bg-blue-600 text-white"
          onClick={onCallNormal}
        >
          📢 Chamar Normal
        </button>

        <button
          className="px-4 py-2.5 text-sm font-medium rounded-md bg-orange-500 text-white"
          onClick={onCallPriority}
        >
          ⚡ Chamar Prioridade
        </button>
      </div>
    )}

    {/* 🟢 Finalizar / 🔴 Cancelar */}
    {showActionButtons && (
      <div className="flex gap-3 items-center">
        <button
          className="px-4 py-2.5 text-sm font-medium rounded-md bg-green-600 text-white"
          onClick={onFinalize}
        >
          ✅ Finalizar
        </button>

        <button
          className="px-4 py-2.5 text-sm font-medium rounded-md bg-red-600 text-white"
          onClick={onCancel}
        >
          ❌ Cancelar
        </button>
      </div>
    )}

  </div>
)
}