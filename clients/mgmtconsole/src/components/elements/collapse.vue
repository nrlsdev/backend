<template>
  <div class="collapse-container">
    <div class="collapse-header" @click="onCollapseClicked">
      <Icon :icon="icon ? icon : ''" />
      <label class="collapse-header-title">{{ title }}</label>
      <Icon :icon="showStatusIcon ? statusIcon : ''" />
      <Icon :icon="collapsed ? 'arrow-up' : 'arrow-down'" />
    </div>
    <b-collapse class="collapse-content" v-model="collapsed">
      <slot />
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
  padding: 8px 16px;
  border-radius: 5px;
  background-color: rgb(36, 36, 36);
}

.collapse-container + .collapse-container {
  margin-top: 16px;
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
</style>
