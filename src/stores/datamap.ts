import { WORLD, type Marker } from '@/constant'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDataMapStore = defineStore('datamap', () => {
  const currentWorld = ref<(typeof WORLD)[keyof typeof WORLD]>(WORLD.MAIN)
  const markers = ref<{ [key: string]: Marker }>({})

  return { currentWorld, markers }
})
