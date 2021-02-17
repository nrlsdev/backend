<template>
  <button
    :class="readonly ? 'readonly' : ''"
    :disbaled="readonly"
    v-if="$mq === 'sm' && mobileIcon"
  >
    <Icon :icon="mobileIcon" />
  </button>
  <button :class="readonly ? 'readonly' : ''" :disbaled="readonly" v-else>
    <slot />
  </button>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator';

@Component
export default class CustomButton extends Vue {
  @Prop({
    type: String,
    required: false,
  })
  protected mobileIcon!: string;

  @Prop({
    type: Boolean,
    required: false,
    default: false,
  })
  protected readonly!: boolean;
}
</script>

<style scoped>
button {
  width: 100%;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
}

.readonly {
  cursor: initial;
  border: 1px solid var(--custom-button-default-color);
  background-color: var(--transparent-color);
}

.default {
  background-color: var(--custom-button-default-color);
}

.default:hover {
  background-color: var(--custom-button-default-hover-color);
}

.default:active {
  background-color: var(--custom-button-default-active-color);
}

.branded {
  background-color: var(--custom-button-branded-color);
}

.branded:hover {
  background-color: var(--custom-button-branded-hover-color);
}

.branded:active {
  background-color: var(--custom-button-branded-active-color);
}

.delete {
  background-color: var(--custom-button-delte-color);
}

.delete:hover {
  background-color: var(--custom-button-delte-hover-color);
}

.delete:active {
  background-color: var(--custom-button-delte-active-color);
}

.modal-btn {
  background-color: var(--custom-button-modal-color);
}

.modal-btn:hover {
  background-color: var(--custom-button-modal-hover-color);
}

.modal-btn:active {
  background-color: var(--custom-button-modal-active-color);
}

.big {
  padding: 10px;
  font-weight: bold;
}
</style>
