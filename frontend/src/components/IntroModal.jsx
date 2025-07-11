import React, { useState } from 'react'

export default function IntroModal({ onClose }) {
  const [name, setName] = useState('')

  const handleChange = (e) => {
    const value = e.target.value.slice(0, 15)
    setName(value)
  }

  return (
    <div className="text-center space-y-4">
      <p>Boas vindas, viajante...</p>
      <input
        type="text"
        value={name}
        onChange={handleChange}
        maxLength={15}
        className="bg-gray-800 border border-gray-700 p-2 text-center"
      />
      <div>
        <button className="button" onClick={() => onClose(name)}>
          Prosseguir
        </button>
      </div>
    </div>
  )
}
