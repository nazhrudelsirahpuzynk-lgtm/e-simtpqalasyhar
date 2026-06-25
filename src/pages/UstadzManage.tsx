import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { Users, Plus, Search, ChevronRight, X, Save, UserCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User, ClassLevel } from '../types';

export function UstadzManage() {
  const { users, currentUser, addUser } = useApp();
  const [search, setSearch] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [selectedUstadz, setSelectedUstadz] = useState<User | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<User>>({
    role: 'ustadz',
    gender: 'L',
    classLevel: 'Jilid 1',
    isActive: true,
  });

  if (currentUser?.role !== 'admin') return null;

  const ustadzList = users.filter(u => u.role === 'ustadz');
  const filtered = ustadzList.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.phone.includes(search));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUstadz: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name || '',
      phone: formData.phone || '',
      password: formData.password || 'password',
      role: 'ustadz',
      gender: formData.gender as 'L' | 'P',
      birthPlace: formData.birthPlace || '',
      birthDate: formData.birthDate || '',
      address: formData.address || '',
      classLevel: formData.classLevel as ClassLevel,
      isActive: true,
    };
    addUser(newUstadz);
    setIsAdding(false);
    setFormData({ role: 'ustadz', gender: 'L', classLevel: 'Jilid 1', isActive: true });
  };

  return (
    <div className="space-y-4 relative">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Kelola Ustadz</h2>
          <p className="text-sm text-slate-500">Total {ustadzList.length} ustadz terdaftar</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-emerald-600 text-white p-3 rounded-full shadow-lg hover:bg-emerald-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
          placeholder="Cari nama atau nomor HP..."
        />
      </div>

      <div className="space-y-3">
        {filtered.map(u => (
          <motion.div 
            key={u.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setSelectedUstadz(u)}
            className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center active:scale-[0.98] transition-transform cursor-pointer hover:border-emerald-200"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold text-lg">
                {u.name.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-slate-800">{u.name}</h4>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">HP: {u.phone}</span>
                  {u.classLevel && (
                    <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">{u.classLevel}</span>
                  )}
                </div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center p-8 text-slate-500">Ustadz tidak ditemukan.</div>
        )}
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm sm:p-4"
          >
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                <h3 className="font-bold text-lg text-slate-800">Tambah Ustadz Baru</h3>
                <button 
                  onClick={() => setIsAdding(false)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              
              <div className="p-4 overflow-y-auto">
                <form id="add-ustadz-form" onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 ml-1">Nama Lengkap</label>
                    <input name="name" required onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-500 text-sm" placeholder="Nama Ustadz" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500 ml-1">Jenis Kelamin</label>
                      <select name="gender" required onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-500 text-sm">
                        <option value="L">Laki-laki</option>
                        <option value="P">Perempuan</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500 ml-1">Wali Kelas</label>
                      <select name="classLevel" required onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-500 text-sm">
                        <option value="Jilid 1">Jilid 1</option>
                        <option value="Jilid 2">Jilid 2</option>
                        <option value="Jilid 3">Jilid 3</option>
                        <option value="Jilid 4">Jilid 4</option>
                        <option value="Jilid 5">Jilid 5</option>
                        <option value="Al Qur'an 1">Al Qur'an 1</option>
                        <option value="Al Qur'an 2">Al Qur'an 2</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500 ml-1">Tempat Lahir</label>
                      <input name="birthPlace" required onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-500 text-sm" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500 ml-1">Tanggal Lahir</label>
                      <input name="birthDate" type="date" required onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-500 text-sm" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 ml-1">Alamat Lengkap</label>
                    <textarea name="address" required onChange={handleInputChange} rows={2} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-500 text-sm resize-none" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500 ml-1">Nomor HP (Login Ustadz)</label>
                      <input name="phone" type="tel" required onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-500 text-sm" placeholder="Contoh: 08222" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500 ml-1">Password</label>
                      <input name="password" type="text" required onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-500 text-sm" placeholder="Password Login" />
                    </div>
                  </div>
                </form>
              </div>

              <div className="p-4 border-t border-slate-100 bg-white sticky bottom-0 z-10">
                <button 
                  type="submit"
                  form="add-ustadz-form"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Simpan Data Ustadz
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedUstadz && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm sm:p-4"
          >
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                <h3 className="font-bold text-lg text-slate-800">Detail Ustadz</h3>
                <button 
                  onClick={() => setSelectedUstadz(null)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              
              <div className="p-5 overflow-y-auto space-y-4">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold text-2xl">
                    {selectedUstadz.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-xl text-slate-800">{selectedUstadz.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">HP: {selectedUstadz.phone}</span>
                      {selectedUstadz.classLevel && (
                        <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">Wali: {selectedUstadz.classLevel}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-sm">
                  <div className="grid grid-cols-3">
                    <span className="text-slate-500 font-medium col-span-1">Gender</span>
                    <span className="text-slate-800 font-semibold col-span-2">{selectedUstadz.gender === 'P' ? 'Perempuan' : 'Laki-laki'}</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="text-slate-500 font-medium col-span-1">TTL</span>
                    <span className="text-slate-800 font-semibold col-span-2">
                      {selectedUstadz.birthPlace || '-'}, {selectedUstadz.birthDate || '-'}
                    </span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="text-slate-500 font-medium col-span-1">Alamat</span>
                    <span className="text-slate-800 font-semibold col-span-2">{selectedUstadz.address || '-'}</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="text-slate-500 font-medium col-span-1">Status</span>
                    <span className="text-slate-800 font-semibold col-span-2">
                      <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-xs">Aktif</span>
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
