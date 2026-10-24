import React from 'react';
import { 
  Sparkles, 
  Calendar, 
  BookOpen, 
  Heart, 
  Layers, 
  ArrowRight, 
  ShieldCheck, 
  Compass,
  CheckCircle2
} from 'lucide-react';
import { UserProfile, Package, SessionRecord } from '../types';

interface HomeSectionProps {
  currentUser: UserProfile | null;
  packages: Package[];
  sessions: SessionRecord[];
  onNavigate: (tab: string) => void;
  onOpenBreathingPacer: () => void;
}

export const HomeSection: React.FC<HomeSectionProps> = ({
  currentUser,
  packages,
  sessions,
  onNavigate,
  onOpenBreathingPacer,
}) => {
  const firstName = currentUser?.fullName.split(' ')[0] || 'Bienvenida';
  const activePackages = packages.filter(p => p.status === 'active');
  const totalRemainingSessions = activePackages.reduce(
    (acc, p) => acc + (p.totalSessions - p.sessionsUsed), 
    0
  );
  const lastSession = sessions.length > 0 ? sessions[0] : null;

  return (
    <div className="space-y-10 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-white/70 border border-[#D7C8A5]/50 shadow-sm p-6 sm:p-10 lg:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 text-xs font-medium text-[#A06446]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#BE6E55]" />
              <span>Espacio de Integración y Presencia</span>
              <span aria-hidden="true">·</span>
              <span>SERES</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-[#503250] leading-tight text-balance">
              {currentUser?.role === 'admin'
                ? `Hola, ${firstName}. Panel de Centro SERES`
                : `Bienvenida, ${firstName}. Conecta con tu cuerpo y tu tiempo`}
            </h1>

            <p className="text-sm sm:text-base text-[#1E1E1E]/80 leading-relaxed max-w-xl">
              Un puente entre lo vivido en tus sesiones y tu vida cotidiana. Aquí puedes consultar tus asistencias y paquetes, explorar prácticas de autocuidado corporal y registrar tus comprensiones personales en total intimidad.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('guia-diaria')}
                className="px-5 py-3 rounded-2xl bg-[#503250] hover:bg-[#3d263d] text-[#F5F0E6] text-xs sm:text-sm font-medium transition-all shadow-md shadow-[#503250]/15 flex items-center gap-2"
              >
                <Compass className="w-4 h-4 text-[#D7C8A5]" />
                <span>Explorar Guía Diaria</span>
              </button>

              <button
                onClick={onOpenBreathingPacer}
                className="px-5 py-3 rounded-2xl bg-[#BE6E55]/15 hover:bg-[#BE6E55]/25 text-[#503250] text-xs sm:text-sm font-medium transition-all flex items-center gap-2 border border-[#BE6E55]/30"
              >
                <Sparkles className="w-4 h-4 text-[#BE6E55]" />
                <span>Hacer una pausa (Respiración)</span>
              </button>
            </div>
          </div>

          {/* Right Visual Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-[#D7C8A5]/40 aspect-[4/3] bg-[#EBE4D5]">
              <img
                src="/src/assets/images/seres_hero_wellness_1792882552902.jpg"
                alt="Espacio sereno de terapias y bienestar en SERES"
                className="w-full h-full object-cover"
                loading="eager"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end p-4">
                <span className="text-xs text-white/95 font-medium tracking-wide">
                  Cuidado integrativo, presencia y pausa consciente
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Snapshot Cards Bar */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        
        {/* Card 1: Balance de sesiones */}
        <div className="p-6 bg-white/70 rounded-3xl border border-[#D7C8A5]/40 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-[#A06446] font-medium mb-2">
              <span className="flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#BE6E55]" />
                Tus Sesiones Disponibles
              </span>
              <span>{activePackages.length} bono{activePackages.length !== 1 ? 's' : ''} activo{activePackages.length !== 1 ? 's' : ''}</span>
            </div>
            
            <div className="text-3xl font-display font-bold text-[#503250] tabular-nums mt-1">
              {totalRemainingSessions} <span className="text-sm font-normal text-[#1E1E1E]/60">sesiones restantes</span>
            </div>

            <p className="text-xs text-[#1E1E1E]/70 mt-2">
              {activePackages.length > 0 
                ? activePackages[0].name
                : 'No tienes paquetes activos en este momento.'}
            </p>
          </div>

          <button
            onClick={() => onNavigate('sesiones')}
            className="mt-4 pt-3 border-t border-[#503250]/10 text-xs font-semibold text-[#503250] hover:text-[#BE6E55] flex items-center justify-between transition-colors"
          >
            <span>Ver detalle y asistencias</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 2: Última sesión registrada */}
        <div className="p-6 bg-white/70 rounded-3xl border border-[#D7C8A5]/40 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-[#A06446] font-medium mb-2">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#BE6E55]" />
                Última Sesión Realizada
              </span>
              <span>{lastSession ? 'Completada' : 'Sin registro'}</span>
            </div>

            {lastSession ? (
              <>
                <div className="text-lg font-semibold text-[#503250] line-clamp-1">
                  {lastSession.serviceName}
                </div>
                <div className="text-xs text-[#1E1E1E]/70 mt-1">
                  Con {lastSession.therapistName} · {new Date(lastSession.sessionDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}
                </div>
                <div className="text-[11px] text-[#A06446] mt-2 line-clamp-2">
                  {lastSession.administrativeNotes}
                </div>
              </>
            ) : (
              <p className="text-xs text-[#1E1E1E]/60 mt-1">
                Aún no tienes sesiones registradas en tu historial.
              </p>
            )}
          </div>

          <button
            onClick={() => onNavigate('espacio-personal')}
            className="mt-4 pt-3 border-t border-[#503250]/10 text-xs font-semibold text-[#503250] hover:text-[#BE6E55] flex items-center justify-between transition-colors"
          >
            <span>Integrar aprendizajes en Mi Espacio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 3: Pausa de hoy */}
        <div className="p-6 bg-white/70 rounded-3xl border border-[#D7C8A5]/40 shadow-sm flex flex-col justify-between sm:col-span-2 lg:col-span-1">
          <div>
            <div className="flex items-center justify-between text-xs text-[#A06446] font-medium mb-2">
              <span className="flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-[#BE6E55]" />
                Autocuidado Recomendado
              </span>
              <span>5 minutos</span>
            </div>

            <div className="text-lg font-semibold text-[#503250]">
              Pausa de Regreso al Cuerpo
            </div>
            <p className="text-xs text-[#1E1E1E]/70 mt-1">
              Descomprime hombros y siente el apoyo de tus pies antes de continuar tu jornada.
            </p>
          </div>

          <button
            onClick={() => onNavigate('autocuidado')}
            className="mt-4 pt-3 border-t border-[#503250]/10 text-xs font-semibold text-[#503250] hover:text-[#BE6E55] flex items-center justify-between transition-colors"
          >
            <span>Ver biblioteca de prácticas</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </section>

      {/* 6 Core Pillars Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-display font-semibold text-[#503250]">
              Dimensiones de tu camino en SERES
            </h2>
            <p className="text-xs text-[#1E1E1E]/70 mt-0.5">
              Accede directamente a cada espacio diseñado para acompañar tu proceso
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          
          {/* Pillar 1 */}
          <div 
            onClick={() => onNavigate('sesiones')}
            className="group cursor-pointer p-6 bg-white/60 hover:bg-white rounded-3xl border border-[#D7C8A5]/40 hover:border-[#BE6E55]/40 transition-all shadow-sm hover:shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-2xl bg-[#503250]/10 text-[#503250] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Layers className="w-5 h-5 text-[#503250]" />
              </div>
              <h3 className="text-base font-semibold text-[#503250] group-hover:text-[#BE6E55] transition-colors">
                1. Mis Sesiones y Bonos
              </h3>
              <p className="text-xs text-[#1E1E1E]/70 mt-2 leading-relaxed">
                Historial fidedigno de asistencias, terapeutas asignadas, sesiones utilizadas y saldo disponible de tus paquetes.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-medium text-[#A06446]">
              <span>Consultar bonos</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Pillar 2 */}
          <div 
            onClick={() => onNavigate('espacio-personal')}
            className="group cursor-pointer p-6 bg-white/60 hover:bg-white rounded-3xl border border-[#D7C8A5]/40 hover:border-[#BE6E55]/40 transition-all shadow-sm hover:shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-2xl bg-[#BE6E55]/10 text-[#BE6E55] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5 text-[#BE6E55]" />
              </div>
              <h3 className="text-base font-semibold text-[#503250] group-hover:text-[#BE6E55] transition-colors">
                2. Mi Espacio Personal
              </h3>
              <p className="text-xs text-[#1E1E1E]/70 mt-2 leading-relaxed">
                Reflexiones y aprendizajes post-sesión. Privadas por defecto con preguntas para llevar a tu cuaderno físico o registrar aquí.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-medium text-[#A06446]">
              <span>Abrir reflexiones</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Pillar 3 */}
          <div 
            onClick={() => onNavigate('autocuidado')}
            className="group cursor-pointer p-6 bg-white/60 hover:bg-white rounded-3xl border border-[#D7C8A5]/40 hover:border-[#BE6E55]/40 transition-all shadow-sm hover:shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-2xl bg-[#A587A5]/15 text-[#503250] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Heart className="w-5 h-5 text-[#503250]" />
              </div>
              <h3 className="text-base font-semibold text-[#503250] group-hover:text-[#BE6E55] transition-colors">
                3. Biblioteca de Autocuidado
              </h3>
              <p className="text-xs text-[#1E1E1E]/70 mt-2 leading-relaxed">
                Ejercicios de movilidad, estiramientos, respiración consciente, presencia somática y pausas cotidianas sin forzar el cuerpo.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-medium text-[#A06446]">
              <span>Ver biblioteca</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Pillar 4 */}
          <div 
            onClick={() => onNavigate('guia-diaria')}
            className="group cursor-pointer p-6 bg-white/60 hover:bg-white rounded-3xl border border-[#D7C8A5]/40 hover:border-[#BE6E55]/40 transition-all shadow-sm hover:shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-2xl bg-[#D7C8A5]/30 text-[#A06446] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Compass className="w-5 h-5 text-[#A06446]" />
              </div>
              <h3 className="text-base font-semibold text-[#503250] group-hover:text-[#BE6E55] transition-colors">
                4. Guía Diaria Intuitiva
              </h3>
              <p className="text-xs text-[#1E1E1E]/70 mt-2 leading-relaxed">
                Encuentra de inmediato una práctica según lo que requieres hoy (pausa, movimiento, escucha amable, calma nocturna).
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-medium text-[#A06446]">
              <span>Encontrar práctica</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Pillar 5 */}
          <div 
            onClick={() => onNavigate('servicios')}
            className="group cursor-pointer p-6 bg-white/60 hover:bg-white rounded-3xl border border-[#D7C8A5]/40 hover:border-[#BE6E55]/40 transition-all shadow-sm hover:shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-2xl bg-[#503250]/10 text-[#503250] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Calendar className="w-5 h-5 text-[#503250]" />
              </div>
              <h3 className="text-base font-semibold text-[#503250] group-hover:text-[#BE6E55] transition-colors">
                5. Servicios y Encuentros
              </h3>
              <p className="text-xs text-[#1E1E1E]/70 mt-2 leading-relaxed">
                Consulta los masajes, terapias integrativas y talleres grupales disponibles en nuestro centro con enlace directo de contacto.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-medium text-[#A06446]">
              <span>Ver propuestas</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Pillar 6: Futuro Programa de Referidos (Preparación arquitectónica transparente) */}
          <div 
            onClick={() => onNavigate('sesiones')}
            className="p-6 bg-white/60 rounded-3xl border border-[#D7C8A5]/40 transition-all shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-2xl bg-[#BE6E55]/10 text-[#BE6E55] flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5 text-[#BE6E55]" />
              </div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-[#503250]">
                  6. Programa de Referidos
                </h3>
                <span className="text-[10px] font-medium text-[#A06446] bg-[#A06446]/10 px-2 py-0.5 rounded-full">
                  Próximamente
                </span>
              </div>
              <p className="text-xs text-[#1E1E1E]/70 mt-2 leading-relaxed">
                Diseñado para agradecer a quienes recomiendan SERES. La arquitectura está lista para cuando el centro apruebe sus condiciones comerciales oficiales.
              </p>
            </div>
            <div className="mt-4 text-[11px] text-[#A06446] font-medium">
              Estructura técnica preparada
            </div>
          </div>

        </div>
      </section>

      {/* Ethical & Non-Diagnostic Principles Banner */}
      <section className="p-6 rounded-3xl bg-[#503250]/5 border border-[#503250]/15 flex items-start gap-4">
        <div className="p-2.5 rounded-2xl bg-white shadow-sm text-[#503250] shrink-0 mt-0.5">
          <ShieldCheck className="w-5 h-5 text-[#503250]" />
        </div>
        <div className="space-y-1">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#503250]">
            Compromiso ético y de cuidado en SERES
          </h4>
          <p className="text-xs text-[#1E1E1E]/75 leading-relaxed">
            La aplicación de SERES no diagnostica estados emocionales ni promete soluciones mágicas. El cuerpo no es una máquina que deba repararse, sino un espacio vivo de experiencia. Nuestras prácticas de autocuidado son invitaciones a la presencia y el bienestar, y nunca sustituyen la consulta médica o psicológica especializada cuando sea necesaria.
          </p>
        </div>
      </section>

    </div>
  );
};
