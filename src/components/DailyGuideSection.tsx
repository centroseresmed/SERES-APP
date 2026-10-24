import React, { useState } from 'react';
import { 
  Compass, 
  Sparkles, 
  ArrowRight, 
  Clock, 
  Heart, 
  Moon, 
  Sun, 
  PauseCircle, 
  Activity, 
  ShieldCheck,
  Check
} from 'lucide-react';
import { SelfCareResource } from '../types';

interface DailyGuideSectionProps {
  resources: SelfCareResource[];
  onSelectResource: (resource: SelfCareResource) => void;
  onOpenBreathingPacer: () => void;
}

export const DailyGuideSection: React.FC<DailyGuideSectionProps> = ({
  resources,
  onSelectResource,
  onOpenBreathingPacer,
}) => {
  const [selectedMoment, setSelectedMoment] = useState<string | null>(null);

  const moments = [
    {
      id: 'pausa',
      title: 'Necesito hacer una pausa',
      subtitle: '3 a 5 minutos · Entre tareas o reuniones',
      description: 'Detener la prisa, soltar la mandíbula y volver al contacto con el asiento.',
      icon: PauseCircle,
      accent: 'from-[#503250]/10 to-[#BE6E55]/10',
      targetSlug: 'pausa-3-respiraciones',
      fallbackCategory: 'conscious_pauses',
    },
    {
      id: 'tension',
      title: 'Siento tensión y quiero moverme',
      subtitle: '5 a 7 minutos · Carga en hombros y espalda',
      description: 'Movimientos lentos y ondulatorios para devolver espacio a las articulaciones.',
      icon: Activity,
      accent: 'from-[#BE6E55]/10 to-[#A06446]/10',
      targetSlug: 'descompresion-cervicales-escapular',
      fallbackCategory: 'movement',
    },
    {
      id: 'emocion',
      title: 'Quiero reconocer cómo me siento',
      subtitle: '6 a 8 minutos · Presencia amable y escucha',
      description: 'Darle un espacio respetuoso a las sensaciones corporales sin juzgar ni analizar.',
      icon: Heart,
      accent: 'from-[#A587A5]/15 to-[#503250]/10',
      targetSlug: 'reconocimiento-acompanamiento-emocional',
      fallbackCategory: 'emotional_awareness',
    },
    {
      id: 'presencia',
      title: 'Necesito recuperar presencia',
      subtitle: '8 a 10 minutos · Arraigo y contacto con el suelo',
      description: 'Sentir los apoyos físicos tangibles para calmar la mente dispersa.',
      icon: Compass,
      accent: 'from-[#D7C8A5]/25 to-[#BE6E55]/10',
      targetSlug: 'enraizamiento-descanso-suelo',
      fallbackCategory: 'body_connection',
    },
    {
      id: 'noche',
      title: 'Quiero cerrar el día con calma',
      subtitle: '6 minutos · Transición hacia el sueño',
      description: 'Soltar los pendientes acumulados y preparar el cuerpo para un descanso profundo.',
      icon: Moon,
      accent: 'from-[#503250]/15 to-[#A587A5]/15',
      targetSlug: 'transicion-hacia-el-sueno',
      fallbackCategory: 'daily_care',
    },
    {
      id: 'dia',
      title: 'Quiero comenzar el día conectando conmigo',
      subtitle: '5 minutos · Despertar suave de la respiración',
      description: 'Iniciar la jornada desde la calma interna antes de abrir las demandas del mundo.',
      icon: Sun,
      accent: 'from-[#BE6E55]/10 to-[#D7C8A5]/25',
      targetSlug: 'respiracion-consciente-calma',
      fallbackCategory: 'breathing',
    },
  ];

  const handleSelectMoment = (moment: typeof moments[0]) => {
    setSelectedMoment(moment.id);
    const target = resources.find(r => r.slug === moment.targetSlug) ||
                   resources.find(r => r.category === moment.fallbackCategory) ||
                   resources[0];

    if (target) {
      onSelectResource(target);
    }
  };

  return (
    <div className="space-y-10 pb-16">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 text-xs font-medium text-[#A06446]">
          <Compass className="w-4 h-4 text-[#BE6E55]" />
          <span>Orientación en el Momento Presente</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-display font-semibold text-[#503250] mt-1">
          Guía Diaria de Autocuidado
        </h2>
        <p className="text-xs sm:text-sm text-[#1E1E1E]/75 mt-1 max-w-2xl">
          Elige qué necesitas acompañar en este momento. Sin formularios extensos ni clasificaciones clínicas; solo una invitación directa a reconectar con tu bienestar corporal.
        </p>
      </div>

      {/* Grid of the 6 emotional/somatic needs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {moments.map((m) => {
          const Icon = m.icon;
          return (
            <div
              key={m.id}
              onClick={() => handleSelectMoment(m)}
              className="group cursor-pointer p-6 rounded-3xl bg-white border border-[#D7C8A5]/50 hover:border-[#BE6E55]/50 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#503250]/5 text-[#503250] flex items-center justify-center group-hover:bg-[#503250] group-hover:text-[#F5F0E6] transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-medium text-[#A06446]">
                    {m.subtitle}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#503250] group-hover:text-[#BE6E55] transition-colors leading-snug">
                  {m.title}
                </h3>

                <p className="text-xs text-[#1E1E1E]/70 mt-2 leading-relaxed">
                  {m.description}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-[#503250]/10 flex items-center justify-between text-xs font-semibold text-[#503250] group-hover:text-[#BE6E55] transition-colors">
                <span>Comenzar práctica</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick live breathing pacer banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#503250] to-[#734773] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-[#D7C8A5] font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-[#D7C8A5]" />
            <span>Ritmo guiado en pantalla</span>
          </div>
          <h3 className="text-lg font-bold">
            ¿Solo tienes 2 minutos libres ahora mismo?
          </h3>
          <p className="text-xs text-white/80 max-w-lg leading-relaxed">
            Abre el orbe respiratorio interactivo de SERES para sincronizar tu inhalación y exhalación en un ritmo natural de 4 tiempos.
          </p>
        </div>

        <button
          onClick={onOpenBreathingPacer}
          className="px-6 py-3 rounded-2xl bg-[#BE6E55] hover:bg-[#a85f48] text-white text-xs font-semibold transition-all shadow-md shrink-0 flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Iniciar respiración 4-4</span>
        </button>
      </div>

    </div>
  );
};
