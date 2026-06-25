import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { CalendarCheck, CheckCircle2, XCircle, AlertCircle, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export function Absensi() {
  const { currentUser, santri, attendance, addAttendance } = useApp();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  if (!currentUser || currentUser.role === 'admin') return null;

  // For Ustadz: show santri they teach
  const mySantri = santri.filter(s => s.ustadzId === currentUser.id);

  const getStatus = (santriId: string) => {
    return attendance.find(a => a.santriId === santriId && a.date === selectedDate)?.status;
  };

  const handleAbsen = (santriId: string, status: 'Hadir' | 'Izin' | 'Sakit' | 'Alpha') => {
    addAttendance({
      id: Math.random().toString(36).substr(2, 9),
      santriId,
      date: selectedDate,
      status
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <CalendarCheck className="w-6 h-6 text-emerald-600" />
            Absensi Santri
          </h2>
          <p className="text-sm text-slate-500">Input kehadiran harian</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <label className="text-xs font-semibold text-slate-500 mb-1 block">Pilih Tanggal</label>
        <input 
          type="date" 
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <div className="space-y-4">
        {mySantri.map(s => {
          const status = getStatus(s.id);
          return (
            <motion.div 
              key={s.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100"
            >
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-bold text-slate-800">{s.name}</h4>
                <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">{s.classLevel}</span>
              </div>
              
              <div className="grid grid-cols-4 gap-2">
                <button 
                  onClick={() => handleAbsen(s.id, 'Hadir')}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${status === 'Hadir' ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                >
                  <CheckCircle2 className={`w-5 h-5 mb-1 ${status === 'Hadir' ? 'text-emerald-500' : ''}`} />
                  <span className="text-[10px] font-medium">Hadir</span>
                </button>
                <button 
                  onClick={() => handleAbsen(s.id, 'Izin')}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${status === 'Izin' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                >
                  <Clock className={`w-5 h-5 mb-1 ${status === 'Izin' ? 'text-blue-500' : ''}`} />
                  <span className="text-[10px] font-medium">Izin</span>
                </button>
                <button 
                  onClick={() => handleAbsen(s.id, 'Sakit')}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${status === 'Sakit' ? 'bg-amber-50 border-amber-500 text-amber-700' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                >
                  <AlertCircle className={`w-5 h-5 mb-1 ${status === 'Sakit' ? 'text-amber-500' : ''}`} />
                  <span className="text-[10px] font-medium">Sakit</span>
                </button>
                <button 
                  onClick={() => handleAbsen(s.id, 'Alpha')}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${status === 'Alpha' ? 'bg-red-50 border-red-500 text-red-700' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                >
                  <XCircle className={`w-5 h-5 mb-1 ${status === 'Alpha' ? 'text-red-500' : ''}`} />
                  <span className="text-[10px] font-medium">Alpha</span>
                </button>
              </div>
            </motion.div>
          )
        })}
        {mySantri.length === 0 && (
          <div className="text-center p-8 text-slate-500">Tidak ada santri di kelas Anda.</div>
        )}
      </div>
    </div>
  );
}
