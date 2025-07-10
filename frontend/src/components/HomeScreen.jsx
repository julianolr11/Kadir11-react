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
  const [showLogo1, setShowLogo1] = useState(false)
  const [showLogo2, setShowLogo2] = useState(false)
  const [bgVisible, setBgVisible] = useState(false)
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
    const timer = setTimeout(() => setShowLogo1(true), 0)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const logoTimer = setTimeout(() => setShowLogo2(true), 4000)
    return () => clearTimeout(logoTimer)
  }, [])

  useEffect(() => {
    const bgTimer = setTimeout(() => setBgVisible(true), 0)
    return () => clearTimeout(bgTimer)
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100
    }
  }, [volume])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play().catch(() => {})
      }
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  const quit = () => {
    if (window.api?.quit) {
      window.api.quit()
    } else {
      window.close()
    }
  }

  return (
    <div className="relative flex flex-col items-center justify-center h-full">
      <img
        src={bgGif}
        alt="background"
        className={`absolute inset-0 w-full h-full object-cover -z-10 transition-opacity duration-1000 ${bgVisible ? 'opacity-100' : 'opacity-0'}`}
      />
      <audio ref={audioRef} src={musicSrc} loop className="hidden" />
      <div className="relative w-[700px] h-[700px]">
        <img
          src={logo1}
          alt="Kadir11"
          className={`absolute w-[700px] transition-opacity duration-[2000ms] ${showLogo1 ? (showLogo2 ? 'opacity-0' : 'opacity-90') : 'opacity-0'}`}
          style={{ mixBlendMode: 'screen', top: '130px' }}
        />
        <img
          src={logo2}
          alt="Kadir11"
          className={`absolute w-[700px] transition-opacity duration-1000 ${showLogo2 ? 'opacity-100' : 'opacity-0'}`}
          style={{ top: '130px' }}
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
          <div className="bg-gray-800 p-4 rounded text-center w-72">
            <h2 className="text-xl mb-4">Opções</h2>

            <div className="mb-4">
              <h3 className="text-sm mb-1">Tela cheia</h3>
              <label className="flex justify-center items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={isFullscreen}
                  onChange={(e) => toggleFullscreen(e.target.checked)}
                />
                Tela cheia
              </label>
            </div>

            <div className="mb-4">
              <h3 className="text-sm mb-1">Linguagem</h3>
              <div className="space-x-4">
                <label>
                  <input
                    type="radio"
                    value="pt"
                    checked={language === 'pt'}
                    onChange={() => setLanguage('pt')}
                  />
                  <span className="ml-1" role="img" aria-label="Brazil flag">🇧🇷</span> PT-BR
                </label>
                <label>
                  <input
                    type="radio"
                    value="en"
                    checked={language === 'en'}
                    onChange={() => setLanguage('en')}
                  />
                  <span className="ml-1" role="img" aria-label="USA flag">🇺🇸</span> US
                </label>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-sm mb-1">Som do jogo</h3>
              <div className="flex items-center justify-center">
                <span role="img" aria-label="muted" onClick={() => setVolume(0)}>🔇</span>
                <input
                  className="mx-2"
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                />
                <span role="img" aria-label="sound" onClick={() => setVolume(100)}>🔊</span>
              </div>
            </div>

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
