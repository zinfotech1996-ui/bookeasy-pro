export interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  avatar?: string;
  color: string;
  services: string[];
  workingHours: {
    [key: string]: { start: string; end: string } | null;
  };
}

export interface Service {
  id: string;
  name: string;
  description?: string;
  duration: number; // in minutes
  price: number;
  category: string;
  teamMemberIds: string[];
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  notes?: string;
  avatar?: string;
  createdAt: Date;
  totalVisits: number;
  totalSpent: number;
  lastVisit?: Date;
}

export interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  teamMemberId: string;
  teamMemberName: string;
  serviceId: string;
  serviceName: string;
  date: Date;
  startTime: string;
  endTime: string;
  duration: number;
  price: number;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  notes?: string;
  createdAt: Date;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface CalendarDay {
  date: Date;
  appointments: Appointment[];
  isToday: boolean;
  isCurrentMonth: boolean;
}
