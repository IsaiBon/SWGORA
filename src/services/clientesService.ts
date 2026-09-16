import { supabase } from './supabase'

export interface Cliente {
  id: string
  nombre: string
  telefono?: string | null
  direccion?: string | null
  taller?: string | null
  especificaciones_tecnicas?: Record<string, any>
  created_at: string
  updated_at?: string
}

export type ClienteInsert = Omit<Cliente, 'id' | 'created_at' | 'updated_at'> & {
  id?: string
  created_at?: string
  updated_at?: string
}

export type ClienteUpdate = Partial<Omit<Cliente, 'id' | 'created_at' | 'updated_at'>>

export const clientesService = {
  async getClientes(): Promise<Cliente[]> {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }
    return (data as Cliente[]) || []
  },

  async getClienteById(id: string): Promise<Cliente | null> {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      throw error
    }
    return data as Cliente
  },

  async createCliente(cliente: ClienteInsert): Promise<Cliente> {
    const { data, error } = await supabase
      .from('clientes')
      .insert([cliente])
      .select()
      .single()

    if (error) {
      throw error
    }
    return data as Cliente
  },

  async updateCliente(id: string, updates: ClienteUpdate): Promise<Cliente> {
    const { data, error } = await supabase
      .from('clientes')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw error
    }
    return data as Cliente
  },

  async deleteCliente(id: string): Promise<void> {
    const { error } = await supabase
      .from('clientes')
      .delete()
      .eq('id', id)

    if (error) {
      throw error
    }
  },
}
