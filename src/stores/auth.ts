import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/authService'
import { perfilesService } from '@/services/perfilesService'
import type { User as SupabaseUser, Session } from '@supabase/supabase-js'

export type UserRole = 'Administrador' | 'Usuario de Taller' | string

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>({
    id: 'usr-1',
    name: 'Roberto Blanco',
    email: 'admin@jrblanco.com',
    role: 'Administrador',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
  })
  const session = ref<Session | null>(null)
  const isInitialized = ref(false)
  const loading = ref(false)

  const isAuthenticated = computed(() => user.value !== null)

  function mapSupabaseUser(sbUser: SupabaseUser | null): User | null {
    if (!sbUser) return null
    return {
      id: sbUser.id,
      name: sbUser.user_metadata?.name || sbUser.email?.split('@')[0] || 'Usuario',
      email: sbUser.email || '',
      role: sbUser.user_metadata?.role || 'Operador',
      avatar: sbUser.user_metadata?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
    }
  }

  async function syncUserWithProfile(sbUser: SupabaseUser | null) {
    if (!sbUser) {
      user.value = null
      return
    }

    try {
      const perfil = await perfilesService.getPerfilById(sbUser.id)
      if (perfil) {
        user.value = {
          id: perfil.id,
          name: perfil.nombre,
          email: perfil.email,
          role: perfil.rol,
          avatar: perfil.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
        }
        return
      }
    } catch {
      // Si la tabla perfiles aún no está migrada en la instancia remota, usar fallback de auth.users
    }

    user.value = mapSupabaseUser(sbUser)
  }

  async function init() {
    if (isInitialized.value) return
    loading.value = true
    try {
      const currentSession = await authService.getSession()
      session.value = currentSession
      await syncUserWithProfile(currentSession?.user || null)

      authService.onAuthStateChange(async (_event, newSession) => {
        session.value = newSession
        await syncUserWithProfile(newSession?.user || null)
      })
    } catch (err) {
      console.error('[AuthStore] Error inicializando sesión:', err)
    } finally {
      loading.value = false
      isInitialized.value = true
    }
  }

  function setRole(newRole: UserRole) {
    if (user.value) {
      user.value.role = newRole
    }
  }

  function setDemoUser(name: string, role: UserRole) {
    user.value = {
      id: 'demo-' + Date.now(),
      name: name.split('@')[0] || (role === 'Administrador' ? 'Roberto Blanco' : 'Técnico Taller'),
      email: name.includes('@') ? name : `${name}@jrblanco.com`,
      role,
      avatar: role === 'Administrador'
        ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    }
  }

  async function login(email: string, password: string, demoRole: UserRole = 'Administrador'): Promise<void> {
    loading.value = true
    try {
      const data = await authService.signIn(email, password)
      session.value = data.session
      await syncUserWithProfile(data.user)
    } catch (err) {
      console.warn('[AuthStore] Supabase signIn fallo o sin conexion, usando fallback demo:', err)
      setDemoUser(email, demoRole)
    } finally {
      loading.value = false
    }
  }

  async function register(email: string, password: string, name?: string): Promise<void> {
    loading.value = true
    try {
      const data = await authService.signUp(email, password, name)
      if (data.session) {
        session.value = data.session
        await syncUserWithProfile(data.user)
      }
    } finally {
      loading.value = false
    }
  }

  async function logout(): Promise<void> {
    loading.value = true
    try {
      await authService.signOut()
    } finally {
      session.value = null
      user.value = null
      loading.value = false
    }
  }

  return {
    user,
    session,
    isAuthenticated,
    isInitialized,
    loading,
    init,
    login,
    setRole,
    setDemoUser,
    register,
    logout,
  }
})
