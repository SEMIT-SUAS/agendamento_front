"use client"

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative flex-1 min-w-[300px]">
      <input
        type="text"
        placeholder="Buscar por nome, senha ou serviço..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 pl-10 text-sm border border-gray-300 rounded-md bg-white text-gray-800 transition-all duration-200 placeholder:text-gray-400 focus:border-blue-600 focus:ring-3 focus:ring-blue-100 focus:bg-white focus:outline-none"
      />
      <svg 
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 pointer-events-none" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="11" cy="11" r="8"></circle>
        <path d="m21 21-4.35-4.35"></path>
      </svg>
    </div>
  )
}