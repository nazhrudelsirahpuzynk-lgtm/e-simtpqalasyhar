import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { LogOut, Home, Users, BookOpen, Bell, CalendarCheck, FileText, GraduationCap } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

export function Layout({ children }: { children: React.ReactNode }) {
  const { currentUser, logout } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  if (!currentUser) return <>{children}</>;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Beranda', icon: Home, path: '/', roles: ['admin', 'ustadz', 'wali_santri'] },
    { name: 'Ustadz', icon: GraduationCap, path: '/ustadz', roles: ['admin'] },
    { name: 'Santri', icon: Users, path: '/santri', roles: ['admin'] },
    { name: 'Absensi', icon: CalendarCheck, path: '/absensi', roles: ['ustadz'] },
    { name: 'Nilai', icon: BookOpen, path: '/nilai', roles: ['ustadz'] },
    { name: 'Pengumuman', icon: Bell, path: '/pengumuman', roles: ['admin'] },
    { name: 'Laporan', icon: FileText, path: '/laporan', roles: ['admin', 'ustadz', 'wali_santri'] },
  ];

  const visibleNavs = navItems.filter(item => item.roles.includes(currentUser.role));

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top App Bar */}
      <header className="bg-emerald-600 text-white shadow-md sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-amber-400" />
            <h1 className="font-bold text-lg tracking-tight">TPQ AL ASYHAR</h1>
          </div>
          <button onClick={handleLogout} className="p-2 hover:bg-emerald-700 rounded-full transition-colors" aria-label="Keluar">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-md mx-auto w-full pb-20 overflow-x-hidden">
        <motion.div 
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="p-4"
        >
          {children}
        </motion.div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full bg-white border-t border-slate-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-20">
        <div className="max-w-md mx-auto flex items-center justify-around h-16">
          {visibleNavs.map(item => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={cn(
                  "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
                  isActive ? "text-emerald-600" : "text-slate-400 hover:text-slate-600"
                )}
              >
                <div className={cn("relative p-1 rounded-xl transition-all", isActive && "bg-emerald-50")}>
                   <Icon className={cn("w-6 h-6", isActive && "fill-emerald-100/50")} />
                </div>
                <span className="text-[10px] font-medium">{item.name}</span>
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  );
}
