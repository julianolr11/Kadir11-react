import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ElementPicker from './ElementPicker'

export default function ElementPage() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const name = state?.name
  const stats = state?.stats

  useEffect(() => {
    if (!name || !stats) navigate('/intro')
  }, [name, stats, navigate])

  const handleSelect = (finalStats) => {
    const pet = { name, ...finalStats }
    if (window.api?.setPreference) {
      window.api.setPreference('pet', pet)
    } else {
      localStorage.setItem('pet', JSON.stringify(pet))
    }
    navigate('/')
  }

  if (!name || !stats) return null

  return <ElementPicker stats={stats} onSelect={handleSelect} />
}
