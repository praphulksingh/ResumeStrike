// backend/server.js
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { ClerkExpressWithAuth } = require('@clerk/clerk-sdk-node');
require('dotenv').config();

// --- PRISMA 7 INITIALIZATION ---
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
// --------------------------------

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// --- MIDDLEWARE: Credit System ---
async function checkAndDeductCredits(req, res, next) {
    try {
        const isAuth = req.auth && !!req.auth.userId;
        const userId = isAuth ? req.auth.userId : req.headers['guest-id'];

        if (!userId || userId === 'null') return res.status(400).json({ error: "Missing authentication or guest ID." });

        let user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            user = await prisma.user.create({
                data: { id: userId, isGuest: !isAuth, credits: isAuth ? 100 : 2 }
            });
        }

        if (user.credits <= 0) {
            return res.status(403).json({ error: "Insufficient credits." });
        }

        await prisma.user.update({
            where: { id: userId },
            data: { credits: user.credits - 1 }
        });

        res.setHeader('x-remaining-credits', user.credits - 1);
        next();
    } catch (error) {
        console.error("Credit check error:", error);
        res.status(500).json({ error: "Internal server error during credit check." });
    }
}

// --- API ENDPOINT: Get Credits ---
app.get('/api/credits', ClerkExpressWithAuth(), async (req, res) => {
    try {
        const isAuth = req.auth && !!req.auth.userId;
        const userId = isAuth ? req.auth.userId : req.headers['guest-id'];

        if (!userId || userId === 'null') return res.json({ credits: 0 });

        let user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            user = await prisma.user.create({
                data: { id: userId, isGuest: !isAuth, credits: isAuth ? 100 : 2 }
            });
        }
        res.json({ credits: user.credits });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch credits." });
    }
});

// ==========================================
// CHAT API ENDPOINTS
// ==========================================

// 1. Get all chats for the sidebar
app.get('/api/chats', ClerkExpressWithAuth(), async (req, res) => {
    try {
        const userId = req.auth?.userId || req.headers['guest-id'];
        if (!userId || userId === 'null') return res.json([]);

        const chats = await prisma.chat.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
        res.json(chats);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch chats" });
    }
});

// 2. Create a new chat
app.post('/api/chats', ClerkExpressWithAuth(), async (req, res) => {
    try {
        const userId = req.auth?.userId || req.headers['guest-id'];
        if (!userId || userId === 'null') return res.status(400).json({ error: "Missing user ID" });

        let user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) await prisma.user.create({ data: { id: userId, isGuest: !req.auth?.userId }});

        const chat = await prisma.chat.create({
            data: { title: req.body.title || 'New Conversation', userId }
        });
        res.json(chat);
    } catch (error) {
        res.status(500).json({ error: "Failed to create chat" });
    }
});

// 3. Get messages for a specific chat
app.get('/api/chats/:chatId/messages', ClerkExpressWithAuth(), async (req, res) => {
    try {
        const { chatId } = req.params;
        const messages = await prisma.message.findMany({
            where: { chatId },
            orderBy: { createdAt: 'asc' }
        });
        res.json({ messages });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch messages" });
    }
});

// 4. Delete a chat
app.delete('/api/chats/:chatId', ClerkExpressWithAuth(), async (req, res) => {
    try {
        const { chatId } = req.params;
        await prisma.message.deleteMany({ where: { chatId } });
        await prisma.chat.delete({ where: { id: chatId } });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete chat" });
    }
});

// 5. Send message and talk to Gemini
app.post('/api/chat', ClerkExpressWithAuth(), async (req, res) => {
    try {
        const { chatId, message } = req.body;
        if (!chatId || !message) return res.status(400).json({ error: 'Missing data' });

        // Save User Message
        await prisma.message.create({
            data: { chatId, role: 'user', content: { text: message } }
        });

        // Get past history for Gemini Context
        const history = await prisma.message.findMany({
            where: { chatId },
            orderBy: { createdAt: 'asc' }
        });

        // Format history for Gemini API. We slice off the last element because it's the user message we just saved.
        const formattedHistory = history.slice(0, -1).map(msg => {
            const textContent = typeof msg.content === 'object' ? msg.content.text : JSON.parse(msg.content).text;
            return {
                role: msg.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: textContent || '' }]
            };
        });

        // Call Gemini
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const chat = model.startChat({ history: formattedHistory });
        const result = await chat.sendMessage(message);
        const reply = result.response.text();

        // Save Assistant Message
        await prisma.message.create({
            data: { chatId, role: 'assistant', content: { text: reply } }
        });

        // Generate a dynamic title if it's the very first message
        let updatedTitle = null;
        if (history.length === 1) {
            try {
                 const titleResult = await model.generateContent(`Summarize this query in 2 to 4 words for a chat title: "${message}"`);
                 updatedTitle = titleResult.response.text().replace(/["'\n]/g, '').trim();
                 await prisma.chat.update({ where: { id: chatId }, data: { title: updatedTitle }});
            } catch(e) {
                 console.log("Title generation skipped due to error", e.message);
            }
        }

        res.json({ reply, title: updatedTitle });
    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ error: 'Chat failed' });
    }
});

// ==========================================
// RESUME GENERATOR ENDPOINTS
// ==========================================

app.post('/api/generate-resume', ClerkExpressWithAuth(), upload.single('resume'), checkAndDeductCredits, async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

        const jobDescription = req.body.jobDescription || "No job description provided.";
        const pdfBase64 = req.file.buffer.toString('base64');
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); 
        
        const prompt = `
      You are an expert technical recruiter and ATS software evaluator.
      I have attached my current resume as a PDF document.
      Read the attached resume and the target Job Description below.
      
      Task 1: Rewrite and tailor my resume to perfectly match the keywords and requirements of the Job Description without hallucinating or inventing fake information.
      Task 2: Calculate an ATS Match Score (0-100) based on how well the newly rewritten resume matches the Job Description.
      Task 3: Provide 2-3 brief bullet points of feedback on what was improved or what is still missing.
      Task 4: Identify 5-10 exact keywords or short phrases from the Job Description that you successfully incorporated.

      
CRITICAL INSTRUCTIONS:
      1. DO NOT INVENT OR HALLUCINATE ANY INFORMATION. Do not add any fake skills, certifications, experience, or projects that the candidate does not have.
      2. Use EXACTLY the Name, Email, Phone, and Links found in the attached PDF.
      3. DO NOT edit the Education section. Return it exactly as it appears in the original resume.
      4. You MAY rewrite and edit the Professional Summary and Project/Experience descriptions to strictly align with the Job Description.
      5. SUGGESTIONS: You may suggest additional skills, certifications, or projects the user should learn based on the JD, but you MUST explicitly append the tag "[SUGGESTED]" to the end of their names so the user knows they are recommendations.
      6. MANDATORY: You MUST include every single project or work experience listed in the original resume. Do not drop any.
      7. DO NOT use any Markdown formatting (like **bold** or *italics*) in any of the text. Return plain text only.

      Output ONLY a valid JSON object with the following structure:
      {
        "atsScore": 85,
        "atsFeedback": ["Added React keyword", "Missing cloud deployment experience"],
        "matchedKeywords": ["React.js", "Node.js", "Problem Solving", "Agile"],
        "resumeData": {
          "personalInfo": { "name": "", "email": "", "phone": "", "links": "" },
          "summary": "A very brief, 2-sentence professional summary.",
          "experience": [ { "company": "", "role": "", "duration": "", "achievements": ["..."] } ],
          "education": [ { "institution": "", "degree": "", "duration": "" } ],
          "skills": ["List of relevant technical AND soft skills extracted from JD"]
        }
      }

      Target Job Description:
      ${jobDescription || "No job description provided."}
      `;

        const result = await model.generateContent([
            prompt, { inlineData: { data: pdfBase64, mimeType: "application/pdf" } }
        ]);

        let aiResponse = result.response.text();
        aiResponse = aiResponse.replace(/```json/g, '').replace(/```/g, '').replace(/\*\*/g, '').trim();
            
        res.json({ message: 'Resume generated successfully', data: JSON.parse(aiResponse) });
    } catch (error) {
        console.error('Server/AI error:', error);
        res.status(500).json({ error: 'Failed to generate resume. Check backend console.' });
    }
});

app.post('/api/generate-cover-letter', ClerkExpressWithAuth(), checkAndDeductCredits, async (req, res) => {
    try {
        const { resumeData, jobDescription } = req.body;
        if (!resumeData || !jobDescription) return res.status(400).json({ error: 'Missing resume data or job description.' });

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); 
        const prompt = `Write a highly tailored, engaging, and concise cover letter. Use the provided Candidate Resume Data. Do not wrap the output in markdown. Return plain text only.\nResume Data: ${JSON.stringify(resumeData)}\nJD: ${jobDescription}`;

        const result = await model.generateContent(prompt);
        let coverLetterText = result.response.text().replace(/\*\*/g, '').trim();

        res.json({ message: 'Cover letter generated successfully', data: coverLetterText });
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate cover letter.' });
    }
});

app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));