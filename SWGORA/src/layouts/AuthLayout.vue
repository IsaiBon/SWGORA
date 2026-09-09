<script setup lang="ts">
import { Layers } from 'lucide-vue-next'
</script>

<template>
  <div class="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
    <div class="sm:mx-auto sm:w-full sm:max-w-md text-center">
      <div class="mx-auto w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center text-white shadow-xl shadow-indigo-500/30 mb-4">
        <Layers class="w-7 h-7" />
      </div>
      <h2 class="text-2xl font-extrabold tracking-tight text-white">
        SWGORA
      </h2>
      <p class="mt-2 text-sm text-indigo-200">
        Plataforma Integral de Gestión y Control
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
      <div class="bg-white py-8 px-6 shadow-2xl rounded-2xl sm:px-10 border border-slate-100">
        <slot />
      </div>
    </div>
  </div>
</template>
