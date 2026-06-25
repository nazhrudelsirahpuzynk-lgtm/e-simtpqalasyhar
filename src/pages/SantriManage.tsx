import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { Users, Plus, Search, ChevronRight, X, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Santri, ClassLevel } from '../types';

export function SantriManage() {
  const { santri, currentUser, addSantri, users, addUser } = useApp();
  const [search, setSearch] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [selectedSantri, setSelectedSantri] = useState<Santri | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Santri> & { parentPassword?: string }>({
    gender: 'L',
    classLevel: 'Jilid 1',
    isActive: true,
  });

  if (currentUser?.role !== 'admin') return null;

  const ustadzList = users.filter(u => u.role === 'ustadz');
  const filtered = santri.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.nis.includes(search));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSantri: Santri = {
      id: Math.random().toString(36).substr(2, 9),
      nis: formData.nis || '',
      name: formData.name || '',
      gender: formData.gender as 'L' | 'P',
      birthPlace: formData.birthPlace || '',
      birthDate: formData.birthDate || '',
      address: formData.address || '',
      fatherName: formData.fatherName || '',
      motherName: formData.motherName || '',
      parentPhone: formData.parentPhone || '',
      classLevel: formData.classLevel as ClassLevel,
      isActive: true,
      ustadzId: formData.ustadzId,
    };
    
    // Automatically create Wali Santri user if not exists
    if (formData.parentPhone) {
      const existingUser = users.find(u => u.phone === formData.parentPhone && u.role === 'wali_santri');
      if (!existingUser) {
        addUser({
          id: Math.random().toString(36).substr(2, 9),
          name: `Wali ${formData.name}`,
          phone: formData.parentPhone,
          password: formData.parentPassword || 'password',
          role: 'wali_santri'
        });
      }
    }

    addSantri(newSantri);
    setIsAdding(false);
    setFormData({ gender: 'L', classLevel: 'Jilid 1', isActive: true });
  };

  return (
    <div className="space-y-4 relative">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Kelola Santri</h2>
          <p className="text-sm text-slate-500">Total {santri.length} santri terdaftar</p>
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
          placeholder="Cari nama atau NIS..."
        />
      </div>

      <div className="space-y-3">
        {filtered.map(s => (
          <motion.div 
            key={s.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setSelectedSantri(s)}
            className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center active:scale-[0.98] transition-transform cursor-pointer hover:border-emerald-200"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold text-lg">
                {s.name.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-slate-800">{s.name}</h4>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">NIS: {s.nis}</span>
                  <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">{s.classLevel}</span>
                </div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center p-8 text-slate-500">Santri tidak ditemukan.</div>
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
                <h3 className="font-bold text-lg text-slate-800">Tambah Santri Baru</h3>
                <button 
                  onClick={() => setIsAdding(false)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              
              <div className="p-4 overflow-y-auto">
                <form id="add-santri-form" onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500 ml-1">NIS</label>
                      <input name="nis" required onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-500 text-sm" placeholder="Nomor Induk" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500 ml-1">Nama Lengkap</label>
                      <input name="name" required onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-500 text-sm" placeholder="Nama Santri" />
                    </div>
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
                      <label className="text-xs font-semibold text-slate-500 ml-1">Kelas Jilid</label>
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
                      <label className="text-xs font-semibold text-slate-500 ml-1">Nama Ayah</label>
                      <input name="fatherName" required onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-500 text-sm" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500 ml-1">Nama Ibu</label>
                      <input name="motherName" required onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-500 text-sm" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500 ml-1">No HP Wali (Login Wali)</label>
                      <input name="parentPhone" type="tel" required onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-500 text-sm" placeholder="Contoh: 08444" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500 ml-1">Password Wali</label>
                      <input name="parentPassword" type="text" required onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-500 text-sm" placeholder="Password Login" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 ml-1">Ustadz Pembimbing</label>
                    <select name="ustadzId" required onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-500 text-sm">
                      <option value="">-- Pilih Ustadz --</option>
                      {ustadzList.map(u => (
                        <option key={u.id} value={u.id}>{u.name}</option>
                      ))}
                    </select>
                  </div>
                </form>
              </div>

              <div className="p-4 border-t border-slate-100 bg-white sticky bottom-0 z-10">
                <button 
                  type="submit"
                  form="add-santri-form"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Simpan Data Santri
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Detail Modal */}
      <AnimatePresence>
        {selectedSantri && (
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
                <h3 className="font-bold text-lg text-slate-800">Detail Santri</h3>
                <button 
                  onClick={() => setSelectedSantri(null)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>
              
              <div className="p-5 overflow-y-auto space-y-4">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold text-2xl">
                    {selectedSantri.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-xl text-slate-800">{selectedSantri.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">NIS: {selectedSantri.nis}</span>
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">{selectedSantri.classLevel}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-sm">
                  <div className="grid grid-cols-3">
                    <span className="text-slate-500 font-medium col-span-1">Gender</span>
                    <span className="text-slate-800 font-semibold col-span-2">{selectedSantri.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="text-slate-500 font-medium col-span-1">TTL</span>
                    <span className="text-slate-800 font-semibold col-span-2">{selectedSantri.birthPlace}, {selectedSantri.birthDate}</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="text-slate-500 font-medium col-span-1">Alamat</span>
                    <span className="text-slate-800 font-semibold col-span-2">{selectedSantri.address}</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="text-slate-500 font-medium col-span-1">Ayah</span>
                    <span className="text-slate-800 font-semibold col-span-2">{selectedSantri.fatherName}</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="text-slate-500 font-medium col-span-1">Ibu</span>
                    <span className="text-slate-800 font-semibold col-span-2">{selectedSantri.motherName}</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="text-slate-500 font-medium col-span-1">No Wali</span>
                    <span className="text-slate-800 font-semibold col-span-2">{selectedSantri.parentPhone}</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="text-slate-500 font-medium col-span-1">Ustadz</span>
                    <span className="text-slate-800 font-semibold col-span-2">
                      {users.find(u => u.id === selectedSantri.ustadzId)?.name || '-'}
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
