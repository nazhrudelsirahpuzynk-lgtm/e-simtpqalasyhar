import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { Bell, Send } from 'lucide-react';
import { motion } from 'motion/react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export function Pengumuman() {
  const { currentUser, announcements, addAnnouncement } = useApp();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [success, setSuccess] = useState(false);

  if (currentUser?.role !== 'admin') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    addAnnouncement({
      id: Math.random().toString(36).substr(2, 9),
      title,
      content,
      date: new Date().toISOString(),
      authorId: currentUser.id,
      targetRole: 'all'
    });

    setSuccess(true);
    setTitle('');
    setContent('');
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Bell className="w-6 h-6 text-amber-500" />
            Kelola Pengumuman
          </h2>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100"
      >
        <h3 className="font-bold text-slate-800 mb-4">Buat Pengumuman Baru</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          {success && (
            <div className="p-3 bg-emerald-50 text-emerald-700 text-sm rounded-xl font-medium border border-emerald-100 text-center">
              Pengumuman berhasil dikirim!
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 ml-1">Judul Pengumuman</label>
            <input 
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              placeholder="Contoh: Libur Hari Raya"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 ml-1">Isi Pengumuman</label>
            <textarea 
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={4}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500 text-sm resize-none"
              placeholder="Tulis pesan Anda di sini..."
              required
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mt-4"
          >
            <Send className="w-5 h-5" />
            Kirim Pengumuman
          </button>
        </form>
      </motion.div>

      <div className="space-y-3">
        <h3 className="font-bold text-slate-800 mt-6">Riwayat Pengumuman</h3>
        {announcements.map(ann => (
          <div key={ann.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-bold text-slate-800">{ann.title}</h4>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded-full font-medium">
                {format(new Date(ann.date), 'dd MMM yyyy', { locale: id })}
              </span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">{ann.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
