<template>
  <div></div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';

@Component
export default class ApplicationPushNotificationPage extends Vue {
  protected layout() {
    return 'application';
  }
}
</script>

<style src="~/assets/styles/pages/application.css" scoped></style>
