// Booking Step 3: Date Selection (ขั้นตอนที่ 3: เลือกวันที่)
import React, { useState, useEffect } from 'react';
import { SHOP_CONFIG } from '../constants';
import { toISODateString, formatThaiDateShort } from '../utils';
import { Calendar, XCircle } from 'lucide-react';

interface DateSelectionProps {
  selectedDate: Date | null;
  onSelect: (d: Date) => void;
  onBack?: () => void;
}

export const DateSelection: React.FC<DateSelectionProps> = ({ 
  selectedDate, 
  onSelect,
  onBack
}) => {
  const [dates, setDates] = useState<Date[]>([]);

  useEffect(() => {
    const arr = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      arr.push(d);
    }
    setDates(arr);
  }, []);

  const getDayName = (date: Date) => {
    return new Intl.DateTimeFormat('th-TH', { weekday: 'long' }).format(date);
  };

  const isHoliday = (date: Date) => {
    const dateString = toISODateString(date);
    return SHOP_CONFIG.holidays.includes(dateString);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-primary-100 p-3 rounded-full text-primary-600">
          <Calendar size={32} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-stone-800">เลือกวันที่</h2>
          {SHOP_CONFIG.holidays.length > 0 && (
            <p className="text-sm text-red-500 mt-1">* สีเทาคือวันหยุดร้าน</p>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {dates.map((date, idx) => {
          const isSelected = selectedDate?.toDateString() === date.toDateString();
          const holiday = isHoliday(date);
          
          return (
            <button
              key={idx}
              onClick={() => !holiday && onSelect(date)}
              disabled={holiday}
              className={`
                flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all
                touch-manipulation shadow-sm relative overflow-hidden
                ${holiday 
                  ? 'bg-stone-100 border-stone-200 opacity-60 cursor-not-allowed' 
                  : isSelected 
                    ? 'border-primary-500 bg-primary-600 text-white ring-2 ring-primary-300 ring-offset-2 active:scale-95' 
                    : 'border-stone-200 bg-white text-stone-600 hover:border-primary-300 hover:bg-stone-50 active:scale-95'}
              `}
            >
              <span className={`text-lg font-medium mb-1 ${isSelected ? 'text-primary-100' : 'text-stone-500'}`}>
                {getDayName(date)}
              </span>
              <span className={`text-2xl font-bold ${holiday ? 'line-through text-stone-400' : ''}`}>
                {formatThaiDateShort(date)}
              </span>
              {holiday && (
                <div className="absolute top-2 right-2 text-red-400">
                  <XCircle size={16} />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
