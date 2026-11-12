<script setup>
defineProps({
  tecles: {
    type: Array,
    required: true,
  },
  bloquejat: {
    type: Boolean,
    default: false,
  },
  premudes: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['premuda'])
</script>

<template>
  <div class="keypad" role="group" aria-label="Tecles del joc">
    <button
      v-for="tecla in tecles"
      :key="tecla"
      type="button"
      :disabled="bloquejat || premudes.includes(tecla)"
      @click="emit('premuda', tecla)"
    >
      {{ tecla }}
    </button>
  </div>
</template>

<style scoped>
.keypad {
  display: grid;
  width: min(100%, 22rem);
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: clamp(0.45rem, 2.5vw, 0.85rem);
  margin-inline: auto;
}

.keypad button {
  touch-action: manipulation;
}

button {
  width: 100%;
  min-width: 0;
  aspect-ratio: 1;
  padding: 0.5rem;
  border: 1px solid var(--stroke);
  border-radius: 0.5rem;
  background: var(--paper-shade);
  color: var(--ink);
  font: inherit;
  font-size: clamp(1.1rem, 5vw, 1.4rem);
  font-weight: 750;
  cursor: pointer;
  transition: background 140ms ease, border-color 140ms ease;
}

button:not(:disabled):hover {
  border-color: var(--accent);
  background: #fff;
}

button:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
}

button:disabled {
  cursor: not-allowed;
  background: #ecece8;
  color: #9a9d9e;
}

@media (prefers-reduced-motion: reduce) {
  button {
    transition: none;
  }
}
</style>
