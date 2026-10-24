import React from 'react';
import { 
  Sparkles, 
  Clock, 
  MessageCircle, 
  Calendar, 
  CheckCircle2, 
  Shield, 
  ArrowRight
} from 'lucide-react';
import { ServiceOrGathering } from '../types';

interface ServicesSectionProps {
  services: ServiceOrGathering[];
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ services }) => {
  const individualServices = services.filter(s => s.itemType === 'service');
  const gatherings = services.filter(s => s.itemType === 'gathering');

  return (
    <div className="space-y-12 pb-16">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 text-xs font-medium text-[#A06446]">
          <Sparkles className="w-4 h-4 text-[#BE6E55]" />
          <span>Propuestas y Encuentros</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-display font-semibold text-[#503250] mt-1">
          Servicios de Terapias y Espacios Compartidos
        </h2>
        <p className="text-xs sm:text-sm text-[#1E1E1E]/75 mt-1 max-w-2xl">
          Conoce nuestros masajes terapéuticos, sesiones somáticas integrativas y encuentros grupales de movimiento consciente en nuestro centro.
        </p>
      </div>

      {/* Individual Services */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-[#503250]/10 pb-2">
          <h3 className="text-lg font-bold text-[#503250] flex items-center gap-2">
            <span>Masajes y Terapias Individuales</span>
            <span className="text-xs font-normal text-[#1E1E1E]/60">({individualServices.length})</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {individualServices.map((srv) => (
            <div
              key={srv.id}
              className="bg-white rounded-3xl border border-[#D7C8A5]/50 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {srv.imageUrl && (
                  <div className="aspect-[16/10] bg-[#EBE4D5] overflow-hidden">
                    <img
                      src={srv.imageUrl}
                      alt={srv.title}
                      className="w-full h-full object-cover hover:scale-102 transition-transform duration-500"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}

                <div className="p-6 space-y-2">
                  <div className="flex items-center justify-between text-xs text-[#A06446]">
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5 text-[#BE6E55]" />
                      {srv.durationText}
                    </span>
                    <span className="font-semibold text-[#503250]">
                      {srv.priceText}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-[#503250] leading-snug">
                    {srv.title}
                  </h4>

                  <p className="text-xs text-[#1E1E1E]/75 leading-relaxed">
                    {srv.description}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 mt-3 border-t border-[#503250]/5">
                {srv.contactActionUrl ? (
                  <a
                    href={srv.contactActionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl bg-[#503250]/10 hover:bg-[#503250] text-[#503250] hover:text-[#F5F0E6] text-xs font-medium transition-all flex items-center justify-center gap-2 text-center"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-[#BE6E55]" />
                    <span>Consultar disponibilidad por WhatsApp</span>
                  </a>
                ) : (
                  <span className="text-xs text-[#1E1E1E]/50">Contacto directo en recepción</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Gatherings and Circles */}
      {gatherings.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#503250]/10 pb-2">
            <h3 className="text-lg font-bold text-[#503250] flex items-center gap-2">
              <span>Encuentros Grupales y Talleres</span>
              <span className="text-xs font-normal text-[#1E1E1E]/60">({gatherings.length})</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {gatherings.map((gat) => (
              <div
                key={gat.id}
                className="p-6 bg-white rounded-3xl border border-[#D7C8A5]/50 shadow-sm flex flex-col sm:flex-row gap-5 items-start"
              >
                {gat.imageUrl && (
                  <div className="w-full sm:w-44 aspect-[4/3] rounded-2xl overflow-hidden bg-[#EBE4D5] shrink-0">
                    <img
                      src={gat.imageUrl}
                      alt={gat.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}

                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="px-2 py-0.5 rounded-full bg-[#A587A5]/20 text-[#503250] font-semibold text-[10px]">
                      Encuentro presencial
                    </span>
                    {gat.scheduledAt && (
                      <span className="text-[#A06446] font-medium flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(gat.scheduledAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    )}
                  </div>

                  <h4 className="text-base font-bold text-[#503250]">
                    {gat.title}
                  </h4>

                  <p className="text-xs text-[#1E1E1E]/75 leading-relaxed">
                    {gat.description}
                  </p>

                  <div className="pt-2 flex items-center justify-between gap-3">
                    <span className="text-xs font-semibold text-[#A06446]">
                      {gat.priceText}
                    </span>

                    {gat.contactActionUrl && (
                      <a
                        href={gat.contactActionUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-1.5 px-3 rounded-xl bg-[#503250] text-[#F5F0E6] text-xs font-medium hover:bg-[#3d263d] transition-all flex items-center gap-1.5"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Reservar plaza</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Booking Notice */}
      <div className="p-6 rounded-3xl bg-white/70 border border-[#D7C8A5]/40 text-xs text-[#1E1E1E]/75 space-y-1">
        <h4 className="font-semibold text-[#503250]">Información sobre reservas y cancelaciones:</h4>
        <p className="leading-relaxed">
          Para cuidar el tiempo de todos y sostener un ambiente de calma, te agradecemos avisar con al menos 24 horas de antelación si necesitas reprogramar o cancelar una sesión programada.
        </p>
      </div>

    </div>
  );
};
