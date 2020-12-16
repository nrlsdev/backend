<template>
  <input
    class="custom-input"
    :type="type"
    :placeholder="placeholder"
    v-on:input="updateInput($event.target.value)"
  />
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator';

@Component
export default class CustomInput extends Vue {
  @Prop({
    type: String,
    required: false,
    default: 'text',
  })
  protected type!: string;

  @Prop({
    type: String,
    required: false,
    default: '',
  })
  protected placeholder!: string;

  protected updateInput(value: number) {
    this.$emit('input', value);
  }
}
</script>

<style src="~/assets/styles/elements/custom-input.css" scoped></style>
