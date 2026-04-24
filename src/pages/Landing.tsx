import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import Stats from '../components/Stats';
import FeaturesGrid from '../components/FeaturesGrid';
import FeaturesCards from '../components/FeaturesCards';
import MeetTeam from '../components/MeetTeam';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Phone, MapPin, ExternalLink, Shield } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();
  const [showDemo, setShowDemo] = useState(false);

  return (
    <main className="bg-[#050505]">
      <Hero />
      <Stats />
      
      <div id="platforms" className="bg-linear-to-b from-black to-[#0a0a0a]">
        <FeaturesGrid />
      </div>

      <MeetTeam />

      <section id="solutions" className="py-24 px-10 border-y border-white/5 bg-linear-to-br from-[#0a0a0a] via-black to-[#0a0a0a]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8 tracking-tighter text-white">Advanced Threat Solutions</h2>
          <p className="text-lg text-gray-400 leading-relaxed mb-12 font-medium">
            Trace X solves the fragmentation problem in cyber threat intelligence (CTI). By aggregating multi-source APIs (VirusTotal, OTX, Shodan) 
            into a single AI-orchestrated analysis pipeline, we reduce analyst fatigue and provide immediate, actionable confidence scores. 
            Our platform automates the complex job of correlating disparate IOCs, allowing security teams to focus on mitigation rather than manual research.
          </p>
          <div className="grid md:grid-cols-2 gap-8 text-left">
            <div className="p-6 rounded-xl bg-white/5 border border-white/10 shadow-2xl">
              <h3 className="font-bold text-white mb-2">Efficiency Booster</h3>
              <p className="text-sm text-gray-400 font-medium">Reduces manual IOC check time by over 80% through automated multi-API querying.</p>
            </div>
            <div className="p-6 rounded-xl bg-white/5 border border-white/10 shadow-2xl">
              <h3 className="font-bold text-white mb-2">AI Reasoning</h3>
              <p className="text-sm text-gray-400 font-medium">Gemini-powered AI provides executive summaries that explain the "why" behind every threat score.</p>
            </div>
          </div>
        </div>
      </section>

      <div id="features" className="bg-black">
        <FeaturesCards />
      </div>

      <section id="about" className="py-24 px-10 bg-linear-to-b from-[#0a0a0a] to-black border-b border-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 tracking-tight text-white">About TRACE X</h2>
          <p className="text-gray-400 leading-relaxed font-medium">
            Born out of the need for a unified, intelligence-first security platform, Trace X is designed for modern SOC teams. 
            We believe that threat intelligence should be accessible, high-confidence, and deeply integrated with AI. 
            Our mission is to empower practitioners with the tools they need to stay ahead of evolving cyber threats through 
            robust data correlation and open-source intelligence transparency.
          </p>
        </div>
      </section>

      <section id="contact" className="py-24 px-10 bg-linear-to-b from-black to-[#111111]">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16">
          <div>
            <h2 className="text-3xl font-bold mb-6 text-white tracking-tight">Contact Us</h2>
            <p className="text-gray-400 mb-8 font-medium">Have questions about Trace X or looking for an enterprise integration? Our team of specialists is here to help.</p>
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-gray-300 font-medium">
                <Mail className="w-5 h-5 text-cyan-400" />
                <span>tracexcti@gmail.com</span>
              </div>
              <div className="flex items-center gap-4 text-gray-300 font-medium">
                <Phone className="w-5 h-5 text-cyan-400" />
                <span>+92 336 4205942</span>
              </div>
              <div className="flex items-center gap-4 text-gray-300 font-medium">
                <MapPin className="w-5 h-5 text-cyan-400" />
                <span>Karachi</span>
              </div>
            </div>
          </div>
          
          <div className="p-10 rounded-2xl bg-white/5 border border-white/10 shadow-2xl flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-cyan-500/10 flex items-center justify-center mb-6">
              <Mail className="w-8 h-8 text-cyan-400" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-white">Direct Inquiry</h3>
            <p className="text-gray-400 mb-8 max-w-sm">
              The fastest way to reach our intelligence team is via direct email. 
              We typically respond to enterprise inquiries within 24 hours.
            </p>
            <a 
              href="mailto:tracexcti@gmail.com"
              className="w-full max-w-xs bg-white text-black rounded-lg font-bold py-4 hover:bg-cyan-50 transition-all flex items-center justify-center gap-2 group"
            >
              Contact TRACE X Team
              <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      {/* Demo Modal */}
      <AnimatePresence>
        {showDemo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 backdrop-blur-md"
            onClick={() => setShowDemo(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-theme-gray-dark aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_50px_-12px_rgba(34,211,238,0.2)] flex flex-col items-center justify-center text-center p-12"
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => setShowDemo(false)}
                className="absolute top-6 right-6 z-10 p-2 rounded-full bg-black/40 text-white/50 hover:text-white hover:bg-black transition-all"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="flex flex-col items-center max-w-lg">
                <div className="w-24 h-24 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-8 rotate-3">
                  <Shield className="w-12 h-12 text-cyan-400" />
                </div>
                <h3 className="text-4xl font-bold tracking-tight text-white mb-4">Classified Intelligence Access</h3>
                <p className="text-theme-text-dim text-lg leading-relaxed mb-10">
                  Real-time threat reconnaissance and mission staging is restricted to registered sentinels.
                </p>
                <button 
                  onClick={() => navigate('/signup')}
                  className="px-10 py-4 bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase tracking-wider rounded-xl transition-all shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:shadow-[0_0_30px_rgba(34,211,238,0.6)]"
                >
                  Apply for Access
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Event for Watch Demo */}
      <script dangerouslySetInnerHTML={{ __html: `
        window.openDemo = () => {
          document.dispatchEvent(new CustomEvent('OPEN_DEMO'));
        }
      `}} />
      
      <DemoOpener onOpen={() => setShowDemo(true)} />
    </main>
  );
}

// Utility component to catch the event from Hero.tsx
const DemoOpener = ({ onOpen }: { onOpen: () => void }) => {
  React.useEffect(() => {
    const handler = () => onOpen();
    document.addEventListener('OPEN_DEMO', handler);
    return () => document.removeEventListener('OPEN_DEMO', handler);
  }, [onOpen]);
  return null;
};
