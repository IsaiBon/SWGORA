import { supabase } from './supabase'

export type ClientType = 'Cliente' | 'Tallerista'
export type ClientStatus = 'Activo' | 'Inactivo'

export interface Client {
  id: string
  nombre: string
  cedula: string
  telefono: string
  tipo: ClientType
  direccion: string
  estado: ClientStatus
  created_at?: string
}

export interface ClientInput {
  nombre: string
  cedula: string
  telefono: string
  tipo: ClientType
  direccion: string
}

async function getClients(): Promise<Client[]> {
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[Clientes] Error al obtener clientes:', error)
    throw error
  }

  return (data ?? []) as Client[]
}

async function createClient(client: ClientInput): Promise<Client> {
  const { data, error } = await supabase
    .from('clientes')
    .insert({
      ...client,
      estado: 'Activo'
    })
    .select()
    .single()

  if (error) {
    console.error('[Clientes] Error al crear cliente:', error)
    throw error
  }

  return data as Client
}

async function updateClient(id: string, client: ClientInput): Promise<Client> {
  const { data, error } = await supabase
    .from('clientes')
    .update(client)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('[Clientes] Error al actualizar cliente:', error)
    throw error
  }

  return data as Client
}

async function deactivateClient(id: string): Promise<Client> {
  const { data, error } = await supabase
    .from('clientes')
    .update({ estado: 'Inactivo' })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('[Clientes] Error al inactivar cliente:', error)
    throw error
  }

  return data as Client
}

export const clientService = {
  getClients,
  createClient,
  updateClient,
  deactivateClient
}
