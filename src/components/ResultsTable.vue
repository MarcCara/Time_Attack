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
  margin: 1.15rem -0.25rem 0;
  overflow-x: auto;
  border: 1px solid #d5c9b4;
  border-radius: 0.4rem;
  background: #fffdf7;
}

table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  white-space: nowrap;
}

th,
td {
  padding: 0.6rem 0.65rem;
  border-bottom: 1px solid #e6dece;
}

th {
  background: #f1e9d8;
  color: var(--text-muted);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-align: left;
  text-transform: uppercase;
}

tbody tr {
  transition: background-color 140ms ease;
}

tbody tr:hover {
  background: #f8f1e4;
}

tbody td {
  color: var(--ink);
  font-variant-numeric: tabular-nums;
}

tbody tr:last-child td {
  border-bottom: 0;
}

tbody td:last-child {
  color: var(--accent);
  font-weight: 700;
}

@media (max-width: 480px) {
  th,
  td {
    padding: 0.55rem 0.45rem;
    font-size: 0.8rem;
  }
}
</style>
