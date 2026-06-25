import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { BookOpen, Plus, Save } from 'lucide-react';
import { motion } from 'motion/react';
import { format } from 'date-fns';

export function Nilai() {
  const { currentUser, santri, addEvaluation } = useApp();
  const [selectedSantri, setSelectedSantri] = useState<string>('');
  const [category, setCategory] = useState('');
  const [subject, setSubject] = useState('');
  const [score, setScore] = useState<'A' | 'B' | 'C' | 'D'>('B');
  const [notes, setNotes] = useState('');
  const [success, setSuccess] = useState(false);

  if (!currentUser || currentUser.role === 'admin') return null;

  const mySantri = santri.filter(s => s.ustadzId === currentUser.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSantri || !category || !subject) return;

    addEvaluation({
      id: Math.random().toString(36).substr(2, 9),
      santriId: selectedSantri,
      ustadzId: currentUser.id,
      date: format(new Date(), 'yyyy-MM-dd'),
      category,
      subject,
      score,
      notes
    });

    setSuccess(true);
    setSubject('');
    setNotes('');
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-emerald-600" />
            Evaluasi Belajar
          </h2>
          <p className="text-sm text-slate-500">Input nilai prestasi santri</p>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {success && (
            <div className="p-3 bg-emerald-50 text-emerald-700 text-sm rounded-xl font-medium border border-emerald-100 text-center">
              Nilai berhasil disimpan!
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 ml-1">Pilih Santri</label>
            <select 
              value={selectedSantri}
              onChange={e => setSelectedSantri(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              required
            >
              <option value="">-- Pilih Santri --</option>
              {mySantri.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.classLevel})</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 ml-1">Kategori (Contoh: Tahsin, Hafalan Doa)</label>
            <input 
              type="text"
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              placeholder="Tahsin / Hafalan Surat Pendek"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 ml-1">Materi / Subjek</label>
            <input 
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              placeholder="Contoh: Doa Sebelum Tidur"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 ml-1">Nilai (A Sangat Baik, B Baik, C Cukup, D Kurang)</label>
            <div className="flex gap-2">
              {['A', 'B', 'C', 'D'].map(val => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setScore(val as any)}
                  className={`flex-1 py-3 rounded-xl font-bold transition-all ${score === val ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 ml-1">Catatan Tambahan</label>
            <textarea 
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500 text-sm resize-none"
              placeholder="Opsional..."
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-600 text-amber-950 font-bold py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mt-4"
          >
            <Save className="w-5 h-5" />
            Simpan Nilai
          </button>
        </form>
      </motion.div>
    </div>
  );
}
