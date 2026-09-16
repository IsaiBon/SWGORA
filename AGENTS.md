# SWGORA - Contexto del Proyecto y Reglas para Agentes (AGENTS.md)

Este documento proporciona el contexto arquitectónico, técnico y operativo del proyecto **SWGORA** para agentes de IA (Antigravity / Gemini) y desarrolladores.

---

## 1. Visión General del Proyecto
- **Nombre**: SWGORA
- **Repositorio**: [https://github.com/IsaiBon/SWGORA](https://github.com/IsaiBon/SWGORA)
- **Rama principal**: `main`
- **Descripción**: Sistema web de gestión operativa y administrativa (órdenes, catálogo, clientes, talleres) desarrollado como una Single Page Application (SPA).

---

## 2. Stack Tecnológico

### Frontend
- **Framework**: [Vue 3](https://vuejs.org/) con Composition API y `<script setup lang="ts">`
- **Herramienta de compilación**: [Vite](https://vitejs.dev/)
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/) (con verificación mediante `vue-tsc`)
- **Estilos**: [Tailwind CSS](https://tailwindcss.com/) + PostCSS + Autoprefixer
- **Enrutamiento**: [Vue Router 4](https://router.vuejs.org/)
- **Estado global**: [Pinia](https://pinia.vuejs.org/)
- **Iconografía**: [lucide-vue-next](https://lucide.dev/)

### Backend & Base de Datos
- **Proveedor**: [Supabase](https://supabase.com/) (PostgreSQL 17)
- **Cliente SDK**: `@supabase/supabase-js`
- **Proyecto Supabase**: `SWGORA` (`ahfnuegsdmnjelcypitk`)
- **Control de versiones de BD**: Migraciones SQL en `supabase/migrations/`

---

## 3. Estructura de Directorios

```text
SWGORA/
├── .agents/                    # Configuraciones y reglas del agente
├── public/                     # Recursos estáticos
├── src/
│   ├── assets/                 # Imágenes, estilos globales
│   ├── components/             # Componentes Vue reutilizables (Navbar, Sidebar, etc.)
│   ├── composables/            # Funciones de lógica reutilizable (Vue Composables)
│   ├── layouts/                # Layouts de vistas
│   ├── router/                 # Configuración de Vue Router
│   ├── services/               # Servicios de conexión API y Supabase
│   │   ├── supabase.ts         # Inicialización del cliente Supabase
│   │   ├── clientesService.ts  # Operaciones CRUD para 'clientes'
│   │   ├── catalogService.ts   # Catálogo de productos
│   │   └── ordersService.ts    # Gestión de órdenes
│   ├── stores/                 # Stores de Pinia
│   ├── views/                  # Vistas principales (Dashboard, etc.)
│   ├── App.vue                 # Componente raíz
│   ├── main.ts                 # Punto de entrada de la aplicación
│   └── style.css               # Estilos Tailwind y personalizaciones
├── supabase/
│   └── migrations/             # Scripts SQL de migraciones versionadas
├── .env                        # Variables de entorno locales (VITE_SUPABASE_URL, etc.)
├── .env.example                # Plantilla de variables de entorno
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 4. Esquema de Base de Datos (Supabase)

### Tabla `public.clientes`
- `id`: `UUID PRIMARY KEY DEFAULT gen_random_uuid()`
- `nombre`: `TEXT NOT NULL`
- `telefono`: `TEXT` (nullable)
- `direccion`: `TEXT` (nullable)
- `taller`: `TEXT` (nullable)
- `especificaciones_tecnicas`: `JSONB NOT NULL DEFAULT '{}'::jsonb` (atributos dinámicos técnicos y de maquinaria)
- `created_at`: `TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())`
- `updated_at`: `TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())`
- **Seguridad**: RLS habilitado con política para roles `anon` y `authenticated`.
- **Índices**: `idx_clientes_nombre`, `idx_clientes_taller`, y GIN `idx_clientes_especificaciones_tecnicas`.
- **Triggers**: `set_clientes_updated_at` (`BEFORE UPDATE`).

### Tabla `public.perfiles`
- `id`: `UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE`
- `nombre`: `TEXT NOT NULL`
- `email`: `TEXT NOT NULL`
- `rol`: `TEXT NOT NULL DEFAULT 'operador'` (roles soportados: `admin`, `supervisor`, `tecnico`, `operador`, `cliente`)
- `avatar_url`: `TEXT` (nullable)
- `created_at`: `TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())`
- `updated_at`: `TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())`
- **Seguridad**: RLS habilitado con políticas de lectura a usuarios autenticados e inserción/actualización de perfil propio.
- **Trigger**: `on_auth_user_created` en `auth.users` y `set_perfiles_updated_at` (`BEFORE UPDATE`).

### Tabla `public.productos`
- `id`: `UUID PRIMARY KEY DEFAULT gen_random_uuid()`
- `codigo`: `TEXT UNIQUE NOT NULL`
- `nombre`: `TEXT NOT NULL`
- `categoria`: `TEXT NOT NULL`
- `precio`: `NUMERIC(12, 2) NOT NULL DEFAULT 0.00`
- `stock`: `INTEGER NOT NULL DEFAULT 0`
- `estado`: `TEXT NOT NULL DEFAULT 'Disponible'`
- `imagen_url`: `TEXT` (nullable)
- `especificaciones_tecnicas`: `JSONB NOT NULL DEFAULT '{}'::jsonb` (atributos técnicos variables: material, presión, voltaje, etc.)
- `created_at`: `TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())`
- `updated_at`: `TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())`
- **Seguridad**: RLS habilitado con políticas de lectura a `anon` y `authenticated`, y modificación a `authenticated`.
- **Índices**: B-tree sobre `codigo`, `categoria`; y GIN `idx_productos_especificaciones_tecnicas` sobre `especificaciones_tecnicas`.
- **Triggers**: `set_productos_updated_at` (`BEFORE UPDATE`) ejecutando `public.update_updated_at_column()`.

---

## 5. Convenciones y Reglas de Desarrollo

1. **Gestión de Git / GitHub**:
   - **Regla mandatoria**: Cada vez que se completen cambios o nuevas funcionalidades, realizar **commit** descriptivo y **push a GitHub** (`git push origin main`).
2. **Sistema Operativo y Terminal**:
   - En entornos Windows PowerShell, usar `npm.cmd` en lugar de `npm` si aplican políticas de ejecución de scripts de PowerShell.
   - Usar `;` como separador de comandos en PowerShell en lugar de `&&`.
3. **TypeScript**:
   - Mantener tipado estricto. No usar `any` implícito ni importar archivos `.js` sin tipos si pueden ser `.ts`.
   - Validar la compilación con `npm.cmd run build` antes de realizar commits.
4. **Base de Datos y Migraciones**:
   - Cualquier cambio DDL (tablas, columnas, políticas RLS) debe registrarse en `supabase/migrations/<timestamp>_<nombre>.sql` y aplicarse en Supabase.
   - Nombres de tablas y columnas en minúsculas y snake_case sin acentos (`telefono`, `direccion`).
