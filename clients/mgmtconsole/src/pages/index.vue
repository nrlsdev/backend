<template>
  <div>
    <button @click="test()">TEST</button>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import { systemAPI } from '../utils/axios-accessor';

@Component
export default class IndexPage extends Vue {
  protected test() {
    systemAPI.get('/');
  }
}
</script>

<style></style>
