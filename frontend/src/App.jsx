import { useState, useEffect } from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton, SignUpButton, useAuth } from '@clerk/clerk-react';
import { v4 as uuidv4 } from 'uuid';

// Synchronous Guest ID Initialization (Guarantees it exists before any fetch happens)
let storedGuestId = localStorage.getItem('guestId');
if (!storedGuestId) {
  storedGuestId = uuidv4();
  localStorage.setItem('guestId', storedGuestId);
}

// ==========================================
// TEMPLATE 1: CLASSIC (Traditional Centered)
// ==========================================
const ClassicTemplate = ({ data, themeColor, showHighlights, renderHighlightedText }) => (
  <div className="bg-white/80 backdrop-blur-md p-12 shadow-xl rounded-2xl border border-white/40 print:shadow-none print:p-0 print:bg-white print:rounded-none print:border-none">
    <div className="text-center mb-6 border-b-2 border-gray-200 pb-4">
      <h1 className={`text-4xl font-bold mb-2 ${themeColor}`} contentEditable={!showHighlights} suppressContentEditableWarning>{data.personalInfo.name}</h1>
      <p className="text-sm text-gray-500" contentEditable={!showHighlights} suppressContentEditableWarning>
        {data.personalInfo.email} | {data.personalInfo.phone} | {data.personalInfo.links}
      </p>
    </div>

    <div className="mb-6">
      <h2 className={`text-lg font-bold uppercase tracking-wider mb-2 ${themeColor}`} contentEditable={!showHighlights} suppressContentEditableWarning>Professional Summary</h2>
      <p className={`text-gray-700 text-sm leading-relaxed outline-none ${!showHighlights && 'hover:bg-gray-50 focus:bg-white'}`} contentEditable={!showHighlights} suppressContentEditableWarning>
        {renderHighlightedText(data.summary)}
      </p>
    </div>

    <div className="mb-6">
      <h2 className={`text-lg font-bold uppercase tracking-wider mb-2 ${themeColor}`} contentEditable={!showHighlights} suppressContentEditableWarning>Technical Skills</h2>
      <p className={`text-gray-700 text-sm leading-relaxed outline-none ${!showHighlights && 'hover:bg-gray-50 focus:bg-white'}`} contentEditable={!showHighlights} suppressContentEditableWarning>
        {renderHighlightedText(Array.isArray(data.skills) ? data.skills.join(' • ') : (data.skills || ''))}
      </p>
    </div>

    <div className="mb-6">
      <h2 className={`text-lg font-bold uppercase tracking-wider mb-2 border-b border-gray-200 pb-1 ${themeColor}`} contentEditable={!showHighlights} suppressContentEditableWarning>Experience</h2>
      {data.experience.map((exp, index) => (
        <div key={index} className="mb-4 mt-3">
          <div className="flex justify-between items-baseline mb-1">
            <h3 className={`text-md font-bold text-gray-800 outline-none ${!showHighlights && 'hover:bg-gray-50 focus:bg-white'}`} contentEditable={!showHighlights} suppressContentEditableWarning>{exp.role}</h3>
            <span className={`text-sm text-gray-500 font-medium outline-none ${!showHighlights && 'hover:bg-gray-50 focus:bg-white'}`} contentEditable={!showHighlights} suppressContentEditableWarning>{exp.duration}</span>
          </div>
          <div className={`text-sm font-semibold mb-2 outline-none ${themeColor} ${!showHighlights && 'hover:bg-gray-50 focus:bg-white'}`} contentEditable={!showHighlights} suppressContentEditableWarning>{exp.company}</div>
          <ul className="list-disc list-outside ml-5 text-sm text-gray-700 space-y-1">
            {exp.achievements.map((achievement, idx) => (
              <li key={idx} className={`outline-none ${!showHighlights && 'hover:bg-gray-50 focus:bg-white'}`} contentEditable={!showHighlights} suppressContentEditableWarning>
                {renderHighlightedText(achievement)}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>

    <div>
      <h2 className={`text-lg font-bold uppercase tracking-wider mb-2 border-b border-gray-200 pb-1 ${themeColor}`} contentEditable={!showHighlights} suppressContentEditableWarning>Education</h2>
      {data.education.map((edu, index) => (
        <div key={index} className="mt-3 flex justify-between items-baseline">
          <div>
            <h3 className={`text-md font-bold text-gray-800 outline-none ${!showHighlights && 'hover:bg-gray-50 focus:bg-white'}`} contentEditable={!showHighlights} suppressContentEditableWarning>{edu.degree}</h3>
            <div className={`text-sm outline-none ${themeColor} ${!showHighlights && 'hover:bg-gray-50 focus:bg-white'}`} contentEditable={!showHighlights} suppressContentEditableWarning>{edu.institution}</div>
          </div>
          <span className={`text-sm text-gray-500 font-medium outline-none ${!showHighlights && 'hover:bg-gray-50 focus:bg-white'}`} contentEditable={!showHighlights} suppressContentEditableWarning>{edu.duration}</span>
        </div>
      ))}
    </div>
  </div>
);

// ==========================================
// TEMPLATE 2: MODERN (Two-Column Split)
// ==========================================
const ModernTemplate = ({ data, themeColor, showHighlights, renderHighlightedText }) => (
  <div className="bg-white/80 backdrop-blur-md shadow-xl rounded-2xl flex flex-col md:flex-row min-h-[1056px] border border-white/40 print:shadow-none print:rounded-none print:border-none print:bg-white">
    <div className="w-full md:w-1/3 bg-gradient-to-b from-gray-50 to-white p-8 border-r border-gray-100 print:from-white print:to-white print:break-inside-avoid">
      <h1 className={`text-3xl font-bold mb-4 ${themeColor}`} contentEditable={!showHighlights} suppressContentEditableWarning>{data.personalInfo.name}</h1>
      <div className="text-sm text-gray-600 mb-8 space-y-2 break-words">
        <p className="outline-none" contentEditable={!showHighlights} suppressContentEditableWarning>📧 {data.personalInfo.email}</p>
        <p className="outline-none" contentEditable={!showHighlights} suppressContentEditableWarning>📱 {data.personalInfo.phone}</p>
        <p className="outline-none" contentEditable={!showHighlights} suppressContentEditableWarning>🔗 {data.personalInfo.links}</p>
      </div>
      <h2 className={`text-sm font-bold uppercase tracking-wider mb-3 border-b border-gray-300 pb-1 ${themeColor}`}>Skills</h2>
      <div className={`text-gray-700 text-sm leading-relaxed space-y-2 outline-none ${!showHighlights && 'hover:bg-white focus:bg-white'}`} contentEditable={!showHighlights} suppressContentEditableWarning>
        {Array.isArray(data.skills) ? data.skills.map((skill, i) => (
          <div key={i} className="font-medium">• {renderHighlightedText(skill)}</div>
        )) : renderHighlightedText(data.skills || '')}
      </div>
    </div>
    <div className="w-full md:w-2/3 p-8">
      <div className="mb-8">
        <h2 className={`text-lg font-bold uppercase tracking-wider mb-2 border-b border-gray-200 pb-1 ${themeColor}`}>Profile</h2>
        <p className={`text-gray-700 text-sm leading-relaxed outline-none ${!showHighlights && 'hover:bg-gray-50 focus:bg-white'}`} contentEditable={!showHighlights} suppressContentEditableWarning>
          {renderHighlightedText(data.summary)}
        </p>
      </div>
      <div className="mb-8">
        <h2 className={`text-lg font-bold uppercase tracking-wider mb-4 border-b border-gray-200 pb-1 ${themeColor}`}>Experience</h2>
        {data.experience.map((exp, index) => (
          <div key={index} className="mb-5">
            <h3 className={`text-md font-bold text-gray-800 outline-none ${!showHighlights && 'hover:bg-gray-50 focus:bg-white'}`} contentEditable={!showHighlights} suppressContentEditableWarning>{exp.role}</h3>
            <div className="flex justify-between items-baseline mb-2">
              <span className={`text-sm font-semibold outline-none ${themeColor} ${!showHighlights && 'hover:bg-gray-50 focus:bg-white'}`} contentEditable={!showHighlights} suppressContentEditableWarning>{exp.company}</span>
              <span className={`text-xs text-gray-500 font-medium outline-none ${!showHighlights && 'hover:bg-gray-50 focus:bg-white'}`} contentEditable={!showHighlights} suppressContentEditableWarning>{exp.duration}</span>
            </div>
            <ul className="list-disc list-outside ml-4 text-sm text-gray-700 space-y-1">
              {exp.achievements.map((achievement, idx) => (
                <li key={idx} className={`outline-none ${!showHighlights && 'hover:bg-gray-50 focus:bg-white'}`} contentEditable={!showHighlights} suppressContentEditableWarning>
                  {renderHighlightedText(achievement)}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div>
        <h2 className={`text-lg font-bold uppercase tracking-wider mb-4 border-b border-gray-200 pb-1 ${themeColor}`}>Education</h2>
        {data.education.map((edu, index) => (
          <div key={index} className="mb-3">
            <h3 className={`text-md font-bold text-gray-800 outline-none ${!showHighlights && 'hover:bg-gray-50 focus:bg-white'}`} contentEditable={!showHighlights} suppressContentEditableWarning>{edu.degree}</h3>
            <div className="flex justify-between items-baseline mt-1">
              <span className={`text-sm outline-none ${themeColor} ${!showHighlights && 'hover:bg-gray-50 focus:bg-white'}`} contentEditable={!showHighlights} suppressContentEditableWarning>{edu.institution}</span>
              <span className={`text-xs text-gray-500 font-medium outline-none ${!showHighlights && 'hover:bg-gray-50 focus:bg-white'}`} contentEditable={!showHighlights} suppressContentEditableWarning>{edu.duration}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);


// ==========================================
// TEMPLATE 3: FAANG (Classic LaTeX style)
// ==========================================
const FaangTemplate = ({ data, themeColor, showHighlights, renderHighlightedText }) => (
  <div className="bg-white p-10 font-serif text-gray-900 shadow-xl border border-gray-200 print:shadow-none print:p-0 print:border-none min-h-[1056px]">
    <div className="text-center mb-5">
      <h1 className="text-3xl font-bold uppercase tracking-wide mb-1 outline-none" contentEditable={!showHighlights} suppressContentEditableWarning>{data.personalInfo.name}</h1>
      <p className="text-sm outline-none" contentEditable={!showHighlights} suppressContentEditableWarning>
        {data.personalInfo.phone} | {data.personalInfo.email} | {data.personalInfo.links}
      </p>
    </div>

    <div className="mb-4">
      <h2 className={`text-sm font-bold uppercase mb-1 border-b-2 border-gray-800 pb-0.5 ${themeColor}`} contentEditable={!showHighlights} suppressContentEditableWarning>Objective</h2>
      <p className="text-sm leading-relaxed outline-none" contentEditable={!showHighlights} suppressContentEditableWarning>
        {renderHighlightedText(data.summary)}
      </p>
    </div>

    <div className="mb-4">
      <h2 className={`text-sm font-bold uppercase mb-1 border-b-2 border-gray-800 pb-0.5 ${themeColor}`} contentEditable={!showHighlights} suppressContentEditableWarning>Education</h2>
      {data.education.map((edu, index) => (
        <div key={index} className="mb-2 flex justify-between items-baseline outline-none" contentEditable={!showHighlights} suppressContentEditableWarning>
          <div>
            <span className="font-bold">{edu.degree}</span>, {edu.institution}
          </div>
          <span className="text-sm">{edu.duration}</span>
        </div>
      ))}
    </div>

    <div className="mb-4">
      <h2 className={`text-sm font-bold uppercase mb-1 border-b-2 border-gray-800 pb-0.5 ${themeColor}`} contentEditable={!showHighlights} suppressContentEditableWarning>Technical Skills</h2>
      <p className="text-sm leading-relaxed outline-none" contentEditable={!showHighlights} suppressContentEditableWarning>
        <span className="font-bold">Skills: </span> 
        {renderHighlightedText(Array.isArray(data.skills) ? data.skills.join(', ') : (data.skills || ''))}
      </p>
    </div>

    <div className="mb-4">
      <h2 className={`text-sm font-bold uppercase mb-1 border-b-2 border-gray-800 pb-0.5 ${themeColor}`} contentEditable={!showHighlights} suppressContentEditableWarning>Experience & Projects</h2>
      {data.experience.map((exp, index) => (
        <div key={index} className="mb-3">
          <div className="flex justify-between items-baseline mb-0.5 outline-none" contentEditable={!showHighlights} suppressContentEditableWarning>
            <span className="font-bold">{exp.role} | {exp.company}</span>
            <span className="text-sm">{exp.duration}</span>
          </div>
          <ul className="list-disc list-outside ml-4 text-sm space-y-1">
            {exp.achievements.map((achievement, idx) => (
              <li key={idx} className="outline-none" contentEditable={!showHighlights} suppressContentEditableWarning>
                {renderHighlightedText(achievement)}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </div>
);

// ==========================================
// TEMPLATE 4: DUAL SECTION (AltaCV style)
// ==========================================
const AltaCvTemplate = ({ data, themeColor, showHighlights, renderHighlightedText }) => (
  <div className="bg-white shadow-xl flex flex-col md:flex-row min-h-[1056px] border border-gray-200 print:shadow-none print:border-none print:bg-white text-gray-800">
    
    {/* Left Main Column */}
    <div className="w-full md:w-2/3 p-8 pr-6">
      <div className="mb-8 border-b-4 border-slate-700 pb-6">
        <h1 className={`text-4xl font-bold uppercase tracking-tight mb-2 ${themeColor}`} contentEditable={!showHighlights} suppressContentEditableWarning>{data.personalInfo.name}</h1>
        <div className="text-sm flex flex-wrap gap-4 text-gray-600 font-medium outline-none" contentEditable={!showHighlights} suppressContentEditableWarning>
          <span>📧 {data.personalInfo.email}</span>
          <span>📱 {data.personalInfo.phone}</span>
          <span>🔗 {data.personalInfo.links}</span>
        </div>
      </div>

      <div className="mb-8">
        <h2 className={`text-xl font-bold uppercase tracking-wider mb-4 text-slate-700 flex items-center gap-2`} contentEditable={!showHighlights} suppressContentEditableWarning>
          <span className="text-slate-400">❖</span> Experience
        </h2>
        {data.experience.map((exp, index) => (
          <div key={index} className="mb-5 border-l-2 border-slate-200 pl-4">
            <h3 className={`text-lg font-bold text-slate-800 outline-none`} contentEditable={!showHighlights} suppressContentEditableWarning>{exp.role}</h3>
            <div className="flex justify-between items-baseline mb-2 text-sm">
              <span className={`font-semibold text-slate-600 outline-none`} contentEditable={!showHighlights} suppressContentEditableWarning>{exp.company}</span>
              <span className={`text-slate-500 font-medium outline-none`} contentEditable={!showHighlights} suppressContentEditableWarning>📅 {exp.duration}</span>
            </div>
            <ul className="list-disc list-outside ml-4 text-sm text-gray-700 space-y-1">
              {exp.achievements.map((achievement, idx) => (
                <li key={idx} className={`outline-none`} contentEditable={!showHighlights} suppressContentEditableWarning>
                  {renderHighlightedText(achievement)}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>

    {/* Right Sidebar */}
    <div className="w-full md:w-1/3 bg-slate-50 p-8 pl-6 border-l border-gray-200 print:bg-slate-50 print:break-inside-avoid">
      <div className="mb-8">
        <h2 className={`text-lg font-bold uppercase tracking-wider mb-4 text-slate-700 border-b border-slate-300 pb-2`} contentEditable={!showHighlights} suppressContentEditableWarning>Profile</h2>
        <p className={`text-sm leading-relaxed outline-none text-gray-700`} contentEditable={!showHighlights} suppressContentEditableWarning>
          {renderHighlightedText(data.summary)}
        </p>
      </div>

      <div className="mb-8">
        <h2 className={`text-lg font-bold uppercase tracking-wider mb-4 text-slate-700 border-b border-slate-300 pb-2`} contentEditable={!showHighlights} suppressContentEditableWarning>Education</h2>
        {data.education.map((edu, index) => (
          <div key={index} className="mb-3">
            <h3 className={`text-sm font-bold text-slate-800 outline-none`} contentEditable={!showHighlights} suppressContentEditableWarning>{edu.degree}</h3>
            <div className="text-xs text-slate-600 mt-1 outline-none" contentEditable={!showHighlights} suppressContentEditableWarning>{edu.institution}</div>
            <div className="text-xs text-slate-400 font-medium mt-1 outline-none" contentEditable={!showHighlights} suppressContentEditableWarning>{edu.duration}</div>
          </div>
        ))}
      </div>

      <div>
        <h2 className={`text-lg font-bold uppercase tracking-wider mb-4 text-slate-700 border-b border-slate-300 pb-2`} contentEditable={!showHighlights} suppressContentEditableWarning>Skills</h2>
        <div className="flex flex-wrap gap-2 outline-none" contentEditable={!showHighlights} suppressContentEditableWarning>
          {Array.isArray(data.skills) ? data.skills.map((skill, i) => (
            <span key={i} className="text-xs font-medium border border-slate-300 text-slate-700 px-2 py-1 rounded-md bg-white">
              {renderHighlightedText(skill)}
            </span>
          )) : renderHighlightedText(data.skills || '')}
        </div>
      </div>
    </div>
  </div>
);

// ==========================================
// MAIN APP COMPONENT
// ==========================================
function App() {
  const { getToken, isSignedIn, isLoaded } = useAuth();

  // Builder States
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showHighlights, setShowHighlights] = useState(false);
  const [jobDescription, setJobDescription] = useState(() => localStorage.getItem('jobDescription') || '');
  const [resultData, setResultData] = useState(() => {
    const saved = localStorage.getItem('resultData');
    return saved ? JSON.parse(saved) : null;
  });
  const [coverLetter, setCoverLetter] = useState(() => localStorage.getItem('coverLetter') || null);
  const [credits, setCredits] = useState(0);
  const [generationOption, setGenerationOption] = useState('resume');
  const [fontFamily, setFontFamily] = useState(() => localStorage.getItem('fontFamily') || 'font-sans');
  const [themeColor, setThemeColor] = useState(() => localStorage.getItem('themeColor') || 'text-indigo-600');
  const [layoutTemplate, setLayoutTemplate] = useState(() => localStorage.getItem('layoutTemplate') || 'classic');

  // Safe Header Generator (Prevents "Bearer null" crashes)
  const getAuthHeaders = async (includeJson = false) => {
    const headers = { 'guest-id': localStorage.getItem('guestId') };
    if (includeJson) headers['Content-Type'] = 'application/json';
    if (isSignedIn) {
       const token = await getToken();
       if (token) headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  };

  const fetchCredits = async () => {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch('http://localhost:5000/api/credits', { headers });
      const data = await res.json();
      setCredits(data.credits || 0);
    } catch (e) { console.error("Credit fetch error", e); }
  };

  // Persistent storage Hooks
  useEffect(() => { localStorage.setItem('jobDescription', jobDescription); }, [jobDescription]);
  useEffect(() => { if (resultData) localStorage.setItem('resultData', JSON.stringify(resultData)); else localStorage.removeItem('resultData'); }, [resultData]);
  useEffect(() => { if (coverLetter) localStorage.setItem('coverLetter', coverLetter); else localStorage.removeItem('coverLetter'); }, [coverLetter]);
  useEffect(() => {
    localStorage.setItem('fontFamily', fontFamily);
    localStorage.setItem('themeColor', themeColor);
    localStorage.setItem('layoutTemplate', layoutTemplate);
  }, [fontFamily, themeColor, layoutTemplate]);

  // Run Auth-dependent fetches only after Clerk loads
  useEffect(() => { 
     if (isLoaded) {
         fetchCredits();
     }
  }, [isLoaded, isSignedIn]);

  const handleProcess = async () => {
    if (credits <= 0) return alert("Out of credits! Please sign up for 100 more.");
    if ((generationOption === 'resume' || generationOption === 'both') && !file) return alert("Upload resume PDF first.");
    if (generationOption === 'coverLetter' && !resultData) return alert("Generate resume first.");
    
    setIsLoading(true);
    const headers = await getAuthHeaders(); // Safe headers

    try {
      let currentResumeData = resultData;

      if (generationOption === 'resume' || generationOption === 'both') {
        const formData = new FormData(); formData.append('resume', file); formData.append('jobDescription', jobDescription);
        
        // Don't inject content-type JSON for FormData
        const res = await fetch('http://localhost:5000/api/generate-resume', { method: 'POST', headers, body: formData });
        const data = await res.json();
        if (res.ok) { setResultData(data.data); currentResumeData = data.data; await fetchCredits(); } 
        else throw new Error(data.error);
      }

      if (generationOption === 'coverLetter' || generationOption === 'both') {
        const clRes = await fetch('http://localhost:5000/api/generate-cover-letter', {
          method: 'POST', headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify({ resumeData: currentResumeData.resumeData, jobDescription })
        });
        const clData = await clRes.json();
        if (clRes.ok) { setCoverLetter(clData.data); await fetchCredits(); } 
        else throw new Error(clData.error);
      }
    } catch (error) { alert(error.message); } finally { setIsLoading(false); }
  };

  const handleReset = () => {
    if (window.confirm("Start over? This clears current resume data.")) {
      setFile(null); setJobDescription(''); setResultData(null); setCoverLetter(null); setShowHighlights(false);
      localStorage.removeItem('jobDescription'); localStorage.removeItem('resultData'); localStorage.removeItem('coverLetter');
    }
  };

  const renderHighlightedText = (text) => {
    if (!showHighlights || !resultData?.matchedKeywords || resultData.matchedKeywords.length === 0) return text;
    const stringText = String(text);
    const safeKeywords = resultData.matchedKeywords.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const regex = new RegExp(`(${safeKeywords.join('|')})`, 'gi');
    return stringText.split(regex).map((part, i) => {
      const isMatch = safeKeywords.some(k => new RegExp(`^${k}$`, 'i').test(part));
      return isMatch ? <span key={i} className="bg-yellow-200 px-1 rounded-sm">{part}</span> : part;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 print:p-0 print:bg-white flex flex-col">
      
      {/* Top Navbar */}
      <nav className="w-full max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center mt-6 mb-6 bg-white/70 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/40 print:hidden">
        <div className="flex items-center w-full sm:w-auto justify-between mb-4 sm:mb-0">
          <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">ResumeStrike</h1>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">
          <div className="text-sm font-bold text-indigo-700 bg-indigo-50 px-3 py-1 sm:px-4 sm:py-2 rounded-full border border-indigo-100 shadow-sm">
            💳 {credits}
          </div>
          <SignedOut>
            <SignInButton mode="modal"><button className="text-sm font-semibold text-gray-600 hover:text-indigo-600">Log In</button></SignInButton>
            <SignUpButton mode="modal"><button className="text-sm font-bold bg-indigo-600 text-white px-3 sm:px-5 py-2 rounded-lg shadow-md hover:bg-indigo-700">Sign Up</button></SignUpButton>
          </SignedOut>
          <SignedIn><UserButton afterSignOutUrl="/" /></SignedIn>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto w-full p-4 md:p-6 print:p-0 flex-1">
        {/* ==================== RESUME BUILDER SECTION ==================== */}
        <div className="backdrop-blur-xl bg-white/70 rounded-2xl shadow-2xl border border-white/40 p-6 md:p-8 mb-8 print:hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">1. Upload Resume (PDF)</label>
              <input type="file" accept=".pdf" onChange={(e) => setFile(e.target.files[0])} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
              {resultData && !file && <p className="text-xs text-green-600 mt-2">✓ Using saved resume data.</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">2. Target Job Description</label>
              <textarea rows={3} value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} placeholder="Paste JD here..." className="w-full p-3 border border-gray-200 rounded-xl shadow-inner bg-white/50 focus:ring-2 focus:ring-indigo-400 outline-none" />
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4 border-t pt-6 border-gray-100">
            <div className="flex flex-col gap-1 w-full md:w-64">
              <label className="text-xs font-bold text-gray-500 uppercase">Generation Task</label>
              <select value={generationOption} onChange={(e) => setGenerationOption(e.target.value)} className="p-2.5 border border-gray-200 rounded-lg bg-white font-medium">
                <option value="resume">Resume Only</option>
                <option value="coverLetter">Cover Letter Only</option>
                <option value="both">Both (Resume + CL)</option>
              </select>
            </div>
            <button onClick={handleProcess} disabled={isLoading} className={`w-full md:flex-1 py-4 text-white font-black rounded-xl shadow-lg transition-transform active:scale-95 ${isLoading ? 'bg-indigo-300' : 'bg-gradient-to-r from-indigo-600 to-violet-600'}`}>
              {isLoading ? '✨ PROCESSING...' : '🚀 STRIKE WITH AI'}
            </button>
            {resultData && <button onClick={handleReset} className="p-4 text-red-500 border border-red-100 rounded-xl hover:bg-red-50 transition-colors">🗑️</button>}
          </div>
        </div>

        {/* Resume Preview */}
        {resultData && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 print:block">
            <div className="lg:col-span-1 space-y-6 print:hidden">
              <div className="backdrop-blur-xl bg-white/70 rounded-2xl shadow-xl border border-white/40 p-6 text-center">
                <h2 className="text-sm font-black text-gray-500 uppercase tracking-widest mb-4">ATS Match</h2>
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-indigo-600 flex items-center justify-center shadow-lg ring-4 ring-indigo-50">
                  <span className="text-3xl font-black text-white">{resultData.atsScore}%</span>
                </div>
                <div className="text-left space-y-4">
                  <h3 className="text-xs font-bold text-gray-400 border-b pb-1">AI INSIGHTS</h3>
                  <ul className="text-xs text-gray-600 space-y-2 list-disc list-inside">{resultData.atsFeedback.map((tip, i) => <li key={i}>{tip}</li>)}</ul>
                  <button onClick={() => setShowHighlights(!showHighlights)} className={`w-full py-3 rounded-xl text-xs font-bold transition-all ${showHighlights ? 'bg-yellow-200 text-yellow-800' : 'bg-white border border-gray-200 text-gray-600'}`}>
                    {showHighlights ? 'HIDE KEYWORDS' : 'HIGHLIGHT MATCHES'}
                  </button>
                </div>
              </div>
              <div className="backdrop-blur-xl bg-white/70 rounded-2xl shadow-xl border border-white/40 p-6 space-y-4">
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Editor Settings</h2>
                <select onChange={(e) => setLayoutTemplate(e.target.value)} value={layoutTemplate} className="w-full p-2.5 text-sm border border-gray-200 rounded-lg">
                  <option value="classic">Classic Layout</option>
                  <option value="modern">Modern Layout</option>
                  <option value="faang">FAANG (LaTeX Style)</option>
                  <option value="altacv">Dual Section (AltaCV Style)</option>
                </select>
                <select onChange={(e) => setFontFamily(e.target.value)} value={fontFamily} className="w-full p-2.5 text-sm border border-gray-200 rounded-lg">
                  <option value="font-sans">Sans-Serif (Modern)</option>
                  <option value="font-serif">Serif (Classic)</option>
                </select>
                <button onClick={() => window.print()} className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl shadow-lg hover:bg-emerald-700">📥 DOWNLOAD PDF</button>
              </div>
            </div>
            <div className="lg:col-span-3 space-y-8">
              <div className={`${fontFamily} transition-all duration-500`}>
                {layoutTemplate === 'classic' && <ClassicTemplate data={resultData.resumeData} themeColor={themeColor} showHighlights={showHighlights} renderHighlightedText={renderHighlightedText} />}
                {layoutTemplate === 'modern' && <ModernTemplate data={resultData.resumeData} themeColor={themeColor} showHighlights={showHighlights} renderHighlightedText={renderHighlightedText} />}
                {layoutTemplate === 'faang' && <FaangTemplate data={resultData.resumeData} themeColor={themeColor} showHighlights={showHighlights} renderHighlightedText={renderHighlightedText} />}
                {layoutTemplate === 'altacv' && <AltaCvTemplate data={resultData.resumeData} themeColor={themeColor} showHighlights={showHighlights} renderHighlightedText={renderHighlightedText} />}
              </div>
              {coverLetter && (
                <div className={`bg-white p-12 shadow-2xl rounded-2xl border border-white/40 print:shadow-none print:p-0 print:bg-white ${fontFamily}`}>
                  <div className="mb-8 border-b-2 border-gray-200 pb-4">
                    <h1 className={`text-3xl font-bold ${themeColor}`}>{resultData.resumeData.personalInfo.name}</h1>
                    <p className="text-sm text-gray-500">COVER LETTER</p>
                  </div>
                  <div className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap outline-none" contentEditable suppressContentEditableWarning>{coverLetter}</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;