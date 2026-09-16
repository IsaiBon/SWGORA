<script setup lang="ts">
withDefaults(
  defineProps<{
    size?: number
    showText?: boolean
  }>(),
  {
    size: 96,
    showText: false,
  }
)
</script>

<template>
  <div class="inline-flex flex-col items-center justify-center select-none">
    <svg
      :width="size"
      :height="size"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="drop-shadow-sm"
    >
      <!-- Outer Cyan Circle -->
      <circle
        cx="50"
        cy="50"
        r="44"
        stroke="#05C7F2"
        stroke-width="3"
        stroke-linecap="round"
      />

      <!-- Subtle inner accent ring -->
      <circle
        cx="50"
        cy="50"
        r="39"
        stroke="#05C7F2"
        stroke-opacity="0.25"
        stroke-width="0.8"
        stroke-dasharray="3 3"
      />

      <!-- Stylized J -->
      <path
        d="M 43 28 H 48 V 56 C 48 63 43 66 37 66 C 33 66 30 64 29 62"
        stroke="#0D0D0D"
        stroke-width="2.8"
        stroke-linecap="round"
        stroke-linejoin="round"
      />

      <!-- Stylized R -->
      <path
        d="M 52 28 H 63 C 69 28 72 32 72 38 C 72 44 68 47 62 47 H 52 V 66"
        stroke="#0D0D0D"
        stroke-width="2.8"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <!-- R Flourish Leg -->
      <path
        d="M 60 47 C 64 53 67 61 74 66 C 77 68 81 67 83 65"
        stroke="#05C7F2"
        stroke-width="2.5"
        stroke-linecap="round"
      />

      <!-- BLANCO Lettering -->
      <text
        x="50"
        y="50"
        text-anchor="middle"
        dominant-baseline="central"
        fill="#04C4D9"
        font-family="system-ui, -apple-system, sans-serif"
        font-size="6.5"
        font-weight="800"
        letter-spacing="3.2"
      >
        BLANCO
      </text>
    </svg>
    <span v-if="showText" class="mt-1 font-bold tracking-tight text-slate-800 text-sm">
      JR BLANCO
    </span>
  </div>
</template>
