import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { User, Briefcase, Zap, Code, ShieldCheck, ChevronRight, LogOut, CheckCircle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [isExtracting, setIsExtracting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [skills, setSkills] = useState<any[]>(user?.demonstratedSkills || []);
  const [jobFitScore, setJobFitScore] = useState<number>(user?.jobFitScore || 0);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [projects, setProjects] = useState<any[]>(user?.microProjects || []);

  const defaultRadar = [
    { subject: 'Frontend', self: 80, demonstrated: 65, market: 90, fullMark: 100 },
    { subject: 'Backend', self: 60, demonstrated: 75, market: 85, fullMark: 100 },
    { subject: 'Database', self: 70, demonstrated: 50, market: 75, fullMark: 100 },
    { subject: 'DevOps', self: 30, demonstrated: 40, market: 60, fullMark: 100 },
    { subject: 'System Design', self: 50, demonstrated: 45, market: 80, fullMark: 100 },
    { subject: 'Algorithms', self: 75, demonstrated: 80, market: 70, fullMark: 100 },
  ];
  const [radarData, setRadarData] = useState<any[]>(defaultRadar);

  useEffect(() => {
    if (user && !user.targetRole) {
      navigate('/onboarding');
    }
  }, [user, navigate]);

  const handleExtraction = async () => {
    if (!token) return;
    setIsExtracting(true);
    const loadingToast = toast.loading('Syncing GitHub and analyzing Resume...');
    try {
      const res = await fetch('http://localhost:5000/api/ingestion/extract', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setSkills(data.skills);
        toast.success('Extraction complete! Now run Market Analysis.', { id: loadingToast, duration: 4000 });
      } else {
        toast.error('Extraction failed: ' + data.error, { id: loadingToast });
      }
    } catch (err) {
      console.error(err);
      toast.error('Error triggering extraction', { id: loadingToast });
    } finally {
      setIsExtracting(false);
    }
  };

  const handleMarketAnalysis = async () => {
    if (!token) return;
    setIsAnalyzing(true);
    const loadingToast = toast.loading('Analyzing market demand...');
    try {
      const res = await fetch('http://localhost:5000/api/analysis/market-fit', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setJobFitScore(data.jobFitScore);
        setRadarData(data.radarData);
        toast.success('Market Analysis complete! Generating radar map...', { id: loadingToast });
      } else {
        toast.error('Analysis failed: ' + data.error, { id: loadingToast });
      }
    } catch (err) {
      console.error(err);
      toast.error('Error triggering analysis', { id: loadingToast });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateProjects = async () => {
    if (!token) return;
    setIsGenerating(true);
    const loadingToast = toast.loading('Designing targeted micro-projects...');
    try {
      const res = await fetch('http://localhost:5000/api/analysis/generate-projects', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setProjects(data.projects);
        toast.success('Projects generated successfully!', { id: loadingToast });
      } else {
        toast.error('Generation failed: ' + data.error, { id: loadingToast });
      }
    } catch (err) {
      console.error(err);
      toast.error('Error generating projects', { id: loadingToast });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCompleteProject = async (title: string) => {
    if (!token) return;
    const loadingToast = toast.loading('Marking project as completed...');
    try {
      const res = await fetch('http://localhost:5000/api/analysis/complete-project', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ projectTitle: title })
      });
      const data = await res.json();
      if (res.ok) {
        setProjects(data.projects);
        setJobFitScore(data.jobFitScore);
        toast.success(`Awesome! Your Job-Fit score increased to ${data.jobFitScore}%!`, { id: loadingToast, icon: '🚀' });
      } else {
        toast.error('Failed: ' + data.error, { id: loadingToast });
      }
    } catch (err) {
      console.error(err);
      toast.error('Error completing project', { id: loadingToast });
    }
  };

  const pieData = [
    { name: 'Fit', value: jobFitScore },
    { name: 'Gap', value: 100 - jobFitScore }
  ];
  const COLORS = ['#0ea5e9', '#1e293b']; // Neon blue for fit, dark for gap

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden font-sans selection:bg-indigo-500/30"
    >
      {/* Vibrant Mesh Gradient Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-cyan-600/10 rounded-full blur-[150px] mix-blend-screen"></div>
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-purple-600/10 rounded-full blur-[100px] mix-blend-screen"></div>
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Navbar */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex justify-between items-center bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-3xl shadow-xl p-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-white/10 p-[2px]">
              <div className="w-full h-full bg-[#111] rounded-full flex items-center justify-center overflow-hidden">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover grayscale" />
                ) : (
                  <User className="h-5 w-5 text-gray-400" />
                )}
              </div>
            </div>
            <div>
              <h1 className="font-bold text-white tracking-tight">{user?.username}</h1>
              <p className="text-xs text-gray-500 font-medium">Software Engineer</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors bg-[#111] px-4 py-2 rounded-lg border border-white/5 hover:border-white/20"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </motion.div>
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Your Capability Dashboard</h2>
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <Briefcase className="h-4 w-4 text-purple-400" />
              <span>Target Role: <strong className="text-gray-200">{user?.targetRole}</strong></span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={handleExtraction}
              disabled={isExtracting || isAnalyzing}
              className="group relative inline-flex items-center justify-center px-4 py-2 font-medium text-white transition-all duration-200 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden shadow-lg"
            >
              <span className="relative flex items-center gap-2">
                {isExtracting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Extracting...
                  </>
                ) : (
                  <>
                    <Code className="h-4 w-4 group-hover:text-cyan-400 transition-colors" />
                    1. Sync GitHub & Resume
                  </>
                )}
              </span>
            </button>

            <button 
              onClick={handleMarketAnalysis}
              disabled={isExtracting || isAnalyzing}
              className="group relative inline-flex items-center justify-center px-6 py-2 font-medium text-white transition-all duration-200 bg-cyan-600 rounded-lg hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden shadow-[0_0_15px_rgba(6,182,212,0.4)]"
            >
              <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
              <span className="relative flex items-center gap-2">
                {isAnalyzing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Analyzing Market...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 group-hover:animate-pulse" />
                    2. Analyze Market Fit
                  </>
                )}
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Radar Chart (Gap Analysis) */}
          <div className="lg:col-span-2 bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-3xl shadow-xl p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-cyan-500 to-blue-500 opacity-50"></div>
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-cyan-400" />
              Skill Gap Analysis
            </h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke="#374151" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name="Self-Rated" dataKey="self" stroke="#a855f7" fill="#a855f7" fillOpacity={0.2} strokeWidth={2} />
                  <Radar name="Demonstrated" dataKey="demonstrated" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.4} strokeWidth={2} />
                  <Radar name="Market Demand" dataKey="market" stroke="#fbbf24" fill="none" strokeWidth={2} strokeDasharray="5 5" />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 text-xs text-gray-400 mt-4">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-purple-500 opacity-50 border border-purple-500"></div> Self-Rated</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-cyan-500 opacity-50 border border-cyan-500"></div> Demonstrated</div>
              <div className="flex items-center gap-2"><div className="w-3 h-0 border-t-2 border-dashed border-yellow-400"></div> Market Demand</div>
            </div>
          </div>

          {/* Job Fit Score */}
          <div className="md:col-span-2 bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-3xl shadow-xl p-6 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-3xl rounded-full"></div>
            <h3 className="text-lg font-semibold text-white mb-2 w-full text-left">Market Job-Fit</h3>
            <p className="text-sm text-gray-400 w-full text-left mb-6">Match for {user?.targetRole}</p>
            
            <div className="relative h-[200px] w-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={75}
                    outerRadius={90}
                    startAngle={90}
                    endAngle={-270}
                    dataKey="value"
                    stroke="none"
                    cornerRadius={10}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-4xl font-black text-white">{jobFitScore}%</span>
                <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest mt-1">Match</span>
              </div>
            </div>
          </div>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Demonstrated Skills List */}
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-3xl shadow-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-1">AI-Extracted Capabilities</h3>
            <p className="text-sm text-gray-400 mb-6">Proven skills from your GitHub & Resume</p>
            
            {skills && skills.length > 0 ? (
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {skills.map((s, i) => (
                  <div key={i} className="bg-slate-800/40 border border-slate-700/50 p-4 rounded-2xl hover:border-indigo-500/50 transition-all hover:shadow-lg hover:bg-slate-800/60 group">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-white group-hover:text-indigo-300 transition-colors">{s.skillName}</span>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        s.proficiency === 'Advanced' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 
                        s.proficiency === 'Intermediate' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 
                        'bg-gray-700 text-gray-300 border border-gray-600'
                      }`}>
                        {s.proficiency}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed border-l-2 border-gray-700 pl-3 italic">
                      "{s.evidence}"
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-center bg-gray-800/30 rounded-xl border border-gray-700/50 border-dashed">
                <Code className="h-10 w-10 text-gray-600 mb-3" />
                <p className="text-gray-400">No skills extracted yet.</p>
                <button onClick={handleExtraction} className="text-cyan-400 text-sm hover:underline mt-2">Run the extraction engine.</button>
              </div>
            )}
          </div>

          {/* Micro-Projects Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-3xl shadow-xl p-6"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Targeted Micro-Projects</h3>
                <p className="text-sm text-gray-400">AI-generated projects to close your gaps</p>
              </div>
              <button
                onClick={handleGenerateProjects}
                disabled={isGenerating || jobFitScore === 0}
                className="text-xs px-3 py-1.5 bg-purple-600/20 text-purple-400 border border-purple-500/30 rounded-lg hover:bg-purple-600/40 transition-colors disabled:opacity-50"
              >
                {isGenerating ? 'Generating...' : 'Generate Projects'}
              </button>
            </div>
            
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {projects && projects.length > 0 ? (
                projects.map((proj, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={idx} 
                    className={`border p-5 rounded-2xl transition-all hover:shadow-xl group ${
                      proj.status === 'COMPLETED' 
                        ? 'bg-slate-800/30 border-green-500/30 opacity-70' 
                        : 'bg-gradient-to-br from-slate-800/60 to-slate-900/60 border-slate-700/50 hover:border-purple-500/50'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className={`text-xs font-bold uppercase tracking-wider mb-1 block ${proj.status === 'COMPLETED' ? 'text-green-400' : 'text-purple-400'}`}>
                          Priority Gap: {proj.targetSkill}
                        </span>
                        <h4 className={`font-medium text-lg transition-colors ${proj.status === 'COMPLETED' ? 'text-gray-300' : 'text-white group-hover:text-purple-300'}`}>
                          {proj.title}
                        </h4>
                      </div>
                      {proj.status !== 'COMPLETED' && (
                        <button 
                          onClick={() => handleCompleteProject(proj.title)}
                          className="bg-gray-700 hover:bg-green-600 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-200 hover:text-white transition-colors flex items-center gap-1"
                        >
                          <CheckCircle className="h-3.5 w-3.5" />
                          Complete
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 line-clamp-2 mb-4">
                      {proj.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className={`flex items-center gap-2 text-xs font-medium ${proj.status === 'COMPLETED' ? 'text-green-500' : 'text-gray-500'}`}>
                        <CheckCircle className="h-3.5 w-3.5" /> {proj.status === 'NOT_STARTED' ? 'Not started' : 'Completed'}
                      </div>
                      <span className="text-xs bg-gray-700 px-2 py-1 rounded text-gray-300">{proj.difficulty}</span>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-48 text-center bg-gray-800/30 rounded-xl border border-gray-700/50 border-dashed">
                  <p className="text-gray-400 text-sm">No projects generated yet.</p>
                  <p className="text-gray-500 text-xs mt-1">Run market analysis first, then generate projects.</p>
                </div>
              )}
            </div>
          </motion.div>

        </div>
      </main>
    </motion.div>
  );
};

export default Dashboard;
