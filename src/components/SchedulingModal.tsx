"use client"

import type { Agendamento } from "../types/agendamento"

interface SchedulingModalProps {
  agendamento: Agendamento
  onClose: () => void
  onShowDetails: () => void
  onCancel: () => void
}

export default function SchedulingModal({ agendamento, onClose, onShowDetails, onCancel }: SchedulingModalProps) {
  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-[fadeIn_0.2s_ease]"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl max-w-[500px] w-[90%] max-h-[90vh] overflow-y-auto animate-[slideUp_0.3s_ease]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-5 border-b border-gray-200">
          <h2 className="text-lg font-semibold m-0">Agendamento Selecionado</h2>
          <button
            className="bg-none border-none text-2xl text-gray-400 cursor-pointer p-0 w-8 h-8 flex items-center justify-center rounded-md transition-all duration-200 hover:bg-gray-100 hover:text-gray-600"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="p-5">
          <div className="flex flex-col gap-3">
            <span className="text-3xl font-semibold text-blue-600">{agendamento.senha}</span>
            <span className="text-lg text-gray-800 font-medium">{agendamento.usuarioNome}</span>
          </div>
        </div>

        <div className="flex gap-3 p-5 border-t border-gray-200 justify-end">
          <button
            className="px-4 py-2.5 text-sm font-medium rounded-md bg-gray-600 text-white transition-all duration-200 hover:bg-gray-700 hover:shadow-md"
            onClick={onShowDetails}
          >
            📋 Detalhes
          </button>
          <button
            className="px-4 py-2.5 text-sm font-medium rounded-md bg-red-600 text-white transition-all duration-200 hover:bg-red-700 hover:shadow-md"
            onClick={onCancel}
          >
            ❌ Não Compareceu
          </button>
          <button
            className="px-4 py-2.5 text-sm font-medium rounded-md bg-transparent text-blue-600 border border-gray-300 transition-all duration-200 hover:bg-gray-50 hover:border-blue-600"
            onClick={onClose}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  )
}