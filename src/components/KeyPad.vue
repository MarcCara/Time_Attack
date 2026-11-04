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
  border-radius: clamp(0.65rem, 3vw, 0.85rem);
  background:
    radial-gradient(circle at 50% 0%, rgb(255 255 255 / 7%), transparent 65%),
    linear-gradient(145deg, #202c41, #151e2f);
  color: #f3f5fa;
  font: inherit;
  font-size: clamp(1.1rem, 5vw, 1.4rem);
  font-weight: 750;
  cursor: pointer;
  box-shadow: 0 0.45rem 0 #090e18, 0 0.6rem 1.2rem rgb(0 0 0 / 20%);
  transition:
    background 140ms ease,
    border-color 140ms ease,
    box-shadow 140ms ease,
    color 140ms ease,
    transform 140ms ease;
}

button:not(:disabled):hover {
  border-color: rgb(255 118 94 / 70%);
  background:
    radial-gradient(circle at 50% 0%, rgb(255 154 118 / 18%), transparent 65%),
    linear-gradient(145deg, #3a3042, #251f32);
  color: #fff;
  box-shadow: 0 0.55rem 0 #090e18, 0 0.8rem 1.5rem rgb(255 118 94 / 12%);
  transform: translateY(-2px);
}

button:not(:disabled):active {
  box-shadow: 0 0.15rem 0 #090e18;
  transform: translateY(0.25rem);
}

button:focus-visible {
  outline: 3px solid var(--accent-bright);
  outline-offset: 3px;
}

button:disabled {
  cursor: not-allowed;
  border-color: rgb(164 183 213 / 8%);
  background: #111827;
  color: #778398;
  box-shadow: none;
}

button:not(:disabled) {
  border-color: rgb(164 183 213 / 24%);
}

@media (prefers-reduced-motion: reduce) {
  button {
    transition: none;
  }
}
</style>
