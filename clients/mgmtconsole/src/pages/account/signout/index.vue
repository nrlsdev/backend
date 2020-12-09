<template>
  <div></div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';

@Component
export default class SignOutPage extends Vue {
  protected created() {
    this.$router.push('/account/signin');
  }
}
</script>
