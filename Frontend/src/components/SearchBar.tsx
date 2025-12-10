"use client"

import "../styles/search-bar.css"

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Buscar por nome, senha ou serviço..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="search-input"
      />
      <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <circle cx="11" cy="11" r="8"></circle>
        <path d="m21 21-4.35-4.35"></path>
      </svg>
    </div>
  )
}
