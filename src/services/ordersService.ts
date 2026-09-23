export interface OrderItem {
  id: string
  productName: string
  quantity: number
  unitPrice: number
}

export interface Order {
  id: string
  orderNumber: string
  customer: string
  date: string
  status: 'Completada' | 'En Proceso' | 'Pendiente' | 'Cancelada'
  total: number
  itemsCount: number
  component?: 'Culata' | 'Block' | 'Cigüeñal' | 'Bielas' | 'Bancadas'
  engine?: string
  type?: 'orden' | 'cotizacion'
}

const mockOrders: Order[] = [
  { 
    id: '1', 
    orderNumber: 'ORD-2026-001', 
    customer: 'Transportes Logísticos del Norte', 
    date: '2026-09-22', 
    status: 'Completada', 
    total: 14250.00, 
    itemsCount: 6,
    component: 'Culata',
    engine: 'Toyota 3L Diesel',
    type: 'orden'
  },
  { 
    id: '2', 
    orderNumber: 'ORD-2026-002', 
    customer: 'Taller Mecánico El Pistón', 
    date: '2026-09-22', 
    status: 'En Proceso', 
    total: 18640.50, 
    itemsCount: 8,
    component: 'Block',
    engine: 'Nissan Z24',
    type: 'orden'
  },
  { 
    id: '3', 
    orderNumber: 'ORD-2026-003', 
    customer: 'Operadora Industrial Regio', 
    date: '2026-09-21', 
    status: 'En Proceso', 
    total: 22100.00, 
    itemsCount: 12,
    component: 'Cigüeñal',
    engine: 'Cummins ISX15',
    type: 'orden'
  },
  { 
    id: '4', 
    orderNumber: 'ORD-2026-004', 
    customer: 'Rectificadora y Motores Alfa', 
    date: '2026-09-20', 
    status: 'Pendiente', 
    total: 7430.00, 
    itemsCount: 4,
    component: 'Bielas',
    engine: 'Detroit DD15',
    type: 'cotizacion'
  },
  { 
    id: '5', 
    orderNumber: 'ORD-2026-005', 
    customer: 'Autotransportes Del Norte', 
    date: '2026-09-19', 
    status: 'Completada', 
    total: 11200.00, 
    itemsCount: 5,
    component: 'Culata',
    engine: 'Mitsubishi 4D56',
    type: 'orden'
  },
  { 
    id: '6', 
    orderNumber: 'ORD-2026-006', 
    customer: 'Servicio Automotriz Mendoza', 
    date: '2026-09-18', 
    status: 'En Proceso', 
    total: 15900.00, 
    itemsCount: 9,
    component: 'Bancadas',
    engine: 'Ford Powerstroke 6.7L',
    type: 'orden'
  },
  { 
    id: '7', 
    orderNumber: 'ORD-2026-007', 
    customer: 'Flotillas y Camiones de Oriente', 
    date: '2026-09-18', 
    status: 'Pendiente', 
    total: 28450.00, 
    itemsCount: 14,
    component: 'Block',
    engine: 'Caterpillar C15',
    type: 'orden'
  },
  { 
    id: '8', 
    orderNumber: 'ORD-2026-008', 
    customer: 'Distribuidora del Norte', 
    date: '2026-09-17', 
    status: 'Completada', 
    total: 9800.00, 
    itemsCount: 6,
    component: 'Cigüeñal',
    engine: 'Toyota 1KZ-TE',
    type: 'orden'
  }
]

export const ordersService = {
  async getOrders(): Promise<Order[]> {
    return Promise.resolve([...mockOrders])
  },

  async getOrderById(id: string): Promise<Order | undefined> {
    return Promise.resolve(mockOrders.find(o => o.id === id))
  },
}
