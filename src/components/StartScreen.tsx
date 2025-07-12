import { useEffect, useRef, useState } from 'react'
import OptionsModal, { Preferences } from './OptionsModal'
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
    const timerBefore = setTimeout(() => setShowLogoBefore(true), 1300)
    const timerAfter = setTimeout(() => {
      setShowLogoBefore(false)
      setShowLogoAfter(true)
    }, 4000)
    return () => {
      clearTimeout(timerBefore)
      clearTimeout(timerAfter)
    }
  }, [])

  return (
    <div className='start-screen'>
      <video className='start-video' src='assets/logo/videointro.mp4' autoPlay loop muted />
      <div className='start-logos'>
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
      <div className='start-buttons'>
        <button>{t(prefs.language, 'start')}</button>
        <button onClick={() => setShowOptions(true)}>{t(prefs.language, 'options')}</button>
        <button onClick={() => setShowExitConfirm(true)}>{t(prefs.language, 'exit')}</button>
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
