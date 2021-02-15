<template>
  <input
    v-if="type !== 'textarea'"
    :type="type"
    :value="value"
    :placeholder="placeholder"
    @input="updateInput($event.target.value)"
  />
  <textarea
    v-else
    :value="value"
    :placeholder="placeholder"
    rows="15"
    @input="updateInput($event.target.value)"
  ></textarea>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator';

@Component
export default class CustomInput extends Vue {
  @Prop()
  protected value!: any;

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
input,
textarea {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border-color: var(--custom-input-border-color) !important;
}

textarea {
  resize: none;
}

input,
textarea::placeholder {
  color: var(--custom-input-placeholder-color);
}

input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
textarea:-webkit-autofill,
textarea:-webkit-autofill:hover,
textarea:-webkit-autofill:focus {
  -webkit-text-fill-color: var(--default-font-color);
  transition: background-color 5000s ease-in-out 0s;
}

.borderless {
  width: 100%;
  padding-bottom: 5px;
  border: none;
  border-radius: 0;
  outline: none;
  background-color: var(--transparent-color);
  border-bottom: 1px solid;
  color: var(--default-font-color);
}

.borderless + .borderless {
  margin-top: 16px;
}

.block {
  width: 100%;
  padding: 5px 10px;
  border: 1px solid var(--gray5-color);
  border-radius: 5px;
  background-color: var(--gray6-color);
  color: var(--white);
}

.readonly {
  color: var(--gray3-color);
}
</style>
