import { supabase } from './supabase'

export interface CatalogProduct {
  id: string
  code: string
  name: string
  category: string
  price: number
  stock: number
  status: 'Disponible' | 'Bajo Stock' | 'Agotado'
  imageUrl: string
  especificaciones_tecnicas?: Record<string, any>
  created_at?: string
  updated_at?: string
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
    especificaciones_tecnicas: {
      diametro: '2 pulgadas',
      material: 'Acero Inoxidable 316',
      presion_maxima_psi: 600,
      temperatura_maxima_c: 250,
      tipo_conexion: 'Bridada ANSI 150'
    }
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
    especificaciones_tecnicas: {
      rango_presion_bar: '0-400',
      salida: '4-20 mA',
      voltaje_operacion_vcc: 24,
      rosca: '1/4 NPT macho',
      precision_porcentaje: 0.5
    }
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
    especificaciones_tecnicas: {
      potencia_hp: 7.5,
      caudal_lpm: 350,
      voltaje_v: '220/440 trifásico',
      material_impulsor: 'Bronce fosforado',
      rpm: 3450
    }
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
    especificaciones_tecnicas: {
      eficiencia_micras: 5,
      flujo_maximo_cfm: 120,
      puertos: '1/2 NPT',
      presion_trabajo_psi: 150
    }
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
    especificaciones_tecnicas: {
      pantalla: 'LCD 4 digitos retroiluminada',
      unidades: ['psi', 'bar', 'kPa', 'kg/cm2'],
      bateria: '9V alcalina',
      proteccion: 'IP65'
    }
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
    especificaciones_tecnicas: {
      diametro_interno: '1/2 pulgada',
      longitud_metros: 15,
      refuerzo: 'Doble malla de acero',
      rango_temperatura_c: '-40 a +150'
    }
  },
]

export const catalogService = {
  async getProducts(): Promise<CatalogProduct[]> {
    try {
      const { data, error } = await supabase
        .from('productos')
        .select('*')
        .order('codigo', { ascending: true })

      if (error || !data || data.length === 0) {
        return [...mockProducts]
      }

      return data.map((item: any) => ({
        id: item.id,
        code: item.codigo,
        name: item.nombre,
        category: item.categoria,
        price: Number(item.precio),
        stock: item.stock,
        status: item.estado as CatalogProduct['status'],
        imageUrl: item.imagen_url || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300&auto=format&fit=crop&q=80',
        especificaciones_tecnicas: item.especificaciones_tecnicas || {},
        created_at: item.created_at,
        updated_at: item.updated_at,
      }))
    } catch {
      return [...mockProducts]
    }
  },
}
