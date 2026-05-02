import { useState, useEffect } from 'react';

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
    {/* Left Sidebar */}
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
    
    {/* Right Main Content */}
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
// MAIN APP COMPONENT
// ==========================================
function App() {
  // Volatile State (Does not persist across refreshes)
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingCL, setIsGeneratingCL] = useState(false);
  const [showHighlights, setShowHighlights] = useState(false);

  // ---------------------------------------------------------
  // 1. LAZY INITIALIZATION: Check localStorage on first load
  // ---------------------------------------------------------
  const [jobDescription, setJobDescription] = useState(() => localStorage.getItem('jobDescription') || '');
  
  const [resultData, setResultData] = useState(() => {
    const saved = localStorage.getItem('resultData');
    return saved ? JSON.parse(saved) : null;
  });

  const [coverLetter, setCoverLetter] = useState(() => localStorage.getItem('coverLetter') || null);
  
  // Styling States
  const [fontFamily, setFontFamily] = useState(() => localStorage.getItem('fontFamily') || 'font-sans');
  const [themeColor, setThemeColor] = useState(() => localStorage.getItem('themeColor') || 'text-indigo-600'); 
  const [layoutTemplate, setLayoutTemplate] = useState(() => localStorage.getItem('layoutTemplate') || 'classic');

  // ---------------------------------------------------------
  // 2. AUTO-SAVE HOOKS: Save to localStorage whenever state changes
  // ---------------------------------------------------------
  useEffect(() => {
    localStorage.setItem('jobDescription', jobDescription);
  }, [jobDescription]);

  useEffect(() => {
    if (resultData) {
      localStorage.setItem('resultData', JSON.stringify(resultData));
    } else {
      localStorage.removeItem('resultData');
    }
  }, [resultData]);

  useEffect(() => {
    if (coverLetter) {
      localStorage.setItem('coverLetter', coverLetter);
    } else {
      localStorage.removeItem('coverLetter');
    }
  }, [coverLetter]);

  useEffect(() => {
    localStorage.setItem('fontFamily', fontFamily);
    localStorage.setItem('themeColor', themeColor);
    localStorage.setItem('layoutTemplate', layoutTemplate);
  }, [fontFamily, themeColor, layoutTemplate]);

  // ---------------------------------------------------------
  // 3. RESET FUNCTION: Clear everything to start a new resume
  // ---------------------------------------------------------
  const handleReset = () => {
    if (window.confirm("Are you sure you want to clear your current resume and start over?")) {
      setFile(null);
      setJobDescription('');
      setResultData(null);
      setCoverLetter(null);
      setShowHighlights(false);
      localStorage.clear();
    }
  };

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleProcessResume = async () => {
    if (!file) return alert("Please upload your PDF resume first.");
    setIsLoading(true);
    setResultData(null);
    setCoverLetter(null);
    setShowHighlights(false); 

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jobDescription', jobDescription);

    try {
      const response = await fetch('http://localhost:5000/api/generate-resume', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        setResultData(data.data); 
      } else {
        alert(data.error || "Something went wrong.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to connect to the backend server.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateCoverLetter = async () => {
    setIsGeneratingCL(true);
    try {
      const response = await fetch('http://localhost:5000/api/generate-cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeData: resultData.resumeData,
          jobDescription: jobDescription,
        }),
      });
      const data = await response.json();
      if (response.ok) setCoverLetter(data.data);
    } catch (error) {
      alert("Failed to connect to backend.");
    } finally {
      setIsGeneratingCL(false);
    }
  };

  const renderHighlightedText = (text) => {
    if (!showHighlights || !resultData?.matchedKeywords || resultData.matchedKeywords.length === 0) {
      return text;
    }
    const safeKeywords = resultData.matchedKeywords.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const regex = new RegExp(`(${safeKeywords.join('|')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, index) => {
      const isMatch = safeKeywords.some(keyword => new RegExp(`^${keyword}$`, 'i').test(part));
      if (isMatch) {
        return (
          <span key={index} className="bg-yellow-200 text-black px-1 rounded-sm shadow-sm transition-all print:bg-transparent print:p-0 print:shadow-none">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6 md:p-8 font-sans print:p-0 print:bg-white">
      
      {/* Control Panel – Modern Glass Card */}
      <div className="max-w-6xl mx-auto backdrop-blur-xl bg-white/70 rounded-2xl shadow-2xl border border-white/40 p-6 md:p-8 mb-8 transition-all duration-300 hover:shadow-3xl print:hidden">
        
        {/* Header with gradient text */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 border-b border-gray-200/50 pb-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            ATS Resume Generator
          </h1>
          {resultData && (
            <button
              onClick={handleReset}
              className="mt-3 md:mt-0 text-sm font-semibold text-red-500 hover:text-red-600 px-4 py-2 border border-red-200 rounded-full hover:bg-red-50 transition-all duration-200"
            >
              🗑️ Start Over
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">1. Upload Resume (PDF)</label>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-colors"
            />
            {resultData && !file && (
              <p className="text-xs text-green-600 mt-2 animate-pulse">✓ Using saved resume data. Upload a new PDF to regenerate.</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">2. Target Job Description</label>
            <textarea
              rows={3}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste JD here..."
              className="w-full p-3 border border-gray-200 rounded-xl shadow-inner bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all"
            />
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={handleProcessResume}
            disabled={isLoading}
            className={`w-full py-3.5 px-4 text-white font-bold rounded-xl shadow-lg transition-all transform hover:scale-[1.02] active:scale-95 ${
              isLoading
                ? 'bg-indigo-300 cursor-wait'
                : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700'
            }`}
          >
            {isLoading ? '✨ Analyzing & Rewriting...' : 'Generate ATS Resume & Score'}
          </button>
        </div>
      </div>

      {/* Results Section */}
      {resultData && (
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 print:block">
          
          {/* Left Sidebar – Modern Glass Cards */}
          <div className="lg:col-span-1 space-y-6 print:hidden">
            {/* Score Card */}
            <div className="backdrop-blur-xl bg-white/70 rounded-2xl shadow-xl border border-white/40 p-6 text-center transition-all hover:shadow-2xl">
              <h2 className="text-lg font-bold text-gray-700 mb-2">ATS Match Score</h2>
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg">
                <span className="text-2xl font-black text-white drop-shadow">
                  {resultData.atsScore}%
                </span>
              </div>
              <div className="text-left">
                <h3 className="text-sm font-bold text-gray-600 mb-2 border-b border-gray-200 pb-1">AI Feedback:</h3>
                <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside mb-4">
                  {resultData.atsFeedback.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </div>
              <div className="text-left">
                <h3 className="text-sm font-bold text-gray-600 mb-2 border-b border-gray-200 pb-1">Matched Keywords:</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {resultData.matchedKeywords &&
                    resultData.matchedKeywords.map((kw, i) => (
                      <span
                        key={i}
                        className="text-xs bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-full text-indigo-700 font-medium"
                      >
                        {kw}
                      </span>
                    ))}
                </div>
                <button
                  onClick={() => setShowHighlights(!showHighlights)}
                  className={`w-full py-2.5 px-4 rounded-xl text-sm font-bold shadow-sm transition-all border ${
                    showHighlights
                      ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {showHighlights ? '👁️ Hide Highlights' : '✨ Highlight Keywords'}
                </button>
                {showHighlights && (
                  <p className="text-xs text-yellow-600 mt-2 text-center">
                    Editing disabled while highlighting is active.
                  </p>
                )}
              </div>
            </div>

            {/* Styling & Layout Card */}
            <div className="backdrop-blur-xl bg-white/70 rounded-2xl shadow-xl border border-white/40 p-6">
              <h2 className="text-lg font-bold text-gray-700 mb-4">Styling & Layout</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-1">Resume Template</label>
                <select
                  onChange={(e) => setLayoutTemplate(e.target.value)}
                  value={layoutTemplate}
                  className="w-full p-2.5 border border-gray-200 rounded-xl bg-white/50 font-semibold text-gray-800 focus:ring-2 focus:ring-indigo-400"
                >
                  <option value="classic">Classic (Centered)</option>
                  <option value="modern">Modern (Split Sidebar)</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-1">Font Style</label>
                <select
                  onChange={(e) => setFontFamily(e.target.value)}
                  value={fontFamily}
                  className="w-full p-2.5 border border-gray-200 rounded-xl bg-white/50"
                >
                  <option value="font-sans">Modern (Sans-Serif)</option>
                  <option value="font-serif">Classic (Serif)</option>
                  <option value="font-mono">Code (Monospace)</option>
                </select>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-600 mb-1">Accent Color</label>
                <select
                  onChange={(e) => setThemeColor(e.target.value)}
                  value={themeColor}
                  className="w-full p-2.5 border border-gray-200 rounded-xl bg-white/50"
                >
                  <option value="text-indigo-600">Professional Indigo</option>
                  <option value="text-teal-600">Modern Teal</option>
                  <option value="text-rose-600">Bold Rose</option>
                  <option value="text-amber-600">Warm Amber</option>
                  <option value="text-gray-800">Classic Dark</option>
                </select>
              </div>

              <button
                onClick={handleGenerateCoverLetter}
                disabled={isGeneratingCL}
                className={`w-full mb-3 text-white font-bold py-3 rounded-xl shadow-lg transition-all transform hover:scale-[1.02] active:scale-95 ${
                  isGeneratingCL
                    ? 'bg-purple-300 cursor-wait'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                }`}
              >
                {isGeneratingCL ? '✍️ Writing Letter...' : 'Write Cover Letter'}
              </button>
              <button
                onClick={() => window.print()}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold py-3 rounded-xl shadow-lg transition-all transform hover:scale-[1.02] active:scale-95"
              >
                📄 Download PDF
              </button>
            </div>
          </div>

          {/* Right Area: Document Previews */}
          <div className="lg:col-span-3 space-y-8">
            {/* Conditional Rendering based on selected Layout */}
            <div className={`${fontFamily} transition-all duration-300`}>
              {layoutTemplate === 'classic' ? (
                <ClassicTemplate
                  data={resultData.resumeData}
                  themeColor={themeColor}
                  showHighlights={showHighlights}
                  renderHighlightedText={renderHighlightedText}
                />
              ) : (
                <ModernTemplate
                  data={resultData.resumeData}
                  themeColor={themeColor}
                  showHighlights={showHighlights}
                  renderHighlightedText={renderHighlightedText}
                />
              )}
            </div>

            {/* Cover Letter Preview */}
            {coverLetter && (
              <div className={`bg-white/80 backdrop-blur-md p-12 shadow-xl rounded-2xl border border-white/40 print:shadow-none print:p-0 print:rounded-none print:border-none print:bg-white ${fontFamily} animate-fadeIn`}>
                <div className="mb-8 border-b-2 border-gray-200 pb-4">
                  <h1 className={`text-3xl font-bold mb-1 ${themeColor}`} contentEditable suppressContentEditableWarning>
                    {resultData.resumeData.personalInfo.name}
                  </h1>
                  <p className="text-sm text-gray-500" contentEditable suppressContentEditableWarning>
                    {resultData.resumeData.personalInfo.email} | {resultData.resumeData.personalInfo.phone}
                  </p>
                </div>
                <div
                  className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap outline-none hover:bg-gray-50 focus:bg-white"
                  contentEditable
                  suppressContentEditableWarning
                >
                  {coverLetter}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;