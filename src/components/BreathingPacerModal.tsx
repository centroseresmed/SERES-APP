import React, { useState, useEffect } from 'react';
import { X, Play, Pause, RotateCcw } from 'lucide-react';

interface BreathingPacerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPattern?: '4-4' | '4-7-8';
}

export const BreathingPacerModal: React.FC<BreathingPacerModalProps> = ({
  isOpen,
  onClose,
  initialPattern = '4-4',
}) => {
  const [isActive, setIsActive] = useState<boolean>(true);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('inhale');
  const [timer, setTimer] = useState<number>(0);
  const [pattern, setPattern] = useState<'4-4' | '4-7-8'>(initialPattern);

  // Pattern configuration in seconds
  const config = pattern === '4-4'
    ? { inhale: 4, hold: 1, exhale: 4, rest: 1 }
    : { inhale: 4, hold: 7, exhale: 8, rest: 1 };

  useEffect(() => {
    if (!isOpen) {
      setIsActive(false);
      setTimer(0);
      setPhase('inhale');
      return;
    }
    setIsActive(true);
  }, [isOpen]);

  useEffect(() => {
    if (!isActive || !isOpen) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        const currentLimit = config[phase];
        if (prev + 1 >= currentLimit) {
          // transition to next phase
          if (phase === 'inhale') setPhase(config.hold > 0 ? 'hold' : 'exhale');
          else if (phase === 'hold') setPhase('exhale');
          else if (phase === 'exhale') setPhase(config.rest > 0 ? 'rest' : 'inhale');
          else if (phase === 'rest') setPhase('inhale');
          return 0;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, phase, config, isOpen]);

  if (!isOpen) return null;

  const phaseInstruction = {
    inhale: 'Inhala suavemente por la nariz...',
    hold: 'Sostén con amabilidad y soltura...',
    exhale: 'Exhala despacio, soltando el peso...',
    rest: 'Descansa en el vacío natural...',
  }[phase];

  const scale = phase === 'inhale' ? 1.35 : phase === 'hold' ? 1.35 : 0.85;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-md bg-[#F5F0E6] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#D7C8A5]/40 flex flex-col items-center relative overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pacer-title"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#503250]/60 hover:text-[#503250] hover:bg-[#503250]/5 rounded-full transition-colors"
          aria-label="Cerrar respiración guiada"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="text-center mb-6">
          <span className="text-xs uppercase tracking-wider text-[#A06446] font-medium">Práctica en vivo</span>
          <h3 id="pacer-title" className="text-xl sm:text-2xl font-bold text-[#503250] mt-1">
            Respiración Consciente
          </h3>
          <p className="text-xs text-[#1E1E1E]/70 mt-1 max-w-xs mx-auto">
            Acompáñate a tu propio ritmo. Si necesitas parar en cualquier momento, respira con naturalidad.
          </p>
        </div>

        {/* Pattern Selector */}
        <div className="flex gap-2 p-1 bg-[#EBE4D5] rounded-xl mb-8">
          <button
            onClick={() => { setPattern('4-4'); setPhase('inhale'); setTimer(0); }}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              pattern === '4-4' ? 'bg-[#503250] text-[#F5F0E6] shadow-sm' : 'text-[#503250]/70 hover:text-[#503250]'
            }`}
          >
            4-4 Equilibrada (Calma)
          </button>
          <button
            onClick={() => { setPattern('4-7-8'); setPhase('inhale'); setTimer(0); }}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              pattern === '4-7-8' ? 'bg-[#503250] text-[#F5F0E6] shadow-sm' : 'text-[#503250]/70 hover:text-[#503250]'
            }`}
          >
            4-7-8 Transición Sueño
          </button>
        </div>

        {/* Animated Breathing Circle */}
        <div className="relative w-56 h-56 flex items-center justify-center my-2">
          {/* Outer gentle wave */}
          <div 
            className="absolute inset-0 rounded-full bg-[#BE6E55]/10 transition-transform duration-1000 ease-in-out"
            style={{ transform: `scale(${scale * 1.15})` }}
          />
          {/* Main animated orb */}
          <div 
            className="w-40 h-40 rounded-full bg-gradient-to-tr from-[#503250] to-[#BE6E55] text-white flex flex-col items-center justify-center shadow-lg transition-all duration-[4000ms] ease-in-out transform"
            style={{ transform: `scale(${scale})` }}
          >
            <span className="text-3xl font-display font-light tabular-nums">
              {config[phase] - timer}
            </span>
            <span className="text-xs uppercase tracking-widest text-[#F5F0E6]/80 mt-1 font-medium">
              {phase === 'inhale' && 'Inhala'}
              {phase === 'hold' && 'Sostén'}
              {phase === 'exhale' && 'Exhala'}
              {phase === 'rest' && 'Pausa'}
            </span>
          </div>
        </div>

        {/* Guiding text */}
        <p className="text-sm font-medium text-[#503250] text-center mt-6 min-h-[1.5rem] transition-opacity">
          {phaseInstruction}
        </p>

        {/* Controls */}
        <div className="flex items-center gap-4 mt-8">
          <button
            onClick={() => { setPhase('inhale'); setTimer(0); }}
            className="p-3 rounded-full text-[#503250] hover:bg-[#503250]/10 transition-colors"
            title="Reiniciar ciclo"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={() => setIsActive(!isActive)}
            className="px-6 py-3 bg-[#503250] text-[#F5F0E6] rounded-2xl font-medium text-sm flex items-center gap-2 hover:bg-[#3d263d] transition-all shadow-md shadow-[#503250]/15"
          >
            {isActive ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Pausar</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Continuar</span>
              </>
            )}
          </button>
        </div>

        <span className="text-[11px] text-[#1E1E1E]/50 mt-6 text-center">
          Práctica sugerida de 3 a 5 minutos · Sin esfuerzo forzado
        </span>
      </div>
    </div>
  );
};
