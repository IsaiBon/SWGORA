<script setup lang="ts">
</script>

<template>
  <div class="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-neutral-900 overflow-x-hidden">
    <!-- Fondo de taller en escala de grises -->
    <div 
      class="absolute inset-0 bg-cover bg-center grayscale filter contrast-110 opacity-75"
      style="background-image: url('/images/workshop-bg.jpg');"
    ></div>
    <!-- Overlay sutil para enfoque visual -->
    <div class="absolute inset-0 bg-black/40 backdrop-blur-[1.5px]"></div>

    <!-- Contenedor central -->
    <div class="relative z-10 w-full flex justify-center py-6">
      <slot />
    </div>
  </div>
</template>
