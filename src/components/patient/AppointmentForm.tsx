import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAppointments } from '../../contexts/AppointmentContext';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { CalendarClock, User, Phone, Mail, Clock, FileText, ArrowLeft } from 'lucide-react';

interface AppointmentFormProps {
  onSuccess: () => void;
  onBack: () => void;
  initialDate?: string;
  initialTime?: string;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({ 
  onSuccess,
  onBack,
  initialDate = '',
  initialTime = ''
}) => {
  const { t, language } = useLanguage();
  const { addAppointment, loading } = useAppointments();
  
  const [formData, setFormData] = useState({
    patientName: '',
    phoneNumber: '',
    email: '',
    cin: '',
    date: initialDate,
    time: initialTime,
    reason: 'consultation',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const reasonOptions = [
    { value: 'consultation', label: t('patient.form.reason.consultation') },
    { value: 'checkup', label: t('patient.form.reason.checkup') },
    { value: 'follow-up', label: t('patient.form.reason.follow-up') },
    { value: 'emergency', label: t('patient.form.reason.emergency') },
    { value: 'other', label: t('patient.form.reason.other') },
  ];
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.patientName.trim()) {
      newErrors.patientName = language === 'en' ? 'Name is required' : 'الاسم مطلوب';
    }
    
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = language === 'en' ? 'Phone number is required' : 'رقم الهاتف مطلوب';
    } else if (!/^\d{10,15}$/.test(formData.phoneNumber.replace(/\D/g, ''))) {
      newErrors.phoneNumber = language === 'en' ? 'Please enter a valid phone number' : 'يرجى إدخال رقم هاتف صحيح';
    }

    if (!formData.cin.trim()) {
      newErrors.cin = language === 'en' ? 'CIN is required' : 'رقم البطاقة الوطنية مطلوب';
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = language === 'en' ? 'Please enter a valid email address' : 'يرجى إدخال عنوان بريد إلكتروني صحيح';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const handleReasonChange = (value: string) => {
    setFormData(prev => ({ ...prev, reason: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await addAppointment(formData);
      onSuccess();
    } catch (error) {
      console.error('Error adding appointment:', error);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-gray-200 mb-4">
          <div className="flex items-center gap-2">
            <User size={20} className="text-blue-500" />
            <h2 className="text-lg font-medium text-gray-900">{t('patient.form.title')}</h2>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onBack}
            icon={<ArrowLeft size={16} />}
          >
            {t('back')}
          </Button>
        </div>
        
        <Input
          label={t('patient.form.name')}
          name="patientName"
          value={formData.patientName}
          onChange={handleChange}
          placeholder={language === 'en' ? 'Enter your full name' : 'أدخل اسمك الكامل'}
          error={errors.patientName}
          required
        />
        
        <Input
          label={t('patient.form.phone')}
          name="phoneNumber"
          type="tel"
          value={formData.phoneNumber}
          onChange={handleChange}
          placeholder={language === 'en' ? 'Enter your phone number' : 'أدخل رقم هاتفك'}
          error={errors.phoneNumber}
          required
        />

        <Input
          label="CIN"
          name="cin"
          value={formData.cin}
          onChange={handleChange}
          placeholder={language === 'en' ? 'Enter your CIN' : 'أدخل رقم البطاقة الوطنية'}
          error={errors.cin}
          required
        />
        
        <Input
          label={t('patient.form.email')}
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder={language === 'en' ? 'Enter your email address (optional)' : 'أدخل عنوان بريدك الإلكتروني (اختياري)'}
          error={errors.email}
        />
        
        <Select
          label={t('patient.form.reason')}
          options={reasonOptions}
          value={formData.reason}
          onChange={handleReasonChange}
          required
        />
        
        <div className="pt-4">
          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={loading}
            className="mt-2"
          >
            {t('patient.form.submit')}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default AppointmentForm;