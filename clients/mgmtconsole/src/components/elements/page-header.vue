<template>
  <div class="page-header overview-header">
    <h1 class="system-large-title-font ellipsis">{{ $t(title) }}</h1>
    <div v-if="onActionButtonClicked">
      <CustomButton
        class="block default"
        @click.native="onActionButtonClicked"
        :mobileIcon="mobileIcon"
        >{{ $t(buttonText) }}</CustomButton
      >
    </div>
    <div v-else>
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator';

@Component
export default class PageHeader extends Vue {
  @Prop({
    type: String,
    required: true,
  })
  protected title!: string;

  @Prop({
    type: String,
    required: false,
  })
  protected buttonText!: string;

  @Prop({
    type: String,
    required: false,
  })
  protected mobileIcon!: string;

  @Prop({
    type: Function,
    required: false,
  })
  protected onActionButtonClicked!: Function;
}
</script>

<style lang="postcss" scoped>
.overview-header {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 25px;
  align-items: center;
}
</style>
