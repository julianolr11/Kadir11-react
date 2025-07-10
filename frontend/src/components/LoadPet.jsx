import React from 'react'
import egg from '../../Assets/Mons/eggsy.png'

export default function LoadPet() {
  return (
    <div>
      <h2>Carregar Pet</h2>
      <img src={egg} alt="Eggsy" style={{ width: '100px' }} />
    </div>
  )
}
