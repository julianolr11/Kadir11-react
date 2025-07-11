import React, { useState, useEffect } from 'react'
import grabImg from '../../../Assets/Cursors/grab.png'
import cursorImg from '../../../Assets/Cursors/cursor.png'

export default function CustomCursor() {
  const [coords, setCoords] = useState({ x: 0, y: 0 })
  const [imgSrc, setImgSrc] = useState(cursorImg)

  useEffect(() => {
    const handleMove = (e) => {
      setCoords({ x: e.clientX, y: e.clientY })
      const el = document.elementFromPoint(e.clientX, e.clientY)
      if (el) {
        const cursorStyle = window.getComputedStyle(el).cursor
        if (cursorStyle.includes('grab')) {
          setImgSrc(grabImg)
        } else if (cursorStyle.includes('pointer')) {
          setImgSrc(cursorImg)
        } else {
          setImgSrc(cursorImg)
        }
      } else {
        setImgSrc(cursorImg)
      }
    }

    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [])

  return (
    <img
      src={imgSrc}
      alt=""
      style={{
        position: 'fixed',
        top: coords.y,
        left: coords.x,
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  )
}
