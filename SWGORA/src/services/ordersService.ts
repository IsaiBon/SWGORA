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
}

const mockOrders: Order[] = [
  { id: '1', orderNumber: 'ORD-2026-001', customer: 'Distribuidora del Norte', date: '2026-09-08', status: 'Completada', total: 14250.00, itemsCount: 15 },
  { id: '2', orderNumber: 'ORD-2026-002', customer: 'Supermercados La Estrella', date: '2026-09-08', status: 'En Proceso', total: 8640.50, itemsCount: 8 },
  { id: '3', orderNumber: 'ORD-2026-003', customer: 'Comercializadora Blanco', date: '2026-09-07', status: 'Pendiente', total: 22100.00, itemsCount: 32 },
  { id: '4', orderNumber: 'ORD-2026-004', customer: 'Industrias Metálicas S.A.', date: '2026-09-06', status: 'Completada', total: 5430.00, itemsCount: 4 },
  { id: '5', orderNumber: 'ORD-2026-005', customer: 'Bodega Central Express', date: '2026-09-05', status: 'Cancelada', total: 1200.00, itemsCount: 2 },
  { id: '6', orderNumber: 'ORD-2026-006', customer: 'Logística y Abasto JR', date: '2026-09-05', status: 'En Proceso', total: 18900.75, itemsCount: 20 },
]

export const ordersService = {
  async getOrders(): Promise<Order[]> {
    return Promise.resolve([...mockOrders])
  },

  async getOrderById(id: string): Promise<Order | undefined> {
    return Promise.resolve(mockOrders.find(o => o.id === id))
  },
}
