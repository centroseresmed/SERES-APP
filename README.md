# SERES · Centro de Masajes y Terapias Integrativas

Aplicación web oficial desarrollada para conectar las sesiones presenciales de **SERES** con la vida cotidiana de las personas que asisten a nuestras terapias, consultas y actividades de bienestar.

---

## 🌿 1. Dimensiones de la Aplicación

1. **Mi experiencia en SERES**:
   - Historial personal de masajes y terapias recibidas.
   - Seguimiento en tiempo real de bonos adquiridos, asistencias consumidas y saldo de sesiones disponibles.
   - Historial de movimientos inmutable: cada descuento se realiza tras la asistencia presencial confirmada por la terapeuta.
   - Preparación arquitectónica para el futuro programa de referidos.

2. **Mi espacio de autocuidado**:
   - Biblioteca organizada en 7 categorías: Movimiento y estiramientos, Respiración consciente, Conexión corporal, Acompañamiento emocional, Meditaciones guiadas, Pausas conscientes y Autocuidado cotidiano.
   - Orbe respiratorio interactivo en pantalla con ritmos 4-4 (calma y regulación somática) y 4-7-8 (transición hacia el descanso).
   - Filtros por categoría y duración aproximada.
   - Instrucciones paso a paso, precauciones corporales y preguntas finales de integración.

3. **Mi camino de conciencia**:
   - Espacio íntimo para registrar comprensiones, aprendizajes y sensaciones post-sesión.
   - **Privacidad estricta por diseño (RLS)**: Las notas personales son 100% confidenciales para cada cliente; la administración y terapeutas no pueden leerlas.
   - Invitación y preguntas guía para personas que prefieren llevar su proceso en un cuaderno físico de papel.

4. **Guía diaria de autocuidado**:
   - Acceso inmediato según la necesidad del momento (pausa, tensión en hombros/cuello, escucha emocional, presencia o noche).

5. **Servicios y Encuentros**:
   - Catálogo de terapias integrativas individuales y círculos grupales con contacto directo.

6. **Panel Administrativo y Terapéutico**:
   - Búsqueda y consulta de clientes autorizados.
   - Registro seguro de asistencias con descuento automático de saldo.
   - Alta de nuevos bonos de sesiones.
   - Procedimiento de corrección administrativa justificada y auditada.

---

## 🎨 2. Identidad Visual Oficial de SERES

- **Morado ciruela:** `#503250` (Color principal de marca)
- **Terracota:** `#BE6E55` (Acento cálido y vital)
- **Marrón cálido:** `#A06446` (Secundario orgánico)
- **Marfil:** `#F5F0E6` (Fondo lienzo predominante)
- **Beige dorado:** `#D7C8A5` (Toques sutiles y bordes)
- **Malva:** `#A587A5` (Complementario suave)
- **Negro suave:** `#1E1E1E` (Tipografía de alta legibilidad)
- **Gris claro:** `#F0F0F0` (Superficies de apoyo)

**Tipografías:**
- **Work Sans**: Títulos y elementos de identidad.
- **Inter**: Textos de lectura e interfaz de usuario.

---

## 🔒 3. Seguridad y Base de Datos (Supabase PostgreSQL + RLS)

El esquema completo y las políticas de seguridad están en `supabase/schema.sql`.

### ¿Por qué es seguro?
- **Row Level Security (RLS)** activado en el 100% de las tablas.
- En la tabla `personal_notes`, la política de Supabase restringe la lectura únicamente a `auth.uid() = client_id`. No existe ninguna política que permita a los administradores leer notas ajenas.
- Las asistencias y bonos solo pueden ser modificados por usuarios con rol `admin`.
- Todos los movimientos generan un registro inmutable con fecha, terapeuta responsable y motivo.

---

## 🚀 4. Guía Paso a Paso para Conectar Supabase y Publicar en Vercel

### Paso 1: Crear tu proyecto en Supabase (Gratuito)
1. Ve a [supabase.com](https://supabase.com) y crea tu cuenta gratuita.
2. Haz clic en **"New Project"**. Elige un nombre (ej. `seres-app`) y define una contraseña segura para tu base de datos.
3. En el menú lateral, abre **SQL Editor** &rarr; **New query**.
4. Copia todo el contenido del archivo `supabase/schema.sql` de este repositorio, pégalo en el editor y presiona **"Run"**. ¡Tus tablas y permisos RLS quedarán creados en segundos!

### Paso 2: Obtener las Llaves Públicas de Supabase
1. En tu panel de Supabase ve a **Project Settings** (ícono de engranaje) &rarr; **API**.
2. Copia:
   - **Project URL**: Ejemplo: `https://xyzabcdef.supabase.co`
   - **Project API Keys** &rarr; Clave **`anon` / `public`**: Ejemplo: `eyJhbGciOiJIUzI1NiIsIn...`
3. ⚠️ **IMPORTANTE DE SEGURIDAD**: NUNCA uses la clave `service_role`. Esa clave anula las reglas de seguridad. Solo debes usar la clave pública `anon`.

### Paso 3: Configurar Variables de Entorno
Crea un archivo `.env` en la raíz del proyecto (basado en `.env.example`):
```env
VITE_SUPABASE_URL="https://tu-proyecto.supabase.co"
VITE_SUPABASE_ANON_KEY="tu_clave_anonima_publica_aqui"
```

### Paso 4: Crear la Primera Cuenta Administradora
1. En la aplicación, regístrate con tu correo electrónico.
2. Para asignarte permisos de administración de forma segura:
   - Entra en Supabase a **Table Editor** &rarr; tabla `profiles`.
   - Busca tu fila y cambia el valor de la columna `role` de `'client'` a `'admin'`.
   - ¡Listo! Al recargar la aplicación verás el menú de **Gestión SERES**.

### Paso 5: Despliegue en Vercel
1. Sube tu código a un repositorio de **GitHub**.
2. Ingresa a [vercel.com](https://vercel.com) y selecciona **"Add New Project"** &rarr; importa tu repositorio de GitHub.
3. En la sección **Environment Variables**, añade:
   - Nombre: `VITE_SUPABASE_URL` | Valor: Tu URL de Supabase
   - Nombre: `VITE_SUPABASE_ANON_KEY` | Valor: Tu clave anon pública
4. Presiona **"Deploy"**. Vercel compilará la aplicación y te entregará una URL pública y segura con certificado SSL (HTTPS) gratuito.

---

## 💡 5. Límites del Plan Gratuito (Free Tier)
La aplicación está optimizada para operar dentro de las cuotas gratuitas:
- **Base de datos Supabase:** 500 MB (suficiente para más de 100,000 registros de texto y asistencias).
- **Autenticación Supabase:** Hasta 50,000 usuarios activos mensuales.
- **Hospedaje Vercel:** Ancho de banda y despliegues ilimitados para uso normal.
- **Consejo:** No subas archivos de video pesado directamente a la base de datos; enlaza videos externos en YouTube o Vimeo si los requieres.

---

## 🌿 Principio de Cuidado
*En SERES promovemos la exploración corporal, la presencia somática y el bienestar integral, reconociendo y respetando la singularidad de cada ser, sin emitir diagnósticos médicos ni sustituir la atención sanitaria o psicológica.*
