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
        // Check if user is authenticated via Clerk or using a Guest ID
        const isAuth = req.auth && !!req.auth.userId;
        const userId = isAuth ? req.auth.userId : req.headers['guest-id'];

        if (!userId) {
            return res.status(400).json({ error: "Missing authentication or guest ID." });
        }

        // Find or create the user in Neon DB
        let user = await prisma.user.findUnique({ where: { id: userId } });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    id: userId,
                    isGuest: !isAuth,
                    credits: isAuth ? 100 : 2 // Give 100 to logged-in, 2 to guests
                }
            });
        }

        if (user.credits <= 0) {
            return res.status(403).json({ error: "Insufficient credits. Please sign up or upgrade to generate more." });
        }

        // Deduct 1 credit
        await prisma.user.update({
            where: { id: userId },
            data: { credits: user.credits - 1 }
        });

        // Pass updated credits to response header
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

        if (!userId) return res.json({ credits: 0 });

        let user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            user = await prisma.user.create({
                data: { id: userId, isGuest: !isAuth, credits: isAuth ? 100 : 2 }
            });
        }
        res.json({ credits: user.credits });
    } catch (error) {
        console.error("Error fetching credits:", error);
        res.status(500).json({ error: "Failed to fetch credits." });
    }
});

// Get all chats for the logged-in user
app.get('/api/chats', ClerkExpressWithAuth(), async (req, res) => {
    const userId = req.auth.userId || req.headers['guest-id'];
    const chats = await prisma.chat.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
    });
    res.json(chats);
});

// Get messages for a specific chat
app.get('/api/chats/:chatId', ClerkExpressWithAuth(), async (req, res) => {
    const { chatId } = req.params;
    const messages = await prisma.message.findMany({
        where: { chatId },
        orderBy: { createdAt: 'asc' }
    });
    res.json(messages);
});

// --- API ENDPOINT: Generate ATS Resume ---
// Note: Protected by Clerk auth check AND the credit deduction middleware
app.post('/api/generate-resume', ClerkExpressWithAuth(), upload.single('resume'), checkAndDeductCredits, async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded.' });
        }

        const jobDescription = req.body.jobDescription || "No job description provided.";

        // 1. Convert the raw PDF file in memory to a base64 string for Gemini Vision
        const pdfBase64 = req.file.buffer.toString('base64');

        // 2. Call Gemini AI (Updated to include ATS Scoring)
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
      1. DO NOT INVENT OR HALLUCINATE ANY INFORMATION. 
      2. Use EXACTLY the Name, Email, Phone, and Links found in the attached PDF.
      3. Do not invent past companies, dates, or degrees. Only enhance the phrasing of the experience and projects I actually provided.
      4. If personal info is missing, leave the string empty. Do not use placeholders.
      5. MANDATORY: You MUST include every single project or work experience listed in the original resume. Do not drop any projects. You may aggressively rewrite the bullet points for those projects to better match the Job Description, but the project itself must remain.
      6. MANDATORY: Keep the "summary" field extremely brief and punchy. It should be no more than 2 to 3 very short sentences focused entirely on hard skills and value. No fluff.
      7. MANDATORY: Extract relevant soft skills (e.g., leadership, communication, cross-functional teamwork, problem-solving, Agile) from the Job Description and include them in the "skills" array alongside your technical skills.
      8. DO NOT use any Markdown formatting (like **bold** or *italics*) in any of the text. Return plain text only.

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

        // 3. Send BOTH the text prompt AND the raw PDF file directly to Gemini
        const result = await model.generateContent([
            prompt,
            { 
                inlineData: { 
                    data: pdfBase64, 
                    mimeType: "application/pdf" 
                } 
            }
        ]);

        let aiResponse = result.response.text();

        // 4. Clean and parse the AI output
        aiResponse = aiResponse
            .replace(/```json/g, '')
            .replace(/```/g, '')
            .replace(/\*\*/g, '') // <--- THIS VAPORIZES THE ASTERISKS
            .trim();
            
        const finalData = JSON.parse(aiResponse);

        // 5. Send structured data (Score + Feedback + Resume) back to frontend
        res.json({
            message: 'Resume generated successfully',
            data: finalData 
        });

    } catch (error) {
        console.error('Server/AI error:', error);
        res.status(500).json({ error: 'Failed to generate resume. Check backend console.' });
    }
});

// --- API ENDPOINT: Generate Cover Letter ---
// Note: Protected by Clerk auth check AND the credit deduction middleware
app.post('/api/generate-cover-letter', ClerkExpressWithAuth(), checkAndDeductCredits, async (req, res) => {
    try {
        const { resumeData, jobDescription } = req.body;

        if (!resumeData || !jobDescription) {
            return res.status(400).json({ error: 'Missing resume data or job description.' });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); 
        
        const prompt = `
        You are an expert career coach and professional copywriter.
        Write a highly tailored, engaging, and concise cover letter (about 3-4 paragraphs) for the candidate applying for the job described below.
        
        CRITICAL INSTRUCTIONS:
        1. Use the provided Candidate Resume Data to highlight relevant skills and experience.
        2. DO NOT hallucinate or invent any experience, skills, or metrics not found in the resume data.
        3. Match the tone of the Job Description.
        4. Do not wrap the output in markdown code blocks or JSON. Return only the raw text of the cover letter.
        
        Candidate Resume Data:
        ${JSON.stringify(resumeData)}

        Target Job Description:
        ${jobDescription}
        `;

        const result = await model.generateContent(prompt);
        let coverLetterText = result.response.text();
        
        // Extra safeguard: Strip out asterisks from cover letter as well
        coverLetterText = coverLetterText.replace(/\*\*/g, '').trim();

        res.json({
            message: 'Cover letter generated successfully',
            data: coverLetterText
        });

    } catch (error) {
        console.error('Server/AI error:', error);
        res.status(500).json({ error: 'Failed to generate cover letter.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});