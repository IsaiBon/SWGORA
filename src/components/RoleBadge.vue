<script setup lang="ts">
import { computed } from 'vue'
import { ShieldCheck, Wrench, Eye } from 'lucide-vue-next'
import { normalizeRole, type UserRole } from '@/stores/auth'

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

const normalized = computed(() => normalizeRole(props.role))

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

const badgeClasses = computed(() => {
  switch (normalized.value) {
    case 'Administrador':
      return 'bg-[#05C7F2]/15 text-sky-900 border-[#05C7F2]/50'
    case 'Operador':
      return 'bg-amber-50 text-amber-900 border-amber-300'
    case 'Consultor':
      return 'bg-indigo-50 text-indigo-900 border-indigo-200'
    default:
      return 'bg-slate-50 text-slate-800 border-slate-300'
  }
})

const iconComponent = computed(() => {
  switch (normalized.value) {
    case 'Administrador':
      return ShieldCheck
    case 'Operador':
      return Wrench
    case 'Consultor':
      return Eye
    default:
      return ShieldCheck
  }
})

const iconColorClass = computed(() => {
  switch (normalized.value) {
    case 'Administrador':
      return 'text-[#04C4D9]'
    case 'Operador':
      return 'text-amber-600'
    case 'Consultor':
      return 'text-indigo-600'
    default:
      return 'text-slate-500'
  }
})
</script>

<template>
  <span
    :class="[
      'inline-flex items-center font-medium rounded-full border transition-colors select-none shadow-sm',
      sizeClasses,
      badgeClasses,
    ]"
  >
    <component
      v-if="showIcon"
      :is="iconComponent"
      :class="[iconSize, iconColorClass]"
    />
    <span>{{ normalized }}</span>
  </span>
</template>
