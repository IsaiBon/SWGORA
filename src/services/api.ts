/**
 * Cliente API base de SWGORA.
 * Preparado para conectar con endpoints REST en los siguientes sprints.
 */
export interface ApiResponse<T> {
  data: T
  message?: string
  status: number
}

const BASE_URL = import.meta.env.VITE_API_URL || '/api'

export const api = {
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`)
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`)
      }
      const data = await response.json()
      return { data, status: response.status }
    } catch (error) {
      console.warn(`[API] Fallback o error en GET ${endpoint}:`, error)
      throw error
    }
  },

  async post<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`)
      }
      const data = await response.json()
      return { data, status: response.status }
    } catch (error) {
      console.warn(`[API] Fallback o error en POST ${endpoint}:`, error)
      throw error
    }
  },
}
