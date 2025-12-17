"use client"

import type { Agendamento } from "../types/agendamento"

interface ActionButtonsProps {
  selectedAgendamento: Agendamento | null
  onCallNormal: () => void
  onCallPriority: () => void
  onFinalize: () => void
  onCancel: () => void
}

export default function ActionButtons({
  selectedAgendamento,
  onCallNormal,
  onCallPriority,
  onFinalize,
  onCancel,
}: ActionButtonsProps) {
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