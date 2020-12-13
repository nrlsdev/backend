<template>
  <div
    class="icon"
    v-if="icon !== ''"
    v-html="require(`@/static/${Icon}.svg?raw`)"
  />
  <div v-else>
    <svg class="icon" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator';

@Component
export default class Icon extends Vue {
  @Prop({
    type: String,
    required: true,
  })
  protected icon!: string;

  protected get Icon() {
    if (this.icon.length <= 0) {
      return '';
    }
    if (this.icon.includes('/')) {
      return this.icon;
    }
    return `icons/${this.icon}`;
  }
}
</script>

<style scoped>
.icon {
  display: grid;
  fill: var(--default-icon-color);
  font-size: 16px;
  width: 1em;
  height: 1em;
}
</style>
