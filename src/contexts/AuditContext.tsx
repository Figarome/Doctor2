import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuditLog } from '../types';
import { useAuth } from './AuthContext';

interface AuditContextType {
  logs: AuditLog[];
  logAction: (params: {
    action: AuditLog['action'];
    resourceType: AuditLog['resourceType'];
    resourceId: string;
    details: string;
  }) => Promise<void>;
  getLogs: (limit?: number) => AuditLog[];
}

const AuditContext = createContext<AuditContextType | undefined>(undefined);

export const AuditProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const storedLogs = localStorage.getItem('clinic-audit-logs');
    if (storedLogs) {
      setLogs(JSON.parse(storedLogs));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('clinic-audit-logs', JSON.stringify(logs));
  }, [logs]);

  const logAction = async (params: {
    action: AuditLog['action'];
    resourceType: AuditLog['resourceType'];
    resourceId: string;
    details: string;
  }) => {
    if (!user) return;

    const newLog: AuditLog = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      timestamp: new Date().toISOString(),
      ...params
    };

    setLogs(prev => [newLog, ...prev]);
  };

  const getLogs = (limit?: number): AuditLog[] => {
    return limit ? logs.slice(0, limit) : logs;
  };

  return (
    <AuditContext.Provider value={{ logs, logAction, getLogs }}>
      {children}
    </AuditContext.Provider>
  );
};

export const useAudit = (): AuditContextType => {
  const context = useContext(AuditContext);
  if (context === undefined) {
    throw new Error('useAudit must be used within an AuditProvider');
  }
  return context;
};