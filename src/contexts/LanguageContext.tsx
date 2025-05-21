import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Language } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translations for both languages
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Common
    'app.name': 'HealthCare Clinic',
    'app.tagline': 'Your health is our priority',
    'language': 'Language',
    'loading': 'Loading...',
    'submit': 'Submit',
    'cancel': 'Cancel',
    'save': 'Save',
    'edit': 'Edit',
    'delete': 'Delete',
    'logout': 'Logout',
    'login': 'Login',
    'search': 'Search',
    'filter': 'Filter',
    'back': 'Back',
    
    // Patient form
    'patient.form.title': 'Book an Appointment',
    'patient.form.subtitle': 'Fill in your details to schedule an appointment',
    'patient.form.name': 'Full Name',
    'patient.form.phone': 'Phone Number',
    'patient.form.email': 'Email (Optional)',
    'patient.form.date': 'Preferred Date',
    'patient.form.time': 'Preferred Time',
    'patient.form.reason': 'Reason for Visit',
    'patient.form.reason.consultation': 'General Consultation',
    'patient.form.reason.checkup': 'Regular Check-up',
    'patient.form.reason.follow-up': 'Follow-up Visit',
    'patient.form.reason.emergency': 'Emergency',
    'patient.form.reason.other': 'Other',
    'patient.form.submit': 'Book Appointment',
    'patient.form.success': 'Your appointment request has been submitted successfully!',
    'patient.form.success.subtitle': 'We will contact you shortly to confirm your appointment.',
    'patient.form.error': 'Something went wrong. Please try again.',
    
    // Admin
    'admin.login.title': 'Admin Login',
    'admin.login.email': 'Email',
    'admin.login.password': 'Password',
    'admin.login.submit': 'Login',
    'admin.dashboard.title': 'Admin Dashboard',
    'admin.dashboard.appointments': 'Appointments',
    'admin.dashboard.pending': 'Pending',
    'admin.dashboard.confirmed': 'Confirmed',
    'admin.dashboard.canceled': 'Canceled',
    'admin.dashboard.all': 'All Appointments',
    'admin.dashboard.add': 'Add Appointment',
    'admin.appointment.status': 'Status',
    'admin.appointment.date': 'Date',
    'admin.appointment.time': 'Time',
    'admin.appointment.patient': 'Patient Name',
    'admin.appointment.phone': 'Phone',
    'admin.appointment.reason': 'Reason',
    'admin.appointment.actions': 'Actions',
    'admin.appointment.confirm': 'Confirm',
    'admin.appointment.reject': 'Reject',
    'admin.appointment.edit': 'Edit',
    'admin.appointment.delete': 'Delete',
    'admin.appointment.nodata': 'No appointments found',
    'admin.confirm.title': 'Confirm Action',
    'admin.confirm.message': 'Are you sure you want to proceed with this action?',
    'admin.patient.details': 'Patient Details',
  },
  ar: {
    // Common
    'app.name': 'عيادة الرعاية الصحية',
    'app.tagline': 'صحتك هي أولويتنا',
    'language': 'اللغة',
    'loading': 'جار التحميل...',
    'submit': 'إرسال',
    'cancel': 'إلغاء',
    'save': 'حفظ',
    'edit': 'تعديل',
    'delete': 'حذف',
    'logout': 'تسجيل الخروج',
    'login': 'تسجيل الدخول',
    'search': 'بحث',
    'filter': 'تصفية',
    'back': 'رجوع',
    
    // Patient form
    'patient.form.title': 'حجز موعد',
    'patient.form.subtitle': 'املأ بياناتك لجدولة موعد',
    'patient.form.name': 'الاسم الكامل',
    'patient.form.phone': 'رقم الهاتف',
    'patient.form.email': 'البريد الإلكتروني (اختياري)',
    'patient.form.date': 'التاريخ المفضل',
    'patient.form.time': 'الوقت المفضل',
    'patient.form.reason': 'سبب الزيارة',
    'patient.form.reason.consultation': 'استشارة عامة',
    'patient.form.reason.checkup': 'فحص دوري',
    'patient.form.reason.follow-up': 'زيارة متابعة',
    'patient.form.reason.emergency': 'طوارئ',
    'patient.form.reason.other': 'أخرى',
    'patient.form.submit': 'حجز موعد',
    'patient.form.success': 'تم تقديم طلب موعدك بنجاح!',
    'patient.form.success.subtitle': 'سنتصل بك قريبًا لتأكيد موعدك.',
    'patient.form.error': 'حدث خطأ ما. يرجى المحاولة مرة أخرى.',
    
    // Admin
    'admin.login.title': 'تسجيل دخول المسؤول',
    'admin.login.email': 'البريد الإلكتروني',
    'admin.login.password': 'كلمة المرور',
    'admin.login.submit': 'تسجيل الدخول',
    'admin.dashboard.title': 'لوحة تحكم المسؤول',
    'admin.dashboard.appointments': 'المواعيد',
    'admin.dashboard.pending': 'قيد الانتظار',
    'admin.dashboard.confirmed': 'مؤكد',
    'admin.dashboard.canceled': 'ملغي',
    'admin.dashboard.all': 'جميع المواعيد',
    'admin.dashboard.add': 'إضافة موعد',
    'admin.appointment.status': 'الحالة',
    'admin.appointment.date': 'التاريخ',
    'admin.appointment.time': 'الوقت',
    'admin.appointment.patient': 'اسم المريض',
    'admin.appointment.phone': 'الهاتف',
    'admin.appointment.reason': 'السبب',
    'admin.appointment.actions': 'الإجراءات',
    'admin.appointment.confirm': 'تأكيد',
    'admin.appointment.reject': 'رفض',
    'admin.appointment.edit': 'تعديل',
    'admin.appointment.delete': 'حذف',
    'admin.appointment.nodata': 'لم يتم العثور على مواعيد',
    'admin.confirm.title': 'تأكيد الإجراء',
    'admin.confirm.message': 'هل أنت متأكد أنك تريد المتابعة في هذا الإجراء؟',
    'admin.patient.details': 'تفاصيل المريض',
  }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};