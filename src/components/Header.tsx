import React, { useState } from 'react';
import { Database, LogOut, ChevronDown, Sparkles, Share2, Check, User, Edit2 } from 'lucide-react';
import { UserProfile } from '../types';
import { dataService } from '../services/dataService';
import { isSupabaseConfigured } from '../lib/supabase';

interface HeaderProps {
  currentUser: UserProfile | null;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenSupabaseGuide: () => void;
  onOpenBreathingPacer: () => void;
  onOpenAuthModal: () => void;
  onOpenEditProfile: () => void;
  showTestingBar: boolean;
  onToggleTestingBar: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  activeTab,
  onTabChange,
  onOpenSupabaseGuide,
  onOpenBreathingPacer,
  onOpenAuthModal,
  onOpenEditProfile,
  showTestingBar,
  onToggleTestingBar,
}) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleShare = () => {
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const navLinks = [
    { id: 'inicio', label: 'Mi Experiencia' },
    { id: 'sesiones', label: 'Sesiones y Bonos' },
    { id: 'autocuidado', label: 'Autocuidado' },
    { id: 'guia-diaria', label: 'Guía Diaria' },
    { id: 'espacio-personal', label: 'Mi Espacio' },
    { id: 'servicios', label: 'Servicios' },
  ];

  if (currentUser?.role === 'admin') {
    navLinks.push({ id: 'admin', label: 'Gestión SERES' });
  }

  return (
    <>
      {/* Top Desktop & Tablet Header */}
      <header className="sticky top-0 z-40 bg-[#F5F0E6]/95 backdrop-blur-md border-b border-[#D7C8A5]/40 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-6">
          
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => onTabChange('inicio')}
            className="flex items-baseline gap-2.5 text-left text-[#503250] whitespace-nowrap shrink-0 group focus:outline-none"
          >
            <span className="font-display text-2xl font-bold tracking-tight text-[#503250] group-hover:text-[#BE6E55] transition-colors">
              SERES
            </span>
            <span className="hidden sm:inline text-xs text-[#A06446] font-medium tracking-wide">
              Terapias Integrativas
            </span>
          </button>

          {/* Zone 2: 4-5 single-line clean navigation links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#1E1E1E]/80">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => onTabChange(link.id)}
                className={`whitespace-nowrap shrink-0 py-1 transition-colors relative ${
                  activeTab === link.id
                    ? 'text-[#503250] font-semibold'
                    : 'text-[#1E1E1E]/70 hover:text-[#503250]'
                }`}
              >
                {link.label}
                {activeTab === link.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#BE6E55] rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Zone 3: 1 primary action area / user controls */}
          <div className="flex items-center gap-2.5 shrink-0">
            
            {/* Share app button */}
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#503250] bg-white/80 hover:bg-white border border-[#D7C8A5] rounded-xl transition-all shadow-xs"
              title="Copiar enlace para compartir la aplicación"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold whitespace-nowrap">¡Enlace copiado!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-[#BE6E55]" />
                  <span className="whitespace-nowrap">Compartir App</span>
                </>
              )}
            </button>

            {/* Quick interactive breathing shortcut */}
            <button
              onClick={onOpenBreathingPacer}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#503250] bg-[#503250]/10 hover:bg-[#503250]/15 rounded-xl transition-all"
              title="Iniciar pausa respiratoria consciente"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#BE6E55]" />
              <span className="whitespace-nowrap">Pausa</span>
            </button>

            {/* Guía Vercel & Supabase */}
            <button
              onClick={onOpenSupabaseGuide}
              className={`p-2 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-all ${
                isSupabaseConfigured
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                  : 'border-[#D7C8A5] bg-white/60 text-[#503250] hover:bg-white'
              }`}
              title="Guía de publicación y conexión"
            >
              <Database className="w-3.5 h-3.5" />
              <span className="hidden md:inline text-[11px] whitespace-nowrap">
                Guía de Conexión
              </span>
            </button>

            {/* User profile menu */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-xl bg-white/80 hover:bg-white border border-[#D7C8A5]/50 transition-all text-left"
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white ${
                    currentUser.role === 'admin' ? 'bg-[#503250]' : 'bg-[#BE6E55]'
                  }`}>
                    {currentUser.fullName.charAt(0) || 'U'}
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="text-xs font-semibold text-[#1E1E1E] leading-tight truncate max-w-[110px]">
                      {currentUser.fullName}
                    </div>
                    <div className="text-[10px] text-[#503250]/70 font-medium leading-none">
                      {currentUser.role === 'admin' ? 'Administradora' : 'Cliente'}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-[#503250]/60" />
                </button>

                {showUserDropdown && (
                  <div 
                    className="absolute right-0 mt-2 w-72 bg-[#F5F0E6] rounded-2xl shadow-xl border border-[#D7C8A5]/60 p-2 z-50 text-xs animate-fade-in"
                    onMouseLeave={() => setShowUserDropdown(false)}
                  >
                    <div className="px-3 py-2 border-b border-[#503250]/10 mb-1">
                      <span className="text-[10px] font-semibold text-[#A06446] uppercase tracking-wider block">
                        Cuenta Activa
                      </span>
                      <p className="text-xs font-bold text-[#503250] mt-0.5">{currentUser.fullName}</p>
                      <p className="text-[11px] text-[#1E1E1E]/60 truncate">{currentUser.email}</p>
                    </div>

                    <div className="px-1 py-1 space-y-1">
                      <button
                        onClick={() => {
                          onOpenEditProfile();
                          setShowUserDropdown(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-[#503250] hover:bg-white flex items-center gap-2 transition-colors font-medium text-xs"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-[#BE6E55]" />
                        <span>Cambiar mi nombre / Editar perfil</span>
                      </button>

                      <button
                        onClick={() => {
                          onToggleTestingBar();
                          setShowUserDropdown(false);
                        }}
                        className="w-full text-left px-3 py-1.5 rounded-xl text-[#1E1E1E]/70 hover:bg-white flex items-center gap-2 transition-colors text-xs"
                      >
                        <span>{showTestingBar ? '👁️ Ocultar barra de prueba' : '🔧 Mostrar barra de prueba'}</span>
                      </button>
                    </div>

                    <div className="pt-1.5 mt-1 border-t border-[#503250]/10">
                      <button
                        onClick={() => {
                          dataService.logout();
                          setShowUserDropdown(false);
                        }}
                        className="w-full text-left px-3 py-1.5 rounded-xl text-red-700 hover:bg-red-50 flex items-center gap-2 transition-colors font-medium text-xs"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Cerrar sesión
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="px-3.5 py-1.5 bg-[#503250] text-[#F5F0E6] text-xs font-medium rounded-xl hover:bg-[#3d263d] transition-all flex items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5" />
                <span>Ingresar</span>
              </button>
            )}

          </div>
        </div>
      </header>

      {/* Mobile Ergonomic Bottom Tab Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#F5F0E6]/95 backdrop-blur-md border-t border-[#D7C8A5]/60 pb-safe shadow-lg">
        <div className="grid grid-cols-5 h-16 items-center px-1">
          <button
            onClick={() => onTabChange('inicio')}
            className={`flex flex-col items-center justify-center py-1 transition-colors ${
              activeTab === 'inicio' ? 'text-[#503250] font-semibold' : 'text-[#1E1E1E]/60'
            }`}
          >
            <span className="text-base leading-none">🌿</span>
            <span className="text-[10px] tracking-tight mt-1 whitespace-nowrap">Inicio</span>
          </button>

          <button
            onClick={() => onTabChange('sesiones')}
            className={`flex flex-col items-center justify-center py-1 transition-colors ${
              activeTab === 'sesiones' ? 'text-[#503250] font-semibold' : 'text-[#1E1E1E]/60'
            }`}
          >
            <span className="text-base leading-none">📋</span>
            <span className="text-[10px] tracking-tight mt-1 whitespace-nowrap">Bonos</span>
          </button>

          <button
            onClick={() => onTabChange('autocuidado')}
            className={`flex flex-col items-center justify-center py-1 transition-colors ${
              activeTab === 'autocuidado' ? 'text-[#503250] font-semibold' : 'text-[#1E1E1E]/60'
            }`}
          >
            <span className="text-base leading-none">✨</span>
            <span className="text-[10px] tracking-tight mt-1 whitespace-nowrap">Cuidado</span>
          </button>

          <button
            onClick={() => onTabChange('espacio-personal')}
            className={`flex flex-col items-center justify-center py-1 transition-colors ${
              activeTab === 'espacio-personal' ? 'text-[#503250] font-semibold' : 'text-[#1E1E1E]/60'
            }`}
          >
            <span className="text-base leading-none">📖</span>
            <span className="text-[10px] tracking-tight mt-1 whitespace-nowrap">Mi Espacio</span>
          </button>

          {currentUser?.role === 'admin' ? (
            <button
              onClick={() => onTabChange('admin')}
              className={`flex flex-col items-center justify-center py-1 transition-colors ${
                activeTab === 'admin' ? 'text-[#503250] font-semibold' : 'text-[#1E1E1E]/60'
              }`}
            >
              <span className="text-base leading-none">⚙️</span>
              <span className="text-[10px] tracking-tight mt-1 whitespace-nowrap">Gestión</span>
            </button>
          ) : (
            <button
              onClick={() => onTabChange('servicios')}
              className={`flex flex-col items-center justify-center py-1 transition-colors ${
                activeTab === 'servicios' ? 'text-[#503250] font-semibold' : 'text-[#1E1E1E]/60'
              }`}
            >
              <span className="text-base leading-none">🌸</span>
              <span className="text-[10px] tracking-tight mt-1 whitespace-nowrap">Servicios</span>
            </button>
          )}
        </div>
      </div>
    </>
  );
};
