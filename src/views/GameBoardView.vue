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
        <p class="eyebrow"><span class="eyebrow-mark" aria-hidden="true">✳</span> Un joc de precisió</p>
        <h1 id="game-title">Time <span>Attack</span></h1>
        <p class="intro-copy">Confia en el teu ritme. Prem cada tecla quan creguis que ha passat el temps.</p>
      </header>

      <section class="game-card" :class="{ 'game-card--results': partidaAcabada }" aria-labelledby="game-title">
        <div class="card-topline">
          <span>{{ jugant ? 'Partida en curs' : partidaAcabada ? 'Partida acabada' : 'A punt?' }}</span>
          <span class="card-index">Núm. 01</span>
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
      <footer class="page-footer">Una mica de sort. Molta intuïció.</footer>
    </div>
  </main>
</template>

<style scoped>
.game-board {
  min-height: 100vh;
  min-height: 100svh;
  padding: clamp(1.5rem, 5vw, 4rem) 1.25rem;
}

.page-layout {
  display: grid;
  width: min(100%, 68rem);
  grid-template-columns: minmax(0, 1.05fr) minmax(19rem, 0.95fr);
  grid-template-areas:
    "header header"
    "game scores"
    "footer footer";
  align-items: start;
  gap: 1.4rem 2rem;
  margin: 0 auto;
}

.page-header {
  position: relative;
  grid-area: header;
  padding: 1rem 0 0.75rem;
  border-bottom: 1px solid #c9bda7;
}

.page-header::after {
  position: absolute;
  right: 0.25rem;
  bottom: -0.65rem;
  width: 4.5rem;
  height: 1rem;
  border-top: 2px solid var(--accent);
  border-radius: 50%;
  content: "";
  transform: rotate(-4deg);
}

.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  margin: 0 0 0.45rem;
  color: var(--olive);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.eyebrow-mark {
  color: var(--accent);
  font-size: 1.1rem;
  line-height: 1;
}

.page-header h1 {
  margin: 0;
  color: var(--ink);
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(3rem, 8vw, 5.8rem);
  font-weight: 700;
  letter-spacing: -0.075em;
  line-height: 0.95;
}

.page-header h1 span {
  color: var(--accent);
  font-style: italic;
  font-weight: 400;
}

.intro-copy {
  margin: 0.75rem 0 0;
  color: var(--text-muted);
  font-family: Georgia, "Times New Roman", serif;
  font-size: 1.05rem;
}

.game-card {
  position: relative;
  grid-area: game;
  min-width: 0;
  padding: clamp(1.25rem, 3vw, 2.25rem);
  border: 1px solid #cfc2ac;
  border-radius: 0.85rem 0.75rem 0.95rem 0.7rem;
  background: var(--paper);
  box-shadow: 5px 6px 0 #cbbda5;
  text-align: center;
  transform: rotate(-0.25deg);
}

.game-card--results {
  padding-block: 1.35rem;
}

.card-topline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px dashed #d1c5b0;
  color: var(--olive);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.11em;
  text-align: left;
  text-transform: uppercase;
}

.card-index {
  color: #a49a87;
  font-size: 0.65rem;
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
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 600;
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
  min-height: 3.1rem;
  padding: 0.75rem 0.9rem;
  border: 1px solid #bdb29e;
  border-radius: 0.35rem;
  background: #fffdf7;
  color: var(--ink);
  font: inherit;
}

.player-form input::placeholder {
  color: #918773;
}

.player-form input:focus-visible {
  border-color: var(--accent);
  outline: 2px solid rgb(198 83 55 / 22%);
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
  margin: 1.2rem auto 1.5rem;
  color: var(--text-muted);
  font-family: Georgia, "Times New Roman", serif;
  font-size: 1.05rem;
  line-height: 1.55;
}

.start-button {
  min-width: 12rem;
  max-width: 100%;
  padding: 0.85rem 1.35rem;
  border: 1px solid #9c3d29;
  border-radius: 0.35rem;
  background: var(--accent);
  color: #fffaf0;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 3px 3px 0 #8e3c2a;
  transition: box-shadow 120ms ease, transform 120ms ease, background 120ms ease;
}

.start-button:hover {
  background: #b94a31;
  box-shadow: 1px 1px 0 #8e3c2a;
  transform: translate(2px, 2px);
}

.start-button:active {
  box-shadow: none;
  transform: translate(3px, 3px);
}

.start-button:focus-visible {
  outline: 2px solid var(--ink);
  outline-offset: 4px;
}

.replay-button {
  margin-top: 1rem;
}

.page-footer {
  grid-area: footer;
  padding-top: 0.3rem;
  color: #89816f;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 0.85rem;
  font-style: italic;
  text-align: right;
}

@media (max-width: 480px) {
  .game-board {
    padding: 1.25rem 0.9rem;
  }

  .page-layout {
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas:
      "header"
      "game"
      "scores"
      "footer";
    gap: 1.1rem;
  }

  .page-header {
    padding-top: 0.25rem;
  }

  .page-header h1 {
    font-size: clamp(3rem, 16vw, 4.5rem);
  }

  .intro-copy {
    max-width: 28rem;
    font-size: 0.98rem;
  }

  .game-card,
  .game-card--results {
    padding: 1.2rem 1rem;
    transform: none;
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
    gap: 0.9rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .start-button {
    transition: none;
  }
}
</style>
