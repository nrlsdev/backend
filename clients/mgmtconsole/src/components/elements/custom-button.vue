<template>
  <button>
    <slot />
  </button>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';

@Component
export default class CustomButton extends Vue {}
</script>

<style scoped>
button {
  width: 100%;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
}

.default {
  background-color: var(--custom-button-default-color);
}

.default:hover {
  background-color: var(--custom-button-default-hover-color);
}

.default:active {
  background-color: var(--custom-button-default-active-color);
}

.branded {
  background-color: var(--custom-button-branded-color);
}

.branded:hover {
  background-color: var(--custom-button-branded-hover-color);
}

.branded:active {
  background-color: var(--custom-button-branded-active-color);
}

.modal-btn {
  background-color: var(--gray3-color);
}

.modal-btn:hover {
  background-color: var(--gray4-color);
}

.modal-btn:active {
  background-color: var(--gray5-color);
}

.big {
  padding: 10px;
  font-weight: bold;
}

.medium {
  padding: 5px 10px;
}
</style>
