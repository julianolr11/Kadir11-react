import { useEffect, useRef, useState } from 'react'
import './CharacterCreation.css'

export interface CharacterSelection {
  sex: 'male' | 'female'
  skin: string
  eyes: string
  torso: string
  legs: string
  feet: string
  shoulders: string
  cape: string
  hair: { style: string; color: string }
  hat: string
  accessory: string
  name: string
}

const defaultSelection: CharacterSelection = {
  sex: 'male',
  skin: '',
  eyes: '',
  torso: '',
  legs: '',
  feet: '',
  shoulders: '',
  cape: '',
  hair: { style: '', color: '' },
  hat: '',
  accessory: '',
  name: '',
}

const frameWidth = 64
const frameHeight = 64
const sx = 1 * frameWidth
const sy = 3 * frameHeight

export default function CharacterCreation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [metadata, setMetadata] = useState<any>(null)
  const [selection, setSelection] = useState<CharacterSelection>(defaultSelection)

  useEffect(() => {
    fetch('Assets/Character/character_metadata_final.json')
      .then(res => res.json())
      .then(setMetadata)
      .catch(err => console.error(err))
  }, [])

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, frameWidth, frameHeight)
    const drawLayer = (src?: string) => {
      if (!src) return
      const img = new Image()
      img.src = src
      img.onload = () => {
        ctx.drawImage(img, sx, sy, frameWidth, frameHeight, 0, 0, frameWidth, frameHeight)
      }
    }
    drawLayer(selection.skin)
    drawLayer(selection.eyes)
    drawLayer(selection.legs)
    drawLayer(selection.feet)
    drawLayer(selection.torso)
    drawLayer(selection.shoulders)
    drawLayer(selection.cape)
    drawLayer(selection.hair.style)
    drawLayer(selection.hair.color)
    drawLayer(selection.hat)
    drawLayer(selection.accessory)
  }, [selection])

  const handle = (field: keyof CharacterSelection, value: any) => {
    setSelection(prev => ({ ...prev, [field]: value }))
  }

  const handleHair = (field: 'style' | 'color', value: string) => {
    setSelection(prev => ({ ...prev, hair: { ...prev.hair, [field]: value } }))
  }

  const confirm = () => {
    window.ipcRenderer.invoke('save-character', selection)
  }

  const list = (key: string) => metadata?.[key] ?? []
  const listSex = (key: string) => metadata?.[key]?.[selection.sex] ?? []

  return (
    <div className='character-creation'>
      <canvas ref={canvasRef} width={frameWidth} height={frameHeight} />
      <div className='fields'>
        <label>
          Sexo
          <select value={selection.sex} onChange={e => handle('sex', e.target.value as 'male' | 'female')}>
            <option value='male'>male</option>
            <option value='female'>female</option>
          </select>
        </label>
        <label>
          Pele
          <select value={selection.skin} onChange={e => handle('skin', e.target.value)}>
            <option value=''>-</option>
            {list('skin').map((o: string) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </label>
        <label>
          Olhos
          <select value={selection.eyes} onChange={e => handle('eyes', e.target.value)}>
            <option value=''>-</option>
            {list('eyes').map((o: string) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </label>
        <label>
          Torso
          <select value={selection.torso} onChange={e => handle('torso', e.target.value)}>
            <option value=''>-</option>
            {listSex('torso').map((o: string) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </label>
        <label>
          Pernas
          <select value={selection.legs} onChange={e => handle('legs', e.target.value)}>
            <option value=''>-</option>
            {listSex('legs').map((o: string) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </label>
        <label>
          Pés
          <select value={selection.feet} onChange={e => handle('feet', e.target.value)}>
            <option value=''>-</option>
            {listSex('feet').map((o: string) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </label>
        <label>
          Ombros
          <select value={selection.shoulders} onChange={e => handle('shoulders', e.target.value)}>
            <option value=''>-</option>
            {list('shoulders').map((o: string) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </label>
        <label>
          Capa
          <select value={selection.cape} onChange={e => handle('cape', e.target.value)}>
            <option value=''>-</option>
            {list('cape').map((o: string) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </label>
        <label>
          Cabelo Estilo
          <select value={selection.hair.style} onChange={e => handleHair('style', e.target.value)}>
            <option value=''>-</option>
            {list('hairStyle').map((o: string) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </label>
        <label>
          Cabelo Cor
          <select value={selection.hair.color} onChange={e => handleHair('color', e.target.value)}>
            <option value=''>-</option>
            {list('hairColor').map((o: string) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </label>
        <label>
          Chapéu
          <select value={selection.hat} onChange={e => handle('hat', e.target.value)}>
            <option value=''>-</option>
            {list('hat').map((o: string) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </label>
        <label>
          Acessório
          <select value={selection.accessory} onChange={e => handle('accessory', e.target.value)}>
            <option value=''>-</option>
            {list('accessory').map((o: string) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </label>
        <label>
          Nome
          <input value={selection.name} onChange={e => handle('name', e.target.value)} />
        </label>
        <button className='confirm' onClick={confirm}>Confirmar</button>
      </div>
    </div>
  )
}
