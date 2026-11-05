<script setup>
import { useGameStore } from '@/stores/game'

const store = useGameStore()
</script>

<template>
  <section class="scoreboard" aria-labelledby="scoreboard-title">
    <h2 id="scoreboard-title">Historial de partidas</h2>
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
  </section>
</template>

<style scoped>
.scoreboard {
  margin: 1.5rem auto 0;
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

@media (max-width: 480px) {
  .scoreboard {
    margin-top: 1.1rem;
    padding: 0.75rem;
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
