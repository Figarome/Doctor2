import React, { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import LanguageToggle from '../common/LanguageToggle';
import Button from '../common/Button';
import { Calendar, Users, LogOut } from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { logout, user } = useAuth();
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };
  
  return (
    <div className={`min-h-screen flex flex-col ${language === 'ar' ? 'rtl' : 'ltr'}`}>
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-xl font-bold text-blue-600">{t('admin.dashboard.title')}</h1>
              {user && <p className="text-sm text-gray-500">{user.name}</p>}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              icon={<LogOut size={16} />}
            >
              {t('logout')}
            </Button>
          </div>
        </div>
      </header>
      
      <div className="flex flex-1">
        <aside className="w-64 bg-white border-r border-gray-200 hidden md:block">
          <nav className="px-4 py-6 space-y-1">
            <a
              href="/admin"
              className="flex items-center px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-md group"
            >
              <Calendar className="mr-3 h-5 w-5 text-blue-500" />
              {t('admin.dashboard.appointments')}
            </a>
          </nav>
        </aside>
        
        <main className="flex-1 bg-gray-50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;