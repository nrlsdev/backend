<template>
  <div>{{ application }}</div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';
import { getApplicationById } from '../../api/application';
import { ApplicationData } from '../../store/modules/application';

@Component
export default class ApplicationPage extends Vue {
  protected application: ApplicationData | null = null;

  protected created() {}

  protected async fetch() {
    const applicationId = this.$route.query.id as string;
    this.application = await getApplicationById(applicationId);
  }
}
</script>

<style scoped></style>
