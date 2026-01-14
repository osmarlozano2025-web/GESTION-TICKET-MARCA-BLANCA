
export enum TicketStatus {
  PENDING = 'Pendiente',
  APPROVED = 'Aprobado',
  IN_PROGRESS = 'En Proceso',
  SOLVED = 'Solucionado',
  CRITICAL = 'Crítico'
}

export interface Ticket {
  id: string;
  storeId: string;
  location: string;
  status: TicketStatus;
  technician: string;
  initials: string;
  priority: 'Baja' | 'Media' | 'Alta' | 'Crítica';
  amount?: number;
}

export interface Breadcrumb {
  label: string;
  path?: string;
}

export interface MaterialRequestItem {
  description: string;
  quantity: number;
  source: 'Taller' | 'Compra';
}

export interface MaterialRequest {
  id: string;
  ticketId: string;
  items: MaterialRequestItem[];
  status: 'Pendiente' | 'Surtido' | 'Cancelado';
  createdAt: string;
  technician: string;
}

export interface UserPermission {
  module: string;
  view: boolean;
  edit: boolean;
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: string;
  group: string;
  permissions: UserPermission[];
}

export interface AppStoreDocument {
  id: string;
  name: string;
  uploadDate: string;
  size: string;
}

export interface AppStore {
  id: string;
  clientId: string;
  name: string;
  location: string;
  code: string;
  documents?: AppStoreDocument[];
}

export interface AppClient {
  id: string;
  name: string;
  storesCount: number;
  activeTickets: number;
  status: 'Active' | 'Critical' | 'Idle';
  logo: string;
}

export interface AppVehicle {
  id: string;
  model: string;
  plate: string;
  km: number;
  nextServiceKm: number;
  vtvExpiry: string; // ISO Date
  btoEnabled: boolean;
  active: boolean;
  lastKmUpdate: string; // ISO Date de la última actualización manual
}

export interface PettyCashEntry {
  id: string;
  ticketId: string;
  amount: number;
  concept: string;
  voucherNumber: string;
  date: string;
  detailedDescription: string; // Comentario de desperdicio / ítems comprados
  evidenceImage?: string;
}

export interface CompanySettings {
  name: string;
  tagline: string;
  logoUrl: string;
  primaryColor: string;
}
