<template>
  <div class="collapse-container">
    <div class="collapse-header" @click="onCollapseClicked">
      <Icon :icon="icon ? icon : ''" />
      <label class="system-headline-font collapse-header-title">{{
        title
      }}</label>
      <Icon :icon="showStatusIcon ? statusIcon : ''" />
      <Icon :icon="collapsed ? 'arrow-up' : 'arrow-down'" />
    </div>
    <b-collapse v-model="collapsed">
      <div class="collapse-content">
        <slot />
      </div>
    </b-collapse>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator';

@Component
export default class Collapse extends Vue {
  protected collapsed: boolean = false;

  protected showStatusIcon: boolean = false;

  @Prop({
    required: false,
    type: String,
  })
  protected icon!: string;

  @Prop({
    required: false,
    type: String,
  })
  protected title!: string;

  @Prop({
    required: false,
    type: String,
  })
  protected statusIcon!: string;

  protected onCollapseClicked() {
    this.collapsed = !this.collapsed;
  }
}
</script>

<style scoped>
.collapse-container {
  padding: 10px 20px;
  border-radius: 5px;
  background-color: var(--collapse-background-color);
}

.collapse-container + .collapse-container {
  margin-top: 20px;
}

.collapse-header {
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  gap: 16px;
  align-items: center;
}

.collapse-header-title {
  cursor: pointer;
  margin: 0;
}

.collapse-content {
  margin-top: 10px;
  padding-top: 20px;
  border-top: 1px solid var(--gray5-color); /* ToDo */
}
</style>
