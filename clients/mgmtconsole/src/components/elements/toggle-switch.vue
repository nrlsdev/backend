<template>
  <label class="toggle-switch">
    <input type="checkbox" :checked="value" @change="onToggleSwitchChanged" />
    <span class="toggle-switch-slider toggle-switch-round"></span>
  </label>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator';

@Component
export default class ToggleSwitch extends Vue {
  @Prop({
    required: true,
    type: Boolean,
    default: false,
  })
  protected value!: boolean;

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
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 24px;
  height: 12px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-switch-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgb(77, 77, 77);
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.toggle-switch-slider:before {
  position: absolute;
  content: '';
  height: 12px;
  width: 12px;
  background-color: rgb(255, 255, 255);
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

input:checked + .toggle-switch-slider {
  background-color: rgb(224, 101, 0);
  box-shadow: 0 0 3px rgb(224, 101, 0);
}

input:checked + .toggle-switch-slider:before {
  -webkit-transform: translateX(12px);
  -ms-transform: translateX(12px);
  transform: translateX(12px);
}

.toggle-switch-slider.toggle-switch-round {
  border-radius: 34px;
}

.toggle-switch-slider.toggle-switch-round:before {
  border-radius: 50%;
}
</style>
