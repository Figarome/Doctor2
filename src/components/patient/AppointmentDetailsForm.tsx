import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { ArrowLeft, Calendar, Clock, User, FileText, Stethoscope } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';

interface AppointmentDetailsFormProps {
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  onConfirm: () => void;
  onBack: () => void;
}

const AppointmentDetailsForm: React.FC<AppointmentDetailsFormProps> = ({
  doctorName,
  specialty,
  date,
  time,
  onConfirm,
  onBack
}) => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    symptoms: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = language === 'en' ? 'Full name is required' : 'الاسم الكامل مطلوب';
    }
    
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = language === 'en' ? 'Phone number is required' : 'رقم الهاتف مطلوب';
    } else if (!/^\d{10,15}$/.test(formData.phoneNumber.replace(/\D/g, ''))) {
      newErrors.phoneNumber = language === 'en' ? 'Please enter a valid phone number' : 'يرجى إدخال رقم هاتف صحيح';
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = language === 'en' ? 'Please enter a valid email address' : 'يرجى إدخال عنوان بريد إلكتروني صحيح';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setShowSuccess(true);
      setTimeout(() => {
        onConfirm();
      }, 1500);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Appointment Summary */}
      <div className="bg-blue-50 p-6 border-b border-blue-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {t('patient.form.confirm_details')}
        </h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center text-gray-700">
            <User className="w-5 h-5 mr-2 text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">{t('patient.form.doctor')}</p>
              <p className="font-medium">{doctorName}</p>
            </div>
          </div>
          
          <div className="flex items-center text-gray-700">
            <Stethoscope className="w-5 h-5 mr-2 text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">{t('patient.form.specialty')}</p>
              <p className="font-medium">{specialty}</p>
            </div>
          </div>
          
          <div className="flex items-center text-gray-700">
            <Calendar className="w-5 h-5 mr-2 text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">{t('patient.form.date')}</p>
              <p className="font-medium">{date}</p>
            </div>
          </div>
          
          <div className="flex items-center text-gray-700">
            <Clock className="w-5 h-5 mr-2 text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">{t('patient.form.time')}</p>
              <p className="font-medium">{time}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6">
        <div className="space-y-4">
          <Input
            label={t('patient.form.name')}
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder={language === 'en' ? 'Enter your full name' : 'أدخل اسمك الكامل'}
            error={errors.fullName}
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
            label={t('patient.form.email')}
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder={language === 'en' ? 'Enter your email (optional)' : 'أدخل بريدك الإلكتروني (اختياري)'}
            error={errors.email}
          />
          
          <div className="mb-4">
            <label
              htmlFor="symptoms"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t('patient.form.symptoms')}
            </label>
            <textarea
              id="symptoms"
              name="symptoms"
              rows={4}
              value={formData.symptoms}
              onChange={handleChange}
              placeholder={language === 'en' ? 'Describe your symptoms or add notes (optional)' : 'صف الأعراض أو أضف ملاحظات (اختياري)'}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
        
        {showSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-700 text-center">
              {t('patient.form.success')}
            </p>
          </div>
        )}
        
        <div className="mt-6 flex justify-between items-center">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            icon={<ArrowLeft size={16} />}
          >
            {t('back')}
          </Button>
          
          <Button
            type="submit"
            variant="primary"
            loading={isSubmitting}
          >
            {t('patient.form.confirm')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AppointmentDetailsForm;