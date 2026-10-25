import React, { useState } from 'react';
import { 
  Shield, 
  UserCheck, 
  Plus, 
  RotateCcw, 
  Calendar, 
  Layers, 
  Search, 
  AlertCircle, 
  CheckCircle2, 
  Lock, 
  History,
  FileSpreadsheet,
  Settings,
  Database
} from 'lucide-react';
import { UserProfile, Package, SessionRecord, PackageMovement } from '../types';
import { dataService } from '../services/dataService';

interface AdminPanelSectionProps {
  currentUser: UserProfile;
  users: UserProfile[];
  packages: Package[];
  sessions: SessionRecord[];
  movements: PackageMovement[];
  onOpenSupabaseGuide?: () => void;
}

export const AdminPanelSection: React.FC<AdminPanelSectionProps> = ({
  currentUser,
  users,
  packages,
  sessions,
  movements,
  onOpenSupabaseGuide,
}) => {
  const [activeTab, setActiveTab] = useState<'asistencia' | 'nuevo-bono' | 'clientes' | 'correcciones'>('asistencia');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form State: Register Attendance
  const [selectedClientId, setSelectedClientId] = useState<string>(
    users.filter(u => u.role === 'client')[0]?.id || ''
  );
  const [attendanceServiceName, setAttendanceServiceName] = useState<string>('Terapia Somática Integrativa');
  const [attendancePackageId, setAttendancePackageId] = useState<string>('');
  const [attendanceTherapistName, setAttendanceTherapistName] = useState<string>(currentUser.fullName);
  const [attendanceDate, setAttendanceDate] = useState<string>(
    new Date().toISOString().slice(0, 16)
  );
  const [attendanceNotes, setAttendanceNotes] = useState<string>('');

  // Form State: Create Package
  const [newPkgClientId, setNewPkgClientId] = useState<string>(
    users.filter(u => u.role === 'client')[0]?.id || ''
  );
  const [newPkgName, setNewPkgName] = useState<string>('Bono 5 Sesiones · Terapias Integrativas');
  const [newPkgServiceType, setNewPkgServiceType] = useState<string>('Terapia Somática Integrativa');
  const [newPkgTotalSessions, setNewPkgTotalSessions] = useState<number>(5);
  const [newPkgExpiresAt, setNewPkgExpiresAt] = useState<string>('');
  const [newPkgNotes, setNewPkgNotes] = useState<string>('');

  // Form State: Correction
  const [selectedSessionToCorrect, setSelectedSessionToCorrect] = useState<string>('');
  const [correctionReason, setCorrectionReason] = useState<string>('');

  const clientUsers = users.filter(u => u.role === 'client');
  const clientPackages = packages.filter(p => p.clientId === selectedClientId && p.status === 'active');

  const handleRecordAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    const result = dataService.recordSessionAttendance({
      clientId: selectedClientId,
      therapistName: attendanceTherapistName.trim() || currentUser.fullName,
      packageId: attendancePackageId || undefined,
      serviceName: attendanceServiceName,
      sessionDate: new Date(attendanceDate).toISOString(),
      administrativeNotes: attendanceNotes.trim() || 'Asistencia presencial registrada por terapeuta.',
    });

    if (result.success) {
      setStatusMessage({
        type: 'success',
        text: `¡Asistencia registrada con éxito! ${attendancePackageId ? 'Se ha descontado 1 sesión del bono correspondiente con registro de auditoría.' : ''}`,
      });
      setAttendanceNotes('');
      setAttendancePackageId('');
    } else {
      setStatusMessage({
        type: 'error',
        text: result.error || 'Ocurrió un error al registrar la asistencia.',
      });
    }
  };

  const handleCreatePackage = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    const result = dataService.createPackage({
      clientId: newPkgClientId,
      name: newPkgName.trim(),
      serviceType: newPkgServiceType.trim(),
      totalSessions: Number(newPkgTotalSessions),
      expiresAt: newPkgExpiresAt || undefined,
      notes: newPkgNotes.trim() || undefined,
    });

    if (result.success) {
      setStatusMessage({
        type: 'success',
        text: `Bono creado exitosamente para el cliente. El saldo de ${newPkgTotalSessions} sesiones ya está activo en su cuenta.`,
      });
      setNewPkgNotes('');
    } else {
      setStatusMessage({
        type: 'error',
        text: result.error || 'Error al crear el paquete.',
      });
    }
  };

  const handleCorrection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSessionToCorrect || !correctionReason.trim()) return;

    const result = dataService.correctSessionAttendance(selectedSessionToCorrect, correctionReason.trim());
    if (result.success) {
      setStatusMessage({
        type: 'success',
        text: 'Corrección administrativa efectuada. Se ha cancelado la sesión y reincorporado la sesión al saldo del cliente si correspondía.',
      });
      setSelectedSessionToCorrect('');
      setCorrectionReason('');
    } else {
      setStatusMessage({
        type: 'error',
        text: result.error || 'Error al efectuar la corrección.',
      });
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#503250]/10 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-medium text-[#A06446]">
            <Shield className="w-4 h-4 text-[#503250]" />
            <span>Área Administrativa y Terapéutica</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-semibold text-[#503250] mt-1">
            Panel de Gestión SERES
          </h2>
          <p className="text-xs sm:text-sm text-[#1E1E1E]/75 mt-0.5">
            Registro fidedigno de asistencias presenciales, gestión de bonos y control de movimientos.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onOpenSupabaseGuide && (
            <button
              onClick={onOpenSupabaseGuide}
              className="px-3 py-1.5 rounded-xl border border-[#D7C8A5] bg-white text-[#503250] hover:bg-[#F5F0E6] text-xs font-medium flex items-center gap-1.5 transition-colors"
              title="Abrir guía de configuración de Supabase y Vercel"
            >
              <Database className="w-3.5 h-3.5 text-[#BE6E55]" />
              <span>Configuración Supabase</span>
            </button>
          )}

          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-2xl text-xs font-semibold shrink-0">
            <UserCheck className="w-4 h-4" />
            <span>{currentUser.fullName}</span>
          </div>
        </div>
      </div>

      {/* Status banner */}
      {statusMessage && (
        <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 text-xs ${
          statusMessage.type === 'success'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
            : 'bg-red-50 border-red-200 text-red-900'
        }`}>
          <div className="flex items-center gap-2">
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-xs font-bold opacity-60 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[#503250]/10 pb-2 overflow-x-auto">
        <button
          onClick={() => { setActiveTab('asistencia'); setStatusMessage(null); }}
          className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
            activeTab === 'asistencia' ? 'bg-[#503250] text-[#F5F0E6]' : 'text-[#503250]/70 hover:bg-[#503250]/5'
          }`}
        >
          1. Registrar Asistencia
        </button>
        <button
          onClick={() => { setActiveTab('nuevo-bono'); setStatusMessage(null); }}
          className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
            activeTab === 'nuevo-bono' ? 'bg-[#503250] text-[#F5F0E6]' : 'text-[#503250]/70 hover:bg-[#503250]/5'
          }`}
        >
          2. Crear Nuevo Bono
        </button>
        <button
          onClick={() => { setActiveTab('clientes'); setStatusMessage(null); }}
          className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
            activeTab === 'clientes' ? 'bg-[#503250] text-[#F5F0E6]' : 'text-[#503250]/70 hover:bg-[#503250]/5'
          }`}
        >
          3. Listado de Clientes y Bonos
        </button>
        <button
          onClick={() => { setActiveTab('correcciones'); setStatusMessage(null); }}
          className={`px-4 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
            activeTab === 'correcciones' ? 'bg-[#503250] text-[#F5F0E6]' : 'text-[#503250]/70 hover:bg-[#503250]/5'
          }`}
        >
          4. Corrección Autorizada
        </button>
      </div>

      {/* Tab 1: Registrar Asistencia */}
      {activeTab === 'asistencia' && (
        <form onSubmit={handleRecordAttendance} className="p-6 sm:p-8 bg-white rounded-3xl border border-[#D7C8A5]/50 shadow-sm space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-[#503250] flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-[#BE6E55]" />
              <span>Registrar Asistencia Presencial</span>
            </h3>
            <p className="text-xs text-[#1E1E1E]/70">
              Solo debe registrarse cuando la persona ha acudido a la sesión. Al vincularla a un bono, se descontará una sesión y se generará un movimiento auditable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#503250] mb-1">
                Cliente <span className="text-red-500">*</span>
              </label>
              {clientUsers.length === 0 ? (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
                  Aún no hay clientes registrados. Cuando tus clientes se registren desde la app, aparecerán en este menú.
                </div>
              ) : (
                <select
                  value={selectedClientId}
                  onChange={(e) => {
                    setSelectedClientId(e.target.value);
                    setAttendancePackageId('');
                  }}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#D7C8A5] bg-[#F5F0E6]/30 text-xs focus:outline-none focus:ring-2 focus:ring-[#503250]/20"
                  required
                >
                  {clientUsers.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.fullName} ({u.email})
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#503250] mb-1">
                Bono a descontar (opcional si es sesión suelta)
              </label>
              <select
                value={attendancePackageId}
                onChange={(e) => setAttendancePackageId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#D7C8A5] bg-[#F5F0E6]/30 text-xs focus:outline-none focus:ring-2 focus:ring-[#503250]/20"
              >
                <option value="">Ninguno (Cobro individual o sesión de prueba)</option>
                {clientPackages.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — Quedan {p.totalSessions - p.sessionsUsed} de {p.totalSessions}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#503250] mb-1">
                Servicio realizado <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={attendanceServiceName}
                onChange={(e) => setAttendanceServiceName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#D7C8A5] bg-[#F5F0E6]/30 text-xs focus:outline-none focus:ring-2 focus:ring-[#503250]/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#503250] mb-1">
                Terapeuta responsable <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={attendanceTherapistName}
                onChange={(e) => setAttendanceTherapistName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#D7C8A5] bg-[#F5F0E6]/30 text-xs focus:outline-none focus:ring-2 focus:ring-[#503250]/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#503250] mb-1">
                Fecha y hora de la sesión <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                required
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#D7C8A5] bg-[#F5F0E6]/30 text-xs focus:outline-none focus:ring-2 focus:ring-[#503250]/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#503250] mb-1">
              Observaciones administrativas o técnicas (no confidenciales)
            </label>
            <textarea
              rows={2}
              value={attendanceNotes}
              onChange={(e) => setAttendanceNotes(e.target.value)}
              placeholder="Ej. Sesión presencial completada puntualmente."
              className="w-full px-4 py-2.5 rounded-xl border border-[#D7C8A5] bg-[#F5F0E6]/30 text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#503250]/20"
            />
          </div>

          <div className="flex justify-end pt-3 border-t border-[#503250]/10">
            <button
              type="submit"
              disabled={clientUsers.length === 0}
              className="px-6 py-2.5 rounded-xl bg-[#503250] hover:bg-[#3d263d] text-[#F5F0E6] text-xs font-medium transition-all shadow-md shadow-[#503250]/15 flex items-center gap-2 disabled:opacity-40"
            >
              <CheckCircle2 className="w-4 h-4 text-[#D7C8A5]" />
              <span>Confirmar y Descontar Sesión</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Crear Nuevo Bono */}
      {activeTab === 'nuevo-bono' && (
        <form onSubmit={handleCreatePackage} className="p-6 sm:p-8 bg-white rounded-3xl border border-[#D7C8A5]/50 shadow-sm space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-[#503250] flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#BE6E55]" />
              <span>Alta de Nuevo Paquete / Bono para Cliente</span>
            </h3>
            <p className="text-xs text-[#1E1E1E]/70">
              Registra la compra de un paquete de sesiones para un cliente.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#503250] mb-1">
                Cliente asignado <span className="text-red-500">*</span>
              </label>
              {clientUsers.length === 0 ? (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
                  Primero debe registrarse al menos un cliente en la app para asignarle un bono.
                </div>
              ) : (
                <select
                  value={newPkgClientId}
                  onChange={(e) => setNewPkgClientId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#D7C8A5] bg-[#F5F0E6]/30 text-xs focus:outline-none focus:ring-2 focus:ring-[#503250]/20"
                  required
                >
                  {clientUsers.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.fullName} ({u.email})
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#503250] mb-1">
                Nombre del paquete <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={newPkgName}
                onChange={(e) => setNewPkgName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#D7C8A5] bg-[#F5F0E6]/30 text-xs focus:outline-none focus:ring-2 focus:ring-[#503250]/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#503250] mb-1">
                Tipo de servicio <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={newPkgServiceType}
                onChange={(e) => setNewPkgServiceType(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#D7C8A5] bg-[#F5F0E6]/30 text-xs focus:outline-none focus:ring-2 focus:ring-[#503250]/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#503250] mb-1">
                Número de sesiones adquiridas <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                max="20"
                required
                value={newPkgTotalSessions}
                onChange={(e) => setNewPkgTotalSessions(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-[#D7C8A5] bg-[#F5F0E6]/30 text-xs focus:outline-none focus:ring-2 focus:ring-[#503250]/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#503250] mb-1">
                Fecha de vencimiento (si aplica)
              </label>
              <input
                type="date"
                value={newPkgExpiresAt}
                onChange={(e) => setNewPkgExpiresAt(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#D7C8A5] bg-[#F5F0E6]/30 text-xs focus:outline-none focus:ring-2 focus:ring-[#503250]/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#503250] mb-1">
              Notas administrativas
            </label>
            <input
              type="text"
              value={newPkgNotes}
              onChange={(e) => setNewPkgNotes(e.target.value)}
              placeholder="Ej. Adquirido en recepción. Pago completado."
              className="w-full px-4 py-2.5 rounded-xl border border-[#D7C8A5] bg-[#F5F0E6]/30 text-xs focus:outline-none focus:ring-2 focus:ring-[#503250]/20"
            />
          </div>

          <div className="flex justify-end pt-3 border-t border-[#503250]/10">
            <button
              type="submit"
              disabled={clientUsers.length === 0}
              className="px-6 py-2.5 rounded-xl bg-[#503250] hover:bg-[#3d263d] text-[#F5F0E6] text-xs font-medium transition-all shadow-md shadow-[#503250]/15 flex items-center gap-2 disabled:opacity-40"
            >
              <Plus className="w-4 h-4 text-[#D7C8A5]" />
              <span>Dar de alta paquete</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab 3: Listado de Clientes y Bonos */}
      {activeTab === 'clientes' && (
        <div className="space-y-6">
          <div className="p-4 bg-white/70 rounded-2xl border border-[#D7C8A5]/40 flex items-center justify-between text-xs">
            <span className="font-semibold text-[#503250]">Total de clientes registrados: {clientUsers.length}</span>
            <span className="text-[#A06446]">Total de bonos activos: {packages.filter(p => p.status === 'active').length}</span>
          </div>

          {clientUsers.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-3xl border border-[#D7C8A5]/40 text-xs text-[#1E1E1E]/60">
              Aún no hay clientes registrados en la aplicación. Invítalos a crear su cuenta con su correo desde el botón "Ingresar".
            </div>
          ) : (
            <div className="space-y-4">
              {clientUsers.map((client) => {
                const pkgs = packages.filter(p => p.clientId === client.id);
                const clientSess = sessions.filter(s => s.clientId === client.id);

                return (
                  <div key={client.id} className="p-6 bg-white rounded-3xl border border-[#D7C8A5]/50 shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#503250]/10 pb-3">
                      <div>
                        <h4 className="text-base font-bold text-[#503250]">
                          {client.fullName}
                        </h4>
                        <p className="text-xs text-[#1E1E1E]/60">
                          {client.email} · {client.phone || 'Sin teléfono'}
                        </p>
                      </div>

                      <div className="text-xs text-right">
                        <span className="text-[#503250] font-semibold">
                          {clientSess.length} asistencias registradas
                        </span>
                      </div>
                    </div>

                    {/* Packages for this client */}
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#A06446] block mb-2">
                        Bonos vinculados ({pkgs.length})
                      </span>

                      {pkgs.length === 0 ? (
                        <p className="text-xs text-[#1E1E1E]/50 italic">Sin bonos asignados.</p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {pkgs.map((p) => (
                            <div key={p.id} className="p-3.5 rounded-2xl bg-[#F5F0E6]/50 border border-[#D7C8A5]/40 text-xs space-y-1">
                              <div className="flex items-center justify-between font-semibold text-[#503250]">
                                <span>{p.name}</span>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                                  p.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-700'
                                }`}>
                                  {p.status}
                                </span>
                              </div>
                              <div className="text-[11px] text-[#1E1E1E]/70 flex items-center justify-between">
                                <span>Consumidas: {p.sessionsUsed} de {p.totalSessions}</span>
                                <span className="font-bold text-[#BE6E55]">
                                  {p.totalSessions - p.sessionsUsed} disponibles
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Privacy reminder on client's personal notes */}
                    <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-[11px] text-gray-600 flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                      <span>Las notas de reflexión personal de {client.fullName} están protegidas y no son accesibles para la administración.</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Corrección Autorizada */}
      {activeTab === 'correcciones' && (
        <form onSubmit={handleCorrection} className="p-6 sm:p-8 bg-white rounded-3xl border border-[#D7C8A5]/50 shadow-sm space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-[#503250] flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-amber-600" />
              <span>Procedimiento de Corrección de Asistencia</span>
            </h3>
            <p className="text-xs text-[#1E1E1E]/70">
              Si se registró por error una asistencia, este procedimiento revierte la sesión al bono del cliente y deja una justificación auditada.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#503250] mb-1">
              Seleccionar sesión a corregir <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedSessionToCorrect}
              onChange={(e) => setSelectedSessionToCorrect(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#D7C8A5] bg-[#F5F0E6]/30 text-xs focus:outline-none focus:ring-2 focus:ring-[#503250]/20"
              required
            >
              <option value="">Selecciona una sesión confirmada...</option>
              {sessions.filter(s => s.status === 'confirmed').map((s) => (
                <option key={s.id} value={s.id}>
                  {s.clientName || 'Cliente'} — {s.serviceName} ({new Date(s.sessionDate).toLocaleDateString('es-ES')}) [{s.packageName || 'Sin bono'}]
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#503250] mb-1">
              Motivo o justificación de la corrección <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={correctionReason}
              onChange={(e) => setCorrectionReason(e.target.value)}
              placeholder="Ej. Registro duplicado por error de tipeo en recepción"
              className="w-full px-4 py-2.5 rounded-xl border border-[#D7C8A5] bg-[#F5F0E6]/30 text-xs focus:outline-none focus:ring-2 focus:ring-[#503250]/20"
            />
          </div>

          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 text-xs">
            <strong>Efecto de esta acción:</strong> La sesión pasará a estado cancelada y, si estaba vinculada a un bono con sesiones descontadas, se reintegrará 1 sesión al saldo del cliente con constancia del cambio en el historial.
          </div>

          <div className="flex justify-end pt-3 border-t border-[#503250]/10">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-medium transition-all shadow-md flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Ejecutar corrección auditada</span>
            </button>
          </div>
        </form>
      )}

    </div>
  );
};
