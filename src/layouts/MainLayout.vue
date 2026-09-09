<script setup lang="ts">
import Navbar from '@/components/Navbar.vue'
import Sidebar from '@/components/Sidebar.vue'
</script>

<template>
  <div class="min-h-screen flex bg-slate-50 text-slate-900">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- Navbar -->
      <Navbar />

      <!-- Page Content -->
      <main class="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
        <slot />
      </main>

      <!-- Footer -->
      <footer class="py-4 px-6 border-t border-slate-200 text-center text-xs text-slate-400 bg-white">
        SWGORA &copy; 2026 - Arquitectura Frontend Base
      </footer>
    </div>
  </div>
</template>
