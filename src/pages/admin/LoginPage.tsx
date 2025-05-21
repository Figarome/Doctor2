import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import LanguageToggle from '../../components/common/LanguageToggle';
import { Lock } from 'lucide-react';

const LoginPage: React.FC = () => {
  const { login, loading } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError(language === 'en' ? 'Please enter both email and password' : 'الرجاء إدخال البريد الإلكتروني وكلمة المرور');
      return;
    }
    
    try {
      const success = await login(email, password);
      
      if (success) {
        navigate('/admin');
      } else {
        setError(language === 'en' ? 'Invalid email or password' : 'البريد الإلكتروني أو كلمة المرور غير صحيحة');
      }
    } catch (err) {
      setError(language === 'en' ? 'An error occurred. Please try again.' : 'حدث خطأ. يرجى المحاولة مرة أخرى.');
    }
  };
  
  return (
    <div className={`min-h-screen bg-gray-50 flex flex-col justify-center ${language === 'ar' ? 'rtl' : 'ltr'}`}>
      <div className="absolute top-4 right-4">
        <LanguageToggle />
      </div>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900 mt-6">
          {t('admin.login.title')}
        </h2>
      </div>
      
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input
              label={t('admin.login.email')}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder={language === 'en' ? 'Enter your email' : 'أدخل بريدك الإلكتروني'}
            />
            
            <Input
              label={t('admin.login.password')}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder={language === 'en' ? 'Enter your password' : 'أدخل كلمة المرور'}
            />
            
            {error && (
              <div className="text-red-600 text-sm">
                {error}
              </div>
            )}
            
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              fullWidth
              icon={<Lock size={16} />}
            >
              {t('admin.login.submit')}
            </Button>
            
            <div className="mt-4 text-sm text-gray-600 text-center">
              <p>
                {language === 'en' ? 'Demo credentials: ' : 'بيانات الدخول التجريبية: '}
                admin@clinic.com / admin123
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;