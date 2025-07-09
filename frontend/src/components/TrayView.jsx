import { useEffect, useRef, useState } from 'react'
import '../../styles/main.css'

const rarityGradients = {
  Comum: 'linear-gradient(135deg, #808080, #A9A9A9)',
  Incomum: 'linear-gradient(135deg, #D3D3D3, #E0E0E0)',
  Raro: 'linear-gradient(135deg, #32CD32, #228B22)',
  MuitoRaro: 'linear-gradient(135deg, #4682B4, #1E90FF)',
  Epico: 'linear-gradient(135deg, #800080, #DA70D6)',
  Lendario: 'linear-gradient(135deg, #FFD700, #FFA500)'
}

const itemRarities = {
  healthPotion: 'Comum',
  meat: 'Comum',
  staminaPotion: 'Comum',
  chocolate: 'Comum',
  terrainMedium: 'Raro',
  terrainLarge: 'Epico',
  nest: 'Raro',
  eggAve: 'Raro',
  eggCriaturaMistica: 'Raro',
  eggCriaturaSombria: 'Raro',
  eggDraconideo: 'Raro',
  eggFera: 'Raro',
  eggMonstro: 'Raro',
  eggReptiloide: 'Raro'
}

const rarityWeights = { Comum: 40, Incomum: 30, Raro: 15, MuitoRaro: 10, Epico: 4, Lendario: 1 }

function getImageSrc(relativePath) {
  if (!relativePath) return 'Assets/Mons/eggsy.png'
  const gifSrc = relativePath.endsWith('.gif') ? `Assets/Mons/${relativePath}` : null
  return gifSrc || `Assets/Mons/${relativePath}`
}

export default function TrayView() {
  const [petData, setPetData] = useState({
    image: 'eggsy.png',
    name: 'Eggsy',
    rarity: 'Raro',
    element: 'fire',
    currentHealth: 80,
    maxHealth: 100,
    energy: 60,
    level: 5,
    hunger: 20,
    happiness: 25
  })
  const [showMenu, setShowMenu] = useState(false)
  const [showRarity, setShowRarity] = useState(true)
  const [exitConfirm, setExitConfirm] = useState(false)
  const [battleMsg, setBattleMsg] = useState('')
  const [statusVisible, setStatusVisible] = useState(false)
  const [itemIcon, setItemIcon] = useState(null)
  const statusTimeout = useRef(null)
  const itemsData = useRef([])

  useEffect(() => {
    fetch('data/items.json').then(r => r.json()).then(d => { itemsData.current = d }).catch(() => { itemsData.current = [] })
  }, [])

  useEffect(() => {
    const onPet = (_, data) => setPetData(data)
    const onBattleError = (_, msg) => { setBattleMsg(msg); setTimeout(() => setBattleMsg(''), 3000) }
    window.electronAPI?.on('pet-data', onPet)
    window.electronAPI?.on('show-battle-error', onBattleError)
  }, [])

  useEffect(() => {
    const interval = setInterval(maybeFindItem, 20 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const toggleMenu = e => { e.stopPropagation(); setShowMenu(m => !m) }

  useEffect(() => {
    const close = () => setShowMenu(false)
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [])

  const handleMenu = action => {
    if (action === 'open-status') window.electronAPI?.send('open-status-window')
    else if (action === 'load-pet') window.electronAPI?.send('open-load-pet-window')
    else if (action === 'exit') setExitConfirm(true)
    else if (action === 'train-pet') window.electronAPI?.send('train-pet')
    else if (action === 'care-pet') window.electronAPI?.send('care-pet')
    else if (action === 'battle-pet') window.electronAPI?.send('open-battle-mode-window')
    else if (action === 'itens-pet') window.electronAPI?.send('itens-pet')
    else if (action === 'store-pet') window.electronAPI?.send('store-pet')
  }

  const confirmExit = () => window.electronAPI?.send('exit-app')

  const showStatus = () => {
    setStatusVisible(true)
    clearTimeout(statusTimeout.current)
    statusTimeout.current = setTimeout(() => setStatusVisible(false), 5000)
  }

  function updateStatusIcon(h) {
    if (h > 90) return 'Assets/Shop/happy.png'
    if (h > 70) return 'Assets/Shop/smile.png'
    if (h > 50) return 'Assets/Shop/shy-smile.png'
    if (h > 30) return 'Assets/Shop/poker-face.png'
    return 'Assets/Shop/sad.png'
  }

  function getRandomItem() {
    if (!itemsData.current.length) return null
    let total = 0
    const weights = itemsData.current.map(it => {
      const rarity = itemRarities[it.id] || 'Comum'
      const w = rarityWeights[rarity] || 1
      total += w
      return w
    })
    let r = Math.random() * total
    for (let i = 0; i < itemsData.current.length; i++) {
      if (r < weights[i]) return itemsData.current[i]
      r -= weights[i]
    }
    return itemsData.current[0]
  }

  function maybeFindItem() {
    if (Math.random() < 0.1) {
      const item = getRandomItem()
      if (!item) return
      setItemIcon(item.icon)
      setTimeout(() => setItemIcon(null), 5000)
      window.electronAPI?.send('reward-pet', { item: item.id, qty: 1 })
    }
  }

  const hungerLow = petData.hunger < 30
  const happinessLow = petData.happiness < 30

  const petImage = petData.statusImage || petData.image

  return (
    <>
      <div className="tray-container">
        <div className="toggle-container">
          <div className={`toggle-switch${showRarity ? ' active' : ''}`} onClick={() => setShowRarity(v => !v)} />
        </div>
        <div className="pet-image-container">
          <div className="pet-image-background" style={{ background: rarityGradients[petData.rarity] }} />
          <div className="pet-image-texture" style={{ display: showRarity ? 'block' : 'none' }} />
          <img
            id="pet-image"
            src={getImageSrc(petImage)}
            alt="Pet Image"
            style={{ imageRendering: 'pixelated' }}
            onClick={showStatus}
            onError={e => { if (e.currentTarget.src.endsWith('.gif')) e.currentTarget.src = e.currentTarget.src.replace(/\.gif$/i, '.png'); else e.currentTarget.src = 'Assets/Mons/eggsy.png' }}
          />
          <div className="pet-info" style={{ display: showRarity ? 'block' : 'none' }}>
            <div className="pet-name">{petData.name}</div>
            <div className="health-bar">
              <div className="bar" id="health-fill" style={{ width: `${(petData.currentHealth / petData.maxHealth) * 100}%` }} />
            </div>
            <div className="energy-bar">
              <div className="bar" id="energy-fill" style={{ width: `${petData.energy}%` }} />
            </div>
            <div className="pet-level" id="level-display">Lvl {petData.level}</div>
          </div>
          <div className="hamburger-menu" onClick={toggleMenu}>
            <img className="hamburger-icon" src="Assets/Icons/Hamburger_icon.svg.png" alt="Menu" style={{ imageRendering: 'pixelated' }} />
            <div className={`menu-dropdown${showMenu ? ' active' : ''}`}> 
              <div className="menu-item" data-action="open-status" onClick={() => handleMenu('open-status')}>Status</div>
              <div className="menu-item" data-action="care-pet" onClick={() => handleMenu('care-pet')}>Cuidar</div>
              <div className="menu-item" data-action="train-pet" onClick={() => handleMenu('train-pet')}>Treinar</div>
              <div className="menu-item" data-action="battle-pet" onClick={() => handleMenu('battle-pet')}>Batalhar</div>
              <div className="menu-item" data-action="itens-pet" onClick={() => handleMenu('itens-pet')}>Itens</div>
              <div className="menu-item" data-action="store-pet" onClick={() => handleMenu('store-pet')}>Loja</div>
              <div className="menu-item" data-action="load-pet" onClick={() => handleMenu('load-pet')}>Pets</div>
              <div className="menu-item" data-action="exit" onClick={() => handleMenu('exit')}>Sair</div>
            </div>
          </div>
          {hungerLow && (
            <img id="hunger-warning" className="warning-image" src="Assets/Shop/meat1.png" alt="Fome baixa" style={{ imageRendering: 'pixelated', top: happinessLow ? '65px' : '65px' }} />
          )}
          {happinessLow && (
            <img id="happiness-warning" className="warning-image" src="Assets/Shop/sad.png" alt="Felicidade baixa" style={{ imageRendering: 'pixelated', top: hungerLow ? '85px' : '65px' }} />
          )}
          {itemIcon && (
            <div id="item-found-bubble" className="item-bubble">
              <img id="item-found-img" src={itemIcon} alt="Item" />
            </div>
          )}
          {statusVisible && (
            <div id="pet-status-bubble">
              <img src={updateStatusIcon(petData.happiness)} alt="status" />
            </div>
          )}
          {battleMsg && <div id="battle-alert">{battleMsg}</div>}
        </div>
      </div>
      {exitConfirm && (
        <div id="exit-confirm-overlay" className="overlay">
          <div id="exit-confirm-box">
            <p>Tem certeza que deseja sair?</p>
            <div className="confirm-buttons">
              <button className="button small-button" id="exit-confirm-yes" onClick={confirmExit}>Sair</button>
              <button className="button small-button" id="exit-confirm-no" onClick={() => setExitConfirm(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
