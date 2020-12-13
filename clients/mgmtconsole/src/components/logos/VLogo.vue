<template>
  <svg width="1000px" height="1000px" viewBox="0 0 1000 1000">
    <path
      d="M157 0 C121.654 0 93 28.654 93 64 L93 752 C93 787.346 121.654 816 157 816 L845 816 C880.346 816 909 787.346 909 752 L909 64 C909 28.654 880.346 0 845 0 Z"
      stroke="none"
    />
    <defs>
      <text
        id="string"
        transform="matrix(1.0 0.0 0.0 1.0 6.0 798.5)"
        y="198.0"
        font-family="ArialMT, Arial"
        x="1.92919921875"
        font-size="219"
        text-decoration="none"
      >
        Revanced
      </text>
    </defs>
    <use id="Revanced" xlink:href="#string" />
  </svg>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';

@Component
export default class VLogo extends Vue {}
</script>

<style scoped>
* {
  fill: var(--company-logo-color);
}
</style>
