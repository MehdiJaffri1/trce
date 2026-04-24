import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, X } from 'lucide-react';
import { firebaseService, auth } from '../lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { motion } from 'framer-motion';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      // Don't await profile sync - do it in background so dashboard loads immediately
      firebaseService.createUserProfile(result.user).catch(pErr => console.warn("Sync delayed:", pErr));
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.code === 'auth/configuration-not-found' 
        ? "Firebase Configuration Error: Please check your Vercel Environment Variables." 
        : err.message
      );
    }
  };

  const handleGoogle = async () => {
    try {
      const result = await firebaseService.signInWithGoogle();
      // Don't await profile sync - do it in background so dashboard loads immediately
      firebaseService.createUserProfile(result.user).catch(pErr => console.warn("Sync delayed:", pErr));
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.code === 'auth/unauthorized-domain'
        ? "Domain Unauthorized: Add your Vercel URL to authorized domains in Firebase Console."
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
          <h1 className="text-3xl font-bold tracking-tighter mb-2">Welcome Back</h1>
          <p className="text-theme-text-dim text-sm">Securely access your threat intelligence</p>
        </div>

        {error && <div className="p-3 mb-6 bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded-lg">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
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
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-theme-gray-mid rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-white/30 transition-colors"
              required
            />
          </div>
          <button type="submit" className="w-full btn-primary-minimal py-3 flex items-center justify-center gap-2">
            <LogIn className="w-4 h-4" />
            Login
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-theme-gray-mid"></div></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#141414] px-2 text-theme-text-dim">Or continue with</span></div>
        </div>

        <button 
          onClick={handleGoogle}
          className="w-full py-3 border border-theme-gray-mid rounded-lg flex items-center justify-center gap-2 hover:bg-white/5 transition-colors font-medium"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
          Google
        </button>

        <p className="mt-8 text-center text-sm text-theme-text-dim">
          Don't have an account? <Link to="/signup" className="text-white font-semibold hover:underline">Sign up</Link>
        </p>
      </motion.div>
    </div>
  );
}
