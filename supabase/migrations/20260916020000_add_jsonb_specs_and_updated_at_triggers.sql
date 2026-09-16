-- Migración: Atributos dinámicos JSONB, índices GIN y triggers para updated_at
-- Proyecto: SWGORA

-- 1. Función reutilizable para actualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Tabla clientes: añadir especificaciones_tecnicas (JSONB) y updated_at
ALTER TABLE public.clientes 
ADD COLUMN IF NOT EXISTS especificaciones_tecnicas JSONB NOT NULL DEFAULT '{}'::jsonb;

ALTER TABLE public.clientes 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now());

-- Índice GIN para optimizar consultas sobre especificaciones_tecnicas en clientes
CREATE INDEX IF NOT EXISTS idx_clientes_especificaciones_tecnicas 
ON public.clientes USING gin (especificaciones_tecnicas);

-- Trigger para clientes
DROP TRIGGER IF EXISTS set_clientes_updated_at ON public.clientes;
CREATE TRIGGER set_clientes_updated_at
    BEFORE UPDATE ON public.clientes
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- 3. Trigger para perfiles (la columna updated_at ya existe)
DROP TRIGGER IF EXISTS set_perfiles_updated_at ON public.perfiles;
CREATE TRIGGER set_perfiles_updated_at
    BEFORE UPDATE ON public.perfiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- 4. Tabla productos (catálogo con atributos dinámicos y control de timestamps)
CREATE TABLE IF NOT EXISTS public.productos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo TEXT UNIQUE NOT NULL,
    nombre TEXT NOT NULL,
    categoria TEXT NOT NULL,
    precio NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    stock INTEGER NOT NULL DEFAULT 0,
    estado TEXT NOT NULL DEFAULT 'Disponible',
    imagen_url TEXT,
    especificaciones_tecnicas JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.productos ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'productos' AND policyname = 'Permitir lectura de productos a todos los usuarios'
    ) THEN
        CREATE POLICY "Permitir lectura de productos a todos los usuarios"
        ON public.productos
        FOR SELECT
        TO anon, authenticated
        USING (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'productos' AND policyname = 'Permitir modificacion de productos a autenticados'
    ) THEN
        CREATE POLICY "Permitir modificacion de productos a autenticados"
        ON public.productos
        FOR ALL
        TO authenticated
        USING (true)
        WITH CHECK (true);
    END IF;
END
$$;

-- Índice GIN sobre especificaciones_tecnicas de productos
CREATE INDEX IF NOT EXISTS idx_productos_especificaciones_tecnicas 
ON public.productos USING gin (especificaciones_tecnicas);

CREATE INDEX IF NOT EXISTS idx_productos_codigo ON public.productos (codigo);
CREATE INDEX IF NOT EXISTS idx_productos_categoria ON public.productos (categoria);

-- Trigger para productos
DROP TRIGGER IF EXISTS set_productos_updated_at ON public.productos;
CREATE TRIGGER set_productos_updated_at
    BEFORE UPDATE ON public.productos
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- 5. Semilla inicial de productos con especificaciones técnicas
INSERT INTO public.productos (codigo, nombre, categoria, precio, stock, estado, imagen_url, especificaciones_tecnicas)
VALUES 
(
    'PROD-101', 
    'Válvula de Control Industrial 2"', 
    'Válvulas y Control', 
    3450.00, 
    45, 
    'Disponible', 
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300&auto=format&fit=crop&q=80',
    '{"diametro": "2 pulgadas", "material": "Acero Inoxidable 316", "presion_maxima_psi": 600, "temperatura_maxima_c": 250, "tipo_conexion": "Bridada ANSI 150"}'::jsonb
),
(
    'PROD-102', 
    'Sensor de Presión Hidráulica', 
    'Instrumentación', 
    1890.50, 
    6, 
    'Bajo Stock', 
    'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=300&auto=format&fit=crop&q=80',
    '{"rango_presion_bar": "0-400", "salida": "4-20 mA", "voltaje_operacion_vcc": 24, "rosca": "1/4 NPT macho", "precision_porcentaje": 0.5}'::jsonb
),
(
    'PROD-103', 
    'Bomba Centrífuga de Alta Presión', 
    'Bombas y Motores', 
    12800.00, 
    12, 
    'Disponible', 
    'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=300&auto=format&fit=crop&q=80',
    '{"potencia_hp": 7.5, "caudal_lpm": 350, "voltaje_v": "220/440 trifásico", "material_impulsor": "Bronce fosforado", "rpm": 3450}'::jsonb
),
(
    'PROD-104', 
    'Filtro de Aire Compresor Heavy Duty', 
    'Filtros y Mantenimiento', 
    640.00, 
    0, 
    'Agotado', 
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300&auto=format&fit=crop&q=80',
    '{"eficiencia_micras": 5, "flujo_maximo_cfm": 120, "puertos": "1/2 NPT", "presion_trabajo_psi": 150}'::jsonb
),
(
    'PROD-105', 
    'Manómetro Digital de Precisión', 
    'Instrumentación', 
    920.00, 
    28, 
    'Disponible', 
    'https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?w=300&auto=format&fit=crop&q=80',
    '{"pantalla": "LCD 4 digitos retroiluminada", "unidades": ["psi", "bar", "kPa", "kg/cm2"], "bateria": "9V alcalina", "proteccion": "IP65"}'::jsonb
),
(
    'PROD-106', 
    'Manguera de Alta Temperatura Reforzada', 
    'Accesorios', 
    430.00, 
    80, 
    'Disponible', 
    'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=300&auto=format&fit=crop&q=80',
    '{"diametro_interno": "1/2 pulgada", "longitud_metros": 15, "refuerzo": "Doble malla de acero", "rango_temperatura_c": "-40 a +150"}'::jsonb
)
ON CONFLICT (codigo) DO UPDATE SET
    especificaciones_tecnicas = EXCLUDED.especificaciones_tecnicas,
    precio = EXCLUDED.precio,
    stock = EXCLUDED.stock;
