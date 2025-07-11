import React, { useState } from 'react'

export default function IntroModal({ onClose }) {
  const [name, setName] = useState('')
  const [confirmed, setConfirmed] = useState(false)

  const handleChange = (e) => {
    const value = e.target.value.slice(0, 15)
    setName(value)
  }

  const handleConfirm = () => {
    if (name.trim()) {
      setConfirmed(true)
    }
  }

  return (
    <div className="text-center space-y-4">
      <div
        className={`transition-opacity duration-500 ${
          confirmed ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <p>Boas vindas, viajante...</p>
        <input
          type="text"
          value={name}
          onChange={handleChange}
          maxLength={15}
          className="bg-gray-800 border border-gray-700 p-2 text-center"
        />
        <div>
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
        <p>
          O destino o trouxe até{' '}
          <span className="text-yellow-400">Kadir</span>, um mundo onde as
          lendas ganham vida...
        </p>
        <div>
          <button className="button" onClick={() => onClose(name)}>
            Próximo
          </button>
        </div>
      </div>
    </div>
  )
}
