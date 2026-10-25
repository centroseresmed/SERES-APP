import React, { useState } from 'react';
import { X, Mail, Lock, User, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { dataService } from '../services/dataService';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      if (isSupabaseConfigured && supabase) {
        // En conexión real con Supabase
        if (isRegister) {
          const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: { full_name: fullName }
            }
          });
          if (error) throw error;
          setMessage({
            type: 'success',
            text: '¡Cuenta creada! Revisa tu correo electrónico para confirmar el registro.'
          });
        } else {
          const { error } = await supabase.auth.signInWithPassword({
            email,
            password
          });
          if (error) throw error;
          setMessage({ type: 'success', text: '¡Bienvenida de vuelta!' });
          setTimeout(() => {
            onSuccess();
            onClose();
          }, 800);
        }
      } else {
        // En modo local
        const result = await dataService.loginWithEmail(email);
        if (result.success) {
          setMessage({ type: 'success', text: 'Sesión iniciada correctamente.' });
          setTimeout(() => {
            onSuccess();
            onClose();
          }, 600);
        } else {
          setMessage({ type: 'error', text: result.message || 'Error al iniciar sesión.' });
        }
      }
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err.message || 'No se pudo completar la operación. Verifica tus datos.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-[#F5F0E6] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#D7C8A5]/60 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#503250]/60 hover:text-[#503250] hover:bg-[#503250]/5 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <span className="font-display text-2xl font-bold tracking-tight text-[#503250]">
            SERES
          </span>
          <h3 className="text-lg font-bold text-[#503250] mt-1">
            {isRegister ? 'Crear cuenta de cliente' : 'Acceso a tu espacio SERES'}
          </h3>
          <p className="text-xs text-[#1E1E1E]/70 mt-1">
            Consulta tus bonos, sesiones asistidas y tu espacio de autocuidado
          </p>
        </div>

        {message && (
          <div className={`p-3.5 rounded-2xl mb-4 text-xs flex items-center gap-2 ${
            message.type === 'success' 
              ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' 
              : 'bg-red-50 text-red-900 border border-red-200'
          }`}>
            {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />}
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-[#503250] mb-1">Nombre completo</label>
              <div className="relative">
                <User className="w-4 h-4 text-[#503250]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Tu nombre y apellido"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D7C8A5] bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#503250]/20"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#503250] mb-1">Correo electrónico</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#503250]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D7C8A5] bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#503250]/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#503250] mb-1">Contraseña</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#503250]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D7C8A5] bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#503250]/20"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-[#503250] hover:bg-[#3d263d] text-[#F5F0E6] text-xs font-semibold transition-all shadow-md shadow-[#503250]/15 flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
          >
            <span>{loading ? 'Procesando...' : isRegister ? 'Registrarme' : 'Entrar a mi espacio'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-[#503250]/10 text-center">
          <button
            type="button"
            onClick={() => { setIsRegister(!isRegister); setMessage(null); }}
            className="text-xs text-[#BE6E55] hover:underline font-medium"
          >
            {isRegister
              ? '¿Ya tienes una cuenta? Inicia sesión aquí'
              : '¿Primera vez en SERES? Crea tu cuenta aquí'}
          </button>
        </div>
      </div>
    </div>
  );
};
