import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function Hero() {
  const navigate = useNavigate();
  
  // High-Performance Cloudinary Globe Video for CTI Theme
  const videoUrl = "https://res.cloudinary.com/dwye3tm6z/video/upload/v1776593423/Animate_globe_rotate_202604182304_bkzxtf.mp4";
  const fallbackVideoUrl = "https://assets.mixkit.co/videos/preview/mixkit-abstract-technology-vortex-with-blue-lights-4430-large.mp4";

  return (
    <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden bg-black">
      {/* Background Video Layer */}
      <div className="absolute inset-0 z-0 scale-105"> {/* Slight scale for smooth edges */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-60 mix-blend-screen"
          onError={(e) => {
            const video = e.target as HTMLVideoElement;
            if (video.src !== fallbackVideoUrl) {
              video.src = fallbackVideoUrl;
            }
          }}
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
        
        {/* Cinematic VFX: Vignette & Seam Integration */}
        {/* Core Vignette: Deepens edges, focuses on text */}
        <div className="absolute inset-0 bg-radial-[circle_at_center,_transparent_10%,_rgba(0,0,0,0.5)_50%,_rgba(0,0,0,1)_100%]" />
        
        {/* Top Navbar Fade */}
        <div className="absolute top-0 left-0 right-0 h-48 bg-linear-to-b from-black to-transparent" />
        
        {/* Bottom Section Combine: Large linear fade to meld with Stats section */}
        <div className="absolute bottom-0 left-0 right-0 h-[400px] bg-linear-to-t from-black via-black/90 to-transparent" />
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-6xl md:text-8xl font-bold tracking-[-2px] sm:tracking-[-3px] mb-6 sm:mb-8 leading-[1.1] sm:leading-[1] text-white"
          >
            Trace The <span className="text-cyan-500">Threat</span><br className="hidden sm:block" />
            <span className="sm:inline"> Secure The Future</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-base sm:text-lg md:text-xl text-gray-400 mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed font-medium px-4"
          >
            Trace X Enterprise: The next generation of Cyber Threat Intelligence. 
            Correlate, analyze, and neutralize threats with AI-driven sentinel precision.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
          >
            <button 
              onClick={() => navigate('/signup')}
              className="w-full sm:w-auto px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.2)]"
            >
              Get Started
            </button>
            
            <button 
              onClick={() => document.dispatchEvent(new CustomEvent('OPEN_DEMO'))}
              className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white/20 text-white rounded-full font-bold text-lg hover:bg-white hover:text-black transition-all"
            >
              Watch Demo
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* 3D Decorative Element (Optional: Subtle Bottom Glow) */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[150%] h-[20%] bg-cyan-500/10 blur-[120px] rounded-[100%] pointer-events-none" />
    </section>
  );
}
