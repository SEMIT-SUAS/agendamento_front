export interface Agendamento {
  agendamentoId: number
  secretariaId?: number
  senha: string
  usuarioNome: string
  usuarioTipo?: string
  servicoNome: string
  situacao: "AGENDADO" | "EM_ATENDIMENTO" | "REAGENDADO" | "CANCELADO" | "NAO_COMPARECEU"
  tipoAtendimento: string
  horaAgendamento: string
  horaChamada?: string
}
