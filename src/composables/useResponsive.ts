import { ref, onMounted, onUnmounted } from 'vue'

export function useResponsive(breakpoint = 1024) {
  const isMobile = ref(false)

  const checkScreen = () => {
    isMobile.value = window.innerWidth < breakpoint
  }

  onMounted(() => {
    checkScreen()
    window.addEventListener('resize', checkScreen)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', checkScreen)
  })

  return {
    isMobile,
  }
}
