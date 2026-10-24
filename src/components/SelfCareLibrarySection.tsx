import React, { useState } from 'react';
import { 
  Heart, 
  Search, 
  Clock, 
  Sparkles, 
  AlertTriangle, 
  X, 
  CheckCircle2, 
  ArrowRight,
  Filter
} from 'lucide-react';
import { SelfCareResource, SelfCareCategory } from '../types';

interface SelfCareLibrarySectionProps {
  resources: SelfCareResource[];
  onOpenBreathingPacer: () => void;
  onOpenPersonalNoteForResource?: (resource: SelfCareResource) => void;
}

export const SelfCareLibrarySection: React.FC<SelfCareLibrarySectionProps> = ({
  resources,
  onOpenBreathingPacer,
  onOpenPersonalNoteForResource,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDuration, setSelectedDuration] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeResource, setActiveResource] = useState<SelfCareResource | null>(null);

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: 'Todas las prácticas' },
    { id: 'breathing', label: 'Respiración consciente' },
    { id: 'movement', label: 'Movimiento y estiramientos' },
    { id: 'body_connection', label: 'Conexión corporal' },
    { id: 'emotional_awareness', label: 'Acompañamiento emocional' },
    { id: 'meditation', label: 'Meditaciones guiadas' },
    { id: 'conscious_pauses', label: 'Pausas conscientes' },
    { id: 'daily_care', label: 'Autocuidado cotidiano' },
  ];

  // Filtering
  const filteredResources = resources.filter((res) => {
    const matchCategory = selectedCategory === 'all' || res.category === selectedCategory;
    const matchDuration = 
      selectedDuration === 'all' ||
      (selectedDuration === 'short' && res.approxDurationMinutes <= 5) ||
      (selectedDuration === 'medium' && res.approxDurationMinutes > 5 && res.approxDurationMinutes <= 8) ||
      (selectedDuration === 'long' && res.approxDurationMinutes > 8);
    const matchSearch =
      searchQuery === '' ||
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchCategory && matchDuration && matchSearch;
  });

  return (
    <div className="space-y-10 pb-16">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 text-xs font-medium text-[#A06446]">
          <Heart className="w-4 h-4 text-[#BE6E55]" />
          <span>Espacio de Autocuidado</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-display font-semibold text-[#503250] mt-1">
          Biblioteca de Recursos y Prácticas Corporales
        </h2>
        <p className="text-xs sm:text-sm text-[#1E1E1E]/75 mt-1 max-w-2xl">
          Prácticas amables para realizar en casa sin equipos especiales. Diseñadas para reconectar con tus apoyos, regular el sistema nervioso y respetar el ritmo de tu cuerpo.
        </p>
      </div>

      {/* Filter Bar & Search */}
      <div className="space-y-4">
        
        {/* Search bar & duration filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#503250]/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por práctica, palabra clave o zona corporal..."
              className="w-full pl-9 pr-4 py-2.5 rounded-2xl border border-[#D7C8A5] bg-white/70 text-xs placeholder:text-[#1E1E1E]/40 focus:outline-none focus:ring-2 focus:ring-[#503250]/20"
            />
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-white/70 rounded-2xl border border-[#D7C8A5]/40 text-xs self-start sm:self-auto overflow-x-auto">
            <button
              onClick={() => setSelectedDuration('all')}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                selectedDuration === 'all' ? 'bg-[#503250] text-[#F5F0E6] font-medium' : 'text-[#1E1E1E]/70 hover:text-[#503250]'
              }`}
            >
              Cualquier duración
            </button>
            <button
              onClick={() => setSelectedDuration('short')}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                selectedDuration === 'short' ? 'bg-[#503250] text-[#F5F0E6] font-medium' : 'text-[#1E1E1E]/70 hover:text-[#503250]'
              }`}
            >
              ≤ 5 min (Pausas)
            </button>
            <button
              onClick={() => setSelectedDuration('medium')}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                selectedDuration === 'medium' ? 'bg-[#503250] text-[#F5F0E6] font-medium' : 'text-[#1E1E1E]/70 hover:text-[#503250]'
              }`}
            >
              6 - 8 min
            </button>
            <button
              onClick={() => setSelectedDuration('long')}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                selectedDuration === 'long' ? 'bg-[#503250] text-[#F5F0E6] font-medium' : 'text-[#1E1E1E]/70 hover:text-[#503250]'
              }`}
            >
              10+ min
            </button>
          </div>
        </div>

        {/* Categories segmented scrollable tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs whitespace-nowrap transition-all border ${
                selectedCategory === cat.id
                  ? 'bg-[#503250] text-[#F5F0E6] border-[#503250] shadow-sm font-medium'
                  : 'bg-white/60 hover:bg-white text-[#503250] border-[#D7C8A5]/50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Resources Grid */}
      <section>
        {filteredResources.length === 0 ? (
          <div className="p-12 text-center bg-white/60 rounded-3xl border border-[#D7C8A5]/40 text-[#1E1E1E]/60">
            <Heart className="w-8 h-8 mx-auto text-[#D7C8A5] mb-2" />
            <p className="text-sm font-medium">No se encontraron prácticas con esos filtros.</p>
            <button
              onClick={() => { setSelectedCategory('all'); setSelectedDuration('all'); setSearchQuery(''); }}
              className="mt-3 text-xs text-[#BE6E55] underline font-medium"
            >
              Restablecer filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((res) => (
              <div
                key={res.id}
                onClick={() => setActiveResource(res)}
                className="group cursor-pointer bg-white rounded-3xl border border-[#D7C8A5]/50 hover:border-[#BE6E55]/50 transition-all shadow-sm hover:shadow-md overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Image slot with resilient fallback */}
                  {res.imageUrl && (
                    <div className="aspect-[16/10] overflow-hidden bg-[#EBE4D5] relative">
                      <img
                        src={res.imageUrl}
                        alt={res.title}
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-[11px] font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#D7C8A5]" />
                        <span>{res.approxDurationMinutes} min</span>
                      </div>
                    </div>
                  )}

                  <div className="p-5 sm:p-6 space-y-2">
                    <div className="text-[11px] font-medium text-[#A06446] tracking-wide">
                      {res.categoryLabel}
                    </div>

                    <h4 className="text-base font-bold text-[#503250] group-hover:text-[#BE6E55] transition-colors leading-snug">
                      {res.title}
                    </h4>

                    <p className="text-xs text-[#1E1E1E]/70 line-clamp-2 leading-relaxed">
                      {res.description}
                    </p>

                    {/* Tags clean inline text */}
                    <div className="flex flex-wrap gap-1.5 pt-2 text-[10px] text-[#503250]/70 font-medium">
                      {res.tags.slice(0, 3).map((tag, idx) => (
                        <span key={tag}>
                          {idx > 0 && <span className="mr-1 text-[#D7C8A5]">·</span>}
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-5 sm:p-6 pt-0 border-t border-[#503250]/5 mt-2 flex items-center justify-between text-xs font-semibold text-[#503250] group-hover:text-[#BE6E55] transition-colors">
                  <span>Explorar paso a paso</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Resource Detail Modal */}
      {activeResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl bg-[#F5F0E6] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#D7C8A5]/60 relative max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-[#503250]/10 gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-[#A06446]">
                  <span>{activeResource.categoryLabel}</span>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    {activeResource.approxDurationMinutes} minutos
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#503250] mt-1 leading-snug">
                  {activeResource.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveResource(null)}
                className="p-2 text-[#503250]/60 hover:text-[#503250] hover:bg-[#503250]/5 rounded-full transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="mt-4 overflow-y-auto pr-1 space-y-5 text-xs sm:text-sm text-[#1E1E1E]/85">
              
              {/* Image if available */}
              {activeResource.imageUrl && (
                <div className="rounded-2xl overflow-hidden aspect-[16/9] shadow-sm bg-[#EBE4D5]">
                  <img
                    src={activeResource.imageUrl}
                    alt={activeResource.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}

              {/* Goal */}
              <div className="p-4 bg-white/70 rounded-2xl border border-[#D7C8A5]/40 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#A06446]">
                  Objetivo práctico
                </span>
                <p className="text-[#503250] font-medium">
                  {activeResource.practicalGoal}
                </p>
                <p className="text-xs text-[#1E1E1E]/70 mt-1">
                  {activeResource.description}
                </p>
              </div>

              {/* Step by step */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-[#503250]">
                  Instrucciones paso a paso:
                </h4>
                <div className="space-y-2.5">
                  {activeResource.stepByStepInstructions.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-white/50 rounded-xl border border-[#D7C8A5]/30">
                      <span className="w-5 h-5 rounded-full bg-[#503250] text-[#F5F0E6] text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-xs leading-relaxed text-[#1E1E1E]/85">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Precautions */}
              {activeResource.precautions && (
                <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200/80 text-amber-950 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-amber-900">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Precauciones y límites corporales:</span>
                  </div>
                  <p className="text-amber-900/80 leading-relaxed">
                    {activeResource.precautions}
                  </p>
                </div>
              )}

              {/* Integration Question */}
              {activeResource.integrationQuestion && (
                <div className="p-4 bg-[#A587A5]/15 rounded-2xl border border-[#A587A5]/25 text-xs space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#503250]">
                    Pregunta final para integrar
                  </span>
                  <p className="text-[#503250] font-medium text-sm">
                    "{activeResource.integrationQuestion}"
                  </p>
                </div>
              )}

            </div>

            {/* Modal Actions */}
            <div className="pt-4 mt-2 border-t border-[#503250]/10 flex flex-wrap items-center justify-between gap-3">
              {activeResource.category === 'breathing' || activeResource.category === 'conscious_pauses' ? (
                <button
                  onClick={() => {
                    setActiveResource(null);
                    onOpenBreathingPacer();
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#BE6E55] hover:bg-[#a85f48] text-white text-xs font-medium transition-all flex items-center gap-2 shadow-sm"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Abrir ritmo respiratorio en vivo</span>
                </button>
              ) : (
                <span className="text-xs text-[#1E1E1E]/60 italic">
                  Tómate tu tiempo. Sin prisa.
                </span>
              )}

              <button
                onClick={() => setActiveResource(null)}
                className="px-5 py-2.5 rounded-xl bg-[#503250] text-[#F5F0E6] text-xs font-medium hover:bg-[#3d263d] transition-colors"
              >
                Cerrar práctica
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
