export interface Client {
  id: string
  name: string
  company: string
  type: 'Flotilla' | 'Empresa' | 'Taller Asociado' | 'Particular'
  phone: string
  email: string
  address: string
  city: string
  status: 'Activo' | 'En Servicio' | 'Inactivo'
  assignedRole: 'Administrador' | 'Usuario de Taller'
  equipmentDescription: string
  totalServices: number
  lastContact: string
}

const initialClients: Client[] = [
  {
    id: 'cli-01',
    name: 'Ing. Carlos Mendoza',
    company: 'Transportes Logísticos del Norte',
    type: 'Flotilla',
    phone: '+52 55 4920 1840',
    email: 'cmendoza@transnorte.mx',
    address: 'Av. de las Industrias 1420, Bodega 4',
    city: 'Monterrey, N.L.',
    status: 'En Servicio',
    assignedRole: 'Usuario de Taller',
    equipmentDescription: '12 Tractocamiones Kenworth T680 (Mantenimiento Válvulas y Turbos)',
    totalServices: 18,
    lastContact: 'Hoy, 08:30 AM',
  },
  {
    id: 'cli-02',
    name: 'Lic. Mariana Garza',
    company: 'Operadora Industrial Regio',
    type: 'Empresa',
    phone: '+52 81 1234 5678',
    email: 'mgarza@regioindustrial.com',
    address: 'Parque Industrial Milenium, Nave 8',
    city: 'Apodaca, N.L.',
    status: 'Activo',
    assignedRole: 'Administrador',
    equipmentDescription: 'Sistemas de Bombeo y Compresores de Alta Presión',
    totalServices: 24,
    lastContact: 'Ayer',
  },
  {
    id: 'cli-03',
    name: 'Maestro Jorge Ramos',
    company: 'Taller Mecánico Especializado Ramos',
    type: 'Taller Asociado',
    phone: '+52 81 8345 9912',
    email: 'taller.ramos@hotmail.com',
    address: 'Calzada Madero 2185 Poniente',
    city: 'Monterrey, N.L.',
    status: 'Activo',
    assignedRole: 'Usuario de Taller',
    equipmentDescription: 'Rectificación de Cabezas y Monoblocks para Motores Diesel',
    totalServices: 35,
    lastContact: '14 Sep 2026',
  },
  {
    id: 'cli-04',
    name: 'Ing. Roberto Silva',
    company: 'Constructora y Pavimentos del Centro',
    type: 'Flotilla',
    phone: '+52 55 7712 3490',
    email: 'rsilva@copacentro.com.mx',
    address: 'Km 14.5 Carretera Nacional',
    city: 'Santiago, N.L.',
    status: 'En Servicio',
    assignedRole: 'Usuario de Taller',
    equipmentDescription: '6 Maquinarias Pesadas Caterpillar (Retroexcavadoras y Motoconformadoras)',
    totalServices: 9,
    lastContact: '12 Sep 2026',
  },
  {
    id: 'cli-05',
    name: 'Sr. Alejandro Treviño',
    company: 'Particular (Vehículo Utilitario)',
    type: 'Particular',
    phone: '+52 81 9988 7766',
    email: 'atrevino.mty@gmail.com',
    address: 'Av. Eugenio Garza Sada 3450',
    city: 'Monterrey, N.L.',
    status: 'Activo',
    assignedRole: 'Administrador',
    equipmentDescription: 'Pick-Up Ford F-250 Super Duty (Ajuste de Motor Completo)',
    totalServices: 3,
    lastContact: '08 Sep 2026',
  },
  {
    id: 'cli-06',
    name: 'Dr. Fernando Salazar',
    company: 'Hospital y Servicios Médicos Móviles',
    type: 'Empresa',
    phone: '+52 81 2233 4455',
    email: 'fsalazar@redsaludmovil.org',
    address: 'Av. Gonzalitos 890 Sur',
    city: 'Monterrey, N.L.',
    status: 'Inactivo',
    assignedRole: 'Administrador',
    equipmentDescription: '3 Ambulancias Terapia Intensiva (Generadores y Bombas Auxiliares)',
    totalServices: 7,
    lastContact: '01 Sep 2026',
  },
]

const STORAGE_KEY = 'jrblanco_clients_v2'

export const clientService = {
  getClients(): Client[] {
    const data = localStorage.getItem(STORAGE_KEY)
    if (data) {
      try {
        return JSON.parse(data)
      } catch (e) {
        console.error('Error parseando clientes en localStorage:', e)
      }
    }
    this.resetClients()
    return [...initialClients]
  },

  saveClient(client: Partial<Client> & { name: string }): Client {
    const clients = this.getClients()
    if (client.id) {
      const idx = clients.findIndex(c => c.id === client.id)
      if (idx !== -1) {
        clients[idx] = { ...clients[idx], ...client } as Client
        localStorage.setItem(STORAGE_KEY, JSON.stringify(clients))
        return clients[idx]
      }
    }

    const newClient: Client = {
      id: 'cli-' + Date.now(),
      name: client.name,
      company: client.company || 'Particular',
      type: client.type || 'Particular',
      phone: client.phone || '',
      email: client.email || '',
      address: client.address || '',
      city: client.city || 'Monterrey, N.L.',
      status: client.status || 'Activo',
      assignedRole: client.assignedRole || 'Usuario de Taller',
      equipmentDescription: client.equipmentDescription || 'Mantenimiento General en Taller',
      totalServices: client.totalServices || 1,
      lastContact: 'Hoy',
    }

    clients.unshift(newClient)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clients))
    return newClient
  },

  deleteClient(id: string): void {
    const clients = this.getClients().filter(c => c.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clients))
  },

  clearAll(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]))
  },

  resetClients(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialClients))
  },
}
