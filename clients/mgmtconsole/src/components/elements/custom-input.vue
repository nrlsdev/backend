<template>
  <input
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

  @Prop({
    type: Function,
    required: false,
  })
  protected change!: Function;

  protected updateInput(value: string) {
    this.$emit('input', value);

    if (this.change) {
      this.change();
    }
  }
}
</script>

<style scoped>
input {
  border-color: var(--custom-input-border-color) !important;
}

input::placeholder {
  color: var(--custom-input-placeholder-color);
}

input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:active,
input:-webkit-autofill:focus {
  -webkit-text-fill-color: var(--default-font-color) !important;
  box-shadow: 0 0 0 10000px var(--account-input-background-color) inset !important;
  -webkit-box-shadow: 0 0 0 10000px var(--account-input-background-color) inset !important;
}

.borderless {
  width: 100%;
  margin-bottom: 16px;
  padding-bottom: 5px;
  border: none;
  border-radius: 0;
  outline: none;
  background-color: var(--transparent-color);
  border-bottom: 1px solid;
  color: var(--default-font-color);
}

.block {
  width: 100%;
  padding: 5px 10px;
  border: 1px solid var(--gray5-color);
  border-radius: 5px;
  background-color: var(--gray6-color);
  color: var(--white);
}

.block + .block {
  margin-top: 20px;
}

.readonly {
  color: var(--gray3-color);
}
</style>
