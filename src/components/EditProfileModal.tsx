import React, { useState } from 'react';
import { X, User, Phone, Save, Check } from 'lucide-react';
import { UserProfile } from '../types';
import { dataService } from '../services/dataService';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
}) => {
  const [fullName, setFullName] = useState(currentUser.fullName);
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    dataService.updateUserProfile({
      fullName: fullName.trim(),
      phone: phone.trim(),
    });

    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 800);
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
          <span className="text-xs uppercase tracking-wider text-[#A06446] font-medium">Configuración de Cuenta</span>
          <h3 className="text-xl font-bold text-[#503250] mt-1">
            Editar Mi Perfil
          </h3>
          <p className="text-xs text-[#1E1E1E]/70 mt-1">
            Actualiza tu nombre real y datos de contacto de SERES
          </p>
        </div>

        {saved && (
          <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs flex items-center gap-2 mb-4">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>¡Perfil actualizado con éxito!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#503250] mb-1">
              Tu Nombre Completo
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#503250]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ej. Tu nombre real"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D7C8A5] bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#503250]/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#503250] mb-1">
              Correo Electrónico (No modificable)
            </label>
            <input
              type="email"
              disabled
              value={currentUser.email}
              className="w-full px-4 py-2.5 rounded-xl border border-[#D7C8A5]/60 bg-gray-100/70 text-xs text-gray-600 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#503250] mb-1">
              Teléfono o WhatsApp de contacto (Opcional)
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-[#503250]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+57 300 123 4567"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D7C8A5] bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#503250]/20"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-[#503250] hover:bg-[#3d263d] text-[#F5F0E6] text-xs font-semibold transition-all shadow-md shadow-[#503250]/15 flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Cambios</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
