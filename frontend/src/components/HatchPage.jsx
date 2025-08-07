import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import evolution from '../../../Assets/Mons/evolution.gif'
import criaturaSombria from '../../../Assets/Mons/CriaturaSombria/criaturasombria.png'

export default function HatchPage() {
  const navigate = useNavigate()
  const [showPet, setShowPet] = useState(false)

  useEffect(() => {
    const timer1 = setTimeout(() => setShowPet(true), 2000)
    const timer2 = setTimeout(() => navigate('/', { replace: true }), 3500)
    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [navigate])

  return (
    <div className="flex items-center justify-center h-full">
      {!showPet ? (
        <img src={evolution} alt="Hatching" className="w-64 h-64" />
      ) : (
        <img
          src={criaturaSombria}
          alt="Pet"
          className="w-32 h-32 animate-bounce"
        />
      )}
    </div>
  )
}
