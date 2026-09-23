-- =====================================================
-- ACTUALIZAR TABLA CLIENTES PARA EL NUEVO CRUD
-- =====================================================

-- 1. Agregar cédula / DUI
ALTER TABLE public.clientes
ADD COLUMN IF NOT EXISTS cedula TEXT;

-- 2. Agregar tipo de cliente
ALTER TABLE public.clientes
ADD COLUMN IF NOT EXISTS tipo TEXT NOT NULL DEFAULT 'Cliente';

-- 3. Agregar estado para eliminación lógica
ALTER TABLE public.clientes
ADD COLUMN IF NOT EXISTS estado TEXT NOT NULL DEFAULT 'Activo';

-- 4. La columna "taller" pertenecía al diseño anterior
ALTER TABLE public.clientes
DROP COLUMN IF EXISTS taller;

-- =====================================================
-- VALIDACIONES
-- =====================================================

-- Solo permitimos Cliente o Tallerista
ALTER TABLE public.clientes
DROP CONSTRAINT IF EXISTS clientes_tipo_check;

ALTER TABLE public.clientes
ADD CONSTRAINT clientes_tipo_check
CHECK (tipo IN ('Cliente', 'Tallerista'));

-- Solo permitimos Activo o Inactivo
ALTER TABLE public.clientes
DROP CONSTRAINT IF EXISTS clientes_estado_check;

ALTER TABLE public.clientes
ADD CONSTRAINT clientes_estado_check
CHECK (estado IN ('Activo', 'Inactivo'));

-- =====================================================
-- ÍNDICES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_clientes_cedula
ON public.clientes (cedula);

CREATE INDEX IF NOT EXISTS idx_clientes_tipo
ON public.clientes (tipo);

CREATE INDEX IF NOT EXISTS idx_clientes_estado
ON public.clientes (estado);