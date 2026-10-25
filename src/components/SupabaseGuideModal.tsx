import React, { useState } from 'react';
import { X, Database, ShieldCheck, CheckCircle2, Copy, AlertTriangle, Key, ExternalLink, Sparkles, BookOpen } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';

interface SupabaseGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseGuideModal: React.FC<SupabaseGuideModalProps> = ({ isOpen, onClose }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'guia_pdf' | 'sql' | 'compartir' | 'limites'>('guia_pdf');

  if (!isOpen) return null;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-3xl bg-[#F5F0E6] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#D7C8A5]/60 relative max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#503250]/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#503250]/10 text-[#503250]">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-[#503250]">Guía Paso a Paso (Alineada con tu Guía del Estudiante)</h3>
                {isSupabaseConfigured ? (
                  <span className="text-[11px] font-medium text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Conectado con Supabase
                  </span>
                ) : (
                  <span className="text-[11px] font-medium text-[#A06446] bg-[#A06446]/10 px-2 py-0.5 rounded-full">
                    Modo Activo Local
                  </span>
                )}
              </div>
              <p className="text-xs text-[#1E1E1E]/70 mt-0.5">
                Explicación sencilla para conectar Supabase con Vercel y tener tu enlace oficial
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
            onClick={() => setActiveTab('guia_pdf')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
              activeTab === 'guia_pdf' ? 'bg-[#503250] text-[#F5F0E6]' : 'text-[#503250]/70 hover:bg-[#503250]/5'
            }`}
          >
            1. Pasos de tu Guía (Vercel + Supabase)
          </button>
          <button
            onClick={() => setActiveTab('compartir')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
              activeTab === 'compartir' ? 'bg-[#503250] text-[#F5F0E6]' : 'text-[#503250]/70 hover:bg-[#503250]/5'
            }`}
          >
            2. Cómo Compartir tu App en Vivo
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
              activeTab === 'sql' ? 'bg-[#503250] text-[#F5F0E6]' : 'text-[#503250]/70 hover:bg-[#503250]/5'
            }`}
          >
            3. Tablas de SERES (SQL)
          </button>
          <button
            onClick={() => setActiveTab('limites')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
              activeTab === 'limites' ? 'bg-[#503250] text-[#F5F0E6]' : 'text-[#503250]/70 hover:bg-[#503250]/5'
            }`}
          >
            4. Límites Gratuitos
          </button>
        </div>

        {/* Tab Contents */}
        <div className="mt-4 overflow-y-auto pr-1 text-sm text-[#1E1E1E]/85 space-y-4 flex-1">
          
          {activeTab === 'guia_pdf' && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-950 text-xs leading-relaxed">
                <strong>💡 Tu guía del estudiante tiene la opción más fácil:</strong><br />
                En lugar de copiar y pegar códigos raros a mano, tu guía explica la <strong>Opción A (automática)</strong> usando la tienda de integraciones de Vercel. Nuestra app ya está programada para reconocer automáticamente esas variables.
              </div>

              <div className="p-4 bg-white/70 rounded-2xl border border-[#D7C8A5]/40 space-y-1">
                <h4 className="font-semibold text-[#503250] flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#503250] text-white text-xs flex items-center justify-center">1</span>
                  Paso 5 de tu Guía: Guardar el código en GitHub
                </h4>
                <p className="text-xs text-[#1E1E1E]/75">
                  En Google AI Studio, en la esquina superior derecha o en el menú de opciones (los tres puntos <strong>···</strong> o ícono de GitHub), busca el botón <strong>"Export to GitHub"</strong> o <strong>"Push to GitHub"</strong>. Escribe un nombre como <code className="bg-[#EBE4D5] px-1 rounded font-mono">seres-app</code> y dale a Create/Push.
                </p>
              </div>

              <div className="p-4 bg-white/70 rounded-2xl border border-[#D7C8A5]/40 space-y-1">
                <h4 className="font-semibold text-[#503250] flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#503250] text-white text-xs flex items-center justify-center">2</span>
                  Paso 6 y 7 de tu Guía: Cuentas en Vercel y Supabase con GitHub
                </h4>
                <p className="text-xs text-[#1E1E1E]/75">
                  Entra a <strong>vercel.com</strong> y <strong>supabase.com</strong> eligiendo en ambas <em>"Continue with GitHub"</em>. En Supabase crea un nuevo proyecto (ej. <code className="bg-[#EBE4D5] px-1 rounded font-mono">seres-db</code>).
                </p>
              </div>

              <div className="p-4 bg-white/70 rounded-2xl border border-[#D7C8A5]/40 space-y-1">
                <h4 className="font-semibold text-[#503250] flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#503250] text-white text-xs flex items-center justify-center">3</span>
                  Paso 8 de tu Guía: Conectar Supabase con Vercel (Opción A Automática)
                </h4>
                <p className="text-xs text-[#1E1E1E]/75">
                  En el panel de Vercel, ve a <strong>Integrations</strong> (o Marketplace), busca <strong>Supabase</strong>, dale a <strong>"Add Integration"</strong>, selecciona tu proyecto de Vercel y tu proyecto de Supabase y dale a <strong>"Connect"</strong>. ¡Vercel conecta todo solo!
                </p>
              </div>

              <div className="p-4 bg-white/70 rounded-2xl border border-[#D7C8A5]/40 space-y-1">
                <h4 className="font-semibold text-[#503250] flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#503250] text-white text-xs flex items-center justify-center">4</span>
                  Paso 9 y 10: Desplegar y Enlace en Vivo
                </h4>
                <p className="text-xs text-[#1E1E1E]/75">
                  Vercel publicará tu app y te dará tu enlace oficial como <code className="bg-[#EBE4D5] px-1 rounded font-mono">https://seres-app.vercel.app</code> que funciona en cualquier celular o computador.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'compartir' && (
            <div className="space-y-4">
              <div className="p-4 bg-white/80 rounded-2xl border border-[#D7C8A5]/50 space-y-3">
                <div className="flex items-center gap-2 text-[#503250] font-semibold">
                  <Sparkles className="w-5 h-5 text-[#BE6E55]" />
                  <span>Tienes dos formas de compartir tu app ya activa:</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-[#F5F0E6] rounded-xl border border-[#D7C8A5]/40">
                    <span className="font-bold text-[#503250] block mb-1">
                      Opción Rápida (Desde aquí mismo en Google AI Studio):
                    </span>
                    <p className="text-[#1E1E1E]/75 leading-relaxed">
                      El botón <strong>"Compartir App"</strong> que tienes en la cabecera superior copia el enlace público directo que Google Cloud ya ha generado para tu aplicación. Puedes enviarlo por WhatsApp a cualquier persona y abrirá la aplicación completa.
                    </p>
                  </div>

                  <div className="p-3 bg-[#F5F0E6] rounded-xl border border-[#D7C8A5]/40">
                    <span className="font-bold text-[#503250] block mb-1">
                      Opción Definitiva con Vercel (Como explica tu guía):
                    </span>
                    <p className="text-[#1E1E1E]/75 leading-relaxed">
                      Al publicarla en Vercel siguiendo los pasos 5 a 9 de tu PDF, tendrás un enlace personalizado como <strong>https://seres.vercel.app</strong> (e incluso puedes ponerle tu propio dominio web oficial como www.centroseres.com cuando quieras).
                    </p>
                  </div>

                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900">
                    <strong>¿Cómo quitar la barra de prueba?</strong><br />
                    Para que no se vea como una "vista de prueba", puedes ocultar la barra superior haciendo clic en tu foto/nombre de usuario en la esquina superior derecha y seleccionando <em>"Ocultar barra de prueba"</em>. Así la app queda con la presentación final limpia para tus clientes.
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sql' && (
            <div className="space-y-4">
              <div className="p-4 bg-white/70 rounded-2xl border border-[#D7C8A5]/40 space-y-2">
                <h4 className="font-semibold text-[#503250]">¿Por qué SERES necesita el código SQL?</h4>
                <p className="text-xs text-[#1E1E1E]/75 leading-relaxed">
                  En la mini app del curso se guardaban solo tareas sencillas. En SERES cuidamos información valiosa: los bonos de sesiones, los registros de asistencias de tus clientes y las reflexiones privadas. El archivo <code className="bg-[#EBE4D5] px-1 font-mono rounded">supabase/schema.sql</code> crea esas tablas con candados de seguridad (Row Level Security).
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => handleCopy('-- Copiado desde schema.sql de SERES', 'sql')}
                    className="px-4 py-2 bg-[#503250] text-[#F5F0E6] rounded-xl text-xs font-medium hover:bg-[#3d263d] transition-colors flex items-center gap-1.5"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedKey === 'sql' ? '¡Script copiado!' : 'Copiar script SQL para Supabase'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'limites' && (
            <div className="p-4 bg-white/70 rounded-2xl border border-[#D7C8A5]/40 space-y-2 text-xs">
              <h4 className="font-semibold text-[#503250]">Límites 100% gratuitos para tu centro</h4>
              <p className="text-[#1E1E1E]/75">
                Tanto Vercel como Supabase ofrecen cuentas gratis que no te cobrarán nada si sigues las recomendaciones de tu guía:
              </p>
              <ul className="list-disc list-inside space-y-1 text-[#1E1E1E]/70">
                <li>Elige siempre el plan <strong>Hobby</strong> en Vercel y el plan <strong>Free</strong> en Supabase.</li>
                <li>No necesitas ingresar tarjeta de crédito.</li>
                <li>Capacidad para hasta 50,000 clientes activos y cientos de miles de registros de asistencia.</li>
              </ul>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-[#503250]/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#503250] text-[#F5F0E6] rounded-xl text-xs font-medium hover:bg-[#3d263d] transition-colors"
          >
            Entendido
          </button>
        </div>

      </div>
    </div>
  );
};
