"use client"

import { Dispatch, SetStateAction, useState } from "react"
import type { Agendamento } from "../types/agendamento"
import { useAuth } from "./AuthContext"

interface ActionButtonsProps {
  setAgendamentos: Dispatch<SetStateAction<Agendamento[]>>
  setSelectedAgendamento: Dispatch<SetStateAction<Agendamento | null>>
  selectedAgendamento: Agendamento | null
  // onCallNormal: () => void
  onCallPriority: () => void
  onFinalize: () => void
  onCancel: () => void
}

const BASE_URL = "http://192.168.200.157:8080/agendamentos"

export default function ActionButtons({
  setSelectedAgendamento,
  setAgendamentos,
  selectedAgendamento,
  onCallPriority,
  onFinalize,
  onCancel,
}: ActionButtonsProps) {

  const { user } = useAuth();
  // const [agendamento, setAgendamento] =  useState<Agendamento | null>(null);

  const onCallNormal = async () => {
      try {
          const secretariaId = user?.secretaria.id.toString();
          const userId = user?.id.toString();
          const response = await fetch(`${BASE_URL}/chamar/normal/${secretariaId}/${userId}`, { method: "POST" })
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          let data
          try {
            data = await response.json() 
            console.log('Data Chamar Normal:', data); 
          } catch {
            data = null
          }

          // setAgendamento(data);
          setSelectedAgendamento(data);
          
          setAgendamentos(prev =>
            prev.map(p =>
              p.agendamentoId === data?.id
                ? { ...p, situacao: "EM_ATENDIMENTO" }
                : p
            )
          );

        } catch (error) {
          console.error("Erro ao chamar normal:", error)
          alert("Erro ao chamar agendamento")
        }
  }

  return (
    <div className="flex gap-3 items-center">
      {!selectedAgendamento ? (
        <div className="flex gap-3 items-center">
          <button
            className="px-4 py-2.5 text-sm font-medium rounded-md bg-blue-600 text-white flex items-center gap-1.5 transition-all duration-200 hover:bg-blue-700 hover:shadow-md hover:-translate-y-0.5 whitespace-nowrap"
            onClick={onCallNormal}
            title="Chamar próximo agendamento"
          >
            <span className="text-base leading-none">📢</span>
            Chamar Normal
          </button>
          <button
            className="px-4 py-2.5 text-sm font-medium rounded-md bg-orange-500 text-white flex items-center gap-1.5 transition-all duration-200 hover:bg-[#f05a1e] hover:shadow-md hover:-translate-y-0.5 whitespace-nowrap"
            onClick={onCallPriority}
            title="Chamar próximo com prioridade"
          >
            <span className="text-base leading-none">⚡</span>
            Chamar Prioridade
          </button>
        </div>
      ) : (
        <div className="flex gap-3 items-center">
          <button
            className="px-4 py-2.5 text-sm font-medium rounded-md bg-green-600 text-white flex items-center gap-1.5 transition-all duration-200 hover:bg-green-700 hover:shadow-md hover:-translate-y-0.5 whitespace-nowrap"
            onClick={onFinalize}
            title="Finalizar atendimento"
          >
            <span className="text-base leading-none">✅</span>
            Finalizar
          </button>
          <button
            className="px-4 py-2.5 text-sm font-medium rounded-md bg-red-600 text-white flex items-center gap-1.5 transition-all duration-200 hover:bg-red-700 hover:shadow-md hover:-translate-y-0.5 whitespace-nowrap"
            onClick={onCancel}
            title="Marcar como não compareceu"
          >
            <span className="text-base leading-none">❌</span>
            Cancelar
          </button>
        </div>
      )}
    </div>
  )
}