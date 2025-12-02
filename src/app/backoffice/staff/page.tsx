export default function BackofficeStaffPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold tracking-tight mb-1">จัดการพนักงาน</h1>
        <p className="text-sm text-stone-500">
          หน้านี้จะใช้จัดการข้อมูลพนักงาน/หมอนวด (Staff) และความถนัด (specialty) ตามสเปกใน `.spec/backoffice`.
        </p>
      </div>
      <div className="rounded-xl border border-dashed border-stone-300 bg-stone-50 p-6 text-sm text-stone-500">
        ตารางพนักงานและฟอร์มเพิ่ม/แก้ไขพนักงานจะถูกเพิ่มในเฟสถัดไป
      </div>
    </div>
  );
}
