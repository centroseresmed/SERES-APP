import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HomeSection } from './components/HomeSection';
import { SessionsAndPackagesSection } from './components/SessionsAndPackagesSection';
import { PersonalSpaceSection } from './components/PersonalSpaceSection';
import { SelfCareLibrarySection } from './components/SelfCareLibrarySection';
import { DailyGuideSection } from './components/DailyGuideSection';
import { ServicesSection } from './components/ServicesSection';
import { AdminPanelSection } from './components/AdminPanelSection';
import { Footer } from './components/Footer';
import { BreathingPacerModal } from './components/BreathingPacerModal';
import { SupabaseGuideModal } from './components/SupabaseGuideModal';
import { dataService } from './services/dataService';
import { UserProfile, Package, SessionRecord, PersonalNote, SelfCareResource } from './types';
import { ShieldCheck, UserCheck } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(dataService.getCurrentUser());
  const [activeTab, setActiveTab] = useState<string>('inicio');
  const [isBreathingPacerOpen, setIsBreathingPacerOpen] = useState<boolean>(false);
  const [isSupabaseGuideOpen, setIsSupabaseGuideOpen] = useState<boolean>(false);
  
  // Data state
  const [packages, setPackages] = useState<Package[]>(dataService.getPackages());
  const [sessions, setSessions] = useState<SessionRecord[]>(dataService.getSessions());
  const [movements, setMovements] = useState(dataService.getPackageMovements());
  const [notes, setNotes] = useState<PersonalNote[]>(dataService.getPersonalNotes());
  const [resources, setResources] = useState<SelfCareResource[]>(dataService.getSelfCareResources());
  const [services, setServices] = useState(dataService.getServicesAndGatherings());
  const [allUsers, setAllUsers] = useState(dataService.getUsers());

  // Navigation payload helpers
  const [initialNoteSession, setInitialNoteSession] = useState<SessionRecord | null>(null);

  // Subscribe to service updates
  useEffect(() => {
    const refreshData = () => {
      const user = dataService.getCurrentUser();
      setCurrentUser(user);
      setPackages(dataService.getPackages());
      setSessions(dataService.getSessions());
      setMovements(dataService.getPackageMovements());
      setNotes(dataService.getPersonalNotes());
      setResources(dataService.getSelfCareResources());
      setServices(dataService.getServicesAndGatherings());
      setAllUsers(dataService.getUsers());
    };

    const unsubscribe = dataService.subscribe(refreshData);
    return () => unsubscribe();
  }, []);

  const handleWriteNoteForSession = (session: SessionRecord) => {
    setInitialNoteSession(session);
    setActiveTab('espacio-personal');
  };

  const handleSelectResourceFromGuide = (resource: SelfCareResource) => {
    setActiveTab('autocuidado');
  };

  return (
    <div className="min-h-screen bg-[#F5F0E6] text-[#1E1E1E] flex flex-col font-sans selection:bg-[#BE6E55]/20 selection:text-[#503250]">
      
      {/* Top Bar Navigation */}
      <Header
        currentUser={currentUser}
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSupabaseGuide={() => setIsSupabaseGuideOpen(true)}
        onOpenBreathingPacer={() => setIsBreathingPacerOpen(true)}
      />

      {/* Persona Testing Bar: Visual confirmation of active role and instant test switch */}
      <div className="bg-[#D7C8A5]/25 border-b border-[#D7C8A5]/40 py-1.5 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-[#503250]">
            <span className="font-semibold text-[11px] uppercase tracking-wider">
              {currentUser?.role === 'admin' ? 'Modo Terapeuta / Administración' : 'Sesión de Cliente'}:
            </span>
            <span className="font-bold">{currentUser?.fullName}</span>
            <span className="text-[#1E1E1E]/60 text-[11px]">({currentUser?.email})</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#A06446]">Cambiar vista de prueba:</span>
            {allUsers.map((u) => (
              <button
                key={u.id}
                onClick={() => dataService.switchUser(u.id)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  currentUser?.id === u.id
                    ? 'bg-[#503250] text-[#F5F0E6]'
                    : 'bg-white/70 hover:bg-white text-[#503250] border border-[#D7C8A5]/60'
                }`}
              >
                {u.fullName.split(' ')[0]} ({u.role === 'admin' ? 'Admin' : 'Cliente'})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {activeTab === 'inicio' && (
          <HomeSection
            currentUser={currentUser}
            packages={packages}
            sessions={sessions}
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenBreathingPacer={() => setIsBreathingPacerOpen(true)}
          />
        )}

        {activeTab === 'sesiones' && (
          <SessionsAndPackagesSection
            packages={packages}
            sessions={sessions}
            movements={movements}
            onWriteNoteForSession={handleWriteNoteForSession}
          />
        )}

        {activeTab === 'espacio-personal' && (
          <PersonalSpaceSection
            notes={notes}
            sessions={sessions}
            onSaveNote={(noteData) => dataService.savePersonalNote(noteData)}
            onDeleteNote={(id) => dataService.deletePersonalNote(id)}
            initialEditingSession={initialNoteSession}
            onClearInitialSession={() => setInitialNoteSession(null)}
          />
        )}

        {activeTab === 'autocuidado' && (
          <SelfCareLibrarySection
            resources={resources}
            onOpenBreathingPacer={() => setIsBreathingPacerOpen(true)}
          />
        )}

        {activeTab === 'guia-diaria' && (
          <DailyGuideSection
            resources={resources}
            onSelectResource={handleSelectResourceFromGuide}
            onOpenBreathingPacer={() => setIsBreathingPacerOpen(true)}
          />
        )}

        {activeTab === 'servicios' && (
          <ServicesSection
            services={services}
          />
        )}

        {activeTab === 'admin' && currentUser?.role === 'admin' && (
          <AdminPanelSection
            currentUser={currentUser}
            users={allUsers}
            packages={packages}
            sessions={sessions}
            movements={movements}
          />
        )}
      </main>

      {/* Interactive Breathing Modal */}
      <BreathingPacerModal
        isOpen={isBreathingPacerOpen}
        onClose={() => setIsBreathingPacerOpen(false)}
      />

      {/* Supabase & Vercel Guide Modal */}
      <SupabaseGuideModal
        isOpen={isSupabaseGuideOpen}
        onClose={() => setIsSupabaseGuideOpen(false)}
      />

      {/* Footer */}
      <Footer
        onOpenSupabaseGuide={() => setIsSupabaseGuideOpen(true)}
        onNavigate={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
