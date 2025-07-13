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
  back: string
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
  back: '',
  hair: { style: '', color: '' },
  hat: '',
  accessory: '',
  name: '',
}

const frameWidth = 64
const frameHeight = 64
const sx = 0 * frameWidth
const frontRow = 6
const rightRow = 7
const leftRow = 5
const backRow = 4
const orientationFrames = [frontRow, rightRow, backRow, leftRow]

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
  const [frameRow, setFrameRow] = useState(frontRow)
  const [orientation, setOrientation] = useState(0)
  const [errorMsg, setErrorMsg] = useState('')
  const [phase, setPhase] = useState<'create' | 'intro'>('create')
  const [fade, setFade] = useState<'in' | 'out'>('in')
  const [showIntroText, setShowIntroText] = useState(false)
  const [showProceed, setShowProceed] = useState(false)

  useEffect(() => {
    fetch('Assets/Character/character_metadata_final.json')
      .then(res => res.json())
      .then(setMetadata)
      .catch(err => console.error(err))
  }, [])

  useEffect(() => {
    setFrameRow(orientationFrames[orientation])
  }, [orientation])

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    const sy = frameRow * frameHeight

    const loadImg = (src: string) =>
      new Promise<HTMLImageElement>(resolve => {
        const img = new Image()
        img.src = src
        if (img.complete) resolve(img)
        else img.onload = () => resolve(img)
      })

    let ignore = false

    const draw = async () => {
      ctx.clearRect(0, 0, frameWidth, frameHeight)
      const layers: Array<string | undefined> = [
        selection.skin,
        selection.eyes,
        selection.legs,
        selection.feet,
        selection.torso,
        selection.hair.style && selection.hair.color
          ? `Assets/Character/hair/${selection.hair.style}/${selection.hair.color}.png`
          : undefined,
        selection.hat,
        selection.accessory,
        selection.back,
      ]

      for (const src of layers) {
        if (!src) continue
        const img = await loadImg(src)
        if (ignore) return
        ctx.drawImage(img, sx, sy, frameWidth, frameHeight, 0, 0, frameWidth, frameHeight)
      }
    }

    draw()

    return () => {
      ignore = true
    }
  }, [selection, frameRow])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setOrientation(o => (o + 1) % orientationFrames.length)
      else if (e.key === 'ArrowLeft') setOrientation(o => (o + orientationFrames.length - 1) % orientationFrames.length)
      else if (e.key === 'ArrowUp') setOrientation(2)
      else if (e.key === 'ArrowDown') setOrientation(0)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  const handle = (field: keyof CharacterSelection, value: any) => {
    setSelection(prev => {
      if (field === 'sex') {
        const newSex = value as 'male' | 'female'
        if (!metadata) {
          return {
            ...prev,
            sex: newSex,
            skin: `Assets/Character/body/${newSex}/light.png`,
          }
        }

        const pickSameIndex = (key: 'torso' | 'legs' | 'feet') => {
          const prevList = metadata.clothes[key][prev.sex] ?? []
          const idx = prevList.indexOf((prev as any)[key])
          const newList = metadata.clothes[key][newSex] ?? []
          return idx >= 0 && idx < newList.length ? newList[idx] : ''
        }

        return {
          ...prev,
          sex: newSex,
          skin: `Assets/Character/body/${newSex}/light.png`,
          torso: pickSameIndex('torso'),
          legs: pickSameIndex('legs'),
          feet: pickSameIndex('feet'),
        }
      }
      return { ...prev, [field]: value }
    })
  }

  const handleHair = (field: 'style' | 'color', value: string) => {
    setSelection(prev => {
      let hair = { ...prev.hair, [field]: value }
      if (field === 'color') {
        if (!value) {
          hair.style = ''
        } else if (!prev.hair.style) {
          const first = list('hairStyle')[0] ?? ''
          hair.style = first
        }
      }
      return { ...prev, hair }
    })
  }

  const handleNameChange = (value: string) => {
    let v = value.slice(0, 15)
    const sanitized = v.replace(/[^A-Za-z0-9._]/g, '')
    if (sanitized !== v) {
      setErrorMsg('Use apenas letras, números, ponto e underline')
    } else {
      setErrorMsg('')
    }
    handle('name', sanitized)
  }

  const confirm = () => {
    const valid = /^[A-Za-z0-9._]{1,15}$/.test(selection.name)
    if (!valid) {
      setErrorMsg('Nome inválido')
      return
    }
    window.ipcRenderer.invoke('save-character', selection)
    setFade('out')
    setTimeout(() => {
      setPhase('intro')
      setFade('in')
    }, 500)
  }

  useEffect(() => {
    if (phase === 'intro') {
      const textTimer = setTimeout(() => setShowIntroText(true), 500)
      const btnTimer = setTimeout(() => setShowProceed(true), 1500)
      return () => {
        clearTimeout(textTimer)
        clearTimeout(btnTimer)
      }
    } else {
      setShowIntroText(false)
      setShowProceed(false)
    }
  }, [phase])

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
      case 'back':
        return metadata.clothes.back
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
    <div className='character-creation-wrapper'>
      {phase === 'create' && (
        <div className={`character-creation ${fade === 'out' ? 'fade-out' : ''}`}>
          <div className='fields-left'>
            <OptionRow
              label='Pele'
              options={list('skin')}
              value={selection.skin}
              onChange={v => handle('skin', v)}
              allowNone={false}
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
          </div>
          <div className='preview'>
            <OptionRow
              label={selection.sex === 'male' ? '♂' : '♀'}
              options={['male', 'female']}
              value={selection.sex}
              onChange={v => handle('sex', v as 'male' | 'female')}
              allowNone={false}
            />
            <canvas ref={canvasRef} width={frameWidth} height={frameHeight} />
            <div className='rotation-controls'>
              <button className='arrow-btn' onClick={() => setOrientation(o => (o + orientationFrames.length - 1) % orientationFrames.length)}>◀</button>
              <button className='arrow-btn' onClick={() => setOrientation(o => (o + 1) % orientationFrames.length)}>▶</button>
            </div>
            <label className='name-row'>
              Nome
          <input value={selection.name} onChange={e => handleNameChange(e.target.value)} />
            </label>
            <div className='error-message'>{errorMsg}</div>
            <div className='nickname'>{selection.name}</div>
            <button className='confirm' onClick={confirm}>Prosseguir</button>
          </div>
          <div className='fields-right'>
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
            <OptionRow
              label='Costas'
              options={list('back')}
              value={selection.back}
              onChange={v => handle('back', v)}
            />
          </div>
        </div>
      )}
      {phase === 'intro' && (
        <div className={`next-screen ${fade === 'in' ? 'visible' : ''}`}>
          <p className={`next-text ${showIntroText ? 'visible' : ''}`}>
            Como toda grande jornada, um companheiro leal é essencial. Mas antes, preciso entender quem você é, para encontrar aquele que mais combina com você.
          </p>
          {showProceed && (
            <button className={`proceed-btn ${showProceed ? 'visible' : ''}`}>Prosseguir</button>
          )}
        </div>
      )}
    </div>
  )
}
