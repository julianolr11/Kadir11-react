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

interface Props {
  playerSrc: string
  petSrc: string
}

const GameMap = ({ playerSrc, petSrc }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const collisionPolygons = useRef<Point[][]>([])
  const playerPos = useRef<Point>({ x: 0, y: 0 })
  const petPos = useRef<Point>({ x: 0, y: 0 })
  const holdTimeouts = useRef<Record<string, NodeJS.Timeout | null>>({})
  const holdIntervals = useRef<Record<string, NodeJS.Timeout | null>>({})
  const pathQueue = useRef<Point[]>([])
  const pathInterval = useRef<NodeJS.Timeout | null>(null)

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

      const playerImg = await loadImage(playerSrc)
      const petImg = await loadImage(petSrc)


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

      const startTile = { x: 10, y: 24 }
      playerPos.current = {
        x: startTile.x * map.tilewidth,
        y: startTile.y * map.tileheight,
      }
      petPos.current = {
        x: startTile.x * map.tilewidth,
        y: (startTile.y + 1) * map.tileheight,
      }

      const clearPath = () => {
        if (pathInterval.current) {
          clearInterval(pathInterval.current)
          pathInterval.current = null
        }
        pathQueue.current = []
      }

      const findPath = (start: Point, goal: Point) => {
        const startTile = {
          x: Math.floor(start.x / map.tilewidth),
          y: Math.floor(start.y / map.tileheight),
        }
        const goalTile = {
          x: Math.floor(goal.x / map.tilewidth),
          y: Math.floor(goal.y / map.tileheight),
        }
        const key = (p: { x: number; y: number }) => `${p.x},${p.y}`
        const queue: Array<{ x: number; y: number }> = [startTile]
        const came = new Map<string, { x: number; y: number } | null>()
        came.set(key(startTile), null)
        const visited = new Set<string>([key(startTile)])
        while (queue.length) {
          const current = queue.shift() as { x: number; y: number }
          if (current.x === goalTile.x && current.y === goalTile.y) break
          for (const [dx, dy] of [
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1],
          ]) {
            const nx = current.x + dx
            const ny = current.y + dy
            if (nx < 0 || ny < 0 || nx >= map.width || ny >= map.height) continue
            const pos = { x: nx * map.tilewidth, y: ny * map.tileheight }
            const center = {
              x: pos.x + map.tilewidth / 2,
              y: pos.y + map.tileheight / 2,
            }
            if (
              collisionPolygons.current.some(poly => pointInPolygon(center, poly))
            )
              continue
            const k = key({ x: nx, y: ny })
            if (!visited.has(k)) {
              visited.add(k)
              came.set(k, current)
              queue.push({ x: nx, y: ny })
            }
          }
        }

        if (!came.has(key(goalTile))) return [] as Point[]
        const rev: Array<{ x: number; y: number }> = []
        for (let p: { x: number; y: number } | null = goalTile; p; ) {
          rev.push(p)
          p = came.get(key(p)) || null
        }
        rev.reverse()
        rev.shift()
        return rev.map(t => ({ x: t.x * map.tilewidth, y: t.y * map.tileheight }))
      }

      const startPath = (tiles: Point[]) => {
        clearPath()
        if (!tiles.length) return
        pathQueue.current = [...tiles]
        const step = () => {
          const next = pathQueue.current.shift()
          if (!next) {
            clearPath()
            return
          }
          const center = {
            x: next.x + map.tilewidth / 2,
            y: next.y + map.tileheight / 2,
          }
          const blocked = collisionPolygons.current.some(poly =>
            pointInPolygon(center, poly)
          )
          if (!blocked) {
            const prev = { ...playerPos.current }
            playerPos.current = next
            petPos.current = prev
            drawScene()
          }
          if (pathQueue.current.length === 0) {
            clearPath()
            return
          }
        }
        step()
        pathInterval.current = setInterval(step, 1000)
      }

      const handleClick = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const target = { x, y }
        const path = findPath(playerPos.current, target)
        startPath(path)
      }

      const drawScene = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        map.layers.forEach(layer => {
          if (layer.type === 'tilelayer') drawLayer(layer as TileLayer)
        })
        ctx.drawImage(
          petImg,
          petPos.current.x,
          petPos.current.y,
          map.tilewidth,
          map.tileheight
        )
        ctx.drawImage(
          playerImg,
          playerPos.current.x,
          playerPos.current.y,
          map.tilewidth,
          map.tileheight
        )
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
          const prev = { ...playerPos.current }
          playerPos.current = next
          petPos.current = prev
          drawScene()
        }
      }

      const handleKeyDown = (e: KeyboardEvent) => {
        if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) return
        e.preventDefault()
        clearPath()
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
      canvas.addEventListener('click', handleClick)

      drawScene()

      cleanup = () => {
        window.removeEventListener('keydown', handleKeyDown)
        window.removeEventListener('keyup', handleKeyUp)
        canvas.removeEventListener('click', handleClick)
        Object.values(holdTimeouts.current).forEach(t => t && clearTimeout(t))
        Object.values(holdIntervals.current).forEach(i => i && clearInterval(i))
        clearPath()
      }
    })()

    return () => {
      if (cleanup) cleanup()
    }
  }, [playerSrc, petSrc])

  return <canvas ref={canvasRef} style={{ imageRendering: 'pixelated' }} />
}

export default GameMap
