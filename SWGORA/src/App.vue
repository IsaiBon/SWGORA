<script setup lang="ts">
import MainLayout from '@/layouts/MainLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
</script>

<template>
  <router-view v-slot="{ Component, route }">
    <component :is="route.meta?.layout === 'auth' ? AuthLayout : MainLayout">
      <component :is="Component" />
    </component>
  </router-view>
</template>
