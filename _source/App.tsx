
import React, { useState } from 'react';
import { BookingStep, BookingState } from './types';
import { StepIndicator } from './components/StepIndicator';
import { ChevronLeft, User } from 'lucide-react';
import { formatThaiDate } from './utils';
import { BranchSelection } from './components/BranchSelection';
import { ServiceSelection } from './components/ServiceSelection';
import { DateSelection } from './components/DateSelection';
import { TimeSelection } from './components/TimeSelection';
import { StaffSelection } from './components/StaffSelection';
import { Confirmation } from './components/Confirmation';
import { SuccessScreen } from './components/SuccessScreen';
import { MyBookingsScreen } from './components/MyBookingsScreen';

// --- Main App Component ---

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<BookingStep>(BookingStep.BRANCH_SELECTION);
  const [bookingState, setBookingState] = useState<BookingState>({
    branch: null,
    service: null,
    date: null,
    timeSlot: null,
    staff: null,
    customerName: '',
    customerPhone: ''
  });
  const [bookingId, setBookingId] = useState<string>('');

  const handleStepComplete = (nextStep: BookingStep) => {
    setCurrentStep(nextStep);
    // Default browser scroll handling (top of container)
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    if (currentStep === BookingStep.BRANCH_SELECTION) return;
    if (currentStep === BookingStep.MY_BOOKINGS) {
      setCurrentStep(BookingStep.BRANCH_SELECTION);
      return;
    }
    setCurrentStep(currentStep - 1);
  };

  const updateBookingState = (field: keyof BookingState, value: any) => {
    setBookingState(prev => ({ ...prev, [field]: value }));
  };

  const handleConfirmBooking = () => {
    // Generate Fake Booking ID: SS-YYMMDD-XXXX
    const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, ''); // 251209
    const random = Math.floor(1000 + Math.random() * 9000);
    const newId = `SS-${dateStr}-${random}`;
    
    setBookingId(newId);
    handleStepComplete(BookingStep.SUCCESS);
  };

  const renderStep = () => {
    switch (currentStep) {
      case BookingStep.BRANCH_SELECTION:
        return (
          <BranchSelection 
            onSelect={(b) => {
              updateBookingState('branch', b);
              handleStepComplete(BookingStep.SERVICE_SELECTION);
            }}
            onCheckHistory={() => handleStepComplete(BookingStep.MY_BOOKINGS)}
          />
        );
      case BookingStep.MY_BOOKINGS:
        return <MyBookingsScreen onBack={() => handleBack()} />;
      case BookingStep.SERVICE_SELECTION:
        return (
          <ServiceSelection 
            branchId={bookingState.branch?.id || ''}
            onSelect={(s) => {
              updateBookingState('service', s);
              handleStepComplete(BookingStep.DATE_SELECTION);
            }} 
          />
        );
      case BookingStep.DATE_SELECTION:
        return (
          <DateSelection 
            selectedDate={bookingState.date}
            onSelect={(d) => {
              updateBookingState('date', d);
              handleStepComplete(BookingStep.TIME_SELECTION);
            }} 
          />
        );
      case BookingStep.TIME_SELECTION:
        return (
          <TimeSelection 
            selectedTime={bookingState.timeSlot}
            onSelect={(t) => {
              updateBookingState('timeSlot', t);
              handleStepComplete(BookingStep.STAFF_SELECTION);
            }} 
          />
        );
      case BookingStep.STAFF_SELECTION:
        return (
          <StaffSelection 
            serviceId={bookingState.service?.id || ''}
            selectedStaff={bookingState.staff}
            date={bookingState.date || new Date()}
            timeSlot={bookingState.timeSlot || {id:'', time:'', available:false}}
            onSelect={(s) => {
              updateBookingState('staff', s);
              handleStepComplete(BookingStep.CONFIRMATION);
            }} 
          />
        );
      case BookingStep.CONFIRMATION:
        return (
          <Confirmation 
            bookingState={bookingState} 
            onChange={(field, val) => updateBookingState(field as keyof BookingState, val)}
            onConfirm={handleConfirmBooking}
          />
        );
      case BookingStep.SUCCESS:
        return <SuccessScreen bookingId={bookingId} />;
      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case BookingStep.MY_BOOKINGS: return 'ประวัติการจอง';
      case BookingStep.BRANCH_SELECTION: return 'คลินิกแผนไทย วสส.พล';
      case BookingStep.SERVICE_SELECTION: return 'เลือกบริการ';
      case BookingStep.DATE_SELECTION: return 'เลือกวันที่';
      case BookingStep.TIME_SELECTION: return 'เลือกเวลา';
      case BookingStep.STAFF_SELECTION: return 'เลือกพนักงาน';
      case BookingStep.CONFIRMATION: return 'ยืนยันการจอง';
      case BookingStep.SUCCESS: return 'จองสำเร็จ';
      default: return 'จองคิว';
    }
  };

  // High Contrast Header Logic
  return (
    <div className="min-h-screen bg-primary-50 font-sans text-stone-800 pb-10">
      <div className="max-w-lg mx-auto bg-primary-50 min-h-screen shadow-2xl relative">
        
        {/* Header */}
        <header className="sticky top-0 z-50 bg-primary-700 text-white shadow-md transition-all duration-300">
          <div className="px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {currentStep > 0 && currentStep !== BookingStep.SUCCESS && (
                <button 
                  onClick={handleBack}
                  className="p-2 rounded-full hover:bg-primary-600 transition-colors text-white"
                >
                  <ChevronLeft size={24} />
                </button>
              )}
              <div>
                <h1 className="text-xl font-bold leading-none drop-shadow-sm">{getStepTitle()}</h1>
                {currentStep === BookingStep.BRANCH_SELECTION && (
                   <p className="text-primary-100 text-xs mt-1">ยินดีต้อนรับเข้าสู่บริการค่ะ</p>
                )}
              </div>
            </div>
            <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center border border-primary-500 shadow-inner">
              <User size={20} className="text-white" />
            </div>
          </div>
          
          <StepIndicator 
            currentStep={currentStep} 
            onStepClick={(step) => setCurrentStep(step)}
          />
        </header>

        {/* Content */}
        <main className="p-4 pt-6">
          {renderStep()}
        </main>

        {/* Footer Summary (Sticky Bottom) */}
        {currentStep > BookingStep.BRANCH_SELECTION && currentStep < BookingStep.CONFIRMATION && currentStep !== BookingStep.MY_BOOKINGS && (
          <div className="fixed bottom-0 left-0 right-0 z-40">
            <div className="max-w-lg mx-auto bg-white/95 backdrop-blur-md border-t border-stone-200 p-4 shadow-lg-up">
              <div className="flex items-center justify-between text-sm">
                <div className="flex flex-col">
                  <span className="text-stone-400 text-xs">สรุปรายการ</span>
                  <div className="flex items-center gap-2 font-medium text-stone-800">
                    {bookingState.branch?.name && <span>{bookingState.branch.name.split('สาขา')[1]}</span>}
                    {bookingState.service && <span>• {bookingState.service.name}</span>}
                  </div>
                  <div className="text-primary-600 font-bold text-xs mt-0.5">
                    {bookingState.date && <span>{formatThaiDate(bookingState.date)}</span>}
                    {bookingState.timeSlot && <span>, {bookingState.timeSlot.time} น.</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
