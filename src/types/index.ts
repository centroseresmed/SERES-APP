export type UserRole = 'client' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: UserRole;
  createdAt: string;
}

export type PackageStatus = 'active' | 'completed' | 'expired';

export interface Package {
  id: string;
  clientId: string;
  clientName?: string;
  name: string;
  serviceType: string;
  totalSessions: number;
  sessionsUsed: number;
  purchaseDate: string;
  status: PackageStatus;
  expiresAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PackageMovement {
  id: string;
  packageId: string;
  clientId: string;
  changeAmount: number; // e.g. -1 for session redeemed, +1 for administrative correction
  reason: string;
  recordedByName: string;
  createdAt: string;
}

export type SessionStatus = 'confirmed' | 'cancelled' | 'rescheduled';

export interface SessionRecord {
  id: string;
  clientId: string;
  clientName?: string;
  therapistName: string;
  packageId?: string;
  packageName?: string;
  serviceName: string;
  sessionDate: string; // ISO date string
  status: SessionStatus;
  sessionNumberInPackage?: number;
  administrativeNotes?: string;
  createdAt: string;
}

export interface PersonalNote {
  id: string;
  clientId: string;
  sessionId?: string;
  sessionTitle?: string;
  title?: string;
  reflections: string;
  learnings?: string;
  questionsToExplore?: string;
  createdAt: string;
  updatedAt: string;
}

export type SelfCareCategory = 
  | 'movement' 
  | 'breathing' 
  | 'body_connection' 
  | 'emotional_awareness' 
  | 'meditation' 
  | 'conscious_pauses' 
  | 'daily_care';

export interface SelfCareResource {
  id: string;
  title: string;
  slug: string;
  category: SelfCareCategory;
  categoryLabel: string;
  description: string;
  practicalGoal: string;
  approxDurationMinutes: number;
  stepByStepInstructions: string[];
  precautions?: string;
  tags: string[];
  imageUrl?: string;
  audioUrl?: string;
  integrationQuestion?: string;
  isPublished: boolean;
}

export type ServiceGatheringType = 'service' | 'gathering';

export interface ServiceOrGathering {
  id: string;
  title: string;
  itemType: ServiceGatheringType;
  description: string;
  durationText?: string;
  priceText?: string;
  scheduledAt?: string;
  imageUrl?: string;
  contactActionUrl?: string;
  isPublished: boolean;
}

export type ReferralStatus = 
  | 'registered' 
  | 'contacted' 
  | 'session_completed' 
  | 'reward_pending' 
  | 'reward_claimed';

export interface ReferralLead {
  id: string;
  referrerClientId: string;
  referredName: string;
  referredContact?: string;
  status: ReferralStatus;
  notes?: string;
  createdAt: string;
}
