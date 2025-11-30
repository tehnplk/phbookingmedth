
import React from 'react';
import { Branch } from '../types';
import { BRANCHES } from '../constants';
import { Button } from './Button';
import { Search, Store, MapPin, ChevronLeft } from 'lucide-react';

interface BranchSelectionProps {
  onSelect: (b: Branch) => void;
  onCheckHistory: () => void;
}

export const BranchSelection: React.FC<BranchSelectionProps> = ({ onSelect, onCheckHistory }) => {
  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {/* 1. Search Section - Top Priority */}
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-stone-200">
         <h2 className="text-lg font-bold text-stone-800 mb-3 flex items-center gap-2">
           <Search size={22} className="text-primary-600"/> 
           มีรายการจองอยู่แล้ว?
         </h2>
         <Button 
          variant="outline" 
          fullWidth 
          onClick={onCheckHistory}
          className="!py-3 !text-lg !rounded-xl border-2 border-stone-200 text-stone-600 hover:border-primary-500 hover:text-primary-700 bg-stone-50"
        >
          ตรวจสอบสถานะ / ค้นหาตั๋ว
        </Button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-primary-200"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="px-3 bg-primary-50 text-sm text-stone-400 font-medium">หรือ จองคิวใหม่</span>
        </div>
      </div>

      {/* 2. Branch Selection Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-primary-100 p-3 rounded-full text-primary-600">
            <Store size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-stone-800">เลือกสาขา</h2>
            <p className="text-base text-stone-500">เลือกสาขาที่ใกล้คุณที่สุดค่ะ</p>
          </div>
        </div>

        <div className="space-y-4">
          {BRANCHES.map((branch) => (
            <div 
              key={branch.id}
              onClick={() => onSelect(branch)}
              className="group relative flex flex-col sm:flex-row items-start sm:items-center p-4 rounded-3xl border-2 border-stone-200 bg-white hover:border-primary-300 hover:bg-white transition-all cursor-pointer active:scale-[0.98] touch-manipulation shadow-sm"
            >
              <img src={branch.image} alt={branch.name} className="w-full sm:w-28 h-40 sm:h-28 rounded-2xl object-cover shadow-md mb-4 sm:mb-0" />
              
              <div className="sm:ml-5 flex-1 w-full">
                <h3 className="text-xl font-bold text-stone-900 leading-tight mb-2 group-hover:text-primary-700 transition-colors">{branch.name}</h3>
                <div className="flex items-start gap-2 text-stone-500 text-base leading-relaxed">
                  <MapPin size={18} className="mt-1 shrink-0 text-primary-500" />
                  <span>{branch.location}</span>
                </div>
              </div>
              
              <div className="absolute top-4 right-4 sm:relative sm:top-auto sm:right-auto sm:ml-4 bg-primary-100 text-primary-600 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronLeft size={24} className="rotate-180" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
