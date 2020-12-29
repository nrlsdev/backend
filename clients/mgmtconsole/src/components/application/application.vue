<template>
  <div class="application-container" @click="onApplicationClicked">
    <CustomImage class="application-image" :src="application.image" />
    <label>{{ application.name }}</label>
  </div>
</template>

<script lang="ts">
import { Application } from '@backend/systeminterfaces';
import { Vue, Component, Prop } from 'nuxt-property-decorator';

@Component
export default class Icon extends Vue {
  @Prop({
    type: Object,
    required: true,
  })
  protected application!: Application;

  protected onApplicationClicked() {
    this.$router.push(`/application/statistics/${this.application._id}`);
  }
}
</script>

<style scoped>
.application-container {
  cursor: pointer;
}

.application-container:hover {
  opacity: 0.75;
}

.application-image {
  width: 100%;
  padding-bottom: 100%;
  background-size: cover;
  border-radius: 15px;
  background-color: var(--application-background-color);
}
</style>
