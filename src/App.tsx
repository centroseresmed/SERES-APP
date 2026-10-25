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
import { AuthModal } from './components/AuthModal';
import { EditProfileModal } from './components/EditProfileModal';
import { dataService } from './services/dataService';
import { UserProfile, Package, SessionRecord, PersonalNote, SelfCareResource } from './types';
import { EyeOff } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(dataService.getCurrentUser());
  const [activeTab, setActiveTab] = useState<string>('inicio');
  const [isBreathingPacerOpen, setIsBreathingPacerOpen] = useState<boolean>(false);
  const [isSupabaseGuideOpen, setIsSupabaseGuideOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState<boolean>(false);
  
  // Barra de simulación opcional
  const [showTestingBar, setShowTestingBar] = useState<boolean>(() => {
    return localStorage.getItem('seres_show_test_bar') === 'true';
  });

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

  const handleToggleTestingBar = () => {
    const nextState = !showTestingBar;
    setShowTestingBar(nextState);
    localStorage.setItem('seres_show_test_bar', String(nextState));
  };

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
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenEditProfile={() => setIsEditProfileOpen(true)}
        showTestingBar={showTestingBar}
        onToggleTestingBar={handleToggleTestingBar}
      />

      {/* Barra de simulación opcional */}
      {showTestingBar && (
        <div className="bg-[#D7C8A5]/30 border-b border-[#D7C8A5]/50 py-1.5 px-4 text-xs animate-fade-in">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-[#503250]">
              <span className="font-semibold text-[11px] uppercase tracking-wider">
                Simulador de roles:
              </span>
              <span className="font-bold">{currentUser ? currentUser.fullName : 'Visitante Público'}</span>
              <span className="text-[#1E1E1E]/60 text-[11px]">({currentUser?.role === 'admin' ? 'Administradora' : currentUser ? 'Cliente' : 'Sin iniciar sesión'})</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[#A06446]">Cambiar vista:</span>
              <button
                onClick={() => dataService.logout()}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  !currentUser
                    ? 'bg-[#503250] text-[#F5F0E6]'
                    : 'bg-white/80 hover:bg-white text-[#503250] border border-[#D7C8A5]/60'
                }`}
              >
                Visitante (Público)
              </button>
              {allUsers.map((u) => (
                <button
                  key={u.id}
                  onClick={() => dataService.switchUser(u.id)}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                    currentUser?.id === u.id
                      ? 'bg-[#503250] text-[#F5F0E6]'
                      : 'bg-white/80 hover:bg-white text-[#503250] border border-[#D7C8A5]/60'
                  }`}
                >
                  {u.fullName.split(' ')[0]} ({u.role === 'admin' ? 'Admin' : 'Cliente'})
                </button>
              ))}

              <button
                onClick={handleToggleTestingBar}
                className="ml-2 text-[10px] text-[#503250]/70 hover:text-[#503250] flex items-center gap-1 font-semibold pl-2 border-l border-[#503250]/20"
                title="Ocultar para ver la presentación final limpia"
              >
                <EyeOff className="w-3 h-3" />
                <span>Ocultar</span>
              </button>
            </div>
          </div>
        </div>
      )}

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
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
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
            onOpenSupabaseGuide={() => setIsSupabaseGuideOpen(true)}
          />
        )}
      </main>

      {/* Modals */}
      <BreathingPacerModal
        isOpen={isBreathingPacerOpen}
        onClose={() => setIsBreathingPacerOpen(false)}
      />

      <SupabaseGuideModal
        isOpen={isSupabaseGuideOpen}
        onClose={() => setIsSupabaseGuideOpen(false)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => {
          setCurrentUser(dataService.getCurrentUser());
        }}
      />

      {currentUser && (
        <EditProfileModal
          isOpen={isEditProfileOpen}
          onClose={() => setIsEditProfileOpen(false)}
          currentUser={currentUser}
        />
      )}

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
