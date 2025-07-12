import { useEffect, useRef } from 'react'
import './StartScreen.css'

const StartScreen = () => {
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.loop = true
        audioRef.current.play().catch(() => {})
      }
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className='start-screen'>
      <video className='start-video' src='assets/logo/videointro.mp4' autoPlay loop muted />
      <img className='start-logo' src='assets/logo/kadirbefore.png' alt='logo' />
      <div className='start-buttons'>
        <button>Iniciar</button>
        <button>Opções</button>
        <button>Sair</button>
      </div>
      <audio ref={audioRef} src='assets/sounds/sagadonorte.mp3' />
    </div>
  )
}

export default StartScreen
