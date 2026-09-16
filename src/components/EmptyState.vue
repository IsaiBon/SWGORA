<script setup lang="ts">
import { FolderSearch, Plus, RotateCcw } from 'lucide-vue-next'

defineProps<{
  title: string
  description: string
  icon?: any
  actionText?: string
  secondaryActionText?: string
}>()

defineEmits<{
  (e: 'action'): void
  (e: 'secondaryAction'): void
}>()
</script>

<template>
  <div class="bg-white rounded-3xl border border-dashed border-slate-300 p-8 sm:p-12 text-center max-w-lg mx-auto shadow-sm">
    <!-- Icon Container -->
    <div class="relative w-20 h-20 mx-auto mb-5">
      <div class="absolute inset-0 rounded-full bg-[#05C7F2]/15 animate-ping opacity-30"></div>
      <div class="relative w-20 h-20 rounded-full bg-gradient-to-tr from-[#05C7F2]/20 to-[#05F2F2]/10 border border-[#05C7F2]/30 flex items-center justify-center text-[#04C4D9] shadow-inner">
        <component :is="icon" v-if="icon" class="w-9 h-9" />
        <FolderSearch v-else class="w-9 h-9" />
      </div>
    </div>

    <!-- Title & Description -->
    <h3 class="text-lg sm:text-xl font-bold text-slate-900 mb-2">
      {{ title }}
    </h3>
    <p class="text-sm text-slate-500 mb-6 leading-relaxed max-w-sm mx-auto">
      {{ description }}
    </p>

    <!-- Action Buttons -->
    <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
      <button
        v-if="actionText"
        type="button"
        @click="$emit('action')"
        class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#0D0D0D] hover:bg-black text-white text-xs sm:text-sm font-semibold shadow-md active:scale-95 transition"
      >
        <Plus class="w-4 h-4 text-[#05C7F2]" />
        <span>{{ actionText }}</span>
      </button>

      <button
        v-if="secondaryActionText"
        type="button"
        @click="$emit('secondaryAction')"
        class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-medium transition"
      >
        <RotateCcw class="w-3.5 h-3.5 text-slate-500" />
        <span>{{ secondaryActionText }}</span>
      </button>
    </div>
  </div>
</template>
