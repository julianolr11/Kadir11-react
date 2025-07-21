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

  useEffect(() => {
    const mapUrl = new URL('../../tileset/mapainicio.tmj', import.meta.url).href

    fetch(mapUrl)
      .then(res => res.json())
      .then(async (map: MapData) => {
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
      })
  }, [])

  return <canvas ref={canvasRef} style={{ imageRendering: 'pixelated' }} />
}

export default GameMap
