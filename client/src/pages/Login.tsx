import React from 'react';
import { motion } from 'framer-motion';
import { Code, Target, Zap, ArrowRight, Activity, Terminal } from 'lucide-react';

const Login: React.FC = () => {
  const handleGithubLogin = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
    window.location.href = `${backendUrl}/api/auth/github`;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30 relative overflow-hidden">
      
      {/* Vibrant Mesh Gradient Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/30 rounded-full blur-[120px] mix-blend-screen"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-cyan-600/20 rounded-full blur-[150px] mix-blend-screen"></div>
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-purple-600/20 rounded-full blur-[100px] mix-blend-screen"></div>
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-slate-950/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Zap className="h-4 w-4" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white">SkillSync</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-sm font-medium text-slate-300 hover:text-white transition-colors hidden sm:block">How it Works</button>
            <button 
              onClick={handleGithubLogin}
              className="text-sm font-semibold bg-white text-slate-900 px-5 py-2 rounded-full hover:bg-slate-100 transition-all flex items-center gap-2 shadow-lg shadow-white/10"
            >
              Sign In <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 pt-32 pb-16 px-6 sm:pt-40 sm:pb-24">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-8">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping"></span>
              The Next Evolution of Engineering Profiles
            </div>
            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.1]">
              Stop guessing. <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400">
                Start proving.
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-400 mb-10 leading-relaxed">
              SkillSync continuously analyzes your GitHub commits and resume to build a verifiable map of your engineering capabilities, then generates weekend projects to close your gaps.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={handleGithubLogin}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white px-8 py-4 rounded-full text-sm font-bold transition-all hover:scale-105 shadow-[0_0_30px_rgba(99,102,241,0.4)]"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                Continue with GitHub
              </button>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Features Grid */}
      <section className="relative z-10 px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="md:col-span-2 bg-slate-900/60 backdrop-blur-sm border border-slate-700/50 p-8 rounded-3xl hover:border-indigo-500/50 transition-colors shadow-xl"
            >
              <div className="bg-indigo-500/20 w-12 h-12 rounded-xl flex items-center justify-center mb-6 border border-indigo-500/30">
                <Code className="h-6 w-6 text-indigo-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Continuous Code Extraction</h3>
              <p className="text-slate-400 leading-relaxed max-w-lg text-lg">
                Our AI engine scans your GitHub repositories to extract verifiable skills. Stop self-reporting and let your actual code do the talking.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/50 p-8 rounded-3xl hover:border-cyan-500/50 transition-colors shadow-xl"
            >
              <div className="bg-cyan-500/20 w-12 h-12 rounded-xl flex items-center justify-center mb-6 border border-cyan-500/30">
                <Target className="h-6 w-6 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Market Alignment</h3>
              <p className="text-slate-400 leading-relaxed">
                Compare your validated skills against live market data for your specific target role.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/50 p-8 rounded-3xl hover:border-purple-500/50 transition-colors shadow-xl"
            >
              <div className="bg-purple-500/20 w-12 h-12 rounded-xl flex items-center justify-center mb-6 border border-purple-500/30">
                <Activity className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Closing the Gap</h3>
              <p className="text-slate-400 leading-relaxed">
                Automatically generate targeted micro-projects to bridge the gap to market demand.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="md:col-span-2 bg-gradient-to-br from-indigo-900/50 to-purple-900/50 backdrop-blur-sm border border-indigo-500/30 p-8 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between shadow-2xl shadow-indigo-500/10"
            >
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Ready to level up?</h3>
                <p className="text-indigo-200">Join the elite engineers mapping their careers with verified data.</p>
              </div>
              <button 
                onClick={handleGithubLogin}
                className="mt-6 sm:mt-0 bg-white text-indigo-900 px-8 py-3 rounded-full text-sm font-bold hover:bg-indigo-50 transition-colors shadow-lg"
              >
                Get Started Free
              </button>
            </motion.div>

          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/10 py-8 mt-12 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm font-medium text-slate-500">&copy; {new Date().getFullYear()} SkillSync Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Login;
