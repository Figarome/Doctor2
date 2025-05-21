import React, { useState } from 'react';
import { format, addDays } from 'date-fns';
import AppLayout from '../../components/layout/AppLayout';
import AppointmentForm from '../../components/patient/AppointmentForm';
import AppointmentSuccess from '../../components/patient/AppointmentSuccess';
import { useLanguage } from '../../contexts/LanguageContext';
import { Calendar, Clock, MapPin, Star, Users, Phone, Mail, Globe } from 'lucide-react';

const HomePage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [showForm, setShowForm] = useState(false);
  const { t } = useLanguage();
  
  function handleSubmitSuccess() {
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  const handleReset = () => {
    setSubmitted(false);
    setShowForm(false);
    setSelectedDate('');
    setSelectedTime('');
  };

  const handleBookClick = () => {
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setShowForm(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generate next 7 days
  const nextDays = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));

  // Available time slots
  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ];
  
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        {submitted ? (
          <AppointmentSuccess onReset={handleReset} />
        ) : showForm ? (
          <AppointmentForm 
            onSuccess={handleSubmitSuccess}
            onBack={handleBack}
            initialDate={selectedDate}
            initialTime={selectedTime}
          />
        ) : (
          <>
            {/* Doctor Info Card */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
              <div className="md:flex">
                <div className="md:flex-shrink-0">
                  <img
                    className="h-48 w-full object-cover md:w-48"
                    src="https://images.pexels.com/photos/5452291/pexels-photo-5452291.jpeg?auto=compress&cs=tinysrgb&w=300"
                    alt="Dr. Emily Larson"
                  />
                </div>
                <div className="p-8">
                  <div className="flex items-center">
                    <h1 className="text-2xl font-bold text-gray-900">Dr. Emily Larson</h1>
                    <div className="flex items-center ml-4">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm text-gray-600">4.9</span>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    <span>MBBS – Gynecologist</span>
                  </div>
                  <div className="mt-2 flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>3 Years Experience</span>
                  </div>
                  <div className="mt-2 flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>New York Medical Center</span>
                  </div>
                  <p className="mt-4 text-gray-600">
                    Dr. Emily has 3 years of experience helping women with reproductive health.
                  </p>
                </div>
              </div>
            </div>

            {/* Date Selection */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <h2 className="text-lg font-semibold mb-4">Select Date & Time</h2>
              <div className="flex overflow-x-auto pb-4 mb-6 -mx-2">
                {nextDays.map((date) => (
                  <button
                    key={date.toISOString()}
                    onClick={() => setSelectedDate(format(date, 'yyyy-MM-dd'))}
                    className={`flex-shrink-0 mx-2 p-4 rounded-lg border-2 transition-colors
                      ${selectedDate === format(date, 'yyyy-MM-dd')
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-200'}`}
                  >
                    <div className="text-sm font-medium text-gray-600">
                      {format(date, 'EEE')}
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      {format(date, 'dd')}
                    </div>
                  </button>
                ))}
              </div>

              {/* Time Slots */}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`p-2 rounded-full text-sm font-medium transition-colors
                      ${selectedTime === time
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    {time}
                  </button>
                ))}
              </div>

              {/* Book Button */}
              <button
                onClick={handleBookClick}
                className={`w-full mt-8 py-3 px-6 rounded-lg font-medium transition-colors
                  ${!selectedDate || !selectedTime
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                disabled={!selectedDate || !selectedTime}
              >
                Book Appointment
              </button>
            </div>

            {/* Location and Contact Information */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Location & Contact Information</h2>
              
              {/* Map */}
              <div className="w-full h-64 bg-gray-100 rounded-lg mb-6">
                <iframe
                  src="https://maps.app.goo.gl/hQEZ3ddwWJp2LnKP8"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-lg"
                ></iframe>
              </div>
              
              {/* Contact Details */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center text-gray-700">
                    <MapPin className="w-5 h-5 mr-3 text-blue-500" />
                    <div>
                      <p className="font-medium">Address</p>
                      <p className="text-sm">350 Fifth Avenue</p>
                      <p className="text-sm">New York, NY 10118</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-700">
                    <Phone className="w-5 h-5 mr-3 text-blue-500" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-sm">+212 537 686 868</p>
                      <p className="text-sm">Emergency: +212 537 686 868</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center text-gray-700">
                    <Mail className="w-5 h-5 mr-3 text-blue-500" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-sm">contact@emilylarson.clinic</p>
                      <p className="text-sm">appointments@emilylarson.clinic</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-700">
                    <Globe className="w-5 h-5 mr-3 text-blue-500" />
                    <div>
                      <p className="font-medium">Working Hours</p>
                      <p className="text-sm">Monday - Friday: 9:00 AM - 5:00 PM</p>
                      <p className="text-sm">Saturday: 9:00 AM - 1:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default HomePage;