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

// Versión v3 para limpiar sesiones automáticas previas
const STORAGE_KEYS = {
  CURRENT_USER: 'seres_current_user_v3',
  USERS: 'seres_users_v3',
  PACKAGES: 'seres_packages_v3',
  MOVEMENTS: 'seres_movements_v3',
  SESSIONS: 'seres_sessions_v3',
  PERSONAL_NOTES: 'seres_personal_notes_v3',
  RESOURCES: 'seres_resources_v3',
  SERVICES: 'seres_services_v3',
  REFERRALS: 'seres_referrals_v3',
};

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

    // CRUCIAL: Un visitante nuevo que abre el link NO está autenticado (currentUser = null)
    // Así nadie que entre ve la app como administradora por error.
    const storedUser = getLocalItem<UserProfile | null>(STORAGE_KEYS.CURRENT_USER, null);
    this.currentUser = storedUser;
  }

  // --- AUTH & USER PROFILE ---
  public getCurrentUser(): UserProfile | null {
    return this.currentUser;
  }

  public updateUserProfile(updates: { fullName?: string; phone?: string }): { success: boolean } {
    if (!this.currentUser) return { success: false };

    const allUsers = this.getUsers();
    const idx = allUsers.findIndex(u => u.id === this.currentUser!.id);
    if (idx !== -1) {
      allUsers[idx] = {
        ...allUsers[idx],
        ...updates,
      };
      this.currentUser = allUsers[idx];
      setLocalItem(STORAGE_KEYS.USERS, allUsers);
      setLocalItem(STORAGE_KEYS.CURRENT_USER, this.currentUser);
      this.notify();
      return { success: true };
    }
    return { success: false };
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

  public loginAsAdmin(): void {
    const allUsers = this.getUsers();
    let admin = allUsers.find(u => u.role === 'admin' || u.email.toLowerCase() === 'centroseresmed@gmail.com');
    if (!admin) {
      admin = {
        id: 'user-admin-seres',
        email: 'centroseresmed@gmail.com',
        fullName: 'Administradora SERES',
        phone: '',
        role: 'admin',
        createdAt: new Date().toISOString(),
      };
      allUsers.push(admin);
      setLocalItem(STORAGE_KEYS.USERS, allUsers);
    }
    this.currentUser = admin;
    setLocalItem(STORAGE_KEYS.CURRENT_USER, admin);
    this.notify();
  }

  public async loginWithEmail(email: string, fullName?: string): Promise<{ success: boolean; message?: string }> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.auth.signInWithOtp({ email });
        if (error) throw error;
        return { success: true, message: 'Enlace de acceso enviado a tu correo.' };
      } catch (err: any) {
        return { success: false, message: err?.message || 'Error al iniciar sesión con Supabase' };
      }
    }

    const allUsers = this.getUsers();
    const cleanEmail = email.trim().toLowerCase();
    const found = allUsers.find(u => u.email.toLowerCase() === cleanEmail);

    if (found) {
      this.currentUser = found;
      setLocalItem(STORAGE_KEYS.CURRENT_USER, found);
      this.notify();
      return { success: true };
    } else {
      const isAdminEmail = cleanEmail === 'centroseresmed@gmail.com' || cleanEmail.includes('seres');
      const newUser: UserProfile = {
        id: `user-${Date.now()}`,
        email: cleanEmail,
        fullName: fullName || cleanEmail.split('@')[0],
        role: isAdminEmail ? 'admin' : 'client',
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

  // --- PACKAGES & SESSIONS ---
  public getPackages(): Package[] {
    const allPackages = getLocalItem<Package[]>(STORAGE_KEYS.PACKAGES, INITIAL_PACKAGES);
    if (!this.currentUser) return [];

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

    if (this.currentUser.role === 'admin') {
      return allSessions.sort((a, b) => new Date(b.sessionDate).getTime() - new Date(a.sessionDate).getTime());
    }
    return allSessions
      .filter(s => s.clientId === this.currentUser!.id)
      .sort((a, b) => new Date(b.sessionDate).getTime() - new Date(a.sessionDate).getTime());
  }

  // --- ADMIN ACTIONS ---
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

      assignedPackage.sessionsUsed += 1;
      if (assignedPackage.sessionsUsed >= assignedPackage.totalSessions) {
        assignedPackage.status = 'completed';
      }
      assignedPackage.updatedAt = new Date().toISOString();
      sessionNumberInPackage = assignedPackage.sessionsUsed;

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
      administrativeNotes: params.administrativeNotes || 'Asistencia presencial registrada.',
      createdAt: new Date().toISOString(),
    };

    allSessions.unshift(newSession);

    setLocalItem(STORAGE_KEYS.PACKAGES, allPackages);
    setLocalItem(STORAGE_KEYS.MOVEMENTS, allMovements);
    setLocalItem(STORAGE_KEYS.SESSIONS, allSessions);
    this.notify();

    return { success: true, session: newSession };
  }

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
          changeAmount: 1,
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

  // --- PERSONAL NOTES (CLIENT ONLY) ---
  public getPersonalNotes(): PersonalNote[] {
    if (!this.currentUser) return [];

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
      const index = allNotes.findIndex(n => n.id === note.id && n.clientId === this.currentUser!.id);
      if (index === -1) {
        return { success: false, error: 'Nota no encontrada o sin permisos.' };
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

  // --- SELF CARE RESOURCES & SERVICES ---
  public getSelfCareResources(): SelfCareResource[] {
    const all = getLocalItem<SelfCareResource[]>(STORAGE_KEYS.RESOURCES, INITIAL_SELF_CARE_RESOURCES);
    return all.filter(r => r.isPublished);
  }

  public getServicesAndGatherings(): ServiceOrGathering[] {
    const all = getLocalItem<ServiceOrGathering[]>(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
    return all.filter(s => s.isPublished);
  }
}

export const dataService = new DataService();
