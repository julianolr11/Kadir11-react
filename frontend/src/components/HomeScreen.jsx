import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import logo1 from '../../../Assets/Logo/kadirnobg.png'
import logo2 from '../../../Assets/Logo/kadir11nme.png'
import bgGif from '../../../Assets/Logo/gifer.gif'
import musicSrc from '../../../Assets/Sounds/SagadoNorte.mp3'

export default function HomeScreen() {
  const [showExit, setShowExit] = useState(false)
  const [showOptions, setShowOptions] = useState(false)
  const [language, setLanguage] = useState('pt')
  const [volume, setVolume] = useState(50)
  const [prevVolume, setPrevVolume] = useState(50)
  const [showLogo1, setShowLogo1] = useState(false)
  const [showLogo2, setShowLogo2] = useState(false)
  const [bgVisible, setBgVisible] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [pet, setPet] = useState(null)
  const navigate = useNavigate()
  const audioRef = useRef(null)

  const getPref = (key) => {
    if (window.api?.getPreference) {
      return window.api.getPreference(key)
    }
    return localStorage.getItem(key)
  }

  const setPref = (key, value) => {
    if (window.api?.setPreference) {
      window.api.setPreference(key, value)
    } else {
      localStorage.setItem(key, String(value))
    }
  }

  const toggleFullscreen = (enable) => {
    if (enable) {
      document.documentElement
        .requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch(() => setIsFullscreen(false))
    } else if (document.fullscreenElement) {
      document
        .exitFullscreen()
        .then(() => setIsFullscreen(false))
        .catch(() => {})
    } else {
      setIsFullscreen(false)
    }
  }

  const toggleMute = () => {
    if (volume === 0) {
      setVolume(prevVolume)
    } else {
      setPrevVolume(volume)
      setVolume(0)
    }
  }

  // Load saved preferences on first render
  useEffect(() => {
    const storedVolume = getPref('volume')
    if (storedVolume !== null && storedVolume !== undefined) {
      const vol = Number(storedVolume)
      setVolume(vol)
      setPrevVolume(vol)
    }

    const storedLang = getPref('language')
    if (storedLang) {
      setLanguage(storedLang)
    }

    const storedFullscreen = getPref('isFullscreen')
    if (storedFullscreen === true || storedFullscreen === 'true') {
      toggleFullscreen(true)
    }

    const storedPet = getPref('pet')
    if (storedPet) {
      try {
        setPet(typeof storedPet === 'string' ? JSON.parse(storedPet) : storedPet)
      } catch {
        setPet(null)
      }
    }
  }, [])

  // Persist volume changes
  useEffect(() => {
    setPref('volume', volume)
  }, [volume])

  // Persist language changes
  useEffect(() => {
    setPref('language', language)
  }, [language])

  // Persist fullscreen changes
  useEffect(() => {
    setPref('isFullscreen', isFullscreen)
  }, [isFullscreen])

  // Keep state in sync with actual fullscreen status
  useEffect(() => {
    const handleChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleChange)
    return () => document.removeEventListener('fullscreenchange', handleChange)
  }, [])

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

  const handleStart = () => {
    setShowLogo1(false)
    setShowLogo2(false)
    navigate('/intro')
  }

  return (
    <div className="relative flex flex-col items-center justify-center h-full w-full overflow-hidden">
      <img
        src={bgGif}
        alt="background"
        className={`absolute inset-0 w-full h-full object-cover -z-10 transition-opacity duration-1000 ${bgVisible ? 'opacity-100' : 'opacity-0'}`}
      />
      <audio ref={audioRef} src={musicSrc} loop className="hidden" />
      <div className="relative w-[700px] h-[700px]">
        <div
          className={`absolute w-[700px] h-[700px] logo-shine transition-opacity duration-1000 ${showLogo1 ? (showLogo2 ? 'opacity-0' : 'opacity-100') : 'opacity-0'}`}
          style={{ top: '15%', maskImage: `url(${logo1})`, WebkitMaskImage: `url(${logo1})` }}
        />
        <img
          src={logo2}
          alt="Kadir11"
          className={`absolute w-[700px] transition-opacity duration-1000 ${showLogo2 ? 'opacity-100' : 'opacity-0'}`}
          style={{ top: '15%' }}
        />
      </div>
      <div className="absolute bottom-8 flex flex-col items-center w-full">
        <button className="button" onClick={handleStart}>Iniciar</button>
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
          <div className="bg-gray-800 p-4 rounded text-center w-72 text-white">
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
                <span role="img" aria-label="muted" onClick={toggleMute} className="cursor-pointer">🔇</span>
                <input
                  className="mx-2"
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                />
                <span role="img" aria-label="sound" onClick={() => setVolume(100)} className="cursor-pointer">🔊</span>
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
