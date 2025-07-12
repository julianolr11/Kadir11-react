import { createPortal } from 'react-dom'
import './OptionsModal.css'

export interface Preferences {
  language: 'PT-BR' | 'US'
  fullscreen: boolean
  volume: number
  muted: boolean
}

interface Props {
  open: boolean
  preferences: Preferences
  setPreferences: (p: Partial<Preferences>) => void
  toggleMute: () => void
  onClose: () => void
}

const OptionsModal = ({
  open,
  preferences,
  setPreferences,
  toggleMute,
  onClose,
}: Props) => {
  if (!open) return null

  return createPortal(
    <div className='options-modal'>
      <div className='options-modal__mask' onClick={onClose} />
      <div className='options-modal__content'>
        <h2>Opções</h2>
        <h3>Linguagem</h3>
        <div className='options-row'>
          <label>
            <input
              type='radio'
              value='PT-BR'
              checked={preferences.language === 'PT-BR'}
              onChange={() => setPreferences({ language: 'PT-BR' })}
            />
            PT-BR
          </label>
          <label>
            <input
              type='radio'
              value='US'
              checked={preferences.language === 'US'}
              onChange={() => setPreferences({ language: 'US' })}
            />
            US
          </label>
        </div>
        <h3>Fullscreen</h3>
        <div className='options-row'>
          <label>
            <input
              type='checkbox'
              checked={preferences.fullscreen}
              onChange={e => setPreferences({ fullscreen: e.target.checked })}
            />
            Fullscreen
          </label>
        </div>
        <h3>Volume</h3>
        <div className='options-row volume-control'>
          <button className='mute-btn' onClick={toggleMute}>{preferences.muted ? '🔇' : '🔊'}</button>
          <input
            type='range'
            min='0'
            max='1'
            step='0.01'
            value={preferences.muted ? 0 : preferences.volume}
            onChange={e =>
              setPreferences({ volume: parseFloat(e.target.value), muted: false })
            }
          />
        </div>
        <div className='options-footer'>
          <button onClick={onClose}>Fechar</button>
        </div>
      </div>
    </div>,
    document.body,
  )
}

export default OptionsModal
