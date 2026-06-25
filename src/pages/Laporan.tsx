import React from 'react';
import { useApp } from '../store/AppContext';
import { FileText, CheckCircle2, Clock, AlertCircle, XCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export function Laporan() {
  const { currentUser, santri, attendance, evaluations } = useApp();

  if (!currentUser) return null;

  // Wali Santri View
  if (currentUser.role === 'wali_santri') {
    const myChildren = santri.filter(s => s.parentPhone === currentUser.phone);
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <FileText className="w-6 h-6 text-emerald-600" />
          Laporan Belajar
        </h2>
        
        {myChildren.map(child => {
          const childAttendance = attendance.filter(a => a.santriId === child.id);
          const childEvaluations = evaluations.filter(e => e.santriId === child.id);
          
          return (
            <motion.div 
              key={child.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-4"
            >
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-bold text-lg text-slate-800">{child.name}</h3>
                <p className="text-sm text-slate-500">Kelas: {child.classLevel}</p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-700 text-sm mb-2">Riwayat Kehadiran (Terbaru)</h4>
                {childAttendance.length === 0 ? (
                  <p className="text-xs text-slate-500">Belum ada data.</p>
                ) : (
                  <div className="space-y-2">
                    {childAttendance.slice(-3).reverse().map(a => (
                      <div key={a.id} className="flex justify-between items-center text-sm bg-slate-50 p-2 rounded-lg">
                        <span className="text-slate-600">{format(new Date(a.date), 'dd MMM yyyy', { locale: id })}</span>
                        <span className={`font-semibold px-2 py-0.5 rounded-full text-xs ${
                          a.status === 'Hadir' ? 'bg-emerald-100 text-emerald-700' :
                          a.status === 'Izin' ? 'bg-blue-100 text-blue-700' :
                          a.status === 'Sakit' ? 'bg-amber-100 text-amber-700' :
                          'bg-red-100 text-red-700'
                        }`}>{a.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h4 className="font-semibold text-slate-700 text-sm mb-2">Nilai Evaluasi (Terbaru)</h4>
                {childEvaluations.length === 0 ? (
                  <p className="text-xs text-slate-500">Belum ada data nilai.</p>
                ) : (
                  <div className="space-y-2">
                    {childEvaluations.slice(-3).reverse().map(e => (
                      <div key={e.id} className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-xs font-semibold text-emerald-600">{e.category}</span>
                          <span className="font-bold text-lg text-slate-800">{e.score}</span>
                        </div>
                        <p className="text-sm font-medium text-slate-700">{e.subject}</p>
                        {e.notes && <p className="text-xs text-slate-500 mt-1 italic">"{e.notes}"</p>}
                        <p className="text-[10px] text-slate-400 mt-2">{format(new Date(e.date), 'dd MMM yyyy', { locale: id })}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    );
  }

  // Admin / Ustadz View
  const targetSantri = currentUser.role === 'admin' ? santri : santri.filter(s => s.ustadzId === currentUser.id);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
        <FileText className="w-6 h-6 text-emerald-600" />
        {currentUser.role === 'admin' ? 'Laporan Institusi' : 'Laporan Kelas'}
      </h2>
      
      <div className="space-y-4">
        {targetSantri.map(child => {
          const childAttendance = attendance.filter(a => a.santriId === child.id);
          const childEvaluations = evaluations.filter(e => e.santriId === child.id);
          
          const totalHadir = childAttendance.filter(a => a.status === 'Hadir').length;
          const totalIzin = childAttendance.filter(a => a.status === 'Izin').length;
          const totalSakit = childAttendance.filter(a => a.status === 'Sakit').length;
          const totalAlpha = childAttendance.filter(a => a.status === 'Alpha').length;

          return (
            <motion.div 
              key={child.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-4"
            >
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-bold text-lg text-slate-800">{child.name}</h3>
                <p className="text-sm text-slate-500">NIS: {child.nis} • Kelas: {child.classLevel}</p>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-emerald-50 p-2 rounded-xl">
                  <p className="text-xs text-slate-500 mb-1">Hadir</p>
                  <p className="font-bold text-emerald-700">{totalHadir}</p>
                </div>
                <div className="bg-blue-50 p-2 rounded-xl">
                  <p className="text-xs text-slate-500 mb-1">Izin</p>
                  <p className="font-bold text-blue-700">{totalIzin}</p>
                </div>
                <div className="bg-amber-50 p-2 rounded-xl">
                  <p className="text-xs text-slate-500 mb-1">Sakit</p>
                  <p className="font-bold text-amber-700">{totalSakit}</p>
                </div>
                <div className="bg-red-50 p-2 rounded-xl">
                  <p className="text-xs text-slate-500 mb-1">Alpha</p>
                  <p className="font-bold text-red-700">{totalAlpha}</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-slate-700 text-sm mb-2">Evaluasi Terbaru</h4>
                {childEvaluations.length === 0 ? (
                  <p className="text-xs text-slate-500">Belum ada data nilai.</p>
                ) : (
                  <div className="space-y-2">
                    {childEvaluations.slice(-2).reverse().map(e => (
                      <div key={e.id} className="flex justify-between items-center text-sm bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <div>
                          <p className="font-medium text-slate-700">{e.subject}</p>
                          <p className="text-[10px] text-slate-500">{format(new Date(e.date), 'dd MMM yyyy', { locale: id })}</p>
                        </div>
                        <span className="font-bold text-lg text-emerald-600">{e.score}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )
        })}
        {targetSantri.length === 0 && (
          <div className="text-center p-8 text-slate-500">Belum ada data santri.</div>
        )}
      </div>
    </div>
  );
}
