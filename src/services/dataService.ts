import { 
  UserProfile, 
  Package, 
  PackageMovement, 
  SessionRecord, 
  PersonalNote, 
  SelfCareResource, 
  ServiceOrGathering, 
  ReferralLead 
} from '../types';
import { 
  INITIAL_USERS, 
  INITIAL_PACKAGES, 
  INITIAL_PACKAGE_MOVEMENTS, 
  INITIAL_SESSIONS, 
  INITIAL_PERSONAL_NOTES, 
  INITIAL_SELF_CARE_RESOURCES, 
  INITIAL_SERVICES, 
  INITIAL_REFERRALS 
} from './seedData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const STORAGE_KEYS = {
  CURRENT_USER: 'seres_current_user_v1',
  USERS: 'seres_users_v1',
  PACKAGES: 'seres_packages_v1',
  MOVEMENTS: 'seres_movements_v1',
  SESSIONS: 'seres_sessions_v1',
  PERSONAL_NOTES: 'seres_personal_notes_v1',
  RESOURCES: 'seres_resources_v1',
  SERVICES: 'seres_services_v1',
  REFERRALS: 'seres_referrals_v1',
};

// Helper for local storage retrieval with default fallback
function getLocalItem<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.error(`Error reading ${key} from localStorage:`, err);
    return defaultValue;
  }
}

function setLocalItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error writing ${key} to localStorage:`, err);
  }
}

class DataService {
  private currentUser: UserProfile | null = null;
  private listeners: (() => void)[] = [];

  constructor() {
    this.initializeData();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify(): void {
    this.listeners.forEach(l => l());
  }

  private initializeData(): void {
    // If local storage is empty, populate with seed data
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      setLocalItem(STORAGE_KEYS.USERS, INITIAL_USERS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.PACKAGES)) {
      setLocalItem(STORAGE_KEYS.PACKAGES, INITIAL_PACKAGES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.MOVEMENTS)) {
      setLocalItem(STORAGE_KEYS.MOVEMENTS, INITIAL_PACKAGE_MOVEMENTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.SESSIONS)) {
      setLocalItem(STORAGE_KEYS.SESSIONS, INITIAL_SESSIONS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.PERSONAL_NOTES)) {
      setLocalItem(STORAGE_KEYS.PERSONAL_NOTES, INITIAL_PERSONAL_NOTES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.RESOURCES)) {
      setLocalItem(STORAGE_KEYS.RESOURCES, INITIAL_SELF_CARE_RESOURCES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.SERVICES)) {
      setLocalItem(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.REFERRALS)) {
      setLocalItem(STORAGE_KEYS.REFERRALS, INITIAL_REFERRALS);
    }

    // Set initial user if none exists
    const storedUser = getLocalItem<UserProfile | null>(STORAGE_KEYS.CURRENT_USER, null);
    if (storedUser) {
      this.currentUser = storedUser;
    } else {
      // Default to Ana María (client) for initial test
      this.currentUser = INITIAL_USERS[0];
      setLocalItem(STORAGE_KEYS.CURRENT_USER, this.currentUser);
    }
  }

  // --- AUTH & USER CONTEXT ---
  public getCurrentUser(): UserProfile | null {
    return this.currentUser;
  }

  public switchUser(userId: string): void {
    const allUsers = this.getUsers();
    const found = allUsers.find(u => u.id === userId);
    if (found) {
      this.currentUser = found;
      setLocalItem(STORAGE_KEYS.CURRENT_USER, found);
      this.notify();
    }
  }

  public async loginWithEmail(email: string): Promise<{ success: boolean; message?: string }> {
    if (isSupabaseConfigured && supabase) {
      // Supabase Auth call if configured
      try {
        const { error } = await supabase.auth.signInWithOtp({ email });
        if (error) throw error;
        return { success: true, message: 'Enlace mágico de acceso enviado a tu correo.' };
      } catch (err: any) {
        return { success: false, message: err?.message || 'Error al iniciar sesión con Supabase' };
      }
    }

    // Local simulated auth
    const allUsers = this.getUsers();
    const found = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      this.currentUser = found;
      setLocalItem(STORAGE_KEYS.CURRENT_USER, found);
      this.notify();
      return { success: true };
    } else {
      // Create a new client account
      const newUser: UserProfile = {
        id: `user-${Date.now()}`,
        email,
        fullName: email.split('@')[0],
        role: 'client',
        createdAt: new Date().toISOString(),
      };
      allUsers.push(newUser);
      setLocalItem(STORAGE_KEYS.USERS, allUsers);
      this.currentUser = newUser;
      setLocalItem(STORAGE_KEYS.CURRENT_USER, newUser);
      this.notify();
      return { success: true };
    }
  }

  public logout(): void {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.signOut().catch(console.error);
    }
    this.currentUser = null;
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    this.notify();
  }

  public getUsers(): UserProfile[] {
    return getLocalItem<UserProfile[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
  }

  // --- PACKAGES & SESSIONS WITH RLS ENFORCEMENT ---
  public getPackages(): Package[] {
    const allPackages = getLocalItem<Package[]>(STORAGE_KEYS.PACKAGES, INITIAL_PACKAGES);
    if (!this.currentUser) return [];

    // RLS: Client can ONLY see their own packages; Admin can see all packages
    if (this.currentUser.role === 'admin') {
      return allPackages;
    }
    return allPackages.filter(p => p.clientId === this.currentUser!.id);
  }

  public getPackageMovements(packageId?: string): PackageMovement[] {
    const allMovements = getLocalItem<PackageMovement[]>(STORAGE_KEYS.MOVEMENTS, INITIAL_PACKAGE_MOVEMENTS);
    if (!this.currentUser) return [];

    let filtered = allMovements;
    if (this.currentUser.role !== 'admin') {
      filtered = filtered.filter(m => m.clientId === this.currentUser!.id);
    }
    if (packageId) {
      filtered = filtered.filter(m => m.packageId === packageId);
    }
    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getSessions(): SessionRecord[] {
    const allSessions = getLocalItem<SessionRecord[]>(STORAGE_KEYS.SESSIONS, INITIAL_SESSIONS);
    if (!this.currentUser) return [];

    // RLS: Client can ONLY see their own sessions; Admin sees all sessions
    if (this.currentUser.role === 'admin') {
      return allSessions.sort((a, b) => new Date(b.sessionDate).getTime() - new Date(a.sessionDate).getTime());
    }
    return allSessions
      .filter(s => s.clientId === this.currentUser!.id)
      .sort((a, b) => new Date(b.sessionDate).getTime() - new Date(a.sessionDate).getTime());
  }

  // --- ADMIN ACTIONS FOR SESSIONS & ATTENDANCES ---
  public recordSessionAttendance(params: {
    clientId: string;
    therapistName: string;
    packageId?: string;
    serviceName: string;
    sessionDate: string;
    administrativeNotes?: string;
  }): { success: boolean; session?: SessionRecord; error?: string } {
    if (!this.currentUser || this.currentUser.role !== 'admin') {
      return { success: false, error: 'Acceso denegado: solo personal autorizado puede registrar asistencias.' };
    }

    const allUsers = this.getUsers();
    const client = allUsers.find(u => u.id === params.clientId);
    if (!client) {
      return { success: false, error: 'Cliente no encontrado.' };
    }

    const allPackages = getLocalItem<Package[]>(STORAGE_KEYS.PACKAGES, INITIAL_PACKAGES);
    const allMovements = getLocalItem<PackageMovement[]>(STORAGE_KEYS.MOVEMENTS, INITIAL_PACKAGE_MOVEMENTS);
    const allSessions = getLocalItem<SessionRecord[]>(STORAGE_KEYS.SESSIONS, INITIAL_SESSIONS);

    let assignedPackage: Package | undefined;
    let sessionNumberInPackage: number | undefined;

    if (params.packageId) {
      assignedPackage = allPackages.find(p => p.id === params.packageId && p.clientId === params.clientId);
      if (!assignedPackage) {
        return { success: false, error: 'El paquete indicado no pertenece a este cliente.' };
      }
      if (assignedPackage.sessionsUsed >= assignedPackage.totalSessions) {
        return { success: false, error: 'Este paquete ya no tiene sesiones disponibles.' };
      }

      // Deduct 1 session safely
      assignedPackage.sessionsUsed += 1;
      if (assignedPackage.sessionsUsed >= assignedPackage.totalSessions) {
        assignedPackage.status = 'completed';
      }
      assignedPackage.updatedAt = new Date().toISOString();
      sessionNumberInPackage = assignedPackage.sessionsUsed;

      // Create verifiable immutable movement record
      const movement: PackageMovement = {
        id: `mov-${Date.now()}`,
        packageId: assignedPackage.id,
        clientId: params.clientId,
        changeAmount: -1,
        reason: `Asistencia confirmada a sesión ${sessionNumberInPackage}/${assignedPackage.totalSessions}`,
        recordedByName: this.currentUser.fullName,
        createdAt: new Date().toISOString(),
      };
      allMovements.push(movement);
    }

    // Create session record
    const newSession: SessionRecord = {
      id: `ses-${Date.now()}`,
      clientId: params.clientId,
      clientName: client.fullName,
      therapistName: params.therapistName,
      packageId: assignedPackage?.id,
      packageName: assignedPackage?.name,
      serviceName: params.serviceName,
      sessionDate: params.sessionDate,
      status: 'confirmed',
      sessionNumberInPackage,
      administrativeNotes: params.administrativeNotes || 'Asistencia presencial registrada por terapeuta.',
      createdAt: new Date().toISOString(),
    };

    allSessions.unshift(newSession);

    // Save state
    setLocalItem(STORAGE_KEYS.PACKAGES, allPackages);
    setLocalItem(STORAGE_KEYS.MOVEMENTS, allMovements);
    setLocalItem(STORAGE_KEYS.SESSIONS, allSessions);
    this.notify();

    return { success: true, session: newSession };
  }

  // Administrative correction for attendance if registered by error
  public correctSessionAttendance(sessionId: string, reason: string): { success: boolean; error?: string } {
    if (!this.currentUser || this.currentUser.role !== 'admin') {
      return { success: false, error: 'Acceso denegado.' };
    }

    const allSessions = getLocalItem<SessionRecord[]>(STORAGE_KEYS.SESSIONS, INITIAL_SESSIONS);
    const session = allSessions.find(s => s.id === sessionId);
    if (!session) {
      return { success: false, error: 'Sesión no encontrada.' };
    }

    if (session.status === 'cancelled') {
      return { success: false, error: 'Esta sesión ya se encuentra cancelada o corregida.' };
    }

    session.status = 'cancelled';
    session.administrativeNotes = `${session.administrativeNotes || ''} [CORRECCIÓN ADMINISTRATIVA: ${reason}]`;

    // If linked to a package, revert the consumed session
    if (session.packageId) {
      const allPackages = getLocalItem<Package[]>(STORAGE_KEYS.PACKAGES, INITIAL_PACKAGES);
      const pkg = allPackages.find(p => p.id === session.packageId);
      if (pkg && pkg.sessionsUsed > 0) {
        pkg.sessionsUsed -= 1;
        if (pkg.status === 'completed') {
          pkg.status = 'active';
        }
        pkg.updatedAt = new Date().toISOString();

        const allMovements = getLocalItem<PackageMovement[]>(STORAGE_KEYS.MOVEMENTS, INITIAL_PACKAGE_MOVEMENTS);
        const correctionMovement: PackageMovement = {
          id: `mov-${Date.now()}`,
          packageId: pkg.id,
          clientId: session.clientId,
          changeAmount: 1, // Restore 1 session
          reason: `Corrección autorizada: ${reason}`,
          recordedByName: this.currentUser.fullName,
          createdAt: new Date().toISOString(),
        };
        allMovements.push(correctionMovement);
        setLocalItem(STORAGE_KEYS.PACKAGES, allPackages);
        setLocalItem(STORAGE_KEYS.MOVEMENTS, allMovements);
      }
    }

    setLocalItem(STORAGE_KEYS.SESSIONS, allSessions);
    this.notify();
    return { success: true };
  }

  // Admin creates package for a client
  public createPackage(params: {
    clientId: string;
    name: string;
    serviceType: string;
    totalSessions: number;
    expiresAt?: string;
    notes?: string;
  }): { success: boolean; package?: Package; error?: string } {
    if (!this.currentUser || this.currentUser.role !== 'admin') {
      return { success: false, error: 'Solo la administración puede crear paquetes.' };
    }

    const allUsers = this.getUsers();
    const client = allUsers.find(u => u.id === params.clientId);
    if (!client) {
      return { success: false, error: 'Cliente no válido.' };
    }

    const allPackages = getLocalItem<Package[]>(STORAGE_KEYS.PACKAGES, INITIAL_PACKAGES);
    const newPkg: Package = {
      id: `pkg-${Date.now()}`,
      clientId: params.clientId,
      clientName: client.fullName,
      name: params.name,
      serviceType: params.serviceType,
      totalSessions: params.totalSessions,
      sessionsUsed: 0,
      purchaseDate: new Date().toISOString().split('T')[0],
      status: 'active',
      expiresAt: params.expiresAt,
      notes: params.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    allPackages.push(newPkg);
    setLocalItem(STORAGE_KEYS.PACKAGES, allPackages);
    this.notify();
    return { success: true, package: newPkg };
  }

  // --- PERSONAL NOTES (STRICT PRIVACY - CLIENT ONLY) ---
  public getPersonalNotes(): PersonalNote[] {
    if (!this.currentUser) return [];

    // CRITICAL SECURITY ENFORCEMENT:
    // If the user is an admin, they CANNOT view personal notes of clients.
    // They only see their own notes (if any).
    const allNotes = getLocalItem<PersonalNote[]>(STORAGE_KEYS.PERSONAL_NOTES, INITIAL_PERSONAL_NOTES);
    return allNotes
      .filter(n => n.clientId === this.currentUser!.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public savePersonalNote(note: {
    id?: string;
    sessionId?: string;
    sessionTitle?: string;
    title?: string;
    reflections: string;
    learnings?: string;
    questionsToExplore?: string;
  }): { success: boolean; note?: PersonalNote; error?: string } {
    if (!this.currentUser) {
      return { success: false, error: 'Debes iniciar sesión para guardar notas personales.' };
    }

    const allNotes = getLocalItem<PersonalNote[]>(STORAGE_KEYS.PERSONAL_NOTES, INITIAL_PERSONAL_NOTES);
    const now = new Date().toISOString();

    if (note.id) {
      // Edit existing note
      const index = allNotes.findIndex(n => n.id === note.id && n.clientId === this.currentUser!.id);
      if (index === -1) {
        return { success: false, error: 'Nota no encontrada o no tienes permisos para modificarla.' };
      }
      allNotes[index] = {
        ...allNotes[index],
        title: note.title,
        sessionId: note.sessionId,
        sessionTitle: note.sessionTitle,
        reflections: note.reflections,
        learnings: note.learnings,
        questionsToExplore: note.questionsToExplore,
        updatedAt: now,
      };
      setLocalItem(STORAGE_KEYS.PERSONAL_NOTES, allNotes);
      this.notify();
      return { success: true, note: allNotes[index] };
    } else {
      // Create new note
      const newNote: PersonalNote = {
        id: `note-${Date.now()}`,
        clientId: this.currentUser.id,
        sessionId: note.sessionId,
        sessionTitle: note.sessionTitle,
        title: note.title,
        reflections: note.reflections,
        learnings: note.learnings,
        questionsToExplore: note.questionsToExplore,
        createdAt: now,
        updatedAt: now,
      };
      allNotes.unshift(newNote);
      setLocalItem(STORAGE_KEYS.PERSONAL_NOTES, allNotes);
      this.notify();
      return { success: true, note: newNote };
    }
  }

  public deletePersonalNote(noteId: string): { success: boolean; error?: string } {
    if (!this.currentUser) return { success: false, error: 'No autorizado' };

    const allNotes = getLocalItem<PersonalNote[]>(STORAGE_KEYS.PERSONAL_NOTES, INITIAL_PERSONAL_NOTES);
    const updated = allNotes.filter(n => !(n.id === noteId && n.clientId === this.currentUser!.id));
    setLocalItem(STORAGE_KEYS.PERSONAL_NOTES, updated);
    this.notify();
    return { success: true };
  }

  // --- SELF CARE RESOURCES ---
  public getSelfCareResources(): SelfCareResource[] {
    const all = getLocalItem<SelfCareResource[]>(STORAGE_KEYS.RESOURCES, INITIAL_SELF_CARE_RESOURCES);
    if (this.currentUser?.role === 'admin') {
      return all;
    }
    return all.filter(r => r.isPublished);
  }

  public saveSelfCareResource(resource: Partial<SelfCareResource>): { success: boolean; error?: string } {
    if (!this.currentUser || this.currentUser.role !== 'admin') {
      return { success: false, error: 'Solo la administración puede gestionar recursos de autocuidado.' };
    }

    const all = getLocalItem<SelfCareResource[]>(STORAGE_KEYS.RESOURCES, INITIAL_SELF_CARE_RESOURCES);
    if (resource.id) {
      const idx = all.findIndex(r => r.id === resource.id);
      if (idx !== -1) {
        all[idx] = { ...all[idx], ...resource } as SelfCareResource;
      }
    } else {
      const newRes: SelfCareResource = {
        id: `res-${Date.now()}`,
        title: resource.title || 'Práctica de autocuidado',
        slug: (resource.title || 'practica').toLowerCase().replace(/\s+/g, '-'),
        category: resource.category || 'body_connection',
        categoryLabel: resource.categoryLabel || 'Conexión corporal',
        description: resource.description || '',
        practicalGoal: resource.practicalGoal || '',
        approxDurationMinutes: resource.approxDurationMinutes || 5,
        stepByStepInstructions: resource.stepByStepInstructions || [],
        precautions: resource.precautions,
        tags: resource.tags || [],
        imageUrl: resource.imageUrl,
        audioUrl: resource.audioUrl,
        integrationQuestion: resource.integrationQuestion,
        isPublished: resource.isPublished ?? true,
      };
      all.unshift(newRes);
    }
    setLocalItem(STORAGE_KEYS.RESOURCES, all);
    this.notify();
    return { success: true };
  }

  // --- SERVICES AND GATHERINGS ---
  public getServicesAndGatherings(): ServiceOrGathering[] {
    const all = getLocalItem<ServiceOrGathering[]>(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
    if (this.currentUser?.role === 'admin') {
      return all;
    }
    return all.filter(s => s.isPublished);
  }

  public saveServiceOrGathering(item: Partial<ServiceOrGathering>): { success: boolean; error?: string } {
    if (!this.currentUser || this.currentUser.role !== 'admin') {
      return { success: false, error: 'Solo la administración puede gestionar servicios y encuentros.' };
    }

    const all = getLocalItem<ServiceOrGathering[]>(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
    if (item.id) {
      const idx = all.findIndex(s => s.id === item.id);
      if (idx !== -1) {
        all[idx] = { ...all[idx], ...item } as ServiceOrGathering;
      }
    } else {
      const newItem: ServiceOrGathering = {
        id: `srv-${Date.now()}`,
        title: item.title || 'Nuevo servicio',
        itemType: item.itemType || 'service',
        description: item.description || '',
        durationText: item.durationText,
        priceText: item.priceText,
        scheduledAt: item.scheduledAt,
        imageUrl: item.imageUrl,
        contactActionUrl: item.contactActionUrl,
        isPublished: item.isPublished ?? true,
      };
      all.unshift(newItem);
    }
    setLocalItem(STORAGE_KEYS.SERVICES, all);
    this.notify();
    return { success: true };
  }

  // --- REFERRALS (ARCHITECTURAL PREPARATION) ---
  public getReferrals(): ReferralLead[] {
    if (!this.currentUser) return [];
    const all = getLocalItem<ReferralLead[]>(STORAGE_KEYS.REFERRALS, INITIAL_REFERRALS);
    if (this.currentUser.role === 'admin') {
      return all;
    }
    return all.filter(r => r.referrerClientId === this.currentUser!.id);
  }

  public registerReferral(referredName: string, referredContact?: string): { success: boolean; error?: string } {
    if (!this.currentUser) return { success: false, error: 'Debes iniciar sesión.' };

    const all = getLocalItem<ReferralLead[]>(STORAGE_KEYS.REFERRALS, INITIAL_REFERRALS);
    const newRef: ReferralLead = {
      id: `ref-${Date.now()}`,
      referrerClientId: this.currentUser.id,
      referredName,
      referredContact,
      status: 'registered',
      notes: 'Registrado por cliente. Pendiente de verificación presencial.',
      createdAt: new Date().toISOString(),
    };
    all.unshift(newRef);
    setLocalItem(STORAGE_KEYS.REFERRALS, all);
    this.notify();
    return { success: true };
  }

  // Reset to initial seed state
  public resetToDefaultSeed(): void {
    setLocalItem(STORAGE_KEYS.USERS, INITIAL_USERS);
    setLocalItem(STORAGE_KEYS.PACKAGES, INITIAL_PACKAGES);
    setLocalItem(STORAGE_KEYS.MOVEMENTS, INITIAL_PACKAGE_MOVEMENTS);
    setLocalItem(STORAGE_KEYS.SESSIONS, INITIAL_SESSIONS);
    setLocalItem(STORAGE_KEYS.PERSONAL_NOTES, INITIAL_PERSONAL_NOTES);
    setLocalItem(STORAGE_KEYS.RESOURCES, INITIAL_SELF_CARE_RESOURCES);
    setLocalItem(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
    setLocalItem(STORAGE_KEYS.REFERRALS, INITIAL_REFERRALS);
    this.currentUser = INITIAL_USERS[0];
    setLocalItem(STORAGE_KEYS.CURRENT_USER, this.currentUser);
    this.notify();
  }
}

export const dataService = new DataService();
