import React, { useState } from 'react';
import { 
  Layers, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  History, 
  Sparkles,
  PenLine,
  UserCheck
} from 'lucide-react';
import { Package, SessionRecord, PackageMovement } from '../types';

interface SessionsAndPackagesSectionProps {
  packages: Package[];
  sessions: SessionRecord[];
  movements: PackageMovement[];
  onWriteNoteForSession: (session: SessionRecord) => void;
}

export const SessionsAndPackagesSection: React.FC<SessionsAndPackagesSectionProps> = ({
  packages,
  sessions,
  movements,
  onWriteNoteForSession,
}) => {
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(
    packages.length > 0 ? packages[0].id : null
  );

  const selectedPackage = packages.find(p => p.id === selectedPackageId) || (packages.length > 0 ? packages[0] : null);
  const packageMovements = movements.filter(m => !selectedPackageId || m.packageId === selectedPackageId);

  return (
    <div className="space-y-10 pb-16">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 text-xs font-medium text-[#A06446]">
          <Layers className="w-4 h-4 text-[#BE6E55]" />
          <span>Control y Transparencia</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-display font-semibold text-[#503250] mt-1">
          Mis Sesiones y Paquetes Adquiridos
        </h2>
        <p className="text-xs sm:text-sm text-[#1E1E1E]/75 mt-1 max-w-2xl">
          Consulta en tiempo real el estado de tus bonos, el desglose de asistencias confirmadas por el equipo de SERES y el saldo de sesiones disponibles.
        </p>
      </div>

      {/* Packages Overview */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-[#503250] flex items-center gap-2">
          <span>Tus Bonos de Servicio</span>
          <span className="text-xs font-normal text-[#1E1E1E]/60">({packages.length})</span>
        </h3>

        {packages.length === 0 ? (
          <div className="p-8 text-center bg-white/60 rounded-3xl border border-[#D7C8A5]/40 text-[#1E1E1E]/60">
            <Layers className="w-8 h-8 mx-auto text-[#D7C8A5] mb-2" />
            <p className="text-sm font-medium">No tienes paquetes registrados todavía.</p>
            <p className="text-xs mt-1">Al adquirir un bono en recepción o sesión, la administración lo vinculará aquí.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {packages.map((pkg) => {
              const remaining = pkg.totalSessions - pkg.sessionsUsed;
              const isSelected = selectedPackage?.id === pkg.id;

              return (
                <div
                  key={pkg.id}
                  onClick={() => setSelectedPackageId(pkg.id)}
                  className={`cursor-pointer p-6 rounded-3xl border transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-white border-[#503250] shadow-md ring-2 ring-[#503250]/10'
                      : 'bg-white/70 hover:bg-white border-[#D7C8A5]/50 shadow-sm'
                  }`}
                >
                  <div>
                    {/* Status badge & title */}
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        pkg.status === 'active' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : pkg.status === 'completed'
                          ? 'bg-gray-100 text-gray-700'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {pkg.status === 'active' && 'Activo'}
                        {pkg.status === 'completed' && 'Completado'}
                        {pkg.status === 'expired' && 'Vencido'}
                      </span>
                      <span className="text-[11px] text-[#A06446]">
                        Comprado: {pkg.purchaseDate}
                      </span>
                    </div>

                    <h4 className="text-base font-semibold text-[#503250] leading-snug">
                      {pkg.name}
                    </h4>
                    <p className="text-xs text-[#1E1E1E]/65 mt-1">
                      {pkg.serviceType}
                    </p>

                    {/* Visual session dots tracker */}
                    <div className="mt-5 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#503250] font-medium">
                          {pkg.sessionsUsed} de {pkg.totalSessions} utilizadas
                        </span>
                        <span className="font-bold text-[#BE6E55] tabular-nums">
                          {remaining} disponibles
                        </span>
                      </div>

                      <div className="grid grid-cols-5 gap-1.5 pt-1">
                        {Array.from({ length: pkg.totalSessions }).map((_, idx) => (
                          <div
                            key={idx}
                            className={`h-2.5 rounded-full transition-colors ${
                              idx < pkg.sessionsUsed
                                ? 'bg-[#503250]'
                                : 'bg-[#D7C8A5]/40'
                            }`}
                            title={`Sesión ${idx + 1}`}
                          />
                        ))}
                      </div>
                    </div>

                    {pkg.expiresAt && (
                      <div className="text-[11px] text-[#1E1E1E]/60 mt-3 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#A06446]" />
                        <span>Válido hasta: {pkg.expiresAt}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#503250]/10 flex items-center justify-between text-xs text-[#503250] font-medium">
                    <span>{isSelected ? 'Mostrando movimientos' : 'Ver movimientos'}</span>
                    <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'rotate-90' : ''}`} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Audit Trail Movements for Selected Package */}
      {selectedPackage && (
        <section className="bg-white/70 rounded-3xl p-6 sm:p-8 border border-[#D7C8A5]/40 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#503250]/10 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-[#BE6E55]" />
                <h3 className="text-base font-semibold text-[#503250]">
                  Historial de Movimientos del Bono: {selectedPackage.name}
                </h3>
              </div>
              <p className="text-xs text-[#1E1E1E]/65 mt-0.5">
                Registro inmutable: cada descuento se realiza únicamente cuando la terapeuta confirma tu asistencia presencial.
              </p>
            </div>
          </div>

          {packageMovements.length === 0 ? (
            <p className="text-xs text-[#1E1E1E]/60 py-3">No hay movimientos registrados para este paquete.</p>
          ) : (
            <div className="divide-y divide-[#503250]/10">
              {packageMovements.map((mov) => (
                <div key={mov.id} className="py-3 flex items-start justify-between gap-4">
                  <div className="space-y-0.5">
                    <div className="text-xs font-semibold text-[#503250] flex items-center gap-2">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                        mov.changeAmount < 0 
                          ? 'bg-amber-100 text-amber-900' 
                          : 'bg-emerald-100 text-emerald-900'
                      }`}>
                        {mov.changeAmount > 0 ? `+${mov.changeAmount}` : mov.changeAmount} sesión
                      </span>
                      <span>{mov.reason}</span>
                    </div>
                    <div className="text-[11px] text-[#1E1E1E]/60 flex items-center gap-2">
                      <span>Registrado por: <strong>{mov.recordedByName}</strong></span>
                      <span aria-hidden="true">·</span>
                      <span>{new Date(mov.createdAt).toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                    </div>
                  </div>
                  <UserCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Historical List of Sessions */}
      <section className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-[#503250] flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#BE6E55]" />
            <span>Historial Personal de Sesiones y Asistencias</span>
          </h3>
          <p className="text-xs text-[#1E1E1E]/70 mt-0.5">
            Registro cronológico de tus terapias recibidas en SERES. Puedes escribir reflexiones personales vinculadas a cualquiera de ellas.
          </p>
        </div>

        {sessions.length === 0 ? (
          <div className="p-8 text-center bg-white/60 rounded-3xl border border-[#D7C8A5]/40 text-[#1E1E1E]/60">
            <p className="text-xs">No hay sesiones en tu historial.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => (
              <div 
                key={session.id}
                className="p-5 sm:p-6 bg-white/80 rounded-2xl border border-[#D7C8A5]/40 hover:border-[#BE6E55]/40 transition-all shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-bold text-[#503250]">
                      {new Date(session.sessionDate).toLocaleDateString('es-ES', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="text-[#A06446]">
                      {new Date(session.sessionDate).toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    {session.sessionNumberInPackage && (
                      <span className="text-[11px] bg-[#503250]/10 text-[#503250] px-2 py-0.5 rounded-full font-medium">
                        Sesión {session.sessionNumberInPackage} de paquete
                      </span>
                    )}
                  </div>

                  <h4 className="text-base font-semibold text-[#503250]">
                    {session.serviceName}
                  </h4>

                  <div className="text-xs text-[#1E1E1E]/70 flex flex-wrap items-center gap-2">
                    <span>Terapeuta: <strong>{session.therapistName}</strong></span>
                    {session.packageName && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-[#A06446]">{session.packageName}</span>
                      </>
                    )}
                  </div>

                  {session.administrativeNotes && (
                    <p className="text-xs text-[#1E1E1E]/60 italic mt-1 pt-1 border-t border-[#503250]/5">
                      Nota de seguimiento: {session.administrativeNotes}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 shrink-0 pt-2 md:pt-0">
                  <button
                    onClick={() => onWriteNoteForSession(session)}
                    className="px-4 py-2 rounded-xl bg-[#503250]/10 hover:bg-[#503250] text-[#503250] hover:text-[#F5F0E6] text-xs font-medium transition-all flex items-center gap-2"
                  >
                    <PenLine className="w-3.5 h-3.5" />
                    <span>Escribir reflexión</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
};
