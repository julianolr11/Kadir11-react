

export function weightedRandom<T extends string | number>(chances: Record<T, number>): T {
  const entries = Object.entries(chances) as Array<[T, number]>
  const total = entries.reduce((sum, [, chance]) => sum + chance, 0)
  let pick = Math.random() * total
  for (const [key, chance] of entries) {
    if (pick < chance) return key
    pick -= chance
  }
  return entries[entries.length - 1][0]
}

export function carregarPet(especie: string, elemento: string) {
  return window.getPetAssets(especie, elemento)
}

export interface Stats {
  attack: number
  defense: number
  speed: number
  magic: number
  life: number
}

export async function determinarPetFinal(stats: Stats, elemento: string) {
  const speciesChances = {
    Fera: 17,
    Reptiloide: 17,
    Monstro: 17,
    Ave: 17,
    Draconideo: 10.6,
    'Criatura Sombria': 10.6,
    'Criatura Mística': 10.6,
  } as const

  const requirements: Record<keyof typeof speciesChances, (s: Stats) => boolean> = {
    Fera: s => s.attack >= 5,
    Reptiloide: s => s.speed >= 5 && s.life >= 5,
    Monstro: s => s.life >= 6 && s.speed <= 3,
    Ave: s => s.speed >= 6,
    Draconideo: s => s.magic >= 6 && s.attack >= 2,
    'Criatura Sombria': s => s.defense >= 6 && s.magic >= 3,
    'Criatura Mística': s =>
      s.attack >= 4 && s.defense >= 4 && s.speed >= 4 && s.magic >= 4 && s.life >= 4,
  }

  let especie: keyof typeof speciesChances
  while (true) {
    const tentativa = weightedRandom(speciesChances)
    const atende = requirements[tentativa](stats)
    const chanceManter = atende ? 0.75 : 0.25
    if (Math.random() <= chanceManter) {
      especie = tentativa
      break
    }
  }

  const rarityChances = {
    Comum: 33,
    Incomum: 25,
    Raro: 17.5,
    'Muito Raro': 12.5,
    Épico: 10,
    Lendário: 2,
  } as const

  const raridade = weightedRandom(rarityChances)
  const { animacaoEvolucao, assetPet } = await carregarPet(especie, elemento)

  return {
    especie,
    raridade,
    elemento,
    animacaoEvolucao,
    assetPet,
  }
}

export default determinarPetFinal
