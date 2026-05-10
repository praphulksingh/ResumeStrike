import { useState, useEffect, useRef } from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton, SignUpButton, useAuth } from '@clerk/clerk-react';
import { v4 as uuidv4 } from 'uuid';

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
// CHAT SIDEBAR COMPONENT
// ==========================================
const ChatSidebar = ({ chats, currentChatId, onSelectChat, onNewChat, onDeleteChat }) => {
  return (
    <div className="w-72 bg-gray-900 text-white h-full flex flex-col">
      <div className="p-4 border-b border-gray-800">
        <button
          onClick={onNewChat}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Chat
        </button>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        {chats.map(chat => (
          <div
            key={chat.id}
            className={`group flex items-center justify-between px-4 py-2 mx-2 rounded-lg cursor-pointer transition ${
              currentChatId === chat.id ? 'bg-gray-800' : 'hover:bg-gray-800'
            }`}
            onClick={() => onSelectChat(chat.id)}
          >
            <span className="truncate flex-1 text-sm">{chat.title || 'New Conversation'}</span>
            <button
              onClick={(e) => { e.stopPropagation(); onDeleteChat(chat.id); }}
              className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400 transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ))}
        {chats.length === 0 && (
          <div className="text-center text-gray-500 text-sm mt-8">No conversations yet</div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// CHAT AREA COMPONENT
// ==========================================
const ChatArea = ({ chatId, messages, onSendMessage, isSending }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;
    onSendMessage(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <p className="text-lg">✨ Ask me anything about your resume, job search, or cover letters</p>
              <p className="text-sm mt-2">I'm your AI career assistant</p>
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-lg p-3 ${
                msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-800'
              }`}>
                <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
              </div>
            </div>
          ))
        )}
        {isSending && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 rounded-lg p-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="border-t p-4 bg-gray-50">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            disabled={isSending}
          />
          <button
            type="submit"
            disabled={isSending || !input.trim()}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

// ==========================================
// MAIN APP COMPONENT
// ==========================================
function App() {
  const { getToken, isSignedIn } = useAuth();

  // Resume Builder States (unchanged)
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

  // Chat States
  const [isChatMode, setIsChatMode] = useState(false); // false = resume builder, true = chat assistant
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);

  // Initialize Guest ID
  useEffect(() => {
    if (!localStorage.getItem('guestId')) {
      localStorage.setItem('guestId', uuidv4());
    }
  }, []);

  // Fetch User Credits
  const fetchCredits = async () => {
    try {
      const token = await getToken();
      const res = await fetch('http://localhost:5000/api/credits', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'guest-id': localStorage.getItem('guestId')
        }
      });
      const data = await res.json();
      setCredits(data.credits);
    } catch (e) { console.error("Credit fetch error", e); }
  };
  useEffect(() => { fetchCredits(); }, [isSignedIn]);

  // Resume persistent storage
  useEffect(() => { localStorage.setItem('jobDescription', jobDescription); }, [jobDescription]);
  useEffect(() => {
    if (resultData) localStorage.setItem('resultData', JSON.stringify(resultData));
    else localStorage.removeItem('resultData');
  }, [resultData]);
  useEffect(() => {
    if (coverLetter) localStorage.setItem('coverLetter', coverLetter);
    else localStorage.removeItem('coverLetter');
  }, [coverLetter]);
  useEffect(() => {
    localStorage.setItem('fontFamily', fontFamily);
    localStorage.setItem('themeColor', themeColor);
    localStorage.setItem('layoutTemplate', layoutTemplate);
  }, [fontFamily, themeColor, layoutTemplate]);

  // Chat API Helpers (replace with real endpoints)
  const fetchChats = async () => {
    // Mock data – replace with actual fetch
    try {
      const token = await getToken();
      const res = await fetch('http://localhost:5000/api/chats', {
        headers: { 'Authorization': `Bearer ${token}`, 'guest-id': localStorage.getItem('guestId') }
      });
      if (res.ok) {
        const data = await res.json();
        setChats(data);
      } else {
        // Fallback mock
        setChats([
          { id: '1', title: 'How to optimize my resume for ATS?', updatedAt: new Date() },
          { id: '2', title: 'Cover letter for software engineer', updatedAt: new Date() }
        ]);
      }
    } catch (e) {
      console.error(e);
      setChats([]);
    }
  };

  const fetchMessages = async (chatId) => {
    try {
      const token = await getToken();
      const res = await fetch(`http://localhost:5000/api/chats/${chatId}/messages`, {
        headers: { 'Authorization': `Bearer ${token}`, 'guest-id': localStorage.getItem('guestId') }
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      } else {
        // Mock messages
        setMessages([
          { role: 'assistant', content: 'Hello! I can help you with your resume and cover letter. What would you like to know?' }
        ]);
      }
    } catch (e) {
      console.error(e);
      setMessages([]);
    }
  };

  const createNewChat = async () => {
    try {
      const token = await getToken();
      const res = await fetch('http://localhost:5000/api/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, 'guest-id': localStorage.getItem('guestId') },
        body: JSON.stringify({ title: 'New Conversation' })
      });
      if (res.ok) {
        const newChat = await res.json();
        setChats(prev => [newChat, ...prev]);
        setCurrentChatId(newChat.id);
        setMessages([]);
        setIsChatMode(true);
      } else {
        // mock
        const mockNewChat = { id: Date.now().toString(), title: 'New Conversation', updatedAt: new Date() };
        setChats(prev => [mockNewChat, ...prev]);
        setCurrentChatId(mockNewChat.id);
        setMessages([]);
        setIsChatMode(true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteChat = async (chatId) => {
    try {
      const token = await getToken();
      await fetch(`http://localhost:5000/api/chats/${chatId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}`, 'guest-id': localStorage.getItem('guestId') }
      });
      setChats(prev => prev.filter(c => c.id !== chatId));
      if (currentChatId === chatId) {
        setCurrentChatId(null);
        setMessages([]);
      }
    } catch (e) {
      console.error(e);
      // fallback: remove locally
      setChats(prev => prev.filter(c => c.id !== chatId));
      if (currentChatId === chatId) {
        setCurrentChatId(null);
        setMessages([]);
      }
    }
  };

  const sendMessage = async (content) => {
    if (!currentChatId) return;
    // Add user message optimistically
    const userMsg = { role: 'user', content };
    setMessages(prev => [...prev, userMsg]);
    setIsSending(true);

    try {
      const token = await getToken();
      const res = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, 'guest-id': localStorage.getItem('guestId') },
        body: JSON.stringify({ chatId: currentChatId, message: content })
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
        // Also update chat title if needed
        if (chats.find(c => c.id === currentChatId)?.title === 'New Conversation' && data.title) {
          setChats(prev => prev.map(c => c.id === currentChatId ? { ...c, title: data.title } : c));
        }
      } else {
        // Mock response
        setTimeout(() => {
          setMessages(prev => [...prev, { role: 'assistant', content: `I received your message: "${content}". This is a mock response – connect to your real AI backend.` }]);
          setIsSending(false);
        }, 800);
        return;
      }
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, an error occurred. Please try again.' }]);
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    if (currentChatId && isChatMode) {
      fetchMessages(currentChatId);
    }
  }, [currentChatId, isChatMode]);

  // Resume Generation Handler (unchanted, but with credit validation)
  const handleProcess = async () => {
    if (credits <= 0) return alert("Out of credits! Please sign up for 100 more.");
    if ((generationOption === 'resume' || generationOption === 'both') && !file) {
      return alert("Please upload your resume PDF to generate or update a resume.");
    }
    if (generationOption === 'coverLetter' && !resultData) {
      return alert("No resume data found. Please generate a resume first.");
    }
    if (!jobDescription.trim()) {
      return alert("Please paste a job description.");
    }

    setIsLoading(true);
    const token = await getToken();
    const headers = {
      'Authorization': `Bearer ${token}`,
      'guest-id': localStorage.getItem('guestId')
    };

    try {
      let currentResumeData = resultData;

      if (generationOption === 'resume' || generationOption === 'both') {
        const formData = new FormData();
        formData.append('resume', file);
        formData.append('jobDescription', jobDescription);

        const res = await fetch('http://localhost:5000/api/generate-resume', {
          method: 'POST', headers, body: formData
        });
        const data = await res.json();
        if (res.ok) {
          setResultData(data.data);
          currentResumeData = data.data;
          await fetchCredits();
        } else {
          throw new Error(data.error || "Resume generation failed");
        }
      }

      if (generationOption === 'coverLetter' || generationOption === 'both') {
        const resumeDataForCL = currentResumeData?.resumeData;
        if (!resumeDataForCL) throw new Error("Resume data missing.");
        const clRes = await fetch('http://localhost:5000/api/generate-cover-letter', {
          method: 'POST',
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify({ resumeData: resumeDataForCL, jobDescription })
        });
        const clData = await clRes.json();
        if (clRes.ok) {
          setCoverLetter(clData.data);
          await fetchCredits();
        } else {
          throw new Error(clData.error || "Cover letter generation failed");
        }
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    if (window.confirm("Start over? This will clear your current resume and cover letter data.")) {
      setFile(null);
      setJobDescription('');
      setResultData(null);
      setCoverLetter(null);
      setShowHighlights(false);
      localStorage.removeItem('jobDescription');
      localStorage.removeItem('resultData');
      localStorage.removeItem('coverLetter');
    }
  };

  const renderHighlightedText = (text) => {
    if (!showHighlights || !resultData?.matchedKeywords || resultData.matchedKeywords.length === 0) return text;
    const stringText = String(text);
    const safeKeywords = resultData.matchedKeywords.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const regex = new RegExp(`(${safeKeywords.join('|')})`, 'gi');
    const parts = stringText.split(regex);
    return parts.map((part, i) => {
      const isMatch = safeKeywords.some(k => new RegExp(`^${k}$`, 'i').test(part));
      return isMatch ? <span key={i} className="bg-yellow-200 px-1 rounded-sm">{part}</span> : part;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 print:p-0 print:bg-white flex">
      {/* Persistent Chat Sidebar */}
      <div className="print:hidden fixed inset-y-0 left-0 z-10 w-72 bg-gray-900 shadow-xl flex flex-col">
        <ChatSidebar
          chats={chats}
          currentChatId={currentChatId}
          onSelectChat={(id) => {
            setCurrentChatId(id);
            setIsChatMode(true);
          }}
          onNewChat={createNewChat}
          onDeleteChat={deleteChat}
        />
      </div>

      {/* Main Content Area – shifts right because of fixed sidebar */}
      <div className="flex-1 ml-72 print:ml-0">
        {/* Top Navbar (inside main area) */}
        <nav className="max-w-6xl mx-auto flex justify-between items-center mb-6 bg-white/70 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/40 print:hidden mt-4 mr-4">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">ResumeStrike</h1>
            <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setIsChatMode(false)}
                className={`px-3 py-1 text-sm rounded-md transition ${!isChatMode ? 'bg-white shadow text-indigo-600' : 'text-gray-600'}`}
              >
                Resume Builder
              </button>
              <button
                onClick={() => setIsChatMode(true)}
                className={`px-3 py-1 text-sm rounded-md transition ${isChatMode ? 'bg-white shadow text-indigo-600' : 'text-gray-600'}`}
              >
                Chat Assistant
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm font-bold text-indigo-700 bg-indigo-50 px-4 py-2 rounded-full border border-indigo-100 shadow-sm">
              💳 {credits} Credits
            </div>
            <SignedOut>
              <SignInButton mode="modal"><button className="text-sm font-semibold text-gray-600">Log In</button></SignInButton>
              <SignUpButton mode="modal"><button className="text-sm font-bold bg-indigo-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-indigo-700">Sign Up</button></SignUpButton>
            </SignedOut>
            <SignedIn><UserButton afterSignOutUrl="/" /></SignedIn>
          </div>
        </nav>

        <div className="max-w-6xl mx-auto p-4 md:p-6 print:p-0">
          {!isChatMode ? (
            // ==================== RESUME BUILDER SECTION ====================
            <>
              {/* Main Control Card */}
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
                      {layoutTemplate === 'classic' ?
                        <ClassicTemplate data={resultData.resumeData} themeColor={themeColor} showHighlights={showHighlights} renderHighlightedText={renderHighlightedText} /> :
                        <ModernTemplate data={resultData.resumeData} themeColor={themeColor} showHighlights={showHighlights} renderHighlightedText={renderHighlightedText} />
                      }
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
            </>
          ) : (
            // ==================== CHAT ASSISTANT SECTION ====================
            <div className="h-[calc(100vh-120px)] flex flex-col">
              {currentChatId ? (
                <ChatArea
                  chatId={currentChatId}
                  messages={messages}
                  onSendMessage={sendMessage}
                  isSending={isSending}
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-white rounded-2xl shadow-xl">
                  <div className="text-center text-gray-400">
                    <p className="text-lg">Select a conversation or start a new chat</p>
                    <button
                      onClick={createNewChat}
                      className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
                    >
                      New Chat
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;