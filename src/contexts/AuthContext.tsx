import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Role } from '../types'; // ✅ import AuditLog مع User و Role
import { useAudit } from './AuditContext';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users data
const USERS: User[] = [
  {
    id: '1',
    email: 'admin@clinic.com',
    password: 'admin123',
    name: 'Admin',
    role: 'admin'
  },
  {
    id: '2',
    email: 'doctor@clinic.com',
    password: 'doctor123',
    name: 'Dr. Smith',
    role: 'doctor',
    doctorId: 'doc1'
  },
  {
    id: '3',
    email: 'receptionist@clinic.com',
    password: 'reception123',
    name: 'Sarah',
    role: 'receptionist'
  }
];

// Permission matrix
const PERMISSIONS: Record<Role, string[]> = {
  admin: ['*'],
  doctor: [
    'view_own_appointments',
    'update_own_appointments'
  ],
  receptionist: [
    'view_appointments',
    'create_appointments',
    'update_appointments',
    'delete_appointments'
  ]
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { logAction } = useAudit();

  useEffect(() => {
    const storedUser = localStorage.getItem('clinic-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    
    const userPermissions = PERMISSIONS[user.role];
    return userPermissions.includes('*') || userPermissions.includes(permission);
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = USERS.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('clinic-user', JSON.stringify(foundUser));
      
      await logAction({
        action: 'login',
        resourceType: 'user',
        resourceId: foundUser.id,
        details: `User ${foundUser.name} logged in`
      });
      
      setLoading(false);
      return true;
    }
    
    setLoading(false);
    return false;
  };

  const logout = async () => {
    if (user) {
      await logAction({
        action: 'logout',
        resourceType: 'user',
        resourceId: user.id,
        details: `User ${user.name} logged out`
      });
    }
    
    setUser(null);
    localStorage.removeItem('clinic-user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        loading,
        hasPermission
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
