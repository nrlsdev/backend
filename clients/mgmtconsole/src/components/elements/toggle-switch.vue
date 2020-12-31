<template>
  <div class="toggle-switch-container">
    <label class="toggle-switch">
      <input type="checkbox" :checked="value" @change="onToggleSwitchChanged" />
      <span class="toggle-switch-slider toggle-switch-round"></span>
    </label>
    <label class="toggle-switch-text">{{ text }}</label>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator';

@Component
export default class ToggleSwitch extends Vue {
  @Prop({
    required: false,
    type: Boolean,
    default: false,
  })
  protected value!: boolean;

  @Prop({
    required: false,
    type: String,
    default: '',
  })
  protected text!: boolean;

  @Prop({
    type: Function,
    required: false,
  })
  protected change!: Function;

  protected onToggleSwitchChanged() {
    this.$emit('input', !this.value);

    if (this.change) {
      this.change();
    }
  }
}
</script>

<style scoped>
.toggle-switch-container {
  display: grid;
  grid-template-columns: 2em auto;
  gap: 8px;
  align-items: center;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 2em;
  height: 1em;
}

.toggle-switch input {
  display: none;
}

.toggle-switch-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--toggle-switch-not-checked-background-color);
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.toggle-switch-slider:before {
  position: absolute;
  content: '';
  height: 0.9em;
  width: 0.9em;
  top: 0.05em;
  left: 0.05em;
  background-color: var(--toggle-switch-slider-color);
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

input:checked + .toggle-switch-slider {
  background-color: var(--toggle-switch-checked-background-color);
  box-shadow: 0 0 3px var(--toggle-switch-checked-background-color);
}

input:checked + .toggle-switch-slider:before {
  -webkit-transform: translateX(1em);
  -ms-transform: translateX(1em);
  transform: translateX(1em);
}

.toggle-switch-slider.toggle-switch-round {
  border-radius: 16px;
}

.toggle-switch-slider.toggle-switch-round:before {
  border-radius: 100%;
}
</style>
