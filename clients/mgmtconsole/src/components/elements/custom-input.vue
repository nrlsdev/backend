<template>
  <input
    class="custom-input"
    :type="type"
    :placeholder="placeholder"
    @input="updateInput($event.target.value)"
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

  protected updateInput(value: string) {
    this.$emit('input', value);
  }
}
</script>

<style scoped>
.custom-input {
  width: 100%;
  margin-bottom: 16px;
  padding-bottom: 5px;
  border: none;
  border-radius: 0;
  outline: none;
  background-color: var(--transparent-color);
  border-bottom: 1px solid var(--custom-input-border-bottom-color);
  color: var(--default-font-color);
}

.custom-input::placeholder {
  color: var(--custom-input-placeholder-color);
}

.custom-input:-webkit-autofill,
.custom-input:-webkit-autofill:hover,
.custom-input:-webkit-autofill:active,
.custom-input:-webkit-autofill:focus {
  -webkit-text-fill-color: var(--default-font-color) !important;
  box-shadow: 0 0 0 10000px var(--account-input-background-color) inset !important;
  -webkit-box-shadow: 0 0 0 10000px var(--account-input-background-color) inset !important;
}
</style>
