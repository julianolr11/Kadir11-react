import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Questionnaire from './Questionnaire'

export default function QuestionnairePage() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const name = state?.name
  const gender = state?.gender

  useEffect(() => {
    if (!name || !gender) navigate('/intro')
  }, [name, gender, navigate])

  const handleComplete = (stats) => {
    navigate('/element', { state: { name, gender, stats } })
  }

  if (!name || !gender) return null

  return (
    <div className="flex items-center justify-center h-full">
      <Questionnaire onComplete={handleComplete} />
    </div>
  )
}
