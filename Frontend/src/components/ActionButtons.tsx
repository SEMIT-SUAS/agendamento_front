"use client"

import type { Agendamento } from "../types/agendamento"
import "../styles/action-buttons.css"

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
    <div className="action-buttons">
      {!selectedAgendamento ? (
        <div className="call-buttons">
          <button className="btn btn-primary" onClick={onCallNormal} title="Chamar próximo agendamento">
            <span className="btn-icon">📢</span>
            Chamar Normal
          </button>
          <button className="btn btn-accent" onClick={onCallPriority} title="Chamar próximo com prioridade">
            <span className="btn-icon">⚡</span>
            Chamar Prioridade
          </button>
        </div>
      ) : (
        <div className="attendance-buttons">
          <button className="btn btn-success" onClick={onFinalize} title="Finalizar atendimento">
            <span className="btn-icon">✅</span>
            Finalizar
          </button>
          <button className="btn btn-danger" onClick={onCancel} title="Marcar como não compareceu">
            <span className="btn-icon">❌</span>
            Cancelar
          </button>
        </div>
      )}
    </div>
  )
}
