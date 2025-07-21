import React, { useEffect, useState } from 'react'
import mapImage from '../../../Assets/Modes/Journeys/mapa.png'
import heroImage from '../../../Assets/Mons/CriaturaSombria/criaturasombria.png'

export default function MapPage() {
  const [pet, setPet] = useState(null)
  const [position, setPosition] = useState({ x: 50, y: 50 })

  useEffect(() => {
    const storedPet = window.api?.getPreference
      ? window.api.getPreference('pet')
      : localStorage.getItem('pet')
    if (storedPet) {
      try {
        setPet(typeof storedPet === 'string' ? JSON.parse(storedPet) : storedPet)
      } catch {
        setPet(null)
      }
    }
  }, [])

  const handleMapClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setPosition({ x, y })
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div
        className="relative"
        style={{ width: '768px', height: '512px' }}
        onClick={handleMapClick}
      >
        <img src={mapImage} alt="Mapa" className="w-full h-full object-cover" />
        <img
          src={heroImage}
          alt={pet?.name || 'Personagem'}
          className="absolute w-8 h-8"
          style={{
            left: `${position.x}%`,
            top: `${position.y}%`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      </div>
    </div>
  )
}
