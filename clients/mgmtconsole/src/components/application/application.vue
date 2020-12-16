<template>
  <div class="application-container" @click="onApplicationClicked">
    <CustomImage class="application-image" src="/application-placeholder.png" />
    <label>{{ application.name }}</label>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator';
import { ApplicationData } from '../../store/modules/application';

@Component
export default class Icon extends Vue {
  @Prop({
    type: Object,
    required: true,
  })
  protected application!: ApplicationData;

  protected onApplicationClicked() {
    this.$router.push(`/application?id=${this.application._id}`);
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
