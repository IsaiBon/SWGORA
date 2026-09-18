<template>
  <div class="app-layout">
    <Sidebar />

    <main class="main-content">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import Sidebar from '@/components/Sidebar.vue'
</script>

<style scoped>
.app-layout {
  width: 100%;
  min-height: 100vh;
  background: #f7fbfd;
}

.main-content {
  width: calc(100% - 208px);
  min-height: 100vh;
  margin-left: 208px;

  background: linear-gradient(
    180deg,
    #f8fcfe 0%,
    #ffffff 45%,
    #f8fcfe 100%
  );

  overflow-x: hidden;
}

@media (max-width: 900px) {
  .main-content {
    width: calc(100% - 76px);
    margin-left: 76px;
  }
}
</style>