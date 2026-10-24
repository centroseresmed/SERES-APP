-- ============================================================================
-- SERES - Centro de Masajes y Terapias Integrativas
-- Esquema de Base de Datos PostgreSQL / Supabase y Políticas RLS
-- ============================================================================

-- 1. EXTENSIONES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLA DE PERFILES (profiles)
-- Vinculada directamente con auth.users de Supabase
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. TABLA DE PAQUETES (packages)
-- Gestionada por administración; clientes tienen solo lectura de sus paquetes
CREATE TABLE IF NOT EXISTS public.packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    name TEXT NOT NULL,
    service_type TEXT NOT NULL,
    total_sessions INTEGER NOT NULL CHECK (total_sessions > 0),
    sessions_used INTEGER NOT NULL DEFAULT 0 CHECK (sessions_used >= 0 AND sessions_used <= total_sessions),
    purchase_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'expired')),
    expires_at DATE,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. TABLA DE MOVIMIENTOS DE PAQUETES (package_movements)
-- Registro auditable e inmutable de cada descuento o ajuste de sesión
CREATE TABLE IF NOT EXISTS public.package_movements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    package_id UUID NOT NULL REFERENCES public.packages(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    change_amount INTEGER NOT NULL, -- Ej: -1 por asistencia consumida, +1 por corrección justificada
    reason TEXT NOT NULL,
    recorded_by UUID NOT NULL REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. TABLA DE SESIONES Y ASISTENCIAS (sessions)
-- Registro de sesiones realizadas, terapeutas asignadas y asistencia
CREATE TABLE IF NOT EXISTS public.sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    therapist_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    package_id UUID REFERENCES public.packages(id) ON DELETE SET NULL,
    service_name TEXT NOT NULL,
    session_date TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'rescheduled')),
    session_number_in_package INTEGER,
    administrative_notes TEXT, -- Observaciones no sensibles ni diagnósticas
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. TABLA DE NOTAS PERSONALES (personal_notes)
-- ESTRICTAMENTE PRIVADAS PARA EL CLIENTE: NINGÚN ADMINISTRADOR PUEDE LEERLAS
CREATE TABLE IF NOT EXISTS public.personal_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    session_id UUID REFERENCES public.sessions(id) ON DELETE SET NULL,
    title TEXT,
    reflections TEXT NOT NULL,
    learnings TEXT,
    questions_to_explore TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. TABLA DE RECURSOS DE AUTOCUIDADO (self_care_resources)
-- Biblioteca de movilidad, respiración, meditación, etc.
CREATE TABLE IF NOT EXISTS public.self_care_resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL CHECK (category IN (
        'movement', 'breathing', 'body_connection', 
        'emotional_awareness', 'meditation', 'conscious_pauses', 'daily_care'
    )),
    description TEXT NOT NULL,
    practical_goal TEXT NOT NULL,
    approx_duration_minutes INTEGER NOT NULL DEFAULT 5,
    step_by_step_instructions TEXT[] NOT NULL DEFAULT '{}',
    precautions TEXT,
    tags TEXT[] NOT NULL DEFAULT '{}',
    image_url TEXT,
    audio_url TEXT,
    integration_question TEXT,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. TABLA DE SERVICIOS Y ENCUENTROS (services_and_gatherings)
CREATE TABLE IF NOT EXISTS public.services_and_gatherings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    item_type TEXT NOT NULL CHECK (item_type IN ('service', 'gathering')),
    description TEXT NOT NULL,
    duration_text TEXT,
    price_text TEXT,
    scheduled_at TIMESTAMPTZ,
    image_url TEXT,
    contact_action_url TEXT,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 9. TABLA DE PREPARACIÓN PARA PROGRAMA DE REFERIDOS (referral_leads)
-- Preparación arquitectónica futura sin reglas comerciales automáticas
CREATE TABLE IF NOT EXISTS public.referral_leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    referrer_client_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    referred_name TEXT NOT NULL,
    referred_contact TEXT,
    status TEXT NOT NULL DEFAULT 'registered' CHECK (status IN ('registered', 'contacted', 'session_completed', 'reward_pending', 'reward_claimed')),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ============================================================================
-- ACTIVACIÓN DE ROW LEVEL SECURITY (RLS) EN TODAS LAS TABLAS
-- ============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.package_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personal_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.self_care_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services_and_gatherings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_leads ENABLE ROW LEVEL SECURITY;

-- FUNCIÓN AUXILIAR DE SEGURIDAD: VERIFICAR SI EL USUARIO ES ADMIN
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- POLÍTICAS: profiles
CREATE POLICY "Los usuarios pueden ver su propio perfil"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Los administradores pueden ver todos los perfiles"
    ON public.profiles FOR SELECT
    USING (public.is_admin());

CREATE POLICY "Los usuarios pueden actualizar su propio perfil basico"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id AND role = (SELECT role FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Los administradores pueden gestionar perfiles"
    ON public.profiles FOR ALL
    USING (public.is_admin());

-- POLÍTICAS: packages
CREATE POLICY "Clientes pueden ver únicamente sus paquetes"
    ON public.packages FOR SELECT
    USING (auth.uid() = client_id);

CREATE POLICY "Administradores tienen control total de paquetes"
    ON public.packages FOR ALL
    USING (public.is_admin());

-- POLÍTICAS: package_movements
CREATE POLICY "Clientes pueden ver movimientos de sus propios paquetes"
    ON public.package_movements FOR SELECT
    USING (auth.uid() = client_id);

CREATE POLICY "Administradores pueden insertar y auditar movimientos"
    ON public.package_movements FOR ALL
    USING (public.is_admin());

-- POLÍTICAS: sessions
CREATE POLICY "Clientes pueden ver solo sus sesiones"
    ON public.sessions FOR SELECT
    USING (auth.uid() = client_id);

CREATE POLICY "Administradores y terapeutas gestionan sesiones"
    ON public.sessions FOR ALL
    USING (public.is_admin());

-- POLÍTICAS: personal_notes (ESTRICTA PRIVACIDAD DEL CLIENTE)
-- Ni siquiera los administradores pueden leer las notas personales de un cliente
CREATE POLICY "Cliente tiene acceso exclusivo a sus notas personales"
    ON public.personal_notes FOR ALL
    USING (auth.uid() = client_id)
    WITH CHECK (auth.uid() = client_id);

-- POLÍTICAS: self_care_resources
CREATE POLICY "Recursos publicados son legibles por cualquier usuario autenticado"
    ON public.self_care_resources FOR SELECT
    USING (is_published = true OR public.is_admin());

CREATE POLICY "Administradores pueden gestionar biblioteca de autocuidado"
    ON public.self_care_resources FOR ALL
    USING (public.is_admin());

-- POLÍTICAS: services_and_gatherings
CREATE POLICY "Servicios publicados son visibles por todos"
    ON public.services_and_gatherings FOR SELECT
    USING (is_published = true OR public.is_admin());

CREATE POLICY "Administradores pueden gestionar servicios y encuentros"
    ON public.services_and_gatherings FOR ALL
    USING (public.is_admin());

-- POLÍTICAS: referral_leads
CREATE POLICY "Clientes pueden ver referidos que hayan registrado"
    ON public.referral_leads FOR SELECT
    USING (auth.uid() = referrer_client_id);

CREATE POLICY "Clientes pueden registrar un nuevo referido"
    ON public.referral_leads FOR INSERT
    WITH CHECK (auth.uid() = referrer_client_id);

CREATE POLICY "Administradores pueden gestionar y auditar el programa de referidos"
    ON public.referral_leads FOR ALL
    USING (public.is_admin());

-- TRIGGER PARA NUEVOS USUARIOS DE AUTH A PROFILES
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'full_name', 'Usuario SERES'),
        'client' -- Todo registro público entra como cliente por seguridad
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
