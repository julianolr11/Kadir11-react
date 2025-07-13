import { useEffect, useState } from 'react'

export type CursorType = 'default' | 'pointer' | 'grab' | 'leave'

const cursorImages: Record<CursorType, string> = {
  default: '/Assets/Cursors/cursor.png',
  pointer: '/Assets/Cursors/pointer.png',
  grab: '/Assets/Cursors/grab.png',
  leave: '/Assets/Cursors/leave.png',
}

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [cursorType, setCursorType] = useState<CursorType>('default')
  const [pressed, setPressed] = useState(false)

  useEffect(() => {
    const move = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }
    const down = () => setPressed(true)
    const up = () => setPressed(false)
    window.addEventListener('mousemove', move)
    window.addEventListener('mousedown', down)
    window.addEventListener('mouseup', up)
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mousedown', down)
      window.removeEventListener('mouseup', up)
    }
  }, [])

  useEffect(() => {
    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('button, a')) {
        setCursorType(t => (t === 'default' || t === 'pointer' ? 'pointer' : t))
      }
    }
    const onOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('button, a')) {
        setCursorType(t => (t === 'default' || t === 'pointer' ? 'default' : t))
      }
    }
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onOut)
    return () => {
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
    }
  }, [])

  useEffect(() => {
    ;(window as any).setCursorType = (type: CursorType) => setCursorType(type)
    return () => {
      delete (window as any).setCursorType
    }
  }, [])

  const style: React.CSSProperties = {
    position: 'fixed',
    top: position.y,
    left: position.x,
    width: '32px',
    height: '32px',
    transform: `translate(-50%, -50%) scale(${pressed ? 1.1 : 1})`,
    pointerEvents: 'none',
    transition: 'transform 0.1s',
    zIndex: 9999,
  }

  return <img src={cursorImages[cursorType]} style={style} />
}

export default CustomCursor
