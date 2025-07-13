module.exports = {
  plugins: {
    'postcss-import': {},
    '@tailwindcss/nesting': {}, // se você estiver usando nesting
    '@tailwindcss/postcss': {}, // plugin correto agora
    autoprefixer: {},
  },
}
