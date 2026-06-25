import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './store/AppContext';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { SantriManage } from './pages/SantriManage';
import { Absensi } from './pages/Absensi';
import { Nilai } from './pages/Nilai';
import { Laporan } from './pages/Laporan';
import { Pengumuman } from './pages/Pengumuman';
import { UstadzManage } from './pages/UstadzManage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { currentUser } = useApp();
  if (!currentUser) return <Navigate to="/login" />;
  return <Layout>{children}</Layout>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route path="/santri" element={<ProtectedRoute><SantriManage /></ProtectedRoute>} />
      <Route path="/ustadz" element={<ProtectedRoute><UstadzManage /></ProtectedRoute>} />
      <Route path="/absensi" element={<ProtectedRoute><Absensi /></ProtectedRoute>} />
      <Route path="/nilai" element={<ProtectedRoute><Nilai /></ProtectedRoute>} />
      <Route path="/laporan" element={<ProtectedRoute><Laporan /></ProtectedRoute>} />
      <Route path="/pengumuman" element={<ProtectedRoute><Pengumuman /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

function AppContent() {
  const { loading } = useApp();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}



