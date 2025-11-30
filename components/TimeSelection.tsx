
import React, { useState, useEffect } from 'react';
import { TimeSlot } from '../types';
import { SHOP_CONFIG, GENERATE_TIME_SLOTS } from '../constants';
import { Clock } from 'lucide-react';

interface TimeSelectionProps {
  selectedTime: TimeSlot | null;
  onSelect: (t: TimeSlot) => void;
}

export const TimeSelection: React.FC<TimeSelectionProps> = ({ 
  selectedTime, 
  onSelect 
}) => {
  const [slots, setSlots] = useState<TimeSlot[]>([]);

  useEffect(() => {
    // Generate slots based on Shop Config
    setSlots(GENERATE_TIME_SLOTS(SHOP_CONFIG));
  }, []);

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      <div className="flex items-center gap-3 mb-2">
        <div className="bg-primary-100 p-3 rounded-full text-primary-600">
          <Clock size={32} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-stone-800">เลือกเวลา</h2>
          <p className="text-base text-stone-500">
            ร้านเปิด {SHOP_CONFIG.openTime}:00 - {SHOP_CONFIG.closeTime}:00 น.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {slots.map((slot) => {
          const isSelected = selectedTime?.id === slot.id;
          return (
            <button
              key={slot.id}
              disabled={!slot.available}
              onClick={() => onSelect(slot)}
              className={`
                py-5 rounded-2xl border-2 font-bold text-xl transition-all relative overflow-hidden touch-manipulation
                ${!slot.available 
                  ? 'bg-stone-100 text-stone-300 border-stone-100 cursor-not-allowed' 
                  : isSelected 
                    ? 'bg-primary-600 text-white border-primary-600 shadow-lg scale-105 ring-2 ring-primary-300 ring-offset-1' 
                    : 'bg-white text-stone-700 border-stone-200 hover:border-primary-400 hover:bg-stone-50'}
              `}
            >
              {slot.time}
            </button>
          );
        })}
      </div>
    </div>
  );
};
