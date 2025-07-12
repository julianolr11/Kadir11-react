export const translations = {
  'PT-BR': {
    start: 'Iniciar',
    options: 'Opções',
    exit: 'Sair',
    exitConfirm: 'Deseja realmente sair?',
    exitYes: 'Sim',
    exitNo: 'Não',
    optionsTitle: 'Opções',
    language: 'Linguagem',
    fullscreen: 'Fullscreen',
    volume: 'Volume',
    close: 'Fechar',
  },
  US: {
    start: 'Start',
    options: 'Options',
    exit: 'Exit',
    exitConfirm: 'Are you sure you want to exit?',
    exitYes: 'Yes',
    exitNo: 'No',
    optionsTitle: 'Options',
    language: 'Language',
    fullscreen: 'Fullscreen',
    volume: 'Volume',
    close: 'Close',
  },
} as const

export type Lang = keyof typeof translations
export type TranslationKey = keyof typeof translations['PT-BR']

export function t(lang: Lang, key: TranslationKey): string {
  return translations[lang][key]
}
