<template>
  <div :style="`background-image:url('${src}')`"></div>
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
}
</script>

<style scoped></style>
