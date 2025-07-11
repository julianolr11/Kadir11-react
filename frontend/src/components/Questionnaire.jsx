import React, { useEffect, useState } from 'react'
import QUESTIONS from './questions'

export default function Questionnaire({ onComplete }) {
  const [qList, setQList] = useState([])
  const [index, setIndex] = useState(0)
  const [stats, setStats] = useState({ attack: 0, defense: 0, magic: 0, velocity: 0 })
  const [transition, setTransition] = useState(false)

  useEffect(() => {
    const shuffled = [...QUESTIONS].sort(() => Math.random() - 0.5)
    setQList(shuffled.slice(0, 5))
  }, [])

  if (qList.length === 0) return null

  const current = qList[index]

  const handleSelect = (key) => {
    const option = current.options[key]
    const newStats = {
      attack: stats.attack + (option.attack || 0),
      defense: stats.defense + (option.defense || 0),
      magic: stats.magic + (option.magic || 0),
      velocity: stats.velocity + (option.velocity || 0),
    }
    setStats(newStats)
    setTransition(true)
    setTimeout(() => {
      if (index + 1 === qList.length) {
        onComplete(newStats)
      } else {
        setIndex((i) => i + 1)
        setTransition(false)
      }
    }, 300)
  }

  return (
    <div className="text-center">
      <div
        className={`transition-all duration-300 ${
          transition ? '-translate-x-4 opacity-0' : 'translate-x-0 opacity-100'
        }`}
      >
        <p className="mb-4">{current.text}</p>
        <div className="flex flex-col items-center space-y-2">
          {['A', 'B', 'C'].map((key) => (
            <button
              className="button w-64"
              key={key}
              onClick={() => handleSelect(key)}
            >
              {key}) {current.options[key].text}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
