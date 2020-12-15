<template>
  <button class="custom-button-content">
    <slot />
  </button>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';

@Component
export default class CustomButton extends Vue {}
</script>

<style src="~/assets/styles/elements/custom-button.css" scoped></style>

<style scoped>
.custom-button-content {
  font-weight: bold;
}
</style>
