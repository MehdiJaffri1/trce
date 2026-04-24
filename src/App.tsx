/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Footer from './components/Footer';
import { Shield, Activity } from 'lucide-react';

const LoadingScreen = () => (
  <div className="min-h-screen bg-[#020202] flex flex-col items-center justify-center relative overflow-hidden z-[9999]">
    <div className="absolute inset-0 opacity-10 pointer-events-none">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#06b6d420_0%,_transparent_70%)]"></div>
    </div>
    <div className="relative z-10 flex flex-col items-center gap-8">
      <div className="relative">
        <div className="absolute -inset-4 bg-cyan-500/20 blur-xl rounded-full animate-pulse"></div>
        <Shield className="w-16 h-16 text-cyan-400 relative z-10" />
        <Activity className="absolute inset-0 m-auto w-6 h-6 text-cyan-400 animate-pulse z-20" />
      </div>
      <div className="flex flex-col items-center gap-3">
        <h1 className="text-2xl font-black tracking-[0.4em] text-white animate-pulse">TRACE X</h1>
        <div className="flex items-center gap-2">
          <div className="w-1 h-1 bg-cyan-500 rounded-full animate-ping"></div>
          <div className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase opacity-70">
            Initialising Sentinel Stream...
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" />;
  return <>{children}</>;
};

const HomeRoute = () => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (user) return <Navigate to="/dashboard" />;
  return (
    <>
      <Navbar />
      <Landing />
      <Footer />
    </>
  );
};

const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (user) return <Navigate to="/dashboard" />;
  return <>{children}</>;
};

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen font-sans selection:bg-white/30 bg-[#050505]">
          <Routes>
            <Route path="/" element={<HomeRoute />} />
            <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
            <Route path="/signup" element={<AuthRoute><Signup /></AuthRoute>} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}
