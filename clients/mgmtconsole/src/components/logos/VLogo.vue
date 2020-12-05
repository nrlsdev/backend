<template>
  <svg viewBox="0 0 324 324" version="1.1">
    <path
      d="M74.75 0 C67.708 0 62 5.708 62 12.75 L62 187.25 C62 194.292 67.708 200 74.75 200 L249.25 200 C256.292 200 262 194.292 262 187.25 L262 12.75 C262 5.708 256.292 0 249.25 0 Z"
    />
    <defs>
      <text
        id="string"
        transform="matrix(1.0 0.0 0.0 1.0 -48.0 224.0)"
        y="97.0"
        font-family="Helvetica, Helvetica"
        font-size="126"
        x="40.44873046875"
        text-decoration="none"
      >
        Name
      </text>
    </defs>
    <use id="Name" xlink:href="#string" />
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
