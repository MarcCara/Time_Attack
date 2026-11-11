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
  gap: 0.85rem;
  margin-top: 1.5rem;
}

.scoreboard {
  min-width: 0;
  padding: 1rem;
  border: 1px solid var(--stroke);
  border-radius: 0.9rem;
  background: rgb(7 12 21 / 30%);
  text-align: left;
}

h2 {
  margin: 0 0 0.75rem;
  color: #c4cede;
  font-size: 0.75rem;
  font-weight: 650;
  letter-spacing: 0.08em;
  text-align: center;
  text-transform: uppercase;
}

.empty-message,
.best-score {
  margin: 0;
  color: var(--text-muted);
  font-size: 0.85rem;
  text-align: center;
}

.best-score {
  margin-bottom: 0.65rem;
}

.best-score strong {
  color: var(--accent-bright);
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
  padding: 0.55rem 0.65rem;
  border-bottom: 1px solid var(--stroke);
}

th {
  color: var(--text-muted);
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-align: left;
  text-transform: uppercase;
}

td {
  color: #e2e8f1;
  font-size: 0.85rem;
  font-variant-numeric: tabular-nums;
}

tbody tr:last-child td {
  border-bottom: 0;
}

tbody td:last-child {
  color: var(--accent-bright);
  font-weight: 700;
}

.top-result {
  background: rgb(255 118 94 / 10%);
}

.top-result td {
  color: #ffd0c3;
  font-weight: 700;
}

.top-result td:last-child {
  color: var(--accent-bright);
}

.clear-button {
  display: block;
  margin: 0.75rem 0 0 auto;
  padding: 0.45rem 0.7rem;
  border: 1px solid var(--stroke);
  border-radius: 0.5rem;
  background: rgb(255 255 255 / 3%);
  color: var(--text-muted);
  font: inherit;
  font-size: 0.75rem;
  cursor: pointer;
  transition: border-color 140ms ease, color 140ms ease, background 140ms ease;
}

.clear-button:hover {
  border-color: rgb(255 118 94 / 55%);
  background: rgb(255 118 94 / 8%);
  color: #ffd0c3;
}

.clear-button:focus-visible {
  outline: 3px solid var(--accent-bright);
  outline-offset: 2px;
}

@media (max-width: 480px) {
  .scoreboard {
    padding: 0.75rem;
  }

  .scoreboards {
    gap: 0.7rem;
    margin-top: 1.1rem;
  }

  th,
  td {
    padding: 0.5rem 0.4rem;
  }

  td {
    font-size: 0.8rem;
  }
}
</style>
