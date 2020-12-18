<template>
  <b-form-group>
    <slot />
  </b-form-group>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';

@Component
export default class CustomRadioGroup extends Vue {}
</script>

<style scoped></style>
