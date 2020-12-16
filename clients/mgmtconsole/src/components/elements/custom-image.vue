<template>
  <div :style="`background-image:url('${Source}')`"></div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator';

@Component
export default class CustomImage extends Vue {
  @Prop({
    required: true,
  })
  protected src!: string | undefined | null;

  protected get Source() {
    return !this.src || this.src === ''
      ? '/application-placeholder.png'
      : this.src;
  }
}
</script>

<style scoped></style>
