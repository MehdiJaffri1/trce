import { Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="py-12 px-10 border-t border-theme-gray-dark bg-theme-bg">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg tracking-tighter">TRACE X</span>
        </div>
        
        <div className="text-theme-text-dim text-[14px] font-medium">
          © {new Date().getFullYear()} Trace X. All rights reserved.
        </div>
        
        <div className="flex items-center gap-2 text-[14px] text-theme-text-dim">
          <span className="opacity-60">Contact:</span>
          <a href="mailto:tracexcti@gmail.com" className="text-theme-accent hover:opacity-80 transition-opacity">
            tracexcti@gmail.com
          </a>
        </div>
      </div>
    </footer>
  );
}
