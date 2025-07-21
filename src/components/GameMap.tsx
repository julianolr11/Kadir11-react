import { useEffect, useRef } from 'react'

interface Point { x: number; y: number }

interface Tileset {
  firstgid: number
  image: string
  imagewidth: number
  imageheight: number
  tilewidth: number
  tileheight: number
  columns: number
  tilecount: number
}

interface TileLayer {
  type: 'tilelayer'
  name: string
  width: number
  height: number
  data: number[]
}

interface ObjectLayer {
  type: 'objectgroup'
  name: string
  objects: Array<{ x: number; y: number; polygon: Point[] }>
}

interface MapData {
  width: number
  height: number
  tilewidth: number
  tileheight: number
  layers: Array<TileLayer | ObjectLayer>
  tilesets: Tileset[]
}

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>(resolve => {
    const img = new Image()
    img.src = src
    img.onload = () => resolve(img)
  })

const GameMap = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const collisionPolygons = useRef<Point[][]>([])
  const playerPos = useRef<Point>({ x: 0, y: 0 })
  const holdTimeouts = useRef<Record<string, NodeJS.Timeout | null>>({})
  const holdIntervals = useRef<Record<string, NodeJS.Timeout | null>>({})

  const pointInPolygon = (pt: Point, poly: Point[]) => {
    let inside = false
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const xi = poly[i].x
      const yi = poly[i].y
      const xj = poly[j].x
      const yj = poly[j].y
      const intersect = yi > pt.y !== yj > pt.y && pt.x < ((xj - xi) * (pt.y - yi)) / (yj - yi) + xi
      if (intersect) inside = !inside
    }
    return inside
  }

  useEffect(() => {
    let cleanup: (() => void) | undefined

    ;(async () => {
      const mapUrl = new URL('../../tileset/mapainicio.tmj', import.meta.url).href
      const map: MapData = await fetch(mapUrl).then(res => res.json())

      const canvas = canvasRef.current
      if (!canvas) return
      canvas.width = map.width * map.tilewidth
      canvas.height = map.height * map.tileheight
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const images = await Promise.all(
        map.tilesets.map(ts =>
          loadImage(new URL(`../../tileset/${ts.image}`, import.meta.url).href)
        )
      )


      const drawLayer = (layer: TileLayer) => {
        layer.data.forEach((gid, i) => {
          if (!gid) return
          const ts = [...map.tilesets]
            .reverse()
            .find(t => gid >= t.firstgid) as Tileset
          const tid = gid - ts.firstgid
          const img = images[map.tilesets.indexOf(ts)]
          const sx = (tid % ts.columns) * ts.tilewidth
          const sy = Math.floor(tid / ts.columns) * ts.tileheight
          const dx = (i % layer.width) * map.tilewidth
          const dy = Math.floor(i / layer.width) * map.tileheight
          ctx.drawImage(img, sx, sy, ts.tilewidth, ts.tileheight, dx, dy, map.tilewidth, map.tileheight)
        })
      }

      map.layers.forEach(layer => {
        if (layer.type === 'tilelayer') {
          drawLayer(layer as TileLayer)
        } else if (layer.type === 'objectgroup' && layer.name === 'colisores') {
          const polygons = (layer as ObjectLayer).objects.map(obj =>
            obj.polygon.map(p => ({ x: obj.x + p.x, y: obj.y + p.y }))
          )
          collisionPolygons.current = polygons
        }
      })

      playerPos.current = { x: map.tilewidth, y: map.tileheight }

      const drawScene = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        map.layers.forEach(layer => {
          if (layer.type === 'tilelayer') drawLayer(layer as TileLayer)
        })
        ctx.fillStyle = 'red'
        ctx.fillRect(playerPos.current.x, playerPos.current.y, map.tilewidth, map.tileheight)
      }

      const movePlayer = (key: string) => {
        const { tilewidth, tileheight } = map
        let dx = 0
        let dy = 0
        if (key === 'ArrowUp') dy = -tileheight
        else if (key === 'ArrowDown') dy = tileheight
        else if (key === 'ArrowLeft') dx = -tilewidth
        else if (key === 'ArrowRight') dx = tilewidth

        const next = { x: playerPos.current.x + dx, y: playerPos.current.y + dy }
        const center = { x: next.x + tilewidth / 2, y: next.y + tileheight / 2 }
        const blocked = collisionPolygons.current.some(poly => pointInPolygon(center, poly))
        if (!blocked) {
          playerPos.current = next
          drawScene()
        }
      }

      const handleKeyDown = (e: KeyboardEvent) => {
        if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) return
        e.preventDefault()
        if (holdTimeouts.current[e.key]) return
        movePlayer(e.key)
        holdTimeouts.current[e.key] = setTimeout(() => {
          holdIntervals.current[e.key] = setInterval(() => movePlayer(e.key), 1000)
        }, 500)
      }

      const handleKeyUp = (e: KeyboardEvent) => {
        if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) return
        const ht = holdTimeouts.current[e.key]
        if (ht) {
          clearTimeout(ht)
          holdTimeouts.current[e.key] = null
        }
        const hi = holdIntervals.current[e.key]
        if (hi) {
          clearInterval(hi)
          holdIntervals.current[e.key] = null
        }
      }

      window.addEventListener('keydown', handleKeyDown)
      window.addEventListener('keyup', handleKeyUp)

      drawScene()

      cleanup = () => {
        window.removeEventListener('keydown', handleKeyDown)
        window.removeEventListener('keyup', handleKeyUp)
        Object.values(holdTimeouts.current).forEach(t => t && clearTimeout(t))
        Object.values(holdIntervals.current).forEach(i => i && clearInterval(i))
      }
    })()

    return () => {
      if (cleanup) cleanup()
    }
  }, [])

  return <canvas ref={canvasRef} style={{ imageRendering: 'pixelated' }} />
}

export default GameMap
