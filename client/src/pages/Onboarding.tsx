import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Onboarding: React.FC = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [targetRole, setTargetRole] = useState('');
  const [skills, setSkills] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user && user.targetRole) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetRole || !skills) {
      toast.error('Please fill out all fields');
      return;
    }
    if (!token) return;

    setIsSubmitting(true);
    const loadingToast = toast.loading('Saving profile and analyzing resume...');
    
    const formData = new FormData();
    formData.append('targetRole', targetRole);
    
    const skillsArray = skills.split(',').map(s => s.trim()).filter(Boolean);
    formData.append('selfRatedSkills', JSON.stringify(skillsArray));
    
    if (file) {
      formData.append('resume', file);
    }

    try {
      const response = await fetch('http://localhost:5000/api/user/onboarding', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        toast.success('Profile saved successfully!', { id: loadingToast });
        window.location.href = '/';
      } else {
        const errData = await response.json();
        toast.error('Failed to save profile: ' + (errData.error || 'Unknown error'), { id: loadingToast });
      }
    } catch (error) {
      console.error(error);
      toast.error('Network error while saving profile.', { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8 flex justify-center relative overflow-hidden selection:bg-indigo-500/30">
      
      {/* Background Gradients */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-600/10 rounded-full blur-[150px] mix-blend-screen"></div>
      </div>

      <div className="max-w-2xl w-full space-y-8 bg-slate-900/60 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-slate-700/50 relative z-10">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-white">
            Welcome to SkillSync, {user?.username}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Let's set up your profile to start mapping your capabilities.
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="targetRole" className="block text-sm font-medium text-gray-300">
                Target Job Role
              </label>
              <input
                id="targetRole"
                name="targetRole"
                type="text"
                required
                placeholder="e.g. Full-Stack Engineer"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="skills" className="block text-sm font-medium text-gray-300">
                Self-Rated Skills (comma separated)
              </label>
              <input
                id="skills"
                name="skills"
                type="text"
                placeholder="e.g. React, Node.js, Python"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <span className="block text-sm font-medium text-gray-300">
                Upload Resume (PDF)
              </span>
              <label 
                htmlFor="file-upload"
                className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md transition-colors cursor-pointer block w-full ${file ? 'border-cyan-500 bg-cyan-500/10' : 'border-gray-600 bg-gray-800 hover:bg-gray-700'}`}
              >
                <div className="space-y-1 text-center w-full">
                  {file ? (
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <svg className="mx-auto h-12 w-12 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div className="text-sm font-semibold text-cyan-300 truncate max-w-[250px]">
                        {file.name}
                      </div>
                      <p className="text-xs text-cyan-500 font-medium pt-1">
                        Resume attached successfully!
                      </p>
                      <span className="cursor-pointer text-xs text-gray-400 hover:text-white mt-2 block">
                        Change file
                      </span>
                    </div>
                  ) : (
                    <>
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="flex text-sm text-gray-400 justify-center">
                        <span className="relative font-medium text-indigo-400 hover:text-indigo-300">
                          Upload a file
                        </span>
                        <span className="pl-1">or click anywhere here</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        PDF up to 10MB
                      </p>
                    </>
                  )}
                  <input id="file-upload" name="file-upload" type="file" className="sr-only" accept=".pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                </div>
              </label>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Complete Profile Setup'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;
