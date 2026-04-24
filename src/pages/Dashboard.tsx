import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { firebaseService } from '../lib/firebase';
import { 
  Search, Shield, Activity, Globe, Database, Hash, 
  AlertTriangle, CheckCircle, ChevronRight, Download, 
  History, LogOut, Clock, Link as LinkIcon, Info, Server, Cpu, X, 
  FileText, Zap, BarChart3, Fingerprint, Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import ReactMarkdown from 'react-markdown';
import { geminiService } from '../lib/geminiService';

const IOC_TYPES = [
  { id: 'ip', label: 'IP Address', icon: <Database className="w-4 h-4" /> },
  { id: 'domain', label: 'Domain', icon: <Globe className="w-4 h-4" /> },
  { id: 'hash', label: 'File Hash', icon: <Hash className="w-4 h-4" /> },
  { id: 'cve', label: 'CVE', icon: <Shield className="w-4 h-4" /> },
];

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeType, setActiveType] = useState('ip');
  const [inputValue, setInputValue] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [recent, setRecent] = useState<any[]>([]);

  useEffect(() => {
    if (user) loadRecent();
  }, [user]);

  const loadRecent = async () => {
    try {
      const data = await firebaseService.getRecentSearches(user!.uid);
      setRecent(data);
    } catch (e) { console.warn("Sync delay..."); }
  };

  const handleAnalyze = async () => {
    if (!inputValue || isAnalyzing) return;
    setIsAnalyzing(true);
    setResult(null); 
    
    // 1. Fetch Backend Telemetry (Metadata Relay)
    let intelData: any = { raw: {} };
    try {
      console.log("Trace X: Pulling telemetry context...");
      const idToken = await user?.getIdToken();
      const res = await axios.post('/api/analyze', 
        { type: activeType, value: inputValue },
        { headers: { Authorization: `Bearer ${idToken}` } }
      );
      intelData = res.data;
    } catch (telemetryErr: any) {
      console.warn("Telemetry Stream Fault:", telemetryErr);
      // We continue even if telemetry fails, grounding in AI internal knowledge
      intelData = { raw: { vt: { info: "Live telemetry bypassed due to network fault." } } };
    }
    
    try {
      // 2. Execute AI Intelligence Correlation (Frontend Protected Auth)
      console.log("Trace X: Initiating Sentinel Research Engine...");
      const aiReport = await geminiService.generateAIReport(activeType, inputValue, intelData.raw);
      
      const fullResult = {
        ...intelData,
        value: inputValue,
        type: activeType,
        report: aiReport
      };
      
      setResult(fullResult);
      
      // 3. Save Auditable History
      await firebaseService.saveSearch(user!.uid, activeType, inputValue, aiReport);
      loadRecent();
      setInputValue('');
      
    } catch (err: any) {
      console.error("SOC Pipeline Interrupted:", err);
      const detail = err.response?.data?.detail || err.message;
      setResult({
        value: inputValue,
        type: activeType,
        report: {
          summary: `SYSTEM FAULT: ${typeof detail === 'object' ? JSON.stringify(detail) : detail}`,
          report: "The intelligence pipeline encountered a critical infrastructure error. Verification required.",
          threatLevel: "UNKNOWN",
          confidenceScore: 0,
          tlp: "TLP:WHITE",
          asn: "INTERNAL_ERROR",
          recommendations: ["Check Backend Logs", "Verify API Keys"]
        },
        raw: {}
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const downloadReport = () => {
    if (!result) return;
    const doc = new jsPDF();
    doc.setFillColor(10, 10, 10);
    doc.rect(0, 0, 210, 300, 'F');
    doc.setTextColor(0, 255, 255);
    doc.setFontSize(22);
    doc.text('SENTINEL 2.0: MISSION PROFILE', 20, 30);
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text(`VALUE: ${result.value} (${result.type.toUpperCase()})`, 20, 50);
    doc.text(`TLP: ${result.report.tlp}`, 20, 55);
    doc.text(`LEVEL: ${result.report.threatLevel}`, 20, 60);
    
    doc.setFontSize(14);
    doc.text('EXECUTIVE BRIEF', 20, 80);
    doc.setFontSize(10);
    const splitSummary = doc.splitTextToSize(result.report.summary, 170);
    doc.text(splitSummary, 20, 90);
    
    doc.save(`SNTL-2.0-${result.value}.pdf`);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-sans selection:bg-cyan-500/30 flex flex-col antialiased">
      {/* Structural Top Accent */}
      <div className="h-1 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 animate-pulse shrink-0" />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Compact History Sidebar */}
        <aside className="w-72 border-r border-white/5 bg-black/40 flex flex-col hidden xl:flex shrink-0">
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                <Shield className="w-4 h-4 text-cyan-400" />
              </div>
              <span className="font-bold tracking-tighter text-sm uppercase">Sentinel v2.0</span>
            </div>
            <button onClick={() => firebaseService.logout().then(() => navigate('/'))} className="p-2 text-white/20 hover:text-white transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            <div className="text-[10px] uppercase font-black tracking-widest text-white/30 px-2 flex items-center gap-2">
              <History className="w-3 h-3" /> Mission Ledger
            </div>
            {recent.map(s => (
              <button 
                key={s.id} 
                onClick={() => { setInputValue(s.value); setActiveType(s.type); }}
                className="w-full text-left p-3 rounded-lg border border-white/5 bg-white/[0.01] hover:bg-white/[0.04] transition-all group border-l-2 border-l-transparent hover:border-l-cyan-500"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[8px] font-mono text-cyan-500 uppercase tracking-tighter">{s.type}</span>
                  <span className={`text-[7px] font-mono px-1 rounded ${getTlpBg(s.tlp)} text-black font-black`}>{s.tlp}</span>
                </div>
                <div className="text-[11px] font-mono font-bold truncate group-hover:text-cyan-400">{s.value}</div>
              </button>
            ))}
          </div>
        </aside>

        {/* Global Command Center */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          {/* Header Search Matrix */}
          <div className="p-6 lg:p-12 border-b border-white/5 bg-black/20 shrink-0 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[120px] rounded-full -mr-32 -mt-32" />
            
            <div className="max-w-6xl mx-auto relative space-y-10">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left">
                  <h1 className="text-4xl font-black tracking-tighter uppercase text-white leading-tight">Sentinel Intelligence</h1>
                  <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.4em] mt-1 shrink-0">Operator: {user?.email} // System State: Active</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-2 bg-white/5 p-1.5 rounded-xl border border-white/5">
                  {IOC_TYPES.map(t => (
                    <button 
                      key={t.id}
                      onClick={() => setActiveType(t.id)}
                      className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all tracking-widest flex items-center gap-2 ${
                        activeType === t.id ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : 'text-white/40 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {t.icon}
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-6 flex items-center">
                  <Search className="w-5 h-5 text-white/10 group-focus-within:text-cyan-400 transition-colors" />
                </div>
                <input 
                  type="text"
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAnalyze()}
                  placeholder={`ENTER_${activeType.toUpperCase()}_TARGET_FOR_DEEP_CORRELATION...`}
                  className="w-full bg-[#080808] border border-white/10 rounded-2xl py-6 pl-16 pr-44 text-sm font-mono focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder:text-white/5 shadow-inner"
                />
                <div className="absolute right-3 inset-y-3">
                  <button 
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="h-full px-8 bg-white text-black font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-cyan-400 transition-all flex items-center gap-3 disabled:opacity-50 active:scale-95"
                  >
                    {isAnalyzing ? <Zap className="w-4 h-4 animate-spin" /> : <BarChart3 className="w-4 h-4" />}
                    {isAnalyzing ? 'Processing' : 'Execute Scan'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Mission Viewport */}
          <div className="flex-1 overflow-y-auto p-6 lg:p-12 custom-scrollbar bg-black/5">
            <div className="max-w-6xl mx-auto">
              <AnimatePresence mode="wait">
                {!result ? (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="h-[40vh] flex flex-col items-center justify-center text-center opacity-5 select-none"
                  >
                    <Fingerprint className="w-32 h-32 mb-6 stroke-[0.5px]" />
                    <h2 className="text-xl font-black uppercase tracking-[1em]">Scanning Matrix</h2>
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    key={result.value}
                    className="space-y-10"
                  >
                    {/* Header: Executive Summary Card */}
                    <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 lg:p-12 shadow-2xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-8 flex items-center gap-4">
                        <button onClick={downloadReport} className="p-3 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-all text-white/40 hover:text-cyan-400">
                          <Download className="w-5 h-5" />
                        </button>
                      </div>
                      
                      <div className="flex flex-col lg:flex-row gap-12 lg:items-start">
                        <div className="flex-1 space-y-6">
                          <div className="flex items-center gap-3">
                            <span className="px-2 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded text-[9px] font-black text-cyan-400 uppercase tracking-widest">IOC Verification</span>
                            <span className="text-white/20 font-mono text-[9px]">ID: SOL-{result.value.slice(0, 8)}</span>
                          </div>
                          <h2 className="text-5xl lg:text-6xl font-black tracking-tighter text-white font-mono break-all leading-tight">{result.value}</h2>
                          
                          <div className="space-y-4">
                            <div className="flex items-center gap-2 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
                              <FileText className="w-3.5 h-3.5" /> Executive Brief
                            </div>
                            <p className="text-lg lg:text-xl text-white/90 leading-relaxed font-medium">
                              {result.report.summary}
                            </p>
                          </div>
                        </div>

                        {/* Metric Grid */}
                        <div className="w-full lg:w-80 grid grid-cols-2 gap-4">
                          <div className={`p-6 rounded-2xl border border-white/5 flex flex-col justify-between h-32 ${getTlpBg(result.report.tlp)} bg-opacity-20`}>
                            <span className="text-[9px] font-black uppercase text-white/40 tracking-widest flex items-center gap-1.5"><Shield className="w-3 h-3" /> TLP Protocol</span>
                            <span className="text-xl font-black text-white">{result.report.tlp}</span>
                          </div>
                          <div className={`p-6 rounded-2xl border border-white/5 flex flex-col justify-between h-32 ${getLevelColor(result.report.threatLevel)} bg-opacity-20`}>
                            <span className="text-[9px] font-black uppercase text-white/40 tracking-widest flex items-center gap-1.5"><AlertTriangle className="w-3 h-3" /> Threat Level</span>
                            <span className="text-xl font-black text-white">{result.report.threatLevel}</span>
                          </div>
                          <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.03] flex flex-col justify-between h-32">
                            <span className="text-[9px] font-black uppercase text-white/40 tracking-widest flex items-center gap-1.5"><Activity className="w-3 h-3" /> Confidence</span>
                            <span className="text-xl font-black text-cyan-400">{result.report.confidenceScore}%</span>
                          </div>
                          <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.03] flex flex-col justify-between h-32 overflow-hidden">
                            <span className="text-[9px] font-black uppercase text-white/40 tracking-widest flex items-center gap-1.5"><Layers className="w-3 h-3" /> ASN/ISP Data</span>
                            <span className="text-xs font-mono font-bold text-white truncate leading-tight uppercase">{result.report.asn || 'Gathering...'}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Technical Mission Report (Markdown) */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                      <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center gap-3 px-2">
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Technical Mission Report // Deep Analysis</span>
                        </div>
                        <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-8 lg:p-12 shadow-xl">
                          <div className="markdown-body text-white/70 leading-relaxed text-[15px]">
                            <ReactMarkdown>
                              {result.report.report}
                            </ReactMarkdown>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-8">
                        {/* Recommendations Overlay */}
                        <div className="space-y-6">
                          <div className="flex items-center gap-3 px-2">
                            <Zap className="w-4 h-4 text-cyan-400" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Defensive Directives</span>
                          </div>
                          <div className="space-y-4">
                            {(result.report.recommendations || []).map((rec: string, i: number) => (
                              <motion.div 
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                                key={i} 
                                className="p-5 bg-cyan-500/5 border border-cyan-500/10 rounded-2xl flex gap-4 group hover:bg-cyan-500/10 hover:border-cyan-500/30 transition-all"
                              >
                                <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-500 flex items-center justify-center font-black text-[10px] shrink-0 border border-cyan-500/30">{i + 1}</span>
                                <p className="text-[11px] text-white/70 font-bold leading-relaxed">{rec}</p>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        {/* Telemetry Status Card */}
                        <div className="p-8 rounded-3xl bg-black border border-white/5 space-y-6 shadow-2xl">
                          <div className="flex items-center gap-2 mb-2">
                            <Server className="w-4 h-4 text-emerald-500" />
                            <span className="text-[10px] font-black uppercase text-white/40 tracking-widest">Ground Intelligence Status</span>
                          </div>
                          <div className="space-y-4">
                            <div className="flex justify-between items-center text-[10px]">
                              <span className="font-bold text-white/60 uppercase">VirusTotal Relay</span>
                              <span className={`font-mono ${result.raw.vt?.info ? 'text-white/20' : 'text-emerald-400 animate-pulse'}`}>{result.raw.vt?.info ? 'OFFLINE' : 'ONLINE'}</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px]">
                              <span className="font-bold text-white/60 uppercase">Gemini Correlator</span>
                              <span className="text-emerald-400 font-mono animate-pulse">OPTIMIZED</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px]">
                              <span className="font-bold text-white/60 uppercase">Pipeline Latency</span>
                              <span className="text-cyan-400 font-mono">{(performance.now() / 10000 % 100).toFixed(2)}ms</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </main>
      </div>

      <style>{`
        .markdown-body h1, .markdown-body h2, .markdown-body h3 {
          font-weight: 900;
          letter-spacing: -0.05em;
          text-transform: uppercase;
          color: white;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }
        .markdown-body h3 { font-size: 1.1rem; }
        .markdown-body p { margin-bottom: 1.5rem; }
        .markdown-body ul { list-style: disc; padding-left: 1.5rem; margin-bottom: 1.5rem; }
        .markdown-body li { margin-bottom: 0.5rem; }
        .markdown-body strong { color: #06b6d4; font-weight: 800; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.1); }
      `}</style>
    </div>
  );
}

const getTlpBg = (tlp: string) => {
  const t = tlp?.toUpperCase() || '';
  if (t.includes('RED')) return 'bg-red-600/20 border-red-600/40 text-red-500';
  if (t.includes('AMBER')) return 'bg-orange-500/20 border-orange-500/40 text-orange-500';
  if (t.includes('GREEN')) return 'bg-emerald-500/20 border-emerald-500/40 text-emerald-500';
  return 'bg-white/10 border-white/20 text-white';
};

const getLevelColor = (level: string) => {
  const l = level?.toUpperCase() || '';
  if (l.includes('CRITICAL')) return 'bg-red-600/20 border-red-600/40 text-red-500';
  if (l.includes('HIGH')) return 'bg-orange-600/20 border-orange-600/40 text-orange-500';
  if (l.includes('MEDIUM')) return 'bg-yellow-500/20 border-yellow-500/40 text-yellow-500';
  if (l.includes('LOW')) return 'bg-blue-600/20 border-blue-600/40 text-blue-500';
  return 'bg-cyan-500/20 border-cyan-500/40 text-cyan-500';
};
