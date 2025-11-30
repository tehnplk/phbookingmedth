
import React from 'react';
import { Button } from './Button';
import { CheckCircle2, QrCode } from 'lucide-react';

interface SuccessScreenProps {
  bookingId: string;
}

export const SuccessScreen: React.FC<SuccessScreenProps> = ({ bookingId }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] animate-fade-in pb-10 px-2">
      <div className="text-center mb-6">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="text-3xl font-bold text-stone-800">จองสำเร็จ!</h2>
        <p className="text-stone-500 mt-2 text-lg">ขอบคุณที่ใช้บริการค่ะ</p>
      </div>

      {/* Ticket UI */}
      <div className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-xl border border-stone-100 relative">
        {/* Ticket Header */}
        <div className="bg-primary-600 p-6 text-center">
           <h3 className="text-white text-xl font-bold">บัตรนัดรับบริการ</h3>
           <p className="text-primary-100 text-sm opacity-90">คลินิกแผนไทย วสส.พล</p>
        </div>
        
        {/* Ticket Body */}
        <div className="p-8 flex flex-col items-center gap-6">
           <div className="bg-white p-2 rounded-xl border-2 border-stone-100 shadow-inner">
             <img 
               src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${bookingId}`} 
               alt="Booking QR" 
               className="w-48 h-48 object-contain"
             />
           </div>
           
           <div className="text-center space-y-1">
             <p className="text-stone-400 text-sm uppercase tracking-wider font-semibold">Booking ID</p>
             <p className="text-2xl font-mono font-bold text-stone-800 tracking-widest">{bookingId}</p>
           </div>
        </div>

        {/* Cutout Circles */}
        <div className="absolute top-[88px] -left-4 w-8 h-8 bg-primary-50 rounded-full"></div>
        <div className="absolute top-[88px] -right-4 w-8 h-8 bg-primary-50 rounded-full"></div>
        
        {/* Dashed Line */}
        <div className="absolute top-[102px] left-4 right-4 border-b-2 border-dashed border-primary-400/30"></div>

        {/* Footer */}
        <div className="bg-stone-50 p-4 text-center border-t border-stone-100">
          <p className="text-stone-500 text-sm flex items-center justify-center gap-2">
            <QrCode size={16}/> โปรดยื่น QR Code นี้ที่หน้าเคาน์เตอร์
          </p>
        </div>
      </div>

      <div className="mt-8">
        <Button variant="ghost" onClick={() => window.location.reload()}>
          กลับสู่หน้าหลัก
        </Button>
      </div>
    </div>
  );
};
