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
  border: 1px solid #b9ac94;
  border-radius: 0.35rem 0.45rem 0.3rem 0.5rem;
  background: #f4eddd;
  color: var(--ink);
  font: inherit;
  font-size: clamp(1.1rem, 5vw, 1.4rem);
  font-weight: 750;
  cursor: pointer;
  box-shadow: 0 4px 0 #c6b99f;
  transition:
    background 140ms ease,
    border-color 140ms ease,
    box-shadow 140ms ease,
    color 140ms ease,
    transform 140ms ease;
}

button:not(:disabled):hover {
  border-color: var(--accent);
  background: #fff9eb;
  box-shadow: 0 2px 0 #c6b99f;
  transform: translateY(2px);
}

button:not(:disabled):active {
  box-shadow: none;
  transform: translateY(4px);
}

button:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
}

button:disabled {
  cursor: not-allowed;
  border-color: #ded5c4;
  background: #e8e1d3;
  color: #aaa18f;
  box-shadow: none;
}

button:not(:disabled) {
  border-color: #b9ac94;
}

@media (prefers-reduced-motion: reduce) {
  button {
    transition: none;
  }
}
</style>
