import React, { useState } from 'react';
import { X, Database, ShieldCheck, CheckCircle2, Copy, AlertTriangle, Key, ExternalLink } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';

interface SupabaseGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseGuideModal: React.FC<SupabaseGuideModalProps> = ({ isOpen, onClose }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'pasos' | 'seguridad' | 'limites' | 'checklist'>('pasos');

  if (!isOpen) return null;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-3xl bg-[#F5F0E6] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#D7C8A5]/50 relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#503250]/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#503250]/10 text-[#503250]">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-[#503250]">Guía de Configuración Supabase & Vercel</h3>
                {isSupabaseConfigured ? (
                  <span className="text-[11px] font-medium text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Conectado en vivo
                  </span>
                ) : (
                  <span className="text-[11px] font-medium text-[#A06446] bg-[#A06446]/10 px-2 py-0.5 rounded-full">
                    Modo Local Activo (Prueba)
                  </span>
                )}
              </div>
              <p className="text-xs text-[#1E1E1E]/70 mt-0.5">
                Paso a paso en lenguaje claro para vincular tu base de datos gratuita y publicar en Vercel
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#503250]/60 hover:text-[#503250] hover:bg-[#503250]/5 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab selection */}
        <div className="flex border-b border-[#503250]/10 mt-4 overflow-x-auto gap-2 pb-2">
          <button
            onClick={() => setActiveTab('pasos')}
            className={`px-4 py-2 text-xs font-medium rounded-xl whitespace-nowrap transition-all ${
              activeTab === 'pasos' ? 'bg-[#503250] text-[#F5F0E6]' : 'text-[#503250]/70 hover:bg-[#503250]/5'
            }`}
          >
            1. Pasos de Conexión
          </button>
          <button
            onClick={() => setActiveTab('seguridad')}
            className={`px-4 py-2 text-xs font-medium rounded-xl whitespace-nowrap transition-all ${
              activeTab === 'seguridad' ? 'bg-[#503250] text-[#F5F0E6]' : 'text-[#503250]/70 hover:bg-[#503250]/5'
            }`}
          >
            2. Llaves y Seguridad
          </button>
          <button
            onClick={() => setActiveTab('limites')}
            className={`px-4 py-2 text-xs font-medium rounded-xl whitespace-nowrap transition-all ${
              activeTab === 'limites' ? 'bg-[#503250] text-[#F5F0E6]' : 'text-[#503250]/70 hover:bg-[#503250]/5'
            }`}
          >
            3. Límites Gratuitos
          </button>
          <button
            onClick={() => setActiveTab('checklist')}
            className={`px-4 py-2 text-xs font-medium rounded-xl whitespace-nowrap transition-all ${
              activeTab === 'checklist' ? 'bg-[#503250] text-[#F5F0E6]' : 'text-[#503250]/70 hover:bg-[#503250]/5'
            }`}
          >
            4. Pruebas antes de Publicar
          </button>
        </div>

        {/* Tab Contents */}
        <div className="mt-4 overflow-y-auto pr-1 text-sm text-[#1E1E1E]/85 space-y-4 flex-1">
          {activeTab === 'pasos' && (
            <div className="space-y-4">
              <div className="p-4 bg-white/70 rounded-2xl border border-[#D7C8A5]/40">
                <h4 className="font-semibold text-[#503250] flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#503250] text-white text-xs flex items-center justify-center">1</span>
                  Crea tu proyecto gratuito en Supabase
                </h4>
                <p className="text-xs text-[#1E1E1E]/70 mt-1">
                  Ingresa a <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-[#BE6E55] underline inline-flex items-center gap-1 font-medium">supabase.com <ExternalLink className="w-3 h-3 inline" /></a> con tu cuenta y presiona <strong>"New Project"</strong>. Selecciona la región más cercana a tus clientes (por ejemplo, Fráncfort o São Paulo) y define una contraseña segura para tu base de datos.
                </p>
              </div>

              <div className="p-4 bg-white/70 rounded-2xl border border-[#D7C8A5]/40">
                <h4 className="font-semibold text-[#503250] flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#503250] text-white text-xs flex items-center justify-center">2</span>
                  Ejecuta el script SQL de SERES
                </h4>
                <p className="text-xs text-[#1E1E1E]/70 mt-1">
                  En el menú lateral de Supabase, haz clic en <strong>SQL Editor</strong> &rarr; <strong>New query</strong>. Pega todo el contenido del archivo <code className="bg-[#EBE4D5] px-1 py-0.5 rounded text-[#503250]">supabase/schema.sql</code> y haz clic en <strong>"Run"</strong>. Esto creará todas las tablas y políticas de seguridad RLS automáticamente.
                </p>
              </div>

              <div className="p-4 bg-white/70 rounded-2xl border border-[#D7C8A5]/40">
                <h4 className="font-semibold text-[#503250] flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#503250] text-white text-xs flex items-center justify-center">3</span>
                  Copia tu URL y clave Anónima Pública
                </h4>
                <p className="text-xs text-[#1E1E1E]/70 mt-1">
                  En Supabase ve a <strong>Project Settings</strong> &rarr; <strong>API</strong>:
                </p>
                <div className="mt-2 space-y-1.5 text-xs font-mono bg-[#EBE4D5]/60 p-3 rounded-xl border border-[#D7C8A5]/50">
                  <div className="flex items-center justify-between">
                    <span>VITE_SUPABASE_URL = "https://xxxx.supabase.co"</span>
                    <button
                      onClick={() => handleCopy('VITE_SUPABASE_URL', 'url')}
                      className="text-[#503250] text-[10px] hover:underline flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" /> {copiedKey === 'url' ? '¡Copiado!' : 'Copiar nombre'}
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>VITE_SUPABASE_ANON_KEY = "eyJhbGciOi..."</span>
                    <button
                      onClick={() => handleCopy('VITE_SUPABASE_ANON_KEY', 'anon')}
                      className="text-[#503250] text-[10px] hover:underline flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" /> {copiedKey === 'anon' ? '¡Copiado!' : 'Copiar nombre'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white/70 rounded-2xl border border-[#D7C8A5]/40">
                <h4 className="font-semibold text-[#503250] flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#503250] text-white text-xs flex items-center justify-center">4</span>
                  Configura las variables en Vercel
                </h4>
                <p className="text-xs text-[#1E1E1E]/70 mt-1">
                  Cuando subas el código a GitHub y lo conectes con Vercel:
                  <br />
                  En tu proyecto de Vercel ve a <strong>Settings</strong> &rarr; <strong>Environment Variables</strong>. Agrega <code className="bg-[#EBE4D5] px-1 rounded">VITE_SUPABASE_URL</code> y <code className="bg-[#EBE4D5] px-1 rounded">VITE_SUPABASE_ANON_KEY</code> con los valores de Supabase. Luego presiona <strong>Redeploy</strong>.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'seguridad' && (
            <div className="space-y-4">
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900">
                <div className="flex items-center gap-2 font-semibold">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  REGLA DE ORO DE SEGURIDAD
                </div>
                <p className="text-xs mt-1.5 leading-relaxed">
                  <strong>NUNCA</strong> compartas ni incluyas la clave llamada <code className="font-mono bg-amber-100 px-1 py-0.5 rounded">service_role</code> (clave secreta) en el código del navegador, ni en GitHub, ni en chats públicos.
                  La clave <code className="font-mono bg-amber-100 px-1 py-0.5 rounded">service_role</code> salta todas las políticas de seguridad. Solo debes usar la clave <code className="font-mono bg-amber-100 px-1 py-0.5 rounded">anon / public</code>.
                </p>
              </div>

              <div className="p-4 bg-white/70 rounded-2xl border border-[#D7C8A5]/40 space-y-2">
                <h4 className="font-semibold text-[#503250] flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  Privacidad estricta de las notas personales (RLS)
                </h4>
                <p className="text-xs text-[#1E1E1E]/70 leading-relaxed">
                  Las políticas de seguridad <em>Row Level Security (RLS)</em> configuradas en <code className="bg-[#EBE4D5] px-1 rounded">supabase/schema.sql</code> garantizan que cada usuario solo puede consultar y modificar sus propias notas. Ni siquiera una cuenta con rol administrativo puede acceder a las reflexiones personales de un cliente desde la base de datos.
                </p>
              </div>

              <div className="p-4 bg-white/70 rounded-2xl border border-[#D7C8A5]/40 space-y-2">
                <h4 className="font-semibold text-[#503250] flex items-center gap-2">
                  <Key className="w-5 h-5 text-[#503250]" />
                  ¿Cómo crear la primera cuenta administradora de SERES?
                </h4>
                <p className="text-xs text-[#1E1E1E]/70 leading-relaxed">
                  Para que nadie pueda registrarse públicamente como administrador, todos los nuevos registros reciben el rol <code className="bg-[#EBE4D5] px-1 rounded">client</code> por defecto.
                  Para convertir tu cuenta en administradora:
                </p>
                <ol className="list-decimal list-inside text-xs text-[#1E1E1E]/80 space-y-1 pl-1">
                  <li>Regístrate normalmente con tu correo en la aplicación.</li>
                  <li>Entra al <strong>Table Editor</strong> de Supabase en la tabla <code className="bg-[#EBE4D5] px-1 rounded">profiles</code>.</li>
                  <li>Busca tu fila y cambia el campo <code className="bg-[#EBE4D5] px-1 rounded">role</code> de 'client' a <strong>'admin'</strong>.</li>
                </ol>
              </div>
            </div>
          )}

          {activeTab === 'limites' && (
            <div className="space-y-4">
              <div className="p-4 bg-white/70 rounded-2xl border border-[#D7C8A5]/40">
                <h4 className="font-semibold text-[#503250]">Plan Gratuito de Supabase (Free Tier)</h4>
                <ul className="mt-2 space-y-1.5 text-xs text-[#1E1E1E]/75">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <strong>Base de datos PostgreSQL:</strong> 500 MB (suficiente para más de 100,000 sesiones y notas de texto).
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <strong>Usuarios activos mensuales:</strong> Hasta 50,000 usuarios con autenticación.
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <strong>Almacenamiento de archivos (Storage):</strong> 1 GB para imágenes livianas.
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <strong>Tráfico de red:</strong> 5 GB mensuales de transferencia.
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-[#503250]/5 rounded-2xl border border-[#503250]/15">
                <h4 className="font-semibold text-[#503250] text-xs">Recomendaciones para mantenerte siempre en el plan gratis:</h4>
                <ul className="mt-2 space-y-1 text-xs text-[#1E1E1E]/70 list-disc list-inside">
                  <li>No subas videos directamente a la base de datos; enlaza audios o videos en plataformas como YouTube o Vimeo si los necesitas.</li>
                  <li>Las imágenes deben optimizarse en formato WebP o JPEG liviano antes de cargarlas.</li>
                  <li>Supabase pausa proyectos gratuitos inactivos tras 7 días sin uso. Al abrir la app se reactiva con un clic desde el dashboard.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'checklist' && (
            <div className="space-y-3">
              <div className="p-4 bg-white/70 rounded-2xl border border-[#D7C8A5]/40">
                <h4 className="font-semibold text-[#503250] mb-2">Comprobaciones obligatorias antes de abrir a clientes reales:</h4>
                <div className="space-y-2 text-xs">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input type="checkbox" defaultChecked className="mt-0.5 rounded text-[#503250]" />
                    <span><strong>Separación estricta entre clientes:</strong> Se comprobó que Ana María y Carlos solo ven sus propios paquetes y sesiones en el conmutador de personas.</span>
                  </label>
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input type="checkbox" defaultChecked className="mt-0.5 rounded text-[#503250]" />
                    <span><strong>Privacidad de reflexiones:</strong> Se verificó que la administración no tiene pantalla ni acceso a las notas personales de los clientes.</span>
                  </label>
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input type="checkbox" defaultChecked className="mt-0.5 rounded text-[#503250]" />
                    <span><strong>Deducción segura de sesiones:</strong> Las asistencias solo las puede descontar la terapeuta autorizada, generando un registro inmutable.</span>
                  </label>
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input type="checkbox" defaultChecked className="mt-0.5 rounded text-[#503250]" />
                    <span><strong>Corrección auditada:</strong> Si una asistencia se marca por error, se puede revertir con justificación registrada.</span>
                  </label>
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input type="checkbox" defaultChecked className="mt-0.5 rounded text-[#503250]" />
                    <span><strong>Sin secretos en el código:</strong> No hay claves de servicio expuestas en los archivos públicos ni en el repositorio.</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-[#503250]/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#503250] text-[#F5F0E6] rounded-xl text-xs font-medium hover:bg-[#3d263d] transition-colors"
          >
            Entendido y cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
