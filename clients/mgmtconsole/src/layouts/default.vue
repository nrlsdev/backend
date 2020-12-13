<template>
  <div>
    <Navbar />
    <nuxt />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';

@Component({
  middleware: ['redirect-to-signin-page-if-not-signed-in'],
})
export default class DefaultLayout extends Vue {}
</script>
