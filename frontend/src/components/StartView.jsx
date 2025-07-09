import { useEffect, useRef, useState } from 'react'
import '../styles/main.css'
import './StartView.css'

export default function StartView() {
  const [showLoad, setShowLoad] = useState(false)
  const [exitConfirm, setExitConfirm] = useState(false)
  const [limitOpen, setLimitOpen] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef(null)
  const petLimit = 1

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = 0.3
    if (window.electronAPI?.getMuteState) {
      window.electronAPI.getMuteState().then(state => {
        setIsMuted(state)
        audio.muted = state
      }).catch(() => {})
    }

    const fadeOut = () => {
      let vol = audio.volume
      const step = vol / 20
      const interval = setInterval(() => {
        vol -= step
        if (vol <= 0) {
          clearInterval(interval)
          audio.volume = 0
          audio.pause()
          window.electronAPI?.send('close-start-window')
        } else {
          audio.volume = vol
        }
      }, 100)
    }

    window.electronAPI?.on('fade-out-start-music', fadeOut)
  }, [])

  useEffect(() => {
    window.electronAPI?.listPets?.().then(pets => {
      if (pets.length > 0) setShowLoad(true)
    }).catch(() => {})
  }, [])

  const handleMute = () => {
    const audio = audioRef.current
    const next = !isMuted
    setIsMuted(next)
    if (audio) audio.muted = next
    window.electronAPI?.send('set-mute-state', next)
  }

  const handleStart = () => {
    window.electronAPI?.listPets?.().then(pets => {
      if (pets.length >= petLimit) {
        setLimitOpen(true)
      } else {
        window.electronAPI?.send('open-create-pet-window')
      }
    }).catch(() => {})
  }

  const handleLoad = () => {
    window.electronAPI?.send('open-load-pet-window')
  }

  const handleExit = () => {
    setExitConfirm(true)
  }

  const confirmExit = () => {
    window.electronAPI?.send('exit-app')
  }

  return (
    <>
      <div className="window">
        <img src="Assets/Logo/kadirnobg.png" alt="" />
        <img src="Assets/Logo/kadir11nme.png" alt="" className="animate-bg" />
        <button className="button" onClick={handleStart}>Iniciar</button>
        {showLoad && (
          <button className="button" onClick={handleLoad}>Carregar</button>
        )}
        <button className="button" onClick={handleExit}>Sair</button>
        <button id="mute-button" onClick={handleMute}>{isMuted ? '🔇' : '🔊'}</button>
      </div>
      <audio id="background-music" autoPlay loop ref={audioRef}>
        <source src="Assets/Sounds/SagadoNorte.mp3" type="audio/mpeg" />
        Seu navegador não suporta o elemento de áudio.
      </audio>
      {exitConfirm && (
        <div id="exit-confirm-overlay" className="overlay">
          <div id="exit-confirm-box">
            <p>Tem certeza que deseja sair?</p>
            <div className="confirm-buttons">
              <button className="button small-button" onClick={confirmExit}>Sair</button>
              <button className="button small-button" onClick={() => setExitConfirm(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
      {limitOpen && (
        <div id="limit-overlay" className="overlay">
          <div id="limit-box">
            <p id="limit-message">Você já possui um pet. Exclua-o para criar outro.</p>
            <div className="confirm-buttons">
              <button className="button small-button" onClick={() => setLimitOpen(false)}>OK</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
