import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUiStore = defineStore('ui', () => {
  const isMobileSidebarOpen = ref(false)
  const isSidebarCollapsed = ref(false)

  function toggleMobileSidebar() {
    isMobileSidebarOpen.value = !isMobileSidebarOpen.value
  }

  function closeMobileSidebar() {
    isMobileSidebarOpen.value = false
  }

  function toggleSidebarCollapse() {
    isSidebarCollapsed.value = !isSidebarCollapsed.value
  }

  return {
    isMobileSidebarOpen,
    isSidebarCollapsed,
    toggleMobileSidebar,
    closeMobileSidebar,
    toggleSidebarCollapse,
  }
})
