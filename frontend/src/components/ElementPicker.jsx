import React, { useState } from 'react'
import agua from '../../../Assets/Elements/agua.png'
import fogo from '../../../Assets/Elements/fogo.png'
import terra from '../../../Assets/Elements/terra.png'
import ar from '../../../Assets/Elements/ar.png'
import puro from '../../../Assets/Elements/puro.png'

export default function ElementPicker({ stats, onSelect }) {
  const elements = [
    { key: 'fogo', label: 'Fogo', img: fogo },
    { key: 'agua', label: 'Água', img: agua },
    { key: 'terra', label: 'Terra', img: terra },
    { key: 'ar', label: 'Ar', img: ar },
    { key: 'puro', label: 'Puro', img: puro },
  ]

  const [hovered, setHovered] = useState(null)

  const handleSelect = (key) => {
    if (onSelect) {
      onSelect({ ...stats, element: key })
    }
  }

  return (
    <div className="flex justify-center space-x-6">
      {elements.map((el) => (
        <div
          key={el.key}
          className="relative flex flex-col items-center"
          onMouseEnter={() => setHovered(el.key)}
          onMouseLeave={() => setHovered(null)}
        >
          <img
            src={el.img}
            alt={el.label}
            className={`w-24 h-24 transition-transform duration-200 float-hover`}
            onClick={() => handleSelect(el.key)}
          />
          {hovered === el.key && (
            <span className="absolute top-full mt-1 whitespace-nowrap">
              {el.label}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
