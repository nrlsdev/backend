<template>
  <div></div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';

@Component
export default class UserSettingsGeneralPage extends Vue {
  protected layout() {
    return 'user-settings';
  }
}
</script>

<style scoped></style>
