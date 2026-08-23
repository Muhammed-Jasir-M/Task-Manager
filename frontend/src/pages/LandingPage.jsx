import React from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  Layers, 
  Download, 
  Filter as FilterIcon, 
  Clock, 
  ShieldCheck, 
  Zap, 
  Calendar,
  LayoutDashboard,
  Check
} from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="space-y-20 py-4 animate-fadeIn">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-6 pb-12 sm:pt-12 sm:pb-16 text-center max-w-4xl mx-auto space-y-8">
        
        {/* Glow Badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold shadow-sm backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
          <span>Next-Generation Task & KanBan Workspace</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl font-black text-slate-100 tracking-tight leading-[1.1]">
          Organize Your Work.{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-300 bg-clip-text text-transparent">
            Master Your Time.
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-normal">
          TaskLite empowers developers and teams with interactive KanBan boards, real-time drag & drop stage tracking, smart filtering, and instant PDF exports.
        </p>

        {/* Hero Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            to="/dashboard"
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl text-sm font-bold bg-gradient-to-r from-indigo-500 via-violet-600 to-indigo-600 hover:from-indigo-600 hover:to-violet-700 text-white shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <span>Launch Workspace</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            to="/manage"
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl text-sm font-semibold bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 text-slate-200 hover:text-white shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <Layers className="h-4 w-4 text-indigo-400" />
            <span>Task Directory</span>
          </Link>
        </div>

        {/* Feature Checkmarks Ticker */}
        <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-400">
          <div className="flex items-center space-x-1.5">
            <Check className="h-4 w-4 text-emerald-400" />
            <span>100% Free & Open Source</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Check className="h-4 w-4 text-indigo-400" />
            <span>Drag & Drop KanBan</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Check className="h-4 w-4 text-violet-400" />
            <span>One-Click PDF Export</span>
          </div>
        </div>

      </section>

      {/* 2. INTERACTIVE VISUAL PREVIEW MOCKUP */}
      <section className="relative max-w-5xl mx-auto">
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-indigo-500/20 via-violet-500/20 to-cyan-500/20 blur-xl opacity-75"></div>
        <div className="relative rounded-2xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          
          {/* Header Bar Mockup */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-800/80 mb-6">
            <div className="flex items-center space-x-3">
              <div className="flex space-x-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
              </div>
              <span className="text-xs font-bold text-slate-400 tracking-wider uppercase ml-2">TaskLite KanBan Demo</span>
            </div>

            <div className="px-3 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold flex items-center space-x-1">
              <Zap className="h-3.5 w-3.5 text-indigo-400" />
              <span>Live Syncing</span>
            </div>
          </div>

          {/* Sample Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* To Do Column */}
            <div className="rounded-xl bg-slate-950/60 border border-slate-800/80 p-4 space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800/60">
                <span className="text-xs font-bold text-slate-300 uppercase">To Do</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/20 font-bold">2</span>
              </div>
              
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-xs font-bold text-slate-200">Optimize Vite Bundle Chunks</h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">Medium</span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-1">Split vendor libraries to improve load speeds.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-xs font-bold text-slate-200">Integration Test Suite</h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Low</span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-1">Cover REST endpoints with Jest testing.</p>
              </div>
            </div>

            {/* In Progress Column */}
            <div className="rounded-xl bg-slate-950/60 border border-slate-800/80 p-4 space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800/60">
                <span className="text-xs font-bold text-indigo-300 uppercase">In Progress</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-bold">1</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-indigo-500/40 ring-1 ring-indigo-500/20 shadow-md">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-xs font-bold text-indigo-200">KanBan Drag & Drop Flow</h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">High</span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-1">Seamless stage updates and index reordering.</p>
              </div>
            </div>

            {/* Done Column */}
            <div className="rounded-xl bg-slate-950/60 border border-slate-800/80 p-4 space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800/60">
                <span className="text-xs font-bold text-emerald-300 uppercase">Done</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-bold">2</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 shadow-sm opacity-80">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-xs font-bold text-slate-200 line-through">Glassmorphic UI Design</h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Done</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. CORE FEATURES GRID */}
      <section className="max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            Engineered for Modern Productivity
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Everything you need to organize tasks, track status progression, and report results cleanly.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Feature 1 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 transition-all duration-200 space-y-3">
            <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 w-fit">
              <LayoutDashboard className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-100">KanBan Board Workflow</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Visualize work progression across To Do, In Progress, and Done stages with drag-and-drop precision.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 transition-all duration-200 space-y-3">
            <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 w-fit">
              <Download className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-100">Executive PDF Export</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Generate formatted PDF task reports with status badges, due dates, and custom notes in one click.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 transition-all duration-200 space-y-3">
            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 w-fit">
              <FilterIcon className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-100">Smart Filters & Sorting</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Filter by priority, due date range, or instant search keywords to zero in on what matters.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 transition-all duration-200 space-y-3">
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 w-fit">
              <Clock className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-100">Overdue Tracking</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Automatic alert indicators highlight tasks past due date so deadlines never slip unnoticed.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 transition-all duration-200 space-y-3">
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 w-fit">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-100">Instant Inline Editing</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Update task status directly from dropdown chips or open full edit dialog overlays anytime.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 transition-all duration-200 space-y-3">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 w-fit">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-100">Reliable Backend Sync</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Backed by Express & MongoDB Atlas with sanitized CORS access for fast cross-platform reliability.
            </p>
          </div>

        </div>
      </section>

      {/* 4. CALL TO ACTION BANNER */}
      <section className="max-w-4xl mx-auto">
        <div className="relative rounded-3xl bg-gradient-to-r from-indigo-900/60 via-violet-900/60 to-slate-900/80 border border-indigo-500/30 p-8 sm:p-12 text-center overflow-hidden shadow-2xl space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
              Ready to Supercharge Your Workflow?
            </h2>
            <p className="text-slate-300 text-sm max-w-lg mx-auto">
              Start organizing your daily tasks with TaskLite's interactive KanBan experience.
            </p>
          </div>

          <div className="pt-2">
            <Link
              to="/dashboard"
              className="inline-flex items-center space-x-2 px-8 py-4 rounded-2xl text-sm font-bold bg-white text-slate-950 hover:bg-slate-100 shadow-xl transition-all hover:scale-[1.03] active:scale-[0.98]"
            >
              <span>Launch Workspace Now</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center space-x-2">
          <CheckCircle2 className="h-4 w-4 text-indigo-400" />
          <span className="font-bold text-slate-300">TaskLite</span>
          <span>© {new Date().getFullYear()} TaskLite Workspace. All rights reserved.</span>
        </div>

        <div className="flex items-center space-x-4">
          <Link to="/" className="hover:text-slate-300 transition-colors">Home</Link>
          <Link to="/dashboard" className="hover:text-slate-300 transition-colors">Dashboard</Link>
          <Link to="/manage" className="hover:text-slate-300 transition-colors">Task Management</Link>
          <Link to="/create" className="hover:text-slate-300 transition-colors">Create Task</Link>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
