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

interface Attributes {
  attack: number
  defense: number
  speed: number
  magic: number
  life: number
}

interface QuizOption {
  text: string
  effects: Attributes
}

interface QuizQuestion {
  text: string
  options: QuizOption[]
}

const allQuestions: QuizQuestion[] = [
  {
    text: 'Um inimigo aparece subitamente no seu caminho. O que você faz?',
    options: [
      { text: 'Avanço sem hesitar, atacando com tudo.', effects: { attack: 2, defense: 0, speed: 1, magic: 1, life: 1 } },
      { text: 'Me protejo com um escudo e analiso.', effects: { attack: 0, defense: 2, speed: 1, magic: 1, life: 0 } },
      { text: 'Dou um salto rápido para o lado e recuo.', effects: { attack: 1, defense: 0, speed: 2, magic: 1, life: 0 } },
    ],
  },
  {
    text: 'Uma porta mágica tranca o seu caminho. Como você tenta abri-la?',
    options: [
      { text: 'Arrebento com força bruta.', effects: { attack: 2, defense: 1, speed: 1, magic: 0, life: 0 } },
      { text: 'Tento decifrar os símbolos e conjuro um feitiço.', effects: { attack: 0, defense: 1, speed: 1, magic: 2, life: 1 } },
      { text: 'Tento encontrar um mecanismo escondido ao redor.', effects: { attack: 1, defense: 2, speed: 0, magic: 1, life: 0 } },
    ],
  },
  {
    text: 'Você encontra uma criatura ferida. O que faz?',
    options: [
      { text: 'A ajudo com magia de cura.', effects: { attack: 0, defense: 1, speed: 1, magic: 2, life: 0 } },
      { text: 'A ignoro e sigo em frente.', effects: { attack: 1, defense: 1, speed: 2, magic: 0, life: 1 } },
      { text: 'A protejo até que consiga se recuperar.', effects: { attack: 1, defense: 2, speed: 0, magic: 1, life: 0 } },
    ],
  },
  {
    text: 'Um baú está preso entre armadilhas. Como age?',
    options: [
      { text: 'Uso magia para desativar o mecanismo.', effects: { attack: 0, defense: 1, speed: 1, magic: 2, life: 0 } },
      { text: 'Me movimento com rapidez para pegá-lo.', effects: { attack: 1, defense: 0, speed: 2, magic: 1, life: 0 } },
      { text: 'Destruo o mecanismo com força.', effects: { attack: 2, defense: 1, speed: 1, magic: 0, life: 1 } },
    ],
  },
  {
    text: 'Um aliado está em perigo. Você:',
    options: [
      { text: 'Salta na frente dele, recebendo o golpe.', effects: { attack: 1, defense: 2, speed: 0, magic: 1, life: 0 } },
      { text: 'Lança um feitiço para distração.', effects: { attack: 0, defense: 1, speed: 1, magic: 2, life: 0 } },
      { text: 'Derruba o inimigo antes que ataque.', effects: { attack: 2, defense: 0, speed: 1, magic: 1, life: 1 } },
    ],
  },
  {
    text: 'Durante uma tempestade mágica, você:',
    options: [
      { text: 'Cria um campo de proteção.', effects: { attack: 1, defense: 1, speed: 0, magic: 2, life: 1 } },
      { text: 'Corre para se abrigar.', effects: { attack: 0, defense: 1, speed: 2, magic: 1, life: 0 } },
      { text: 'Finca os pés no chão e resiste.', effects: { attack: 1, defense: 2, speed: 1, magic: 0, life: 0 } },
    ],
  },
  {
    text: 'Para vencer um torneio, sua principal estratégia é:',
    options: [
      { text: 'Atacar com golpes poderosos.', effects: { attack: 2, defense: 1, speed: 1, magic: 0, life: 0 } },
      { text: 'Enganar o adversário com ilusões.', effects: { attack: 0, defense: 1, speed: 1, magic: 2, life: 0 } },
      { text: 'Resistir até que o oponente se canse.', effects: { attack: 1, defense: 2, speed: 0, magic: 1, life: 1 } },
    ],
  },
  {
    text: 'Você encontra um livro antigo brilhando. O que faz?',
    options: [
      { text: 'Estudo seu conteúdo a fundo.', effects: { attack: 0, defense: 1, speed: 1, magic: 2, life: 0 } },
      { text: 'Levo comigo para o mestre analisar.', effects: { attack: 1, defense: 2, speed: 0, magic: 1, life: 0 } },
      { text: 'Testo um feitiço imediatamente.', effects: { attack: 1, defense: 0, speed: 2, magic: 1, life: 1 } },
    ],
  },
  {
    text: 'Em uma emboscada, sua reação imediata é:',
    options: [
      { text: 'Contra-atacar com tudo.', effects: { attack: 2, defense: 1, speed: 1, magic: 0, life: 0 } },
      { text: 'Me esconder e observar.', effects: { attack: 0, defense: 2, speed: 1, magic: 1, life: 0 } },
      { text: 'Fugir rapidamente.', effects: { attack: 1, defense: 1, speed: 2, magic: 0, life: 1 } },
    ],
  },
  {
    text: 'Um espírito oferece um presente em troca de um enigma resolvido. Você:',
    options: [
      { text: 'Resolve com lógica mágica.', effects: { attack: 1, defense: 1, speed: 0, magic: 2, life: 0 } },
      { text: 'Tenta intimidá-lo e pegar à força.', effects: { attack: 2, defense: 0, speed: 1, magic: 1, life: 0 } },
      { text: 'Distrai o espírito e pega o item.', effects: { attack: 1, defense: 0, speed: 2, magic: 1, life: 1 } },
    ],
  },
  {
    text: 'Um monstro veloz está atacando. Sua tática:',
    options: [
      { text: 'Golpeá-lo antes que ele reaja.', effects: { attack: 1, defense: 1, speed: 2, magic: 0, life: 0 } },
      { text: 'Criar uma armadilha mágica.', effects: { attack: 0, defense: 1, speed: 1, magic: 2, life: 0 } },
      { text: 'Segurar firme e resistir.', effects: { attack: 1, defense: 2, speed: 0, magic: 1, life: 1 } },
    ],
  },
  {
    text: 'Você encontra uma fonte de energia estranha. Como reage?',
    options: [
      { text: 'A absorvo imediatamente.', effects: { attack: 1, defense: 0, speed: 1, magic: 2, life: 0 } },
      { text: 'Testo um ataque nela.', effects: { attack: 2, defense: 1, speed: 1, magic: 0, life: 0 } },
      { text: 'Recuo e analiso de longe.', effects: { attack: 0, defense: 2, speed: 1, magic: 1, life: 1 } },
    ],
  },
  {
    text: 'Seu grupo está cansado, mas há pressa. Você:',
    options: [
      { text: 'Força todos a continuar correndo.', effects: { attack: 1, defense: 1, speed: 2, magic: 0, life: 1 } },
      { text: 'Protege o grupo e propõe descanso.', effects: { attack: 1, defense: 2, speed: 0, magic: 1, life: 0 } },
      { text: 'Usa magia para restaurar parte das energias.', effects: { attack: 0, defense: 1, speed: 1, magic: 2, life: 0 } },
    ],
  },
  {
    text: 'Ao ver um inimigo forte, você:',
    options: [
      { text: 'Desafia de frente com coragem.', effects: { attack: 2, defense: 1, speed: 1, magic: 0, life: 0 } },
      { text: 'Se afasta e estuda os padrões de ataque.', effects: { attack: 0, defense: 1, speed: 1, magic: 2, life: 1 } },
      { text: 'Chama reforços e se prepara.', effects: { attack: 1, defense: 2, speed: 0, magic: 1, life: 0 } },
    ],
  },
  {
    text: 'Você precisa atravessar uma ponte instável:',
    options: [
      { text: 'Corre rapidamente antes que desabe.', effects: { attack: 1, defense: 0, speed: 2, magic: 1, life: 0 } },
      { text: 'Fortalece a estrutura com magia.', effects: { attack: 0, defense: 1, speed: 1, magic: 2, life: 0 } },
      { text: 'Atrai alguém para testar primeiro.', effects: { attack: 1, defense: 2, speed: 0, magic: 1, life: 1 } },
    ],
  },
  {
    text: 'Seu pet está com medo. O que você faz?',
    options: [
      { text: 'Grito para ele reagir.', effects: { attack: 2, defense: 1, speed: 1, magic: 0, life: 0 } },
      { text: 'O acolho com um encantamento de calma.', effects: { attack: 0, defense: 1, speed: 1, magic: 2, life: 0 } },
      { text: 'Fico ao lado dele, firme.', effects: { attack: 1, defense: 2, speed: 0, magic: 1, life: 1 } },
    ],
  },
  {
    text: 'Um desafio de reflexos é lançado. Você:',
    options: [
      { text: 'Se move mais rápido que o oponente.', effects: { attack: 1, defense: 1, speed: 2, magic: 0, life: 1 } },
      { text: 'Usa feitiços para prever movimentos.', effects: { attack: 0, defense: 1, speed: 1, magic: 2, life: 0 } },
      { text: 'Se protege e observa antes de agir.', effects: { attack: 1, defense: 2, speed: 0, magic: 1, life: 0 } },
    ],
  },
  {
    text: 'Um pergaminho antigo pede um guardião. Você:',
    options: [
      { text: 'Se oferece para guardá-lo.', effects: { attack: 1, defense: 2, speed: 0, magic: 1, life: 0 } },
      { text: 'O estuda para aprender seus segredos.', effects: { attack: 1, defense: 1, speed: 0, magic: 2, life: 0 } },
      { text: 'O vende por moedas.', effects: { attack: 1, defense: 0, speed: 2, magic: 1, life: 1 } },
    ],
  },
  {
    text: 'Um oponente muito mais forte te desafia. Você:',
    options: [
      { text: 'Aceita a luta com bravura.', effects: { attack: 2, defense: 1, speed: 1, magic: 0, life: 0 } },
      { text: 'Usa um feitiço para equilibrar a luta.', effects: { attack: 0, defense: 1, speed: 1, magic: 2, life: 0 } },
      { text: 'Engana e escapa.', effects: { attack: 1, defense: 0, speed: 2, magic: 1, life: 1 } },
    ],
  },
  {
    text: 'Um labirinto mágico se abre. Qual seu plano?',
    options: [
      { text: 'Corro direto, confiante.', effects: { attack: 1, defense: 0, speed: 2, magic: 1, life: 0 } },
      { text: 'Sinto a energia e sigo pelos caminhos menos óbvios.', effects: { attack: 0, defense: 1, speed: 1, magic: 2, life: 0 } },
      { text: 'Deixo marcas e avanço com cautela.', effects: { attack: 1, defense: 2, speed: 1, magic: 0, life: 1 } },
    ],
  },
]

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
  const [phase, setPhase] = useState<'create' | 'intro' | 'quiz' | 'element'>('create')
  const [fade, setFade] = useState<'in' | 'out'>('in')
  const [showIntroText, setShowIntroText] = useState(false)
  const [showProceed, setShowProceed] = useState(false)
  const [attributes, setAttributes] = useState<Attributes>({ attack: 0, defense: 0, speed: 0, magic: 0, life: 0 })
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [questionIndex, setQuestionIndex] = useState(0)

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

  const startQuiz = () => {
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5)
    setQuestions(shuffled.slice(0, 5))
    setQuestionIndex(0)
    setAttributes({ attack: 0, defense: 0, speed: 0, magic: 0, life: 0 })
    setFade('out')
    setTimeout(() => {
      setPhase('quiz')
      setFade('in')
    }, 500)
  }

  const answer = (opt: QuizOption) => {
    setAttributes(prev => ({
      attack: prev.attack + opt.effects.attack,
      defense: prev.defense + opt.effects.defense,
      speed: prev.speed + opt.effects.speed,
      magic: prev.magic + opt.effects.magic,
      life: prev.life + opt.effects.life,
    }))
    if (questionIndex + 1 < questions.length) {
      setFade('out')
      setTimeout(() => {
        setQuestionIndex(i => i + 1)
        setFade('in')
      }, 500)
    } else {
      setFade('out')
      setTimeout(() => {
        setAttributes(prev => ({ ...prev, life: prev.life * 10 }))
        setPhase('element')
        setFade('in')
      }, 500)
    }
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
            <button
              className={`proceed-btn ${showProceed ? 'visible' : ''}`}
              onClick={startQuiz}
            >
              Prosseguir
            </button>
          )}
        </div>
      )}
      {phase === 'quiz' && questions[questionIndex] && (
        <div className={`quiz-screen ${fade === 'out' ? 'fade-out' : ''}`}>
          <p>{questions[questionIndex].text}</p>
          <div className='options'>
            {questions[questionIndex].options.map((o, i) => (
              <button key={i} onClick={() => answer(o)}>
                {o.text}
              </button>
            ))}
          </div>
        </div>
      )}
      {phase === 'element' && (
        <div className={`element-screen ${fade === 'in' ? 'visible' : ''}`}>
          <p>Por fim, escolha um elemento para te guiar</p>
          <div className='element-options'>
            {[
              { name: 'Fire', src: 'Assets/Elements/fire.png' },
              { name: 'Air', src: 'Assets/Elements/air.png' },
              { name: 'Pure', src: 'Assets/Elements/pure.png' },
              { name: 'Earth', src: 'Assets/Elements/earth.png' },
              { name: 'Water', src: 'Assets/Elements/water.png' },
            ].map(el => (
              <div key={el.name} className='element-option'>
                <img src={el.src} alt={el.name} />
                <span>{el.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
