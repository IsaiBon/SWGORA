-- ==============================================================================
-- MIGRACIÓN: Gestión Integral de Clientes (Sprint 3)
-- Archivo: 20260923010000_update_clientes_cedula_tipo_estado.sql
-- Propósito: Agregar columnas cedula, tipo y estado a tabla clientes con checks,
--            soporte de borrado lógico e índices B-tree optimizados.
-- ==============================================================================

-- 1. Agregar columna cedula (identificación / documento de identidad)
ALTER TABLE public.clientes
ADD COLUMN IF NOT EXISTS cedula TEXT;

-- 2. Agregar columna tipo (Cliente o Tallerista) con valor por defecto
ALTER TABLE public.clientes
ADD COLUMN IF NOT EXISTS tipo TEXT NOT NULL DEFAULT 'Cliente';

-- 3. Agregar columna estado (Activo o Inactivo para borrado lógico)
ALTER TABLE public.clientes
ADD COLUMN IF NOT EXISTS estado TEXT NOT NULL DEFAULT 'Activo';

-- 4. Asegurar columna especificaciones_tecnicas (JSONB) para compatibilidad
ALTER TABLE public.clientes
ADD COLUMN IF NOT EXISTS especificaciones_tecnicas JSONB NOT NULL DEFAULT '{}'::jsonb;

-- 5. Asegurar columna updated_at
ALTER TABLE public.clientes
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now());

-- ==============================================================================
-- RESTRICCIONES DE INTEGRIDAD Y REGLAS DE ENTRADA (CHECK CONSTRAINTS)
-- ==============================================================================

-- Restricción para tipo: Solo 'Cliente' o 'Tallerista'
ALTER TABLE public.clientes
DROP CONSTRAINT IF EXISTS clientes_tipo_check;

ALTER TABLE public.clientes
ADD CONSTRAINT clientes_tipo_check
CHECK (tipo IN ('Cliente', 'Tallerista'));

-- Restricción para estado: Solo 'Activo' o 'Inactivo' (Borrado lógico)
ALTER TABLE public.clientes
DROP CONSTRAINT IF EXISTS clientes_estado_check;

ALTER TABLE public.clientes
ADD CONSTRAINT clientes_estado_check
CHECK (estado IN ('Activo', 'Inactivo'));

-- ==============================================================================
-- ÍNDICES B-TREE OPTIMIZADOS PARA CONSULTAS FRECUENTES
-- ==============================================================================

-- Índice B-tree para búsqueda por documento/cédula
CREATE INDEX IF NOT EXISTS idx_clientes_cedula
ON public.clientes (cedula);

-- Índice único condicional: garantiza unicidad de cédula sin impedir nulos o vacíos
CREATE UNIQUE INDEX IF NOT EXISTS idx_clientes_cedula_unique
ON public.clientes (cedula)
WHERE cedula IS NOT NULL AND cedula <> '';

-- Índice B-tree para filtro por tipo de cliente
CREATE INDEX IF NOT EXISTS idx_clientes_tipo
ON public.clientes (tipo);

-- Índice B-tree para filtro por estado (borrado lógico)
CREATE INDEX IF NOT EXISTS idx_clientes_estado
ON public.clientes (estado);

-- Índice compuesto para consultas que filtran estado y tipo simultáneamente
CREATE INDEX IF NOT EXISTS idx_clientes_estado_tipo
ON public.clientes (estado, tipo);

-- Índices para búsqueda por nombre y teléfono
CREATE INDEX IF NOT EXISTS idx_clientes_nombre
ON public.clientes (nombre);

CREATE INDEX IF NOT EXISTS idx_clientes_telefono
ON public.clientes (telefono);

-- Comentarios descriptivos de la tabla y columnas
COMMENT ON COLUMN public.clientes.cedula IS 'Documento de identidad o cédula tributaria del cliente o tallerista';
COMMENT ON COLUMN public.clientes.tipo IS 'Clasificación del contacto: Cliente particular/empresa o Tallerista asociado';
COMMENT ON COLUMN public.clientes.estado IS 'Estado del registro: Activo o Inactivo (Borrado Lógico para preservar historial)';
