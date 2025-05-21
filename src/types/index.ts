export interface Appointment {
  id: string;
  patientName: string;
  phoneNumber: string;
  email?: string;
  cin: string;
  date: string;
  time: string;
  reason: string;
  status: 'pending' | 'confirmed' | 'canceled';
  createdAt: string;
  doctorId?: string;
}

export type Role = 'admin' | 'doctor' | 'receptionist';

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: Role;
  doctorId?: string; // Only for doctors
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: Role;
  action: 'create' | 'update' | 'delete' | 'login' | 'logout';
  resourceType: 'appointment' | 'user';
  resourceId: string;
  details: string;
  timestamp: string;
}

export type Language = 'en' | 'ar';