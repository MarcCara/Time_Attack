<script setup>
import { computed } from 'vue'
import { useGameStore } from '@/stores/game'

const store = useGameStore()
const millorMarca = computed(() => {
  if (store.partides.length === 0) return null

  return Math.min(...store.partides.map((partida) => partida.errorTotal))
})
const classificacioOrdenada = computed(() =>
  [...store.classificacio].sort((a, b) => a.errorTotal - b.errorTotal),
)
</script>

<template>
  <div class="scoreboards">
    <section class="scoreboard" aria-labelledby="scoreboard-title">
      <h2 id="scoreboard-title">Historial de partidas</h2>
      <p class="best-score">
        Millor marca:
        <strong>{{ millorMarca === null ? 'Sense partides' : `${millorMarca} s` }}</strong>
      </p>
      <p v-if="store.partides.length === 0" class="empty-message">
        Encara no hi ha cap partida registrada.
      </p>
      <template v-else>
        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th scope="col">Partida</th>
                <th scope="col">Jugador</th>
                <th scope="col">Error total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="partida in store.partides" :key="partida.id">
                <td>{{ partida.id }}</td>
                <td>{{ partida.nom }}</td>
                <td>{{ partida.errorTotal }} s</td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
      <button
        v-if="store.partides.length > 0"
        class="clear-button"
        type="button"
        @click="store.esborrarPartides"
      >
        Esborrar historial
      </button>
    </section>

    <section class="scoreboard" aria-labelledby="global-scoreboard-title">
      <h2 id="global-scoreboard-title">Classificació global</h2>
      <p v-if="store.classificacio.length === 0" class="empty-message">
        Encara no hi ha resultats. Sigues el primer a jugar!
      </p>
      <div v-else class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th scope="col">Posició</th>
              <th scope="col">Jugador</th>
              <th scope="col">Error total</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(resultat, index) in classificacioOrdenada"
              :key="`${resultat.nom}-${index}`"
              :class="{ 'top-result': index === 0 }"
            >
              <td>{{ index + 1 }}</td>
              <td>{{ resultat.nom }}</td>
              <td>{{ resultat.errorTotal }} s</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<style scoped>
.scoreboards {
  display: grid;
  gap: 0.75rem;
}

.scoreboard {
  min-width: 0;
  padding: 1rem;
  border: 1px solid var(--stroke);
  border-radius: 0.6rem;
  background: var(--paper);
  text-align: left;
}

h2 {
  margin: 0 0 0.7rem;
  padding-bottom: 0.55rem;
  border-bottom: 1px solid var(--stroke);
  color: var(--ink);
  font-size: 1rem;
  font-weight: 700;
}

.empty-message,
.best-score {
  margin: 0;
  color: var(--text-muted);
  font-size: 0.85rem;
  text-align: left;
}

.best-score {
  margin-bottom: 0.65rem;
}

.best-score strong {
  color: var(--accent);
  font-variant-numeric: tabular-nums;
}

.table-wrapper {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  white-space: nowrap;
}

th,
td {
  padding: 0.55rem 0.45rem;
  border-bottom: 1px solid var(--stroke);
}

th {
  color: var(--text-muted);
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-align: left;
  text-transform: uppercase;
}

td {
  color: var(--ink);
  font-size: 0.85rem;
  font-variant-numeric: tabular-nums;
}

tbody tr:last-child td {
  border-bottom: 0;
}

tbody td:last-child {
  color: var(--accent);
  font-weight: 700;
}

.top-result {
  background: #eef1e8;
}

.top-result td {
  color: #4f5b41;
  font-weight: 700;
}

.top-result td:last-child {
  color: var(--accent);
}

.clear-button {
  display: block;
  margin: 0.75rem 0 0 auto;
  padding: 0.45rem 0.7rem;
  border: 1px solid var(--stroke);
  border-radius: 0.35rem;
  background: transparent;
  color: var(--text-muted);
  font: inherit;
  font-size: 0.75rem;
  cursor: pointer;
  transition: border-color 140ms ease, color 140ms ease, background 140ms ease;
}

.clear-button:hover {
  border-color: var(--accent);
  background: #f7e9dc;
  color: var(--accent);
}

.clear-button:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

@media (max-width: 480px) {
  .scoreboard {
    padding: 0.75rem;
  }

  th,
  td {
    padding: 0.5rem 0.35rem;
  }

  td {
    font-size: 0.8rem;
  }
}
</style>
