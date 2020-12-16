<template>
  <div></div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';

@Component
export default class ApplicationGeneralPage extends Vue {
  protected layout() {
    return 'application';
  }
}
</script>

<style scoped></style>
