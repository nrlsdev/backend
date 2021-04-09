<template>
  <div>
    <n-link to="/auth/emailandpassword">E-Mail and Password</n-link>
    <n-link to="/auth/facebook">Facebook</n-link>
    <n-link to="/auth/twitter">Twitter</n-link>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';

@Component
export default class SignInPage extends Vue {}
</script>

<style scoped></style>
