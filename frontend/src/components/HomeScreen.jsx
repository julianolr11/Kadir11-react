import React, { useEffect, useState } from 'react'
import logo1 from '../../../Assets/Logo/kadirnobg.png'
import logo2 from '../../../Assets/Logo/kadir11nme.png'
import bgGif from '../../../Assets/Logo/gifer.gif'
import musicSrc from '../../../Assets/Sounds/SagadoNorte.mp3'

export default function HomeScreen() {
  const [showExit, setShowExit] = useState(false)
  const [showOptions, setShowOptions] = useState(false)
  const [language, setLanguage] = useState('pt')
  const [volume, setVolume] = useState(50)
  const [logo, setLogo] = useState(logo1)

  useEffect(() => {
    const t = setTimeout(() => setLogo(logo2), 5000)
    return () => clearTimeout(t)
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
      <img src={bgGif} alt="background" className="absolute inset-0 w-full h-full object-cover -z-10" />
      <audio src={musicSrc} autoPlay loop className="hidden" />
      <img src={logo} alt="Kadir11" className="w-52" />
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

      {showExit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded text-center">
            <p>Deseja mesmo sair do jogo?</p>
            <button className="mx-2 px-4 py-2 bg-red-500 text-white rounded" onClick={quit}>Sim</button>
            <button className="mx-2 px-4 py-2 bg-gray-200 rounded" onClick={() => setShowExit(false)}>Não</button>
          </div>
        </div>
      )}

      {showOptions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded text-center">
            <div className="space-x-4 mb-4">
              <label>
                <input
                  type="radio"
                  value="pt"
                  checked={language === 'pt'}
                  onChange={() => setLanguage('pt')}
                />
                Português
              </label>
              <label>
                <input
                  type="radio"
                  value="en"
                  checked={language === 'en'}
                  onChange={() => setLanguage('en')}
                />
                Inglês
              </label>
            </div>
            <div className="flex items-center mb-4">
              <span role="img" aria-label="muted">🔇</span>
              <input
                className="mx-2"
                type="range"
                min="1"
                max="100"
                value={volume}
                onChange={(e) => setVolume(e.target.value)}
              />
              <span role="img" aria-label="sound">🔊</span>
            </div>
            <button
              className="px-4 py-2 bg-gray-200 rounded"
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
