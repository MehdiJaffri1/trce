import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, UserPlus, X } from 'lucide-react';
import { firebaseService, auth } from '../lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { motion } from 'framer-motion';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      // Non-blocking sync
      firebaseService.createUserProfile(result.user).catch(pErr => console.warn("Sync delayed:", pErr));
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.code === 'auth/configuration-not-found' 
        ? "Firebase Configuration Error: Please check your Vercel Environment Variables." 
        : err.message
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-theme-bg px-4 relative">
      {/* Close Button */}
      <button 
        onClick={() => navigate('/')}
        className="absolute top-8 right-8 p-3 rounded-full border border-white/10 text-theme-text-dim hover:text-white hover:bg-white/5 transition-all"
        title="Go Back to Home"
      >
        <X className="w-6 h-6" />
      </button>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 minimal-card rounded-2xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tighter mb-2">Create Account</h1>
          <p className="text-theme-text-dim text-sm">Join the next generation of threat intelligence</p>
        </div>

        {error && <div className="p-3 mb-6 bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded-lg">{error}</div>}

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-text-dim" />
            <input 
              type="email" 
              placeholder="Email Address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black border border-theme-gray-mid rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-white/30 transition-colors"
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-text-dim" />
            <input 
              type="password" 
              placeholder="Create Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-theme-gray-mid rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-white/30 transition-colors"
              required
            />
          </div>
          <button type="submit" className="w-full btn-primary-minimal py-3 flex items-center justify-center gap-2">
            <UserPlus className="w-4 h-4" />
            Sign Up
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-theme-text-dim">
          Already have an account? <Link to="/login" className="text-white font-semibold hover:underline">Log in</Link>
        </p>
      </motion.div>
    </div>
  );
}
