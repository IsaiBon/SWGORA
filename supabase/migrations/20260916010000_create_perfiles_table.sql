-- Migración: Crear tabla perfiles vinculada a auth.users
CREATE TABLE IF NOT EXISTS public.perfiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    nombre TEXT NOT NULL,
    email TEXT NOT NULL,
    rol TEXT NOT NULL DEFAULT 'operador',
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.perfiles ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS
DO $$
BEGIN
    -- Permitir lectura a usuarios autenticados
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'perfiles' AND policyname = 'Permitir lectura de perfiles a usuarios autenticados'
    ) THEN
        CREATE POLICY "Permitir lectura de perfiles a usuarios autenticados"
        ON public.perfiles
        FOR SELECT
        TO authenticated
        USING (true);
    END IF;

    -- Permitir al usuario actualizar su propio perfil
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'perfiles' AND policyname = 'Permitir actualizar propio perfil'
    ) THEN
        CREATE POLICY "Permitir actualizar propio perfil"
        ON public.perfiles
        FOR UPDATE
        TO authenticated
        USING (auth.uid() = id)
        WITH CHECK (auth.uid() = id);
    END IF;

    -- Permitir insertar perfil propio
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'perfiles' AND policyname = 'Permitir insercion de propio perfil'
    ) THEN
        CREATE POLICY "Permitir insercion de propio perfil"
        ON public.perfiles
        FOR INSERT
        TO authenticated
        WITH CHECK (auth.uid() = id);
    END IF;
END
$$;

-- Trigger para crear automáticamente el perfil al registrarse un usuario en auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.perfiles (id, nombre, email, rol, avatar_url)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'role', 'operador'),
        NEW.raw_user_meta_data->>'avatar_url'
    )
    ON CONFLICT (id) DO UPDATE SET
        nombre = EXCLUDED.nombre,
        email = EXCLUDED.email;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Sincronizar usuarios existentes previamente registrados en auth.users
INSERT INTO public.perfiles (id, nombre, email, rol)
SELECT 
    id, 
    COALESCE(raw_user_meta_data->>'name', split_part(email, '@', 1)), 
    email, 
    COALESCE(raw_user_meta_data->>'role', 'operador')
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- Índices recomendados
CREATE INDEX IF NOT EXISTS idx_perfiles_email ON public.perfiles (email);
CREATE INDEX IF NOT EXISTS idx_perfiles_rol ON public.perfiles (rol);
