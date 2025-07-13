import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ElementPicker from './ElementPicker'

export default function ElementPage() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const name = state?.name
  const gender = state?.gender
  const stats = state?.stats

  useEffect(() => {
    if (!name || !gender || !stats) navigate('/intro')
  }, [name, gender, stats, navigate])

  const handleSelect = (finalStats) => {
    const pet = { name, gender, ...finalStats }
    if (window.api?.setPreference) {
      window.api.setPreference('pet', pet)
    } else {
      localStorage.setItem('pet', JSON.stringify(pet))
    }
    navigate('/')
  }

  if (!name || !gender || !stats) return null

  return (
    <div className="flex items-center justify-center h-full">
      <ElementPicker stats={stats} onSelect={handleSelect} />
    </div>
  )
}
