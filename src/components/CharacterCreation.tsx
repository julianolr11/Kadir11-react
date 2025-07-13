import { useEffect, useRef, useState } from 'react'
import Store from '../store'
import './CharacterCreation.css'

interface Metadata {
  sex: string[]
  skin: Record<string, string[]>
  eyes: Record<string, string[]>
  torso: Record<string, string[]>
  legs: Record<string, string[]>
  feet: Record<string, string[]>
  shoulders: string[]
  cape: string[]
  hairStyles: string[]
  hairColors: string[]
  hair: Record<string, Record<string, string>>
  hat: string[]
  accessory: string[]
}

const introLines = [
  'Boas vindas, viajante...',
  'Parece estar cansado, mas não desanime.',
  'Kadir está aqui.',
  'Vamos conhecer um pouco mais sobre você.',
]

const CharacterCreation = () => {
  const [introIndex, setIntroIndex] = useState(0)
  const [showMenu, setShowMenu] = useState(false)
  const [metadata, setMetadata] = useState<Metadata | null>(null)
  const [sex, setSex] = useState('male')
  const [skin, setSkin] = useState('')
  const [eyes, setEyes] = useState('')
  const [torso, setTorso] = useState('')
  const [legs, setLegs] = useState('')
  const [feet, setFeet] = useState('')
  const [shoulders, setShoulders] = useState('')
  const [cape, setCape] = useState('')
  const [hairStyle, setHairStyle] = useState('bangs')
  const [hairColor, setHairColor] = useState('brown')
  const [hat, setHat] = useState('')
  const [accessory, setAccessory] = useState('')
  const [name, setName] = useState('')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const store = useRef(new Store()).current

  useEffect(() => {
    fetch('Assets/Character/character_metadata_final.json')
      .then(res => res.json())
      .then((data: Metadata) => {
        setMetadata(data)
        setSkin(data.skin['male'][0])
        setEyes(data.eyes['male'][0])
        setTorso(data.torso['male'][0])
        setLegs(data.legs['male'][0])
        setFeet(data.feet['male'][0])
        setShoulders(data.shoulders[0])
        setCape(data.cape[0])
        setHat(data.hat[0])
        setAccessory(data.accessory[0])
      })
  }, [])

  useEffect(() => {
    if (introIndex < introLines.length) {
      const t = setTimeout(() => setIntroIndex(i => i + 1), 2000)
      return () => clearTimeout(t)
    }
  }, [introIndex])

  useEffect(() => {
    if (!metadata) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const frameWidth = 64
    const frameHeight = 64
    ctx.clearRect(0, 0, frameWidth, frameHeight)
    const layers = [
      skin,
      eyes,
      legs,
      feet,
      torso,
      shoulders,
      cape,
      metadata.hair[hairStyle][hairColor],
      hat,
      accessory,
    ]
    layers.forEach(src => {
      const img = new Image()
      img.src = src
      img.onload = () => {
        const cols = 13
        const frameIndex = 0
        const sx = (frameIndex % cols) * frameWidth
        const sy = Math.floor(frameIndex / cols) * frameHeight
        ctx.drawImage(img, sx, sy, frameWidth, frameHeight, 0, 0, frameWidth, frameHeight)
      }
    })
  }, [skin, eyes, legs, feet, torso, shoulders, cape, hairStyle, hairColor, hat, accessory, metadata])

  const save = () => {
    const selectedCharacter = {
      sex,
      skin,
      eyes,
      torso,
      legs,
      feet,
      shoulders,
      cape,
      hair: { style: hairStyle, color: hairColor },
      hat,
      accessory,
      name,
    }
    store.set('selectedCharacter', selectedCharacter)
    alert('Personagem salvo!')
  }

  return (
    <div className='character-creation'>
      <div className='intro'>
        {introLines.map((line, idx) => (
          <p key={idx} className={`intro-line ${idx < introIndex ? 'visible' : ''}`}>{idx < introIndex ? line : ''}</p>
        ))}
        {introIndex >= introLines.length && (
          <button onClick={() => setShowMenu(true)}>Prosseguir</button>
        )}
      </div>
      {showMenu && metadata && (
        <div className='creation-menu'>
          <label>
            Sexo:
            <select value={sex} onChange={e => setSex(e.target.value)}>
              {metadata.sex.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </label>
          <label>
            Tom de pele:
            <select value={skin} onChange={e => setSkin(e.target.value)}>
              {metadata.skin[sex].map(p => (
                <option key={p} value={p}>{p.split('/').pop()}</option>
              ))}
            </select>
          </label>
          <label>
            Olhos:
            <select value={eyes} onChange={e => setEyes(e.target.value)}>
              {metadata.eyes[sex].map(p => (
                <option key={p} value={p}>{p.split('/').pop()}</option>
              ))}
            </select>
          </label>
          <label>
            Torso:
            <select value={torso} onChange={e => setTorso(e.target.value)}>
              {metadata.torso[sex].map(p => (
                <option key={p} value={p}>{p.split('/').pop()}</option>
              ))}
            </select>
          </label>
          <label>
            Pernas:
            <select value={legs} onChange={e => setLegs(e.target.value)}>
              {metadata.legs[sex].map(p => (
                <option key={p} value={p}>{p.split('/').pop()}</option>
              ))}
            </select>
          </label>
          <label>
            Pés:
            <select value={feet} onChange={e => setFeet(e.target.value)}>
              {metadata.feet[sex].map(p => (
                <option key={p} value={p}>{p.split('/').pop()}</option>
              ))}
            </select>
          </label>
          <label>
            Ombros:
            <select value={shoulders} onChange={e => setShoulders(e.target.value)}>
              {metadata.shoulders.map(p => (
                <option key={p} value={p}>{p.split('/').pop()}</option>
              ))}
            </select>
          </label>
          <label>
            Capa:
            <select value={cape} onChange={e => setCape(e.target.value)}>
              {metadata.cape.map(p => (
                <option key={p} value={p}>{p.split('/').pop()}</option>
              ))}
            </select>
          </label>
          <label>
            Cabelo - Estilo:
            <select value={hairStyle} onChange={e => setHairStyle(e.target.value)}>
              {metadata.hairStyles.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </label>
          <label>
            Cabelo - Cor:
            <select value={hairColor} onChange={e => setHairColor(e.target.value)}>
              {metadata.hairColors.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </label>
          <label>
            Chapéu:
            <select value={hat} onChange={e => setHat(e.target.value)}>
              {metadata.hat.map(p => (
                <option key={p} value={p}>{p.split('/').pop()}</option>
              ))}
            </select>
          </label>
          <label>
            Acessório:
            <select value={accessory} onChange={e => setAccessory(e.target.value)}>
              {metadata.accessory.map(p => (
                <option key={p} value={p}>{p.split('/').pop()}</option>
              ))}
            </select>
          </label>
          <label>
            Nome:
            <input type='text' value={name} onChange={e => setName(e.target.value)} />
          </label>
          <button onClick={save}>Salvar</button>
          <div className='preview'>
            <canvas ref={canvasRef} width='64' height='64'></canvas>
          </div>
        </div>
      )}
    </div>
  )
}

export default CharacterCreation
