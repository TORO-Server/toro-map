import { WORLD, type Marker, type TORDResponse } from '@/constant'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDataMapStore = defineStore('datamap', () => {
  const currentWorld = ref<(typeof WORLD)[keyof typeof WORLD]>(WORLD.MAIN)
  const markers = ref<{ [key: string]: Marker }>({})
  const tord = ref<TORDResponse | null>(null)

  const connections = ref<{
    dynmap: boolean
    tord: boolean
  }>({
    dynmap: false,
    tord: false,
  })

  return { currentWorld, markers, tord, connections }
})
