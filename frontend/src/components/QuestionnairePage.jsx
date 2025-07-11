import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Questionnaire from './Questionnaire'

export default function QuestionnairePage() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const name = state?.name

  useEffect(() => {
    if (!name) navigate('/intro')
  }, [name, navigate])

  const handleComplete = (stats) => {
    navigate('/element', { state: { name, stats } })
  }

  if (!name) return null

  return <Questionnaire onComplete={handleComplete} />
}
