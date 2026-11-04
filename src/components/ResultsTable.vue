<script setup>
defineProps({
  resultats: {
    type: Array,
    required: true,
  },
})
</script>

<template>
  <div class="table-wrapper">
    <table>
      <thead>
        <tr>
          <th scope="col">Tecla</th>
          <th scope="col">Objectiu</th>
          <th scope="col">Temps real</th>
          <th scope="col">Error</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="r in resultats" :key="r.tecla">
          <td>{{ r.tecla }}</td>
          <td>{{ r.objectiu }} s</td>
          <td>{{ r.tempsReal }} s</td>
          <td>{{ r.error }} s</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.table-wrapper {
  margin: 1rem -0.5rem 0;
  overflow-x: auto;
  border: 1px solid var(--stroke);
  border-radius: 0.8rem;
  background: rgb(7 12 21 / 30%);
}

table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  white-space: nowrap;
}

th,
td {
  padding: 0.55rem 0.75rem;
  border-bottom: 1px solid var(--stroke);
}

th {
  background: rgb(255 255 255 / 3%);
  color: var(--text-muted);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

tbody tr {
  transition: background-color 140ms ease;
}

tbody tr:hover {
  background: rgb(255 255 255 / 3%);
}

tbody td {
  color: #e2e8f1;
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
  th,
  td {
    padding: 0.55rem 0.5rem;
    font-size: 0.8rem;
  }
}
</style>
