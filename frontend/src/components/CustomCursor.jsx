import React, { useState, useEffect, useRef } from 'react'
import arrowImg from '../../../Assets/Cursors/cursor.png'
import pointerImg from '../../../Assets/Cursors/pointer.png'
import grabImg from '../../../Assets/Cursors/grab.png'
import leaveImg from '../../../Assets/Cursors/leave.png'

export default function CustomCursor() {
  const [coords, setCoords] = useState({ x: 0, y: 0 })
  const [imgSrc, setImgSrc] = useState(arrowImg)
  const [isPressed, setIsPressed] = useState(false)
  const lastCoords = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const updateImgFromElement = (x, y) => {
      const el = document.elementFromPoint(x, y)
      if (el) {
        const cursorStyle = window.getComputedStyle(el).cursor
        if (cursorStyle.includes('pointer')) {
          setImgSrc(pointerImg)
        } else {
          setImgSrc(arrowImg)
        }
      } else {
        setImgSrc(arrowImg)
      }
    }

    const handleMove = (e) => {
      setCoords({ x: e.clientX, y: e.clientY })
      lastCoords.current = { x: e.clientX, y: e.clientY }
      if (!isPressed) updateImgFromElement(e.clientX, e.clientY)
    }

    const handleDown = () => {
      setIsPressed(true)
      setImgSrc(grabImg)
    }

    const handleUp = () => {
      setIsPressed(false)
      setImgSrc(leaveImg)
      const { x, y } = lastCoords.current
      setTimeout(() => updateImgFromElement(x, y), 100)
    }

    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mousedown', handleDown)
    window.addEventListener('mouseup', handleUp)
    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mousedown', handleDown)
      window.removeEventListener('mouseup', handleUp)
    }
  }, [isPressed])

  return (
    <img
      src={imgSrc}
      alt=""
      style={{
        position: 'fixed',
        top: coords.y,
        left: coords.x,
        transform: `translate(-50%, -50%) scale(${isPressed ? 1.1 : 1})`,
        transition: 'transform 0.1s ease',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  )
}
