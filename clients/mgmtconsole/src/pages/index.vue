<template>
  <div></div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import { SystemUserModule } from '../store/modules/system-user';

@Component
export default class IndexPage extends Vue {
  public async mounted() {
    const userData = await SystemUserModule.getUserData();
    console.log(userData);
  }
}
</script>

<style></style>
