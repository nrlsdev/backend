<template>
  <svg width="2000px" height="816px" viewBox="0 0 2000 816">
    <path
      d="M64 0 C28.654 0 0 28.654 0 64 L0 752 C0 787.346 28.654 816 64 816 L752 816 C787.346 816 816 787.346 816 752 L816 64 C816 28.654 787.346 0 752 0 Z"
      stroke="none"
    />
    <defs>
      <text
        id="string"
        transform="matrix(1.0 0.0 0.0 1.0 1029.0 282.5)"
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
export default class HLogo extends Vue {}
</script>

<style scoped>
* {
  fill: var(--company-logo-color);
}
</style>
