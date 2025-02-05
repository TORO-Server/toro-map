// 型定義
export const WORLD = {
  MAIN: 'main',
  FLAT: 'flat',
  MAP: 'map',
  /*OLDMAIN: 'oldmain',
  SALMON: 'salmon',*/
} as const
export type Marker = {
  sets: {
    [key: string]: MarkerSet
  }
  timestamp: number
}
export type MarkerSet = {
  hide: boolean
  circles: { [key: string]: undefined }
  areas: {
    [key: string]: {
      fillcolor: string
      ytop: number
      color: string
      markup: boolean
      x: number[]
      weight: number
      z: number[]
      ybottom: number
      label: string
      opacity: number
      fillopacity: number
      desc: string
    }
  }
  label: string
  markers: {
    [key: string]: {
      markup: boolean
      x: number
      icon: string
      y: number
      dim: string
      z: number
      label: string
    }
  }
  lines: {
    [key: string]: {
      color: string
      markup: boolean
      x: number[]
      weight: number
      z: number[]
      label: string
      opacity: number
    }
  }
  layerprio: number
}

// 定数とか
export const MARKERURL = (w: (typeof WORLD)[keyof typeof WORLD]) =>
  `https://map.torosaba.net/tiles/_markers_/marker_${w}.json`
