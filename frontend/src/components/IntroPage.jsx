import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function IntroPage() {
  const [name, setName] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setName(e.target.value.slice(0, 15))
  }

  const handleConfirm = () => {
    if (name.trim()) {
      setConfirmed(true)
    }
  }

  const handleProceed = () => {
    navigate('/questions', { state: { name } })
  }

  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center space-y-4">
        <div
          className={`transition-opacity duration-500 ${
            !confirmed ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
        <p className="mb-4">Boas vindas, viajante...</p>
        <input
          type="text"
          value={name}
          onChange={handleChange}
          maxLength={15}
          className="bg-gray-800 border border-gray-700 p-2 text-center mb-4"
        />
        <div className="mt-2">
          <button className="button" onClick={handleConfirm}>
            Prosseguir
          </button>
        </div>
      </div>

        <div
          className={`transition-opacity duration-500 ${
            confirmed ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
        <p className="mb-4">
          O destino o trouxe até{' '}
          <span className="text-yellow-400">Kadir</span>, um mundo onde as lendas ganham vida...
        </p>
        <div className="mt-2">
          <button className="button" onClick={handleProceed}>
            Próximo
          </button>
        </div>
      </div>
      </div>
    </div>
  )
}
