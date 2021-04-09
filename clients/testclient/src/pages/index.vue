<template>
  <div>
    <n-link to="/auth/signin">Signin</n-link>
    <n-link to="/ws">WebSocket</n-link>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';

@Component
export default class IndexPage extends Vue {}
</script>

<style scoped></style>
