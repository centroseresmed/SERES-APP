import React, { useState } from 'react';
import { 
  BookOpen, 
  Lock, 
  Plus, 
  Trash2, 
  Edit3, 
  Calendar, 
  Sparkles, 
  Save, 
  X, 
  HelpCircle,
  FileText
} from 'lucide-react';
import { PersonalNote, SessionRecord } from '../types';

interface PersonalSpaceSectionProps {
  notes: PersonalNote[];
  sessions: SessionRecord[];
  onSaveNote: (note: {
    id?: string;
    sessionId?: string;
    sessionTitle?: string;
    title?: string;
    reflections: string;
    learnings?: string;
    questionsToExplore?: string;
  }) => void;
  onDeleteNote: (id: string) => void;
  initialEditingSession?: SessionRecord | null;
  onClearInitialSession?: () => void;
}

export const PersonalSpaceSection: React.FC<PersonalSpaceSectionProps> = ({
  notes,
  sessions,
  onSaveNote,
  onDeleteNote,
  initialEditingSession,
  onClearInitialSession,
}) => {
  const [isCreating, setIsCreating] = useState<boolean>(Boolean(initialEditingSession));
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

  // Form fields
  const [formTitle, setFormTitle] = useState<string>('');
  const [formSessionId, setFormSessionId] = useState<string>(initialEditingSession?.id || '');
  const [formReflections, setFormReflections] = useState<string>('');
  const [formLearnings, setFormLearnings] = useState<string>('');
  const [formQuestions, setFormQuestions] = useState<string>('');

  const resetForm = () => {
    setFormTitle('');
    setFormSessionId('');
    setFormReflections('');
    setFormLearnings('');
    setFormQuestions('');
    setEditingNoteId(null);
    setIsCreating(false);
    if (onClearInitialSession) onClearInitialSession();
  };

  const handleStartEdit = (note: PersonalNote) => {
    setEditingNoteId(note.id);
    setFormTitle(note.title || '');
    setFormSessionId(note.sessionId || '');
    setFormReflections(note.reflections || '');
    setFormLearnings(note.learnings || '');
    setFormQuestions(note.questionsToExplore || '');
    setIsCreating(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formReflections.trim()) return;

    const matchedSession = sessions.find(s => s.id === formSessionId);

    onSaveNote({
      id: editingNoteId || undefined,
      sessionId: formSessionId || undefined,
      sessionTitle: matchedSession ? `${matchedSession.serviceName} (${new Date(matchedSession.sessionDate).toLocaleDateString('es-ES')})` : undefined,
      title: formTitle.trim() || undefined,
      reflections: formReflections.trim(),
      learnings: formLearnings.trim() || undefined,
      questionsToExplore: formQuestions.trim() || undefined,
    });

    resetForm();
  };

  return (
    <div className="space-y-10 pb-16">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-medium text-[#A06446]">
            <BookOpen className="w-4 h-4 text-[#BE6E55]" />
            <span>Mi Camino de Conciencia</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-semibold text-[#503250] mt-1">
            Mi Espacio de Reflexión e Integración
          </h2>
          <p className="text-xs sm:text-sm text-[#1E1E1E]/75 mt-1 max-w-2xl">
            Un lugar íntimo para registrar lo vivido en tus sesiones, comprender cómo responde tu cuerpo y guardar preguntas que quieras continuar explorando.
          </p>
        </div>

        {!isCreating && (
          <button
            onClick={() => setIsCreating(true)}
            className="px-5 py-3 rounded-2xl bg-[#503250] hover:bg-[#3d263d] text-[#F5F0E6] text-xs font-medium transition-all shadow-md shadow-[#503250]/15 flex items-center gap-2 shrink-0 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 text-[#D7C8A5]" />
            <span>Escribir reflexión</span>
          </button>
        )}
      </div>

      {/* Strict Privacy Callout */}
      <div className="p-4 rounded-2xl bg-white/70 border border-[#D7C8A5]/50 flex items-start gap-3">
        <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800 shrink-0 mt-0.5">
          <Lock className="w-4 h-4" />
        </div>
        <div className="space-y-1 text-xs">
          <span className="font-bold text-[#503250] uppercase tracking-wider block">
            Privacidad total garantizada por diseño (RLS)
          </span>
          <p className="text-[#1E1E1E]/75 leading-relaxed">
            Tus reflexiones son 100% privadas. En SERES cuidamos tu intimidad con el mismo respeto que en consulta: ni las terapeutas ni los administradores tienen acceso para leer tus notas personales en la aplicación.
          </p>
        </div>
      </div>

      {/* Physical Notebook Encouragement Banner */}
      <div className="p-5 rounded-3xl bg-[#A587A5]/10 border border-[#A587A5]/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#503250]">
            <FileText className="w-4 h-4 text-[#A06446]" />
            <span>¿Prefieres escribir en papel?</span>
          </div>
          <p className="text-xs text-[#1E1E1E]/75 leading-relaxed max-w-xl">
            No es obligatorio registrar tus reflexiones dentro de esta aplicación. Si para ti la conexión con un cuaderno físico resulta más cercana, puedes utilizar estas mismas preguntas orientadoras en tus páginas personales.
          </p>
        </div>
      </div>

      {/* Guiding Questions Carousel / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white/60 border border-[#D7C8A5]/40 text-xs space-y-1.5">
          <span className="text-[10px] font-semibold text-[#A06446] uppercase tracking-wider">Pregunta de integración</span>
          <p className="text-[#503250] font-medium">¿Qué sensaciones físicas están más vivas en tu cuerpo hoy tras la sesión?</p>
          <p className="text-[#1E1E1E]/60 text-[11px]">Nota temperatura, ligereza o tensión sin apresurarte a juzgarla.</p>
        </div>

        <div className="p-4 rounded-2xl bg-white/60 border border-[#D7C8A5]/40 text-xs space-y-1.5">
          <span className="text-[10px] font-semibold text-[#A06446] uppercase tracking-wider">Pregunta de ritmo</span>
          <p className="text-[#503250] font-medium">¿En qué momento de tu día sientes que tu respiración se vuelve más corta?</p>
          <p className="text-[#1E1E1E]/60 text-[11px]">Identificar los ritmos habituales ayuda a introducir pequeñas pausas amables.</p>
        </div>

        <div className="p-4 rounded-2xl bg-white/60 border border-[#D7C8A5]/40 text-xs space-y-1.5">
          <span className="text-[10px] font-semibold text-[#A06446] uppercase tracking-wider">Pregunta de cuidado</span>
          <p className="text-[#503250] font-medium">¿Qué pequeño permiso o descanso necesitas regalarte esta semana?</p>
          <p className="text-[#1E1E1E]/60 text-[11px]">Un espacio de 5 minutos al día puede transformar tu relación con tu cuerpo.</p>
        </div>
      </div>

      {/* Create / Edit Form */}
      {isCreating && (
        <form 
          onSubmit={handleSubmit}
          className="p-6 sm:p-8 bg-white rounded-3xl border border-[#503250]/20 shadow-lg space-y-5 animate-fade-in"
        >
          <div className="flex items-center justify-between pb-3 border-b border-[#503250]/10">
            <h3 className="text-lg font-bold text-[#503250] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#BE6E55]" />
              <span>{editingNoteId ? 'Editar Reflexión' : 'Nueva Reflexión Personal'}</span>
            </h3>
            <button
              type="button"
              onClick={resetForm}
              className="p-2 text-[#503250]/60 hover:text-[#503250] hover:bg-[#503250]/5 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#503250] mb-1">
                Título o foco de la nota (opcional)
              </label>
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="Ej. Sensaciones tras el masaje del jueves"
                className="w-full px-4 py-2.5 rounded-xl border border-[#D7C8A5] bg-[#F5F0E6]/30 text-xs focus:outline-none focus:ring-2 focus:ring-[#503250]/30"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#503250] mb-1">
                Vincular a una sesión realizada (opcional)
              </label>
              <select
                value={formSessionId}
                onChange={(e) => setFormSessionId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#D7C8A5] bg-[#F5F0E6]/30 text-xs focus:outline-none focus:ring-2 focus:ring-[#503250]/30"
              >
                <option value="">Nota independiente (sin vincular)</option>
                {sessions.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.serviceName} · {new Date(s.sessionDate).toLocaleDateString('es-ES')} ({s.therapistName})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#503250] mb-1">
              ¿Qué sensaciones, emociones o vivencias emergieron? <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={formReflections}
              onChange={(e) => setFormReflections(e.target.value)}
              placeholder="Describe lo que sentiste en tu cuerpo o durante tu día sin censura ni juicio..."
              className="w-full px-4 py-3 rounded-xl border border-[#D7C8A5] bg-[#F5F0E6]/30 text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#503250]/30"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#503250] mb-1">
                Aprendizajes o comprensiones (opcional)
              </label>
              <textarea
                rows={3}
                value={formLearnings}
                onChange={(e) => setFormLearnings(e.target.value)}
                placeholder="¿Qué comprendiste sobre tus hábitos, posturas o necesidades?"
                className="w-full px-4 py-2.5 rounded-xl border border-[#D7C8A5] bg-[#F5F0E6]/30 text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#503250]/30"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#503250] mb-1">
                Preguntas para seguir explorando (opcional)
              </label>
              <textarea
                rows={3}
                value={formQuestions}
                onChange={(e) => setFormQuestions(e.target.value)}
                placeholder="¿Qué preguntas te acompañan para tu próxima sesión o para tu semana?"
                className="w-full px-4 py-2.5 rounded-xl border border-[#D7C8A5] bg-[#F5F0E6]/30 text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#503250]/30"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#503250]/10">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 text-xs font-medium text-[#1E1E1E]/70 hover:text-[#1E1E1E] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#503250] text-[#F5F0E6] text-xs font-medium hover:bg-[#3d263d] transition-all flex items-center gap-2 shadow-md shadow-[#503250]/15"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Guardar en mi diario privado</span>
            </button>
          </div>
        </form>
      )}

      {/* Notes List */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-[#503250] flex items-center gap-2">
          <span>Tus Reflexiones Registradas</span>
          <span className="text-xs font-normal text-[#1E1E1E]/60">({notes.length})</span>
        </h3>

        {notes.length === 0 ? (
          <div className="p-8 text-center bg-white/60 rounded-3xl border border-[#D7C8A5]/40 text-[#1E1E1E]/60">
            <BookOpen className="w-8 h-8 mx-auto text-[#D7C8A5] mb-2" />
            <p className="text-sm font-medium">No has registrado reflexiones aún.</p>
            <p className="text-xs mt-1">
              Haz clic en "Escribir reflexión" para comenzar a guardar tus vivencias en este espacio privado.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {notes.map((note) => (
              <div 
                key={note.id}
                className="p-6 bg-white rounded-3xl border border-[#D7C8A5]/40 hover:border-[#BE6E55]/40 transition-all shadow-sm space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#503250]/10 pb-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-[#A06446]">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(note.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                      {note.sessionTitle && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-[#503250] font-medium">{note.sessionTitle}</span>
                        </>
                      )}
                    </div>
                    {note.title && (
                      <h4 className="text-base font-bold text-[#503250] mt-1">
                        {note.title}
                      </h4>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleStartEdit(note)}
                      className="p-2 text-[#503250]/70 hover:text-[#503250] hover:bg-[#503250]/5 rounded-lg transition-colors"
                      title="Editar reflexión"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('¿Seguro que deseas eliminar esta reflexión privada?')) {
                          onDeleteNote(note.id);
                        }
                      }}
                      className="p-2 text-red-600/70 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar reflexión"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Body */}
                <div className="text-xs sm:text-sm text-[#1E1E1E]/85 leading-relaxed whitespace-pre-line">
                  {note.reflections}
                </div>

                {/* Learnings & Questions boxes */}
                {(note.learnings || note.questionsToExplore) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    {note.learnings && (
                      <div className="p-3 rounded-2xl bg-[#D7C8A5]/20 border border-[#D7C8A5]/30 text-xs">
                        <span className="font-semibold text-[#503250] block mb-1">Aprendizaje:</span>
                        <p className="text-[#1E1E1E]/80">{note.learnings}</p>
                      </div>
                    )}
                    {note.questionsToExplore && (
                      <div className="p-3 rounded-2xl bg-[#A587A5]/15 border border-[#A587A5]/20 text-xs">
                        <span className="font-semibold text-[#503250] block mb-1">Para seguir explorando:</span>
                        <p className="text-[#1E1E1E]/80">{note.questionsToExplore}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
};
