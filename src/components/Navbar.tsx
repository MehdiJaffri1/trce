import { Shield, LogOut, Menu, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { firebaseService } from '../lib/firebase';
import React, { useState } from 'react';

export default function Navbar() {
  const { user, loading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNav = (id: string) => {
    setIsMenuOpen(false);
    if (location.pathname !== '/') {
      navigate('/' + (id ? '#' + id : ''));
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogout = async () => {
    setIsMenuOpen(false);
    await firebaseService.logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-[#050505]/80 backdrop-blur-md border-b border-[#141414]">
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <Shield className="w-5 h-5 text-white" />
          <span className="font-bold text-lg tracking-tighter">TRACE X</span>
        </div>
        
        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-8">
          <button onClick={() => handleNav('platforms')} className="text-[14px] font-medium text-[#888888] hover:text-white transition-colors">
            Platform
          </button>
          <button onClick={() => handleNav('team')} className="text-[14px] font-medium text-[#888888] hover:text-white transition-colors">
            Team
          </button>
          <button onClick={() => handleNav('features')} className="text-[14px] font-medium text-[#888888] hover:text-white transition-colors">
            Features
          </button>
          <button onClick={() => handleNav('solutions')} className="text-[14px] font-medium text-[#888888] hover:text-white transition-colors">
            Solutions
          </button>
          <button onClick={() => handleNav('about')} className="text-[14px] font-medium text-[#888888] hover:text-white transition-colors">
            About Us
          </button>
          <button onClick={() => handleNav('contact')} className="text-[14px] font-medium text-[#888888] hover:text-white transition-colors">
            Contact
          </button>
        </div>

        {/* Desktop Auth */}
        <div className="hidden lg:flex items-center gap-6 min-w-[120px] justify-end">
          {!loading && (
            user && location.pathname !== '/' ? (
              <>
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="text-[14px] font-medium text-white hover:opacity-80 transition-colors"
                >
                  Dashboard
                </button>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-[6px] border border-white/10 text-white text-[14px] font-semibold hover:bg-white/5 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : !user ? (
              <>
                <button 
                  onClick={() => navigate('/login')}
                  className="text-[14px] font-medium text-white hover:opacity-80 transition-colors"
                >
                  Login
                </button>
                <button 
                  onClick={() => navigate('/signup')}
                  className="px-4 py-2 rounded-[6px] bg-white text-black text-[14px] font-semibold hover:opacity-90 transition-opacity"
                >
                  Sign Up
                </button>
              </>
            ) : null
          )}
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 text-white">
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 z-[99] bg-black p-6 space-y-8 animate-in fade-in slide-in-from-top-4">
          <div className="flex flex-col gap-6">
            <button onClick={() => handleNav('platforms')} className="text-xl font-bold text-white text-left">Platform</button>
            <button onClick={() => handleNav('team')} className="text-xl font-bold text-white text-left">Team</button>
            <button onClick={() => handleNav('features')} className="text-xl font-bold text-white text-left">Features</button>
            <button onClick={() => handleNav('solutions')} className="text-xl font-bold text-white text-left">Solutions</button>
            <button onClick={() => handleNav('about')} className="text-xl font-bold text-white text-left">About Us</button>
            <button onClick={() => handleNav('contact')} className="text-xl font-bold text-white text-left">Contact</button>
          </div>
          
          <div className="pt-8 border-t border-white/10 flex flex-col gap-4">
            {!loading && (
              user && location.pathname !== '/' ? (
                <>
                  <button onClick={() => { setIsMenuOpen(false); navigate('/dashboard'); }} className="w-full py-4 text-center font-bold text-white">Dashboard</button>
                  <button onClick={handleLogout} className="w-full py-4 text-center font-bold bg-white/5 border border-white/10 rounded-xl text-white">Logout</button>
                </>
              ) : !user ? (
                <>
                  <button onClick={() => { setIsMenuOpen(false); navigate('/login'); }} className="w-full py-4 text-center font-bold text-white">Login</button>
                  <button onClick={() => { setIsMenuOpen(false); navigate('/signup'); }} className="w-full py-4 text-center font-bold bg-white text-black rounded-xl border border-white">Sign Up</button>
                </>
              ) : null
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
