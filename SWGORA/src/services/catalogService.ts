export interface CatalogProduct {
  id: string
  code: string
  name: string
  category: string
  price: number
  stock: number
  status: 'Disponible' | 'Bajo Stock' | 'Agotado'
  imageUrl: string
}

const mockProducts: CatalogProduct[] = [
  {
    id: 'p-1',
    code: 'PROD-101',
    name: 'Válvula de Control Industrial 2"',
    category: 'Válvulas y Control',
    price: 3450.00,
    stock: 45,
    status: 'Disponible',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'p-2',
    code: 'PROD-102',
    name: 'Sensor de Presión Hidráulica',
    category: 'Instrumentación',
    price: 1890.50,
    stock: 6,
    status: 'Bajo Stock',
    imageUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'p-3',
    code: 'PROD-103',
    name: 'Bomba Centrífuga de Alta Presión',
    category: 'Bombas y Motores',
    price: 12800.00,
    stock: 12,
    status: 'Disponible',
    imageUrl: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'p-4',
    code: 'PROD-104',
    name: 'Filtro de Aire Compresor Heavy Duty',
    category: 'Filtros y Mantenimiento',
    price: 640.00,
    stock: 0,
    status: 'Agotado',
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'p-5',
    code: 'PROD-105',
    name: 'Manómetro Digital de Precisión',
    category: 'Instrumentación',
    price: 920.00,
    stock: 28,
    status: 'Disponible',
    imageUrl: 'https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'p-6',
    code: 'PROD-106',
    name: 'Manguera de Alta Temperatura Reforzada',
    category: 'Accesorios',
    price: 430.00,
    stock: 80,
    status: 'Disponible',
    imageUrl: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=300&auto=format&fit=crop&q=80',
  },
]

export const catalogService = {
  async getProducts(): Promise<CatalogProduct[]> {
    return Promise.resolve([...mockProducts])
  },
}
