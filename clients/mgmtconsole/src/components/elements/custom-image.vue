<template>
  <div :style="`background-image:url('${Source}')`"></div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator';

@Component
export default class CustomImage extends Vue {
  @Prop({
    type: String,
    required: true,
  })
  protected src!: string;

  protected get Source() {
    return !this.src || this.src === ''
      ? '/application-placeholder.png'
      : this.src;
  }
}
</script>

<style scoped></style>
