import React from 'react';
import { Heart, Database, Shield } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';

interface FooterProps {
  onOpenSupabaseGuide: () => void;
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenSupabaseGuide, onNavigate }) => {
  return (
    <footer className="mt-20 border-t border-[#D7C8A5]/40 bg-white/40 text-xs text-[#1E1E1E]/70 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Brand & mission */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-xl font-bold tracking-tight text-[#503250]">
                SERES
              </span>
              <span className="text-xs text-[#A06446] font-medium">
                Centro de Masajes y Terapias Integrativas
              </span>
            </div>
            <p className="text-xs text-[#1E1E1E]/70 leading-relaxed max-w-sm">
              Un espacio sereno para conectar cuerpo, respiración y vivencia cotidiana. Fomentamos la escucha, la presencia y el autocuidado sin juicios.
            </p>
          </div>

          {/* Quick links */}
          <div className="md:col-span-3 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#503250]">
              Espacios del Centro
            </span>
            <ul className="space-y-1.5 text-xs text-[#1E1E1E]/80">
              <li>
                <button onClick={() => onNavigate('inicio')} className="hover:text-[#503250] transition-colors">
                  Inicio y Experiencia
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('sesiones')} className="hover:text-[#503250] transition-colors">
                  Mis Sesiones y Bonos
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('autocuidado')} className="hover:text-[#503250] transition-colors">
                  Biblioteca de Autocuidado
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('guia-diaria')} className="hover:text-[#503250] transition-colors">
                  Guía Diaria
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('espacio-personal')} className="hover:text-[#503250] transition-colors">
                  Mi Espacio Personal
                </button>
              </li>
            </ul>
          </div>

          {/* Technical & Ethical governance */}
          <div className="md:col-span-4 space-y-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#503250]">
              Infraestructura & Seguridad
            </span>
            <p className="text-[11px] text-[#1E1E1E]/65 leading-relaxed">
              Base de datos relacional PostgreSQL con políticas RLS de acceso exclusivo por cliente. Sin claves de servicio expuestas.
            </p>
            <div className="pt-1">
              <button
                onClick={onOpenSupabaseGuide}
                className="inline-flex items-center gap-1.5 text-xs text-[#503250] font-semibold hover:text-[#BE6E55] transition-colors underline"
              >
                <Database className="w-3.5 h-3.5" />
                <span>Ver estado de conexión Supabase y guía Vercel</span>
              </button>
            </div>
          </div>

        </div>

        <div className="pt-6 border-t border-[#503250]/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#1E1E1E]/55">
          <p>
            © {new Date().getFullYear()} SERES · Todos los derechos reservados.
          </p>
          <p className="flex items-center gap-1">
            <span>Diseñado con cuidado y presencia para el bienestar humano.</span>
          </p>
        </div>

      </div>
    </footer>
  );
};
