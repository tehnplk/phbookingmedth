'use client';

import React, { useEffect, useState } from 'react';
import { useBooking } from '@/context/BookingContext';
import { BookingStep } from '@/types';
import { BranchSelection } from '@/components/BranchSelection';
import { ServiceSelection } from '@/components/ServiceSelection';
import { DateSelection } from '@/components/DateSelection';
import { TimeSelection } from '@/components/TimeSelection';
import { StaffSelection } from '@/components/StaffSelection';
import { Confirmation } from '@/components/Confirmation';
import { SuccessScreen } from '@/components/SuccessScreen';
import { MyBookingsScreen } from '@/components/MyBookingsScreen';
import { useRouter } from 'next/navigation';

export default function BookingPage() {
  const { currentStep, setStep, updateBookingState, bookingState, resetBooking } = useBooking();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [bookingId, setBookingId] = useState<string>('');

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);

  const handleConfirmBooking = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          branchId: bookingState.branch?.id,
          serviceId: bookingState.service?.id,
          staffId: bookingState.staff?.id,
          date: bookingState.date?.toISOString(),
          time: bookingState.timeSlot?.time,
          customerName: bookingState.customerName,
          customerPhone: bookingState.customerPhone,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Booking failed');
      }

      const data = await response.json();
      setBookingId(data.bookingId);
      setStep(BookingStep.SUCCESS);
    } catch (error) {
      console.error('Booking error:', error);
      alert('เกิดข้อผิดพลาดในการจอง กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case BookingStep.BRANCH_SELECTION:
        return (
          <BranchSelection 
            onSelect={(branch) => {
              updateBookingState('branch', branch);
              setStep(BookingStep.SERVICE_SELECTION);
            }}
            onCheckHistory={() => setStep(BookingStep.MY_BOOKINGS)}
          />
        );
      case BookingStep.SERVICE_SELECTION:
        return (
          <ServiceSelection
            branchId={bookingState.branch?.id || ''}
            onSelect={(service) => {
              updateBookingState('service', service);
              setStep(BookingStep.DATE_SELECTION);
            }}
            onBack={() => setStep(BookingStep.BRANCH_SELECTION)}
          />
        );
      case BookingStep.DATE_SELECTION:
        return (
          <DateSelection
            selectedDate={bookingState.date}
            onSelect={(date) => {
              updateBookingState('date', date);
              setStep(BookingStep.TIME_SELECTION);
            }}
            onBack={() => setStep(BookingStep.SERVICE_SELECTION)}
          />
        );
      case BookingStep.TIME_SELECTION:
        return (
          <TimeSelection
            selectedDate={bookingState.date || new Date()}
            selectedTime={bookingState.timeSlot}
            onSelect={(slot) => {
              updateBookingState('timeSlot', slot);
              setStep(BookingStep.STAFF_SELECTION);
            }}
            onBack={() => setStep(BookingStep.DATE_SELECTION)}
          />
        );
      case BookingStep.STAFF_SELECTION:
        return (
          <StaffSelection
            serviceId={bookingState.service?.id || ''}
            selectedStaff={bookingState.staff}
            date={bookingState.date || new Date()}
            timeSlot={bookingState.timeSlot || { id: '', time: '', available: false }}
            onSelect={(staff) => {
              updateBookingState('staff', staff);
              setStep(BookingStep.CONFIRMATION);
            }}
            onBack={() => setStep(BookingStep.TIME_SELECTION)}
          />
        );
      case BookingStep.CONFIRMATION:
        return (
          <Confirmation
            bookingState={bookingState}
            onConfirm={handleConfirmBooking}
            onChange={updateBookingState}
            onBack={() => setStep(BookingStep.STAFF_SELECTION)}
            isLoading={isLoading}
          />
        );
      case BookingStep.SUCCESS:
        return (
          <SuccessScreen
            bookingId={bookingId || `BK-${Date.now().toString().slice(-6)}`}
            onHome={() => {
              resetBooking();
              setStep(BookingStep.BRANCH_SELECTION);
            }}
            onCheckHistory={() => {
              resetBooking();
              setStep(BookingStep.MY_BOOKINGS);
            }}
          />
        );
      case BookingStep.MY_BOOKINGS:
        return (
          <MyBookingsScreen
            onBack={() => setStep(BookingStep.BRANCH_SELECTION)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="animate-fade-in">
      {renderStep()}
    </div>
  );
}
