import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { BookOpen, Phone, Lock, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

export function Login() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, currentUser } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    const user = await login(phone, password);
    setIsLoading(false);
    if (!user) {
      setError('Nomor HP atau password salah.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm bg-white rounded-3xl shadow-xl overflow-hidden"
      >
        <div className="bg-emerald-600 p-8 flex flex-col items-center text-white relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <BookOpen className="w-32 h-32" />
          </div>
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
            <BookOpen className="w-10 h-10 text-amber-400" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">TPQ AL ASYHAR</h1>
          <p className="text-emerald-100 text-sm mt-2 text-center">Aplikasi Sistem Manajemen & Edukasi Santri</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl font-medium border border-red-100 text-center">
                {error}
              </div>
            )}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700 ml-1">Nomor HP</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
                  placeholder="Contoh: 08123..."
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700 ml-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
                  placeholder="Masukkan password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 rounded-2xl shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <span>{isLoading ? 'Memproses...' : 'Masuk Aplikasi'}</span>
              {!isLoading && <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </button>
            
            <p className="text-center text-xs text-slate-500 mt-6 px-4">
              Gunakan Nomor HP dan Password yang telah disetujui dan didaftarkan oleh Admin TPQ.
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
