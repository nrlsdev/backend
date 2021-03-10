<template>
  <select v-if="!countries">
    <slot />
  </select>
  <select v-else-if="countries" @input="updateInput($event.target.value)">
    <option
      v-for="country in countriesData"
      :key="country.code2"
      :value="country.code2"
    >
      {{ country.name }}
    </option>
  </select>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator';
import { Countries } from '@backend/constants';

@Component
export default class CustomSelect extends Vue {
  @Prop()
  protected value: any;

  @Prop({
    type: Boolean,
    required: false,
    default: false,
  })
  protected countries!: boolean;

  protected countriesData = Countries;

  protected countriesLoaded: boolean = false;

  protected updateInput(value: string) {
    this.$emit('input', value);
  }
}
</script>

<style scoped>
select {
  outline: none;
  border-color: var(--custom-input-border-color) !important;
}

.block {
  width: 100%;
  padding: 5px 10px;
  border: 1px solid var(--gray5-color);
  border-radius: 5px;
  background-color: var(--gray6-color);
  color: var(--white);
}
</style>
