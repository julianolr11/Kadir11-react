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

interface OptionRowProps {
  label: string
  options: string[]
  value: string
  onChange: (v: string) => void
  allowNone?: boolean
}

function OptionRow({ label, options, value, onChange, allowNone = true }: OptionRowProps) {
  const all = allowNone ? [''].concat(options) : options
  let index = all.indexOf(value)
  if (index === -1) index = 0
  const prev = () => {
    const i = (index - 1 + all.length) % all.length
    onChange(all[i])
  }
  const next = () => {
    const i = (index + 1) % all.length
    onChange(all[i])
  }
  const display = value || '-'
  return (
    <div className='option-row'>
      <span className='option-label'>{label}</span>
      <button className='arrow-btn' onClick={prev}>◀</button>
      <span className='option-value'>{display}</span>
      <button className='arrow-btn' onClick={next}>▶</button>
    </div>
  )
}

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
        <OptionRow
          label='Sexo'
          options={['male', 'female']}
          value={selection.sex}
          onChange={v => handle('sex', v as 'male' | 'female')}
          allowNone={false}
        />
        <OptionRow
          label='Pele'
          options={list('skin')}
          value={selection.skin}
          onChange={v => handle('skin', v)}
        />
        <OptionRow
          label='Olhos'
          options={list('eyes')}
          value={selection.eyes}
          onChange={v => handle('eyes', v)}
        />
        <OptionRow
          label='Torso'
          options={listSex('torso')}
          value={selection.torso}
          onChange={v => handle('torso', v)}
        />
        <OptionRow
          label='Pernas'
          options={listSex('legs')}
          value={selection.legs}
          onChange={v => handle('legs', v)}
        />
        <OptionRow
          label='Pés'
          options={listSex('feet')}
          value={selection.feet}
          onChange={v => handle('feet', v)}
        />
        <OptionRow
          label='Ombros'
          options={list('shoulders')}
          value={selection.shoulders}
          onChange={v => handle('shoulders', v)}
        />
        <OptionRow
          label='Capa'
          options={list('cape')}
          value={selection.cape}
          onChange={v => handle('cape', v)}
        />
        <OptionRow
          label='Cabelo Estilo'
          options={list('hairStyle')}
          value={selection.hair.style}
          onChange={v => handleHair('style', v)}
        />
        <OptionRow
          label='Cabelo Cor'
          options={list('hairColor')}
          value={selection.hair.color}
          onChange={v => handleHair('color', v)}
        />
        <OptionRow
          label='Chapéu'
          options={list('hat')}
          value={selection.hat}
          onChange={v => handle('hat', v)}
        />
        <OptionRow
          label='Acessório'
          options={list('accessory')}
          value={selection.accessory}
          onChange={v => handle('accessory', v)}
        />
        <label className='name-row'>
          Nome
          <input value={selection.name} onChange={e => handle('name', e.target.value)} />
        </label>
        <button className='confirm' onClick={confirm}>Confirmar</button>
      </div>
    </div>
  )
}
