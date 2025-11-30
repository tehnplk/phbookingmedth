
import React, { useState } from 'react';
import { Staff, TimeSlot } from '../types';
import { STAFF_MEMBERS, STAFF_SCHEDULES } from '../constants';
import { toISODateString } from '../utils';
import { User, Search, CheckCircle2 } from 'lucide-react';

interface StaffSelectionProps {
  serviceId: string;
  selectedStaff: Staff | null;
  date: Date;
  timeSlot: TimeSlot;
  onSelect: (s: Staff) => void;
}

export const StaffSelection: React.FC<StaffSelectionProps> = ({ 
  serviceId,
  selectedStaff, 
  date,
  timeSlot,
  onSelect 
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const availableStaff = STAFF_MEMBERS.filter(s => 
    s.specialty.includes(serviceId) && 
    s.name.includes(searchTerm)
  );

  const checkAvailability = (staffId: string) => {
    const schedule = STAFF_SCHEDULES[staffId];
    if (!schedule) return { available: true, reason: '' }; // No specific schedule means available

    const dateStr = toISODateString(date);

    // Check Day Off
    if (schedule.offDays.includes(dateStr)) {
      return { available: false, reason: 'วันหยุด' };
    }

    // Check Busy Time
    const busyTimes = schedule.busySlots[dateStr];
    if (busyTimes && busyTimes.includes(timeSlot.time)) {
      return { available: false, reason: 'ไม่ว่าง' };
    }

    return { available: true, reason: '' };
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-primary-100 p-3 rounded-full text-primary-600">
          <User size={32} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-stone-800">เลือกพนักงาน</h2>
          <p className="text-base text-stone-500">เลือกคนที่คุณถูกใจได้เลยค่ะ</p>
        </div>
      </div>
      
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
        <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ค้นหาชื่อพนักงาน..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-stone-200 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none text-lg transition-colors"
        />
      </div>

      <div className="space-y-4">
        {availableStaff.length === 0 ? (
          <div className="text-center py-8 text-stone-400">
            ไม่พบรายชื่อพนักงาน
          </div>
        ) : (
          availableStaff.map((staff) => {
            const isSelected = selectedStaff?.id === staff.id;
            const { available, reason } = checkAvailability(staff.id);

            return (
              <button
                key={staff.id}
                onClick={() => available && onSelect(staff)}
                disabled={!available}
                className={`
                  w-full flex items-center p-5 rounded-3xl border-2 transition-all touch-manipulation text-left
                  ${!available 
                    ? 'bg-stone-50 border-stone-100 opacity-60 cursor-not-allowed' 
                    : isSelected 
                      ? 'border-primary-500 bg-primary-50 shadow-md ring-1 ring-primary-500 active:scale-[0.98]' 
                      : 'border-stone-200 bg-white hover:border-primary-300 active:scale-[0.98]'}
                `}
              >
                <div className="relative">
                  <img 
                    src={staff.image} 
                    alt={staff.name} 
                    className={`w-24 h-24 rounded-full object-cover border-4 shadow-sm ${!available ? 'grayscale border-stone-200' : 'border-white'}`} 
                  />
                  {!available && (
                     <div className="absolute inset-0 bg-stone-100/50 rounded-full flex items-center justify-center">
                       <span className="text-xs font-bold bg-stone-600 text-white px-2 py-0.5 rounded-full">{reason}</span>
                     </div>
                  )}
                </div>
                
                <div className="ml-5 flex-1">
                  <h3 className={`text-xl font-bold mb-1 ${isSelected ? 'text-primary-900' : 'text-stone-800'}`}>{staff.name}</h3>
                  <p className="text-base text-stone-500">{staff.role}</p>
                </div>
                
                {isSelected && (
                  <div className="mr-2 text-primary-600">
                    <CheckCircle2 size={32} className="fill-current text-white bg-primary-600 rounded-full" />
                  </div>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};
