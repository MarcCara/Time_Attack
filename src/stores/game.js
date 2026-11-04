import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useGameStore = defineStore('game', () => {
  const nomJugador = ref('')
  const partides = ref([])

  function guardarNom(nom) {
    nomJugador.value = nom
  }

  function guardarPartida(errorTotal) {
    partides.value.push({
      id: partides.value.length + 1,
      nom: nomJugador.value,
      errorTotal,
    })
  }

  return {
    nomJugador,
    partides,
    guardarNom,
    guardarPartida,
  }
})
