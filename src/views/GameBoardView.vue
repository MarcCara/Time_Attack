<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useGameStore } from '@/stores/game'
import KeyPad from '../components/KeyPad.vue'
import ResultsTable from '../components/ResultsTable.vue'

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
    store.guardarPartida(Number(errorTotal.toFixed(2)))
  }
}

function gestionarTeclaFisica(event) {
  if (event.repeat) {
    return
  }

  rebreTecla(event.key.toUpperCase())
}

onMounted(() => {
  window.addEventListener('keydown', gestionarTeclaFisica)
})

onUnmounted(() => {
  window.removeEventListener('keydown', gestionarTeclaFisica)
})
</script>

<template>
  <main class="game-board">
    <section class="game-card" :class="{ 'game-card--results': partidaAcabada }" aria-labelledby="game-title">
      <p class="eyebrow">Partida ràpida <span>·</span> Un jugador</p>
      <h1 id="game-title">Time Attack</h1>
      <form v-if="!store.nomJugador" class="player-form" @submit.prevent="entrar">
        <h2 class="welcome-title">Benvingut a TIME ATTACK!</h2>
        <label class="sr-only" for="player-name">Nom del jugador</label>
        <input
          id="player-name"
          v-model="nom"
          autocomplete="name"
          maxlength="40"
          placeholder="Introdueix el teu nom"
          required
        />
        <button class="start-button" type="submit">Entrar al joc</button>
      </form>

      <template v-else>
        <h2 class="player-greeting">Hola, {{ store.nomJugador }}!</h2>
        <p v-if="!jugant && !partidaAcabada" class="instructions">
          Prem les tecles A, S, D i F quan creguis que han passat 2, 4, 5 i 7 segons.
        </p>
        <p v-else-if="jugant" class="instructions">Prem cada tecla una vegada. El temps no es mostra.</p>
        <p v-else class="instructions">Partida acabada. Aquests són els teus resultats:</p>

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
  </main>
</template>

<style scoped>
.game-board {
  position: relative;
  isolation: isolate;
  display: grid;
  min-height: 100vh;
  min-height: 100svh;
  place-items: center;
  overflow-x: hidden;
  overflow-y: auto;
  padding: clamp(1.5rem, 5vh, 3rem) 1.25rem;
}

.game-board::before,
.game-board::after {
  position: absolute;
  z-index: -1;
  width: 22rem;
  aspect-ratio: 1;
  border: 1px solid rgb(164 183 213 / 7%);
  border-radius: 50%;
  content: "";
  pointer-events: none;
}

.game-board::before {
  top: -13rem;
  left: -9rem;
  box-shadow: 0 0 0 2.5rem rgb(164 183 213 / 2%), 0 0 0 5rem rgb(164 183 213 / 2%);
}

.game-board::after {
  right: -14rem;
  bottom: -16rem;
  width: 32rem;
  border-color: rgb(255 118 94 / 8%);
  box-shadow: 0 0 0 3rem rgb(255 118 94 / 2%), 0 0 0 6rem rgb(255 118 94 / 2%);
}

.game-card {
  position: relative;
  width: min(100%, 35rem);
  padding: clamp(2.25rem, 7vw, 3.5rem) clamp(1.25rem, 6vw, 2.75rem);
  border: 1px solid rgb(164 183 213 / 20%);
  border-radius: 1.5rem;
  background:
    radial-gradient(ellipse at 50% 0%, rgb(255 255 255 / 4%), transparent 55%),
    linear-gradient(145deg, rgb(21 31 49 / 96%), rgb(13 20 33 / 98%));
  text-align: center;
  box-shadow: 0 2rem 6rem rgb(0 0 0 / 38%), inset 0 1px rgb(255 255 255 / 4%);
  animation: card-enter 500ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
}

.game-card--results {
  padding-block: 1.75rem;
}

.game-card--results .eyebrow {
  margin-bottom: 0.65rem;
}

.game-card--results .instructions {
  margin-block: 0.85rem 1rem;
}

.player-form {
  display: grid;
  justify-items: center;
  gap: 1rem;
  margin-top: 1.5rem;
}

.welcome-title,
.player-greeting {
  margin: 0;
  color: #e8edf7;
  font-size: clamp(1.15rem, 4vw, 1.4rem);
  font-weight: 650;
  line-height: 1.35;
}

.player-greeting {
  margin-top: 1rem;
}

.player-form input {
  width: min(100%, 22rem);
  min-height: 3.25rem;
  padding: 0.8rem 1rem;
  border: 1px solid var(--stroke);
  border-radius: 0.65rem;
  background: rgb(7 12 21 / 55%);
  color: #f3f5fa;
  font: inherit;
}

.player-form input::placeholder {
  color: #8996aa;
}

.player-form input:focus-visible {
  border-color: var(--accent);
  outline: 3px solid rgb(255 154 118 / 25%);
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

.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 1.1rem;
  padding: 0.45rem 0.75rem;
  border: 1px solid var(--stroke);
  border-radius: 999px;
  background: rgb(255 255 255 / 3%);
  color: #c4cede;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.eyebrow span {
  color: var(--accent);
}

h1 {
  margin: 0;
  background: linear-gradient(110deg, #ffffff 20%, #cbd6e8 80%);
  background-clip: text;
  color: transparent;
  font-size: clamp(2.8rem, 10vw, 4.25rem);
  font-weight: 800;
  letter-spacing: -0.075em;
  line-height: 1;
}

.instructions {
  max-width: 26rem;
  margin: 1.25rem auto 2rem;
  color: var(--text-muted);
  font-size: 1rem;
  line-height: 1.7;
}

.start-button {
  min-width: 12rem;
  max-width: 100%;
  padding: 0.9rem 1.5rem;
  border: 0;
  border-radius: 0.65rem;
  background: linear-gradient(110deg, #ff765e, #f05e53);
  color: #170d13;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 0.5rem 1.5rem rgb(255 102 83 / 20%), inset 0 1px rgb(255 255 255 / 25%);
  transition: box-shadow 160ms ease, filter 160ms ease, transform 160ms ease;
}

.start-button:hover {
  filter: brightness(1.08);
  box-shadow: 0 0.75rem 2rem rgb(255 102 83 / 28%), inset 0 1px rgb(255 255 255 / 30%);
  transform: translateY(-2px);
}

.start-button:focus-visible {
  outline: 3px solid var(--accent-bright);
  outline-offset: 3px;
}

.replay-button {
  margin-top: 1.25rem;
}

@media (max-width: 480px) {
  .game-board {
    padding: 1.25rem 1rem;
  }

  .game-card {
    width: 100%;
    padding: 2rem 1.25rem;
    border-radius: 1.15rem;
  }

  .game-card--results {
    padding-block: 1.5rem;
  }

  .eyebrow {
    gap: 0.4rem;
    margin-bottom: 0.9rem;
    padding: 0.4rem 0.65rem;
    font-size: 0.68rem;
    letter-spacing: 0.06em;
  }

  h1 {
    font-size: clamp(2.6rem, 13vw, 3.5rem);
  }

  .instructions {
    margin: 1rem auto 1.5rem;
    font-size: 0.95rem;
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

  .game-card {
    padding: 1.75rem 1rem;
  }
}

@media (max-height: 600px) and (orientation: landscape) {
  .game-board {
    place-items: start center;
    padding-block: 1rem;
  }

  .game-card {
    padding-block: 1.5rem;
  }
}

@keyframes card-enter {
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.985);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .game-card {
    animation: none;
  }

  .start-button {
    transition: none;
  }
}

</style>
