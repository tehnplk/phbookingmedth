
import React, { useState } from 'react';
import { BookingState } from '../types';
import { formatThaiDate, formatPhoneNumber } from '../utils';
import { Button } from './Button';
import { CheckCircle2, Phone, AlertCircle } from 'lucide-react';

interface ConfirmationProps {
  bookingState: BookingState;
  onConfirm: () => void;
  onChange: (field: string, value: string) => void;
}

export const Confirmation: React.FC<ConfirmationProps> = ({ 
  bookingState, 
  onConfirm,
  onChange 
}) => {
  const [isValidPhone, setIsValidPhone] = useState(true);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, ''); // Remove non-digits
    
    // Limit to 10 digits
    const truncated = rawValue.slice(0, 10);
    
    onChange('customerPhone', truncated);

    // Validate: Must be 10 digits and start with 06, 08, 09
    const regex = /^0[689]\d{8}$/;
    setIsValidPhone(regex.test(truncated) || truncated.length === 0);
  };

  const formattedPhone = formatPhoneNumber(bookingState.customerPhone);
  const canSubmit = bookingState.customerName.trim().length > 0 && 
                    bookingState.customerPhone.length === 10 && isValidPhone;

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-primary-100 p-3 rounded-full text-primary-600">
          <CheckCircle2 size={32} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-stone-800">ยืนยันการจอง</h2>
          <p className="text-base text-stone-500">ตรวจสอบข้อมูลก่อนยืนยันนะคะ</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200 space-y-4">
        <div className="flex justify-between border-b border-stone-100 pb-3">
          <span className="text-stone-500">สาขา</span>
          <span className="font-bold text-stone-800 text-right">{bookingState.branch?.name}</span>
        </div>
        <div className="flex justify-between border-b border-stone-100 pb-3">
          <span className="text-stone-500">บริการ</span>
          <span className="font-bold text-stone-800">{bookingState.service?.name}</span>
        </div>
        <div className="flex justify-between border-b border-stone-100 pb-3">
          <span className="text-stone-500">วันที่</span>
          <span className="font-bold text-stone-800">
            {bookingState.date ? formatThaiDate(bookingState.date) : '-'}
          </span>
        </div>
        <div className="flex justify-between border-b border-stone-100 pb-3">
          <span className="text-stone-500">เวลา</span>
          <span className="font-bold text-stone-800">{bookingState.timeSlot?.time} น.</span>
        </div>
        <div className="flex justify-between border-b border-stone-100 pb-3">
          <span className="text-stone-500">พนักงาน</span>
          <span className="font-bold text-stone-800">{bookingState.staff?.name}</span>
        </div>
        <div className="flex justify-between items-center pt-2">
          <span className="text-lg font-bold text-stone-800">ราคา</span>
          <span className="text-2xl font-bold text-primary-600">{bookingState.service?.price} บาท</span>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-base font-medium text-stone-700 mb-2">ชื่อผู้จอง</label>
          <input
            type="text"
            value={bookingState.customerName}
            onChange={(e) => onChange('customerName', e.target.value)}
            className="w-full px-5 py-4 rounded-xl border-2 border-stone-200 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none text-lg"
            placeholder="ระบุชื่อของคุณ"
          />
        </div>
        <div>
          <label className="block text-base font-medium text-stone-700 mb-2">เบอร์โทรศัพท์ (มือถือ 10 หลัก)</label>
          <div className="relative">
             <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
             <input
              type="tel"
              value={formattedPhone}
              onChange={handlePhoneChange}
              maxLength={12} // 10 digits + 2 hyphens
              className={`w-full pl-12 pr-5 py-4 rounded-xl border-2 outline-none text-lg tracking-wide font-mono ${!isValidPhone && bookingState.customerPhone.length > 0 ? 'border-red-500 focus:border-red-500 text-red-600' : 'border-stone-200 focus:border-primary-500 focus:ring-1 focus:ring-primary-500'}`}
              placeholder="0xx-xxx-xxxx"
            />
          </div>
          {!isValidPhone && bookingState.customerPhone.length > 0 && (
            <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
              <AlertCircle size={16} /> กรุณากรอกเบอร์มือถือให้ถูกต้อง (เช่น 0812345678)
            </p>
          )}
        </div>
      </div>

      <Button 
        fullWidth 
        onClick={onConfirm} 
        disabled={!canSubmit}
        className="mt-4 !py-4 !text-xl !font-bold"
      >
        ยืนยันการจอง
      </Button>
    </div>
  );
};
