import React, { useEffect, useState, useRef } from 'react'
import logo1 from '../../../Assets/Logo/kadirnobg.png'
import logo2 from '../../../Assets/Logo/kadir11nme.png'
import bgGif from '../../../Assets/Logo/gifer.gif'
import musicSrc from '../../../Assets/Sounds/SagadoNorte.mp3'

export default function HomeScreen() {
  const [showExit, setShowExit] = useState(false)
  const [showOptions, setShowOptions] = useState(false)
  const [language, setLanguage] = useState('pt')
  const [volume, setVolume] = useState(50)
  const [showLogo2, setShowLogo2] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const audioRef = useRef(null)

  const toggleFullscreen = (enable) => {
    if (enable) {
      document.documentElement.requestFullscreen().catch(() => {})
    } else if (document.fullscreenElement) {
      document.exitFullscreen()
    }
    setIsFullscreen(enable)
  }

  useEffect(() => {
    const t = setTimeout(() => setShowLogo2(true), 5000)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100
    }
  }, [volume])

  const quit = () => {
    if (window.api?.quit) {
      window.api.quit()
    } else {
      window.close()
    }
  }

  return (
    <div className="relative flex flex-col items-center justify-center h-full">
      <img src={bgGif} alt="background" className="absolute inset-0 w-full h-full object-cover -z-10" />
      <audio ref={audioRef} src={musicSrc} autoPlay loop className="hidden" />
      <div className="relative w-[900px] h-[900px]">
        <img
          src={logo1}
          alt="Kadir11"
          className={`absolute w-[900px] transition-opacity duration-1000 ${showLogo2 ? 'opacity-0' : 'opacity-90'}`}
          style={{ mixBlendMode: 'screen' }}
        />
        <img
          src={logo2}
          alt="Kadir11"
          className={`absolute w-[900px] transition-opacity duration-1000 ${showLogo2 ? 'opacity-100' : 'opacity-0'}`}
        />
      </div>
      <div className="absolute bottom-8 flex flex-col items-center w-full">
        <button className="button">Iniciar</button>
        <button
          className="button"
          onClick={() => setShowOptions(true)}
        >
          Opções
        </button>
        <button
          className="button"
          onClick={() => setShowExit(true)}
        >
          Sair
        </button>
      </div>

      {showExit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-4 rounded text-center">
            <p>Deseja mesmo sair do jogo?</p>
            <button className="mx-2 button bg-red-600" onClick={quit}>Sim</button>
            <button className="mx-2 button" onClick={() => setShowExit(false)}>Não</button>
          </div>
        </div>
      )}

      {showOptions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-4 rounded text-center">
            <div className="space-x-4 mb-4">
              <label className="cursor-pointer">
                <input
                  type="radio"
                  value="pt"
                  checked={language === 'pt'}
                  onChange={() => setLanguage('pt')}
                />
                <span className="ml-1" role="img" aria-label="Brazil flag">🇧🇷</span> Português
              </label>
              <label className="cursor-pointer">
                <input
                  type="radio"
                  value="en"
                  checked={language === 'en'}
                  onChange={() => setLanguage('en')}
                />
                <span className="ml-1" role="img" aria-label="USA flag">🇺🇸</span> Inglês
              </label>
            </div>
            <div className="flex items-center mb-4">
              <span role="img" aria-label="muted" className="cursor-pointer" onClick={() => setVolume(0)}>🔇</span>
              <input
                className="mx-2"
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
              />
              <span role="img" aria-label="sound" className="cursor-pointer" onClick={() => setVolume(100)}>🔊</span>
            </div>
            <label className="cursor-pointer flex items-center mb-4">
              <input
                type="checkbox"
                className="mr-2"
                checked={isFullscreen}
                onChange={(e) => toggleFullscreen(e.target.checked)}
              />
              Tela cheia
            </label>
            <button
              className="button"
              onClick={() => setShowOptions(false)}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
