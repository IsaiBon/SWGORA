-- Migración: Crear tabla clientes
CREATE TABLE IF NOT EXISTS public.clientes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT NOT NULL,
    telefono TEXT,
    direccion TEXT,
    taller TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;

-- Política de acceso para clientes
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'clientes' AND policyname = 'Permitir acceso completo a clientes'
    ) THEN
        CREATE POLICY "Permitir acceso completo a clientes"
        ON public.clientes
        FOR ALL
        TO anon, authenticated
        USING (true)
        WITH CHECK (true);
    END IF;
END
$$;

-- Índices recomendados
CREATE INDEX IF NOT EXISTS idx_clientes_nombre ON public.clientes (nombre);
CREATE INDEX IF NOT EXISTS idx_clientes_taller ON public.clientes (taller);
