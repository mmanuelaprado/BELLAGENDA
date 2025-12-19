
export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  price: number;
  active: boolean;
}

export interface Appointment {
  id: string;
  serviceId: string;
  clientName: string;
  clientPhone: string;
  date: string; // ISO string
  status: 'confirmed' | 'pending' | 'cancelled';
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  totalBookings: number;
  lastVisit: string;
}

export interface Professional {
  name: string;
  businessName: string;
  email: string;
  slug: string; // for the public link
  bio?: string;
  instagram?: string;
}

export type View = 'landing' | 'login' | 'signup' | 'dashboard' | 'services' | 'profile' | 'booking' | 'clients' | 'marketing';
