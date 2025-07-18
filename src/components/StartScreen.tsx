import { useEffect, useRef, useState } from 'react'
import OptionsModal, { Preferences } from './OptionsModal'
import CharacterCreation from './CharacterCreation'
import { t } from '@/locales'
import './StartScreen.css'

const StartScreen = () => {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [showOptions, setShowOptions] = useState(false)
  const [showExitConfirm, setShowExitConfirm] = useState(false)
  const [showLogoBefore, setShowLogoBefore] = useState(false)
  const [showLogoAfter, setShowLogoAfter] = useState(false)
  const [prefs, setPrefs] = useState<Preferences>(() => {
    const stored = localStorage.getItem('preferences')
    return stored
      ? JSON.parse(stored)
      : { language: 'PT-BR', fullscreen: false, volume: 1, muted: false }
  })
  const lastVolumeRef = useRef(prefs.volume)

  const [phase, setPhase] = useState<'menu' | 'intro' | 'create'>('menu')
  const [showIntro, setShowIntro] = useState(false)
  const [introVisible, setIntroVisible] = useState(false)
  const [showProceed, setShowProceed] = useState(false)
  const [messageIndex, setMessageIndex] = useState(0)
  const messages = [
    'Boas vindas, viajante...',
    'Parece estar cansado, mas não desanime.',
    'Kadir está aqui.',
    'Vamos conhecer um pouco mais sobre você.',
  ]

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

    return () => {
      clearTimeout(audioTimer)
    }
  }, [])

  useEffect(() => {
    if (phase !== 'intro') return
    if (messageIndex >= messages.length) return
    const timer = setTimeout(() => setMessageIndex(i => i + 1), 2000)
    return () => clearTimeout(timer)
  }, [phase, messageIndex])

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

  useEffect(() => {
    const beforeTimer = setTimeout(() => setShowLogoBefore(true), 3000)
    const afterTimer = setTimeout(() => {
      setShowLogoBefore(false)
      setShowLogoAfter(true)
    }, 4000)

    return () => {
      clearTimeout(beforeTimer)
      clearTimeout(afterTimer)
    }
  }, [])

  useEffect(() => {
    if (phase === 'intro') {
      setIntroVisible(true)
      const timer = setTimeout(() => setShowIntro(true), 10)
      return () => clearTimeout(timer)
    }
    setShowIntro(false)
    const timer = setTimeout(() => setIntroVisible(false), 2000)
    return () => clearTimeout(timer)
  }, [phase])

  useEffect(() => {
    if (messageIndex >= messages.length) {
      const timer = setTimeout(() => setShowProceed(true), 1000)
      return () => clearTimeout(timer)
    }
    setShowProceed(false)
  }, [messageIndex])

  return (
    <div className='start-screen'>
      <video className='start-video' src='assets/logo/videointro.mp4' autoPlay loop muted />
      <div className='start-logos'>
        <div className='logo-container'>
          <img
            className={`logo-img ${showLogoBefore ? 'visible' : ''}`}
            src='assets/logo/kadirbefore.png'
            alt='logo1'
          />
          <img
            className={`logo-img ${showLogoAfter ? 'visible' : ''}`}
            src='assets/logo/kadirafter.png'
            alt='logo2'
          />
        </div>
      </div>
      {phase === 'menu' && (
        <div className='start-buttons'>
          <button onClick={() => { setPhase('intro'); setMessageIndex(0) }}>
            {t(prefs.language, 'start')}
          </button>
          <button onClick={() => setShowOptions(true)}>{t(prefs.language, 'options')}</button>
          <button onClick={() => setShowExitConfirm(true)}>{t(prefs.language, 'exit')}</button>
        </div>
      )}
      {introVisible && (
        <div className={`intro-screen ${showIntro ? 'visible' : ''}`}>
          {messages.map((m, i) => (
            <p key={i} className={`intro-text ${messageIndex > i ? 'visible' : ''}`}>{m}</p>
          ))}
          {showProceed && (
            <button
              className='proceed-btn visible'
              onClick={() => setPhase('create')}
            >
              Prosseguir
            </button>
          )}
        </div>
      )}
      <div className={`creator-container ${phase === 'create' ? 'visible' : ''}`}> 
        {phase === 'create' && <CharacterCreation />}
      </div>
      {showExitConfirm && (
        <div className='exit-dropdown'>
          <p>{t(prefs.language, 'exitConfirm')}</p>
          <div className='exit-buttons'>
            <button onClick={() => window.ipcRenderer.invoke('quit-app')}>{t(prefs.language, 'exitYes')}</button>
            <button onClick={() => setShowExitConfirm(false)}>{t(prefs.language, 'exitNo')}</button>
          </div>
        </div>
      )}
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
