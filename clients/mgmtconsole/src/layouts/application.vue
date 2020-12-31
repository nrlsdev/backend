<template>
  <div>
    <Navbar class="application-navbar" />
    <div class="application-sidebar-layout">
      <ApplicationSidebar class="application-sidebar" />
      <div class="common-wrapper">
        <nuxt />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator';

@Component({
  middleware: ['redirect-to-signin-page-if-not-signed-in'],
})
export default class ApplicationLayout extends Vue {}
</script>

<style scoped>
.application-sidebar-layout {
  display: grid;
  grid-template-columns: 250px 1fr;
}

.application-sidebar {
  height: calc(100vh - 73px);
  top: 73px;
  position: sticky;
}

.application-navbar {
  top: 0;
  position: sticky;
  z-index: 1;
}
</style>
