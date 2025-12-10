export function formatDate(dateString: string | undefined): string {
  if (!dateString) return "-"

  try {
    const date = new Date(dateString)
    return date.toLocaleString("pt-BR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  } catch {
    return "-"
  }
}

export function formatSituation(situation: string | undefined): string {
  if (!situation) return "-"

  return situation
    .replace(/_/g, " ")
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}
