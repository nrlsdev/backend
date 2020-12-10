<template>
  <nuxt />
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';

@Component({
  middleware: ['redirect-to-index-page-if-signed-in'],
})
export default class AccountLayout extends Vue {}
</script>
