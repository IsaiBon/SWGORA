<script setup lang="ts">
import { computed } from 'vue'
import { ShieldCheck, Wrench } from 'lucide-vue-next'
import type { UserRole } from '@/stores/auth'

const props = withDefaults(
  defineProps<{
    role: UserRole | string
    size?: 'sm' | 'md' | 'lg'
    showIcon?: boolean
  }>(),
  {
    size: 'md',
    showIcon: true,
  }
)

const isAdmin = computed(() => props.role === 'Administrador')

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'px-2 py-0.5 text-[11px] gap-1'
    case 'lg':
      return 'px-3.5 py-1.5 text-sm gap-2'
    case 'md':
    default:
      return 'px-2.5 py-1 text-xs gap-1.5'
  }
})

const iconSize = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'w-3 h-3'
    case 'lg':
      return 'w-4 h-4'
    case 'md':
    default:
      return 'w-3.5 h-3.5'
  }
})
</script>

<template>
  <span
    :class="[
      'inline-flex items-center font-medium rounded-full border transition-colors select-none shadow-sm',
      sizeClasses,
      isAdmin
        ? 'bg-[#05C7F2]/15 text-sky-900 border-[#05C7F2]/50'
        : 'bg-amber-50 text-amber-900 border-amber-300',
    ]"
  >
    <component
      v-if="showIcon"
      :is="isAdmin ? ShieldCheck : Wrench"
      :class="[iconSize, isAdmin ? 'text-[#04C4D9]' : 'text-amber-600']"
    />
    <span>{{ role }}</span>
  </span>
</template>
