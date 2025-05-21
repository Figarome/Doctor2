import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { AppointmentProvider } from './contexts/AppointmentContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuditProvider } from './contexts/AuditContext';
import HomePage from './pages/patient/HomePage';
import LoginPage from './pages/admin/LoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <ThemeProvider>
          <AuthProvider> {/* ✅ AuthProvider قبل Audit */}
            <AuditProvider>
              <AppointmentProvider>
                <Routes>
                  {/* Patient Routes */}
                  <Route path="/" element={<HomePage />} />
                  
                  {/* Admin Routes */}
                  <Route path="/admin/login" element={<LoginPage />} />
                  <Route 
                    path="/admin" 
                    element={
                      <ProtectedRoute>
                        <DashboardPage />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Fallback route */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </AppointmentProvider>
            </AuditProvider>
          </AuthProvider>
        </ThemeProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;
