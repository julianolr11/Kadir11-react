import { useEffect, useRef, useState } from 'react'
import './StartScreen.css'

const StartScreen = () => {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [logoSrc, setLogoSrc] = useState('assets/logo/kadirbefore.png')
  const [logoClass, setLogoClass] = useState('start-logo')

  useEffect(() => {
    const audioTimer = setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.loop = true
        audioRef.current.play().catch(() => {})
      }
    }, 2000)

    const logoTimer = setTimeout(() => {
      setLogoSrc('assets/logo/kadirafter.png')
      setLogoClass('start-logo logo-after')
    }, 3000)

    return () => {
      clearTimeout(audioTimer)
      clearTimeout(logoTimer)
    }
  }, [])

  return (
    <div className='start-screen'>
      <video className='start-video' src='assets/logo/videointro.mp4' autoPlay loop muted />
      <img className={logoClass} src={logoSrc} alt='logo' />
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
