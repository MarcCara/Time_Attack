<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useGameStore } from '@/stores/game'
import { socket } from '@/services/socket'
import KeyPad from '../components/KeyPad.vue'
import ResultsTable from '../components/ResultsTable.vue'
import ScoreBoard from '../components/ScoreBoard.vue'

const store = useGameStore()
const nom = ref('')

const tecles = ['A', 'S', 'D', 'F']
const tempsObjectiu = {
  A: 2,
  S: 4,
  D: 5,
  F: 7,
}

const jugant = ref(false)
const resultats = ref([])
const partidaAcabada = computed(() => resultats.value.length === tecles.length)
const teclesPremudes = computed(() => resultats.value.map((resultat) => resultat.tecla))

let tempsInici = 0

function entrar() {
  const nomNetejat = nom.value.trim()
  if (nomNetejat === '') return

  store.guardarNom(nomNetejat)
}

function iniciarPartida() {
  resultats.value = []
  tempsInici = performance.now()
  jugant.value = true
}

function rebreTecla(tecla) {
  if (!jugant.value || !tecles.includes(tecla) || resultats.value.some((resultat) => resultat.tecla === tecla)) {
    return
  }

  const tempsRealSenseArrodonir = (performance.now() - tempsInici) / 1000
  const tempsReal = Number(tempsRealSenseArrodonir.toFixed(2))
  const objectiu = tempsObjectiu[tecla]

  resultats.value.push({
    tecla,
    objectiu,
    tempsReal,
    error: Number(Math.abs(tempsRealSenseArrodonir - objectiu).toFixed(2)),
  })

  if (partidaAcabada.value) {
    jugant.value = false

    const errorTotal = resultats.value.reduce((total, resultat) => total + resultat.error, 0)
    const errorFinal = Number(errorTotal.toFixed(2))

    store.guardarPartida(errorFinal)
    socket.emit('resultat', {
      nom: store.nomJugador,
      errorTotal: errorFinal,
    })
  }
}

function gestionarTeclaFisica(event) {
  if (event.repeat) {
    return
  }

  rebreTecla(event.key.toUpperCase())
}

function connectat() {
  console.log('Connectat al servidor!', socket.id)
}

function errorDeConnexio(error) {
  console.error('No s’ha pogut connectar amb el servidor Socket.IO:', error.message)
}

function rebreClassificacio(dades) {
  console.log('Classificació rebuda:', dades)

  store.actualitzarClassificacio(dades)
}

onMounted(() => {
  window.addEventListener('keydown', gestionarTeclaFisica)
  socket.on('connect', connectat)
  socket.on('classificacio', rebreClassificacio)
  socket.on('connect_error', errorDeConnexio)
  socket.connect()
})

onUnmounted(() => {
  window.removeEventListener('keydown', gestionarTeclaFisica)
  socket.off('connect', connectat)
  socket.off('classificacio', rebreClassificacio)
  socket.off('connect_error', errorDeConnexio)
  socket.disconnect()
})
</script>

<template>
  <main class="game-board">
    <div class="page-layout">
      <header class="page-header">
        <p class="eyebrow">Joc de precisió</p>
        <h1 id="game-title">Time Attack</h1>
        <p class="intro-copy">Prem cada tecla quan creguis que ha passat el temps.</p>
      </header>

      <section class="game-card" :class="{ 'game-card--results': partidaAcabada }" aria-labelledby="game-title">
        <div class="card-topline">
          <span>{{ jugant ? 'Partida en curs' : partidaAcabada ? 'Partida acabada' : 'A punt?' }}</span>
        </div>
        <form v-if="!store.nomJugador" class="player-form" @submit.prevent="entrar">
          <h2 class="welcome-title">Com et dius?</h2>
          <p class="form-copy">Escriu el teu nom abans de començar.</p>
          <label class="sr-only" for="player-name">Nom del jugador</label>
          <input
            id="player-name"
            v-model="nom"
            autocomplete="name"
            maxlength="40"
            placeholder="El teu nom"
            required
          />
          <button class="start-button" type="submit">Entrar al joc</button>
        </form>

        <template v-else>
          <h2 class="player-greeting">Hola, {{ store.nomJugador }}!</h2>
          <p v-if="!jugant && !partidaAcabada" class="instructions">
            Prem A, S, D i F quan creguis que han passat 2, 4, 5 i 7 segons.
          </p>
          <p v-else-if="jugant" class="instructions">Prem cada tecla una vegada. El temps no es mostra.</p>
          <p v-else class="instructions">Aquests són els resultats d'aquesta partida:</p>

          <button v-if="!jugant && !partidaAcabada" class="start-button" type="button" @click="iniciarPartida">
            Iniciar partida
          </button>
          <KeyPad
            v-else-if="jugant"
            :tecles="tecles"
            :premudes="teclesPremudes"
            @premuda="rebreTecla"
          />

          <ResultsTable
            v-if="!jugant && resultats.length === tecles.length"
            :resultats="resultats"
          />

          <button v-if="partidaAcabada" class="start-button replay-button" type="button" @click="iniciarPartida">
            Tornar a jugar
          </button>
        </template>
      </section>

      <ScoreBoard />
    </div>
  </main>
</template>

<style scoped>
.game-board {
  min-height: 100vh;
  min-height: 100svh;
  padding: 2rem 1rem;
}

.page-layout {
  display: grid;
  width: min(100%, 48rem);
  gap: 1.25rem;
  margin: 0 auto;
}

.page-header {
  padding: 0.5rem 0 0.25rem;
}

.eyebrow {
  margin: 0 0 0.25rem;
  color: var(--olive);
  font-size: 0.85rem;
}

.page-header h1 {
  margin: 0;
  color: var(--ink);
  font-size: clamp(2.2rem, 7vw, 3rem);
  font-weight: 700;
  letter-spacing: -0.04em;
  line-height: 1.1;
}

.intro-copy {
  margin: 0.45rem 0 0;
  color: var(--text-muted);
  font-size: 1rem;
}

.game-card {
  min-width: 0;
  padding: 1.5rem;
  border: 1px solid var(--stroke);
  border-radius: 0.65rem;
  background: var(--paper);
  box-shadow: 0 2px 6px rgb(40 45 50 / 5%);
  text-align: center;
}

.game-card--results {
  padding-block: 1.25rem;
}

.card-topline {
  padding-bottom: 0.65rem;
  border-bottom: 1px solid var(--stroke);
  color: var(--olive);
  font-size: 0.8rem;
}

.player-form {
  display: grid;
  justify-items: center;
  gap: 0.8rem;
  margin-top: 1.5rem;
}

.welcome-title,
.player-greeting {
  margin: 0;
  color: var(--ink);
  font-size: 1.35rem;
  font-weight: 650;
  line-height: 1.2;
}

.form-copy {
  margin: -0.2rem 0 0.3rem;
  color: var(--text-muted);
}

.player-greeting {
  margin-top: 1.1rem;
}

.player-form input {
  width: min(100%, 22rem);
  min-height: 3rem;
  padding: 0.7rem 0.85rem;
  border: 1px solid var(--stroke);
  border-radius: 0.4rem;
  background: var(--paper);
  color: var(--ink);
  font: inherit;
}

.player-form input::placeholder {
  color: #8a8e91;
}

.player-form input:focus-visible {
  border-color: var(--accent);
  outline: 2px solid rgb(169 76 55 / 18%);
  outline-offset: 2px;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  clip-path: inset(50%);
}

.instructions {
  max-width: 27rem;
  margin: 1rem auto 1.25rem;
  color: var(--text-muted);
  font-size: 1rem;
  line-height: 1.6;
}

.start-button {
  min-width: 12rem;
  max-width: 100%;
  padding: 0.8rem 1.25rem;
  border: 0;
  border-radius: 0.4rem;
  background: var(--accent);
  color: #fff;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
  transition: background 120ms ease;
}

.start-button:hover {
  background: #93412f;
}

.start-button:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
}

.replay-button {
  margin-top: 0.9rem;
}

@media (max-width: 480px) {
  .game-board {
    padding: 1.25rem 0.85rem;
  }

  .page-layout {
    gap: 1rem;
  }

  .page-header h1 {
    font-size: 2.4rem;
  }

  .game-card,
  .game-card--results {
    padding: 1.15rem 1rem;
  }

  .start-button {
    width: 100%;
    min-width: 0;
    min-height: 3.25rem;
    padding: 0.8rem 1rem;
  }
}

@media (max-width: 360px) {
  .game-board {
    padding-inline: 0.75rem;
  }

  .page-layout {
    gap: 0.85rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .start-button {
    transition: none;
  }
}
</style>
