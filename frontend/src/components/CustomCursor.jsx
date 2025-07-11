import React, { useState, useEffect } from 'react'
import grabImg from '../../../Assets/Cursors/grab.png'
import pointerImg from '../../../Assets/Cursors/pointer.png'

export default function CustomCursor() {
  const [coords, setCoords] = useState({ x: 0, y: 0 })
  const [imgSrc, setImgSrc] = useState(pointerImg)

  useEffect(() => {
    const handleMove = (e) => {
      setCoords({ x: e.clientX, y: e.clientY })
      const el = document.elementFromPoint(e.clientX, e.clientY)
      if (el) {
        const cursorStyle = window.getComputedStyle(el).cursor
        if (cursorStyle.includes('grab')) {
          setImgSrc(grabImg)
        } else if (cursorStyle.includes('pointer')) {
          setImgSrc(pointerImg)
        } else {
          setImgSrc(pointerImg)
        }
      } else {
        setImgSrc(pointerImg)
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
