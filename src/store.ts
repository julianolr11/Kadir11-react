class Store {
  private data: Record<string, any>

  constructor() {
    const stored = localStorage.getItem('electron-store')
    this.data = stored ? JSON.parse(stored) : {}
  }

  set(key: string, value: any) {
    this.data[key] = value
    localStorage.setItem('electron-store', JSON.stringify(this.data))
  }

  get(key: string) {
    return this.data[key]
  }
}

export default Store
