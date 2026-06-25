import React from 'react';
import { useApp } from '../store/AppContext';
import { Users, BookOpen, CalendarCheck, FileText, Bell, GraduationCap, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export function Dashboard() {
  const { currentUser, santri, announcements, users } = useApp();

  if (!currentUser) return null;

  const totalUstadz = users.filter(u => u.role === 'ustadz').length;

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-emerald-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden"
      >
        <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
        <h2 className="text-emerald-100 text-sm font-medium mb-1">Assalamu'alaikum,</h2>
        <h1 className="text-2xl font-bold mb-4">{currentUser.name}</h1>
        <div className="flex items-center gap-2 text-sm bg-black/20 w-fit px-3 py-1.5 rounded-full backdrop-blur-sm">
          <Clock className="w-4 h-4 text-amber-400" />
          <span>{format(new Date(), 'EEEE, dd MMMM yyyy', { locale: id })}</span>
        </div>
      </motion.div>

      {/* Quick Stats - Admin & Ustadz */}
      {['admin', 'ustadz'].includes(currentUser.role) && (
        <div className={`grid gap-4 ${currentUser.role === 'admin' ? 'grid-cols-3' : 'grid-cols-2'}`}>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center gap-2 text-center">
            <div className="bg-emerald-100 p-3 rounded-xl text-emerald-600">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-500 text-[10px] font-medium uppercase tracking-wider">Santri</p>
              <p className="text-xl font-bold text-slate-800">{santri.length}</p>
            </div>
          </div>

          {currentUser.role === 'admin' && (
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center gap-2 text-center">
              <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <p className="text-slate-500 text-[10px] font-medium uppercase tracking-wider">Ustadz</p>
                <p className="text-xl font-bold text-slate-800">{totalUstadz}</p>
              </div>
            </div>
          )}

          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center gap-2 text-center">
            <div className="bg-amber-100 p-3 rounded-xl text-amber-600">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-500 text-[10px] font-medium uppercase tracking-wider">Kelas</p>
              <p className="text-xl font-bold text-slate-800">7</p>
            </div>
          </div>
        </div>
      )}

      {/* Wali Santri - Children View */}
      {currentUser.role === 'wali_santri' && (
        <div className="space-y-3">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-emerald-600" />
            Anak Saya
          </h3>
          {santri.filter(s => s.parentPhone === currentUser.phone).map(child => (
            <div key={child.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold text-lg">
                  {child.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">{child.name}</h4>
                  <p className="text-xs text-slate-500">NIS: {child.nis} • Kelas: {child.classLevel}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Announcements */}
      <div className="space-y-3">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <Bell className="w-5 h-5 text-amber-500" />
          Pengumuman Terbaru
        </h3>
        {announcements.length === 0 ? (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center text-slate-500 text-sm">
            Belum ada pengumuman.
          </div>
        ) : (
          announcements.map(ann => (
            <div key={ann.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-slate-800">{ann.title}</h4>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded-full font-medium">
                  {format(new Date(ann.date), 'dd MMM yyyy', { locale: id })}
                </span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">{ann.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
