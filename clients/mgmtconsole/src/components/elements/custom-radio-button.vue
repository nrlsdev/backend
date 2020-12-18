<template>
  <b-form-radio>
    <slot />
  </b-form-radio>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';

@Component
export default class CustomRadioButton extends Vue {}
</script>

<style scoped>
::v-deep .custom-control-input ~ .custom-control-label::before {
  background-color: var(--gray4-color) !important;
  border-color: var(--gray2-color) !important;
}

::v-deep .custom-control-input:checked ~ .custom-control-label::before {
  background-color: var(--primary-color) !important;
  border-color: var(--primary-color) !important;
}

::v-deep .custom-control-input:active ~ .custom-control-label::before {
  background-color: var(--primary-white-background-color) !important;
  border-color: var(--primary-white-background-color) !important;
}

::v-deep .custom-control-input:focus ~ .custom-control-label::before {
  box-shadow: none !important;
}
</style>
