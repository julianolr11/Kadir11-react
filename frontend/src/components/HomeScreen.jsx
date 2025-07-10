<<<<<<< HEAD
import React from 'react'
import logo from '../../Assets/Logo/kadirnobg.png'

export default function HomeScreen() {
  return (
    <div>
      <h1>Bem-vindo ao Kadir11</h1>
      <img src={logo} alt="Kadir11" style={{ width: '200px' }} />
=======
import React, { useState } from 'react'

export default function HomeScreen() {
  const [showExit, setShowExit] = useState(false)
  const [showOptions, setShowOptions] = useState(false)
  const [language, setLanguage] = useState('pt')
  const [volume, setVolume] = useState(50)

  const quit = () => {
    if (window.api?.quit) {
      window.api.quit()
    } else {
      window.close()
    }
  }

  return (
    <div className="home-container">
      <button className="home-button">Iniciar</button>
      <button className="home-button" onClick={() => setShowOptions(true)}>Opções</button>
      <button className="home-button" onClick={() => setShowExit(true)}>Sair</button>

      {showExit && (
        <div className="modal">
          <div className="modal-content">
            <p>Deseja mesmo sair do jogo?</p>
            <button onClick={quit}>Sim</button>
            <button onClick={() => setShowExit(false)}>Não</button>
          </div>
        </div>
      )}

      {showOptions && (
        <div className="modal">
          <div className="modal-content">
            <div>
              <label>
                <input type="radio" value="pt" checked={language === 'pt'} onChange={() => setLanguage('pt')} />
                Português
              </label>
              <label>
                <input type="radio" value="en" checked={language === 'en'} onChange={() => setLanguage('en')} />
                Inglês
              </label>
            </div>
            <div className="volume-control">
              <span role="img" aria-label="muted">🔇</span>
              <input
                type="range"
                min="1"
                max="100"
                value={volume}
                onChange={(e) => setVolume(e.target.value)}
              />
              <span role="img" aria-label="sound">🔊</span>
            </div>
            <button onClick={() => setShowOptions(false)}>Fechar</button>
          </div>
        </div>
      )}
>>>>>>> 63cc4071c04df45ddab26298b528a6b7b504a401
    </div>
  )
}
