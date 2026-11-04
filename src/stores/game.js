import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useGameStore = defineStore('game', () => {
  const nomJugador = ref('')
  const partides = ref([])

  return {
    nomJugador,
    partides,
  }
})
