import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Appointment } from '../types';

interface AppointmentContextType {
  appointments: Appointment[];
  loading: boolean;
  addAppointment: (appointment: Omit<Appointment, 'id' | 'status' | 'createdAt'>) => Promise<Appointment>;
  updateAppointment: (id: string, updatedAppointment: Partial<Appointment>) => Promise<Appointment | null>;
  deleteAppointment: (id: string) => Promise<boolean>;
  getAppointmentById: (id: string) => Appointment | null;
  filterAppointments: (status?: string, searchTerm?: string, date?: string) => Appointment[];
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

export const AppointmentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load appointments from localStorage
    const storedAppointments = localStorage.getItem('clinic-appointments');
    if (storedAppointments) {
      setAppointments(JSON.parse(storedAppointments));
    }
    setLoading(false);
  }, []);

  // Save appointments to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('clinic-appointments', JSON.stringify(appointments));
    }
  }, [appointments, loading]);

  const addAppointment = async (
    appointmentData: Omit<Appointment, 'id' | 'status' | 'createdAt'>
  ): Promise<Appointment> => {
    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newAppointment: Appointment = {
      ...appointmentData,
      id: Date.now().toString(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    
    setAppointments(prev => [...prev, newAppointment]);
    setLoading(false);
    return newAppointment;
  };

  const updateAppointment = async (
    id: string,
    updatedData: Partial<Appointment>
  ): Promise<Appointment | null> => {
    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    let updatedAppointment: Appointment | null = null;
    
    setAppointments(prev => {
      const updated = prev.map(appointment => {
        if (appointment.id === id) {
          updatedAppointment = { ...appointment, ...updatedData };
          return updatedAppointment;
        }
        return appointment;
      });
      return updated;
    });
    
    setLoading(false);
    return updatedAppointment;
  };

  const deleteAppointment = async (id: string): Promise<boolean> => {
    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setAppointments(prev => prev.filter(appointment => appointment.id !== id));
    
    setLoading(false);
    return true;
  };

  const getAppointmentById = (id: string): Appointment | null => {
    return appointments.find(appointment => appointment.id === id) || null;
  };

  const filterAppointments = (
    status?: string,
    searchTerm?: string,
    date?: string
  ): Appointment[] => {
    return appointments.filter(appointment => {
      // Filter by status
      if (status && status !== 'all' && appointment.status !== status) {
        return false;
      }
      
      // Filter by search term
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const patientNameMatch = appointment.patientName.toLowerCase().includes(term);
        const phoneMatch = appointment.phoneNumber.includes(term);
        const emailMatch = appointment.email?.toLowerCase().includes(term) || false;
        
        if (!patientNameMatch && !phoneMatch && !emailMatch) {
          return false;
        }
      }
      
      // Filter by date
      if (date && appointment.date !== date) {
        return false;
      }
      
      return true;
    });
  };

  return (
    <AppointmentContext.Provider
      value={{
        appointments,
        loading,
        addAppointment,
        updateAppointment,
        deleteAppointment,
        getAppointmentById,
        filterAppointments
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
};

export const useAppointments = (): AppointmentContextType => {
  const context = useContext(AppointmentContext);
  if (context === undefined) {
    throw new Error('useAppointments must be used within an AppointmentProvider');
  }
  return context;
};