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
  skin: 'Assets/Character/body/male/light.png',
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
// Sprite coordinates for the front idle frame
const sx = 0 * frameWidth
const sy = 6 * frameHeight

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
  return (
    <div className='option-row'>
      <button className='arrow-btn' onClick={prev}>◀</button>
      <span className='option-label'>{label}</span>
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
    // Ombros e capa desabilitados
    if (selection.hair.style && selection.hair.color) {
      drawLayer(`Assets/Character/hair/${selection.hair.style}/${selection.hair.color}.png`)
    }
    drawLayer(selection.hat)
    drawLayer(selection.accessory)
  }, [selection])

  const handle = (field: keyof CharacterSelection, value: any) => {
    setSelection(prev => {
      if (field === 'sex') {
        return {
          ...prev,
          sex: value as 'male' | 'female',
          skin: `Assets/Character/body/${value}/light.png`,
        }
      }
      return { ...prev, [field]: value }
    })
  }

  const handleHair = (field: 'style' | 'color', value: string) => {
    setSelection(prev => ({ ...prev, hair: { ...prev.hair, [field]: value } }))
  }

  const confirm = () => {
    window.ipcRenderer.invoke('save-character', selection)
  }

  const list = (key: string) => {
    if (!metadata) return []
    switch (key) {
      case 'skin':
        return metadata.skins[selection.sex] ?? []
      case 'eyes':
        return metadata.eyes.filter((p: string) => p.includes(selection.sex))
      case 'hairStyle':
        return metadata.hair.styles
      case 'hairColor':
        return metadata.hair.colors
      case 'shoulders':
        return metadata.clothes.shoulders
      case 'cape':
        return metadata.clothes.cape
      case 'hat':
        return metadata.extras.hats.filter(
          (p: string) =>
            p.includes(selection.sex) || (!p.includes('male') && !p.includes('female'))
        )
      case 'accessory':
        return metadata.extras.accessories.filter(
          (p: string) =>
            p.includes(selection.sex) || (!p.includes('male') && !p.includes('female'))
        )
      default:
        return []
    }
  }

  const listSex = (key: string) => {
    if (!metadata) return []
    return metadata.clothes[key]?.[selection.sex] ?? []
  }

  return (
    <div className='character-creation'>
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
        {/* Ombros e Capa desabilitados por enquanto */}
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
      </div>
      <div className='preview'>
        <canvas ref={canvasRef} width={frameWidth} height={frameHeight} />
        <label className='name-row'>
          Nome
          <input value={selection.name} onChange={e => handle('name', e.target.value)} />
        </label>
        <div className='nickname'>{selection.name}</div>
        <button className='confirm' onClick={confirm}>Confirmar</button>
      </div>
    </div>
  )
}
