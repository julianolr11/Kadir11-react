import { useEffect, useRef, useState } from 'react'
import OptionsModal, { Preferences } from './OptionsModal'
import './StartScreen.css'

const StartScreen = () => {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [logoSrc, setLogoSrc] = useState('assets/logo/kadirbefore.png')
  const [logoClass, setLogoClass] = useState('start-logo')
  const [showOptions, setShowOptions] = useState(false)
  const [prefs, setPrefs] = useState<Preferences>(() => {
    const stored = localStorage.getItem('preferences')
    return stored
      ? JSON.parse(stored)
      : { language: 'PT-BR', fullscreen: false, volume: 1, muted: false }
  })
  const lastVolumeRef = useRef(prefs.volume)

  const updatePrefs = (update: Partial<Preferences>) => {
    setPrefs(prev => {
      const next = { ...prev, ...update }
      localStorage.setItem('preferences', JSON.stringify(next))
      return next
    })
  }

  const toggleMute = () => {
    if (prefs.muted) {
      updatePrefs({ muted: false, volume: lastVolumeRef.current })
    } else {
      lastVolumeRef.current = prefs.volume
      updatePrefs({ muted: true })
    }
  }

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

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = prefs.muted ? 0 : prefs.volume
    }
  }, [prefs.volume, prefs.muted])

  useEffect(() => {
    if (prefs.fullscreen) {
      document.documentElement.requestFullscreen().catch(() => {})
    } else if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {})
    }
  }, [prefs.fullscreen])

  return (
    <div className='start-screen'>
      <video className='start-video' src='assets/logo/videointro.mp4' autoPlay loop muted />
      <img className={logoClass} src={logoSrc} alt='logo' />
      <div className='start-buttons'>
        <button>Iniciar</button>
        <button onClick={() => setShowOptions(true)}>Opções</button>
        <button>Sair</button>
      </div>
      <OptionsModal
        open={showOptions}
        preferences={prefs}
        setPreferences={updatePrefs}
        toggleMute={toggleMute}
        onClose={() => setShowOptions(false)}
      />
      <audio ref={audioRef} src='assets/sounds/sagadonorte.mp3' />
    </div>
  )
}

export default StartScreen
