<template>
  <div>
    <div class="radio-btn-container" v-for="item in items" :key="item.id">
      <input
        class="radio-btn"
        type="radio"
        :id="item.id"
        :checked="value === item.value"
        :name="name"
        :value="item.value"
        :disabled="item.disabled"
        @change="onRadioButtonChanged(item)"
      />
      <label class="radio-btn-label" :for="item.id">{{ $t(item.text) }}</label>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator';

@Component
export default class CustomRadioGroup extends Vue {
  @Prop({
    type: String,
    required: true,
    default: '',
  })
  protected name!: string;

  @Prop()
  protected value!: any;

  @Prop({
    type: Array,
    required: true,
    default: [],
  })
  protected items!: [
    { id: string; text: string; value: any; disabled?: boolean },
  ];

  protected onRadioButtonChanged(item: { text: string; value: any }) {
    this.$emit('input', item.value);
  }
}
</script>

<style scoped>
.radio-btn-container {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 8px;
}

.radio-btn {
  appearance: none;
  outline: none;
}

.radio-btn:after {
  content: '';
  width: 1em;
  height: 1em;
  border-radius: 100%;
  display: inline-block;

  background-color: var(--radio-button-not-checked-background-color);
  border: 4px solid var(--radio-button-border-color);
  box-shadow: 0 0 1px 0.25px var(--radio-button-not-checked-box-shadow-color);
}

.radio-btn:checked:after {
  background-color: var(--radio-button-checked-background-color);
  border: 4px solid var(--radio-button-border-color);
  box-shadow: 0 0 1px 0.25px var(--radio-button-checked-box-shadow-color);
}

.radio-btn:hover:after {
  opacity: 0.75;
}

.radio-btn-label {
  margin: 0;
  line-height: calc(1em + 4px);
  user-select: none;
}
</style>
