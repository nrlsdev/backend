<template>
  <nuxt />
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';

@Component({
  middleware: ['redirect-to-login-if-not-signed-in'],
})
export default class DefaultLayout extends Vue {}
</script>
