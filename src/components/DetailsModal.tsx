"use client"

import type { Agendamento } from "../types/agendamento"
import { formatDate, formatSituation } from "../utils/formatters"

interface DetailsModalProps {
  agendamento: Agendamento
  onClose: () => void
}

export default function DetailsModal({ agendamento, onClose }: DetailsModalProps) {
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
          <h2 className="text-lg font-semibold m-0">Detalhes do Cidadão</h2>
          <button
            className="bg-none border-none text-2xl text-gray-400 cursor-pointer p-0 w-8 h-8 flex items-center justify-center rounded-md transition-all duration-200 hover:bg-gray-100 hover:text-gray-600"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="p-5">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Nome:</label>
              <span className="text-sm text-gray-800">{agendamento.usuarioNome}</span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Serviço:</label>
              <span className="text-sm text-gray-800">{agendamento.servicoNome}</span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Senha:</label>
              <span className="text-sm text-gray-800">{agendamento.senha}</span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Situação:</label>
              <span className="text-sm text-gray-800">{formatSituation(agendamento.situacao)}</span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tipo de Atendimento:</label>
              <span className="text-sm text-gray-800">{agendamento.tipoAtendimento}</span>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Data/Hora:</label>
              <span className="text-sm text-gray-800">{formatDate(agendamento.horaAgendamento)}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 p-5 border-t border-gray-200 justify-end">
          <button
            className="px-4 py-2.5 text-sm font-medium rounded-md bg-transparent text-blue-600 border border-gray-300 transition-all duration-200 hover:bg-gray-50 hover:border-blue-600"
            onClick={onClose}
          >
            ✖ Fechar
          </button>
        </div>
      </div>
    </div>
  )
}