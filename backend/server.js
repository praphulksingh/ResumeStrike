// backend/server.js
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// --- API ENDPOINT: Generate ATS Resume ---
app.post('/api/generate-resume', upload.single('resume'), async (req, res) => {
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
        Task 4: Identify 5-10 exact keywords or short phrases from the Job Description that you successfully incorporated into the rewritten resume.

        CRITICAL INSTRUCTIONS:
        1. DO NOT INVENT OR HALLUCINATE ANY INFORMATION. 
        2. Use EXACTLY the Name, Email, Phone, and Links found in the attached PDF.
        3. Do not invent past companies, dates, or degrees. Only enhance the phrasing of the experience and projects I actually provided in the document.
        4. If a piece of personal info is missing, leave the string empty. Do not use placeholders.

        Output ONLY a valid JSON object with the following structure. Do not include any markdown formatting or extra text outside the JSON:
        {
          "atsScore": 85,
          "atsFeedback": ["Added React keyword", "Missing cloud deployment experience"],
          "matchedKeywords": ["React.js", "Node.js", "EdTech", "Tailwind CSS"],
          "resumeData": {
            "personalInfo": { "name": "", "email": "", "phone": "", "links": "" },
            "summary": "A strong, skills-focused professional summary tailored to the JD.",
            "experience": [ { "company": "", "role": "", "duration": "", "achievements": ["Action-oriented bullet points incorporating keywords"] } ],
            "education": [ { "institution": "", "degree": "", "duration": "" } ],
            "skills": ["List of relevant technical and soft skills"]
          }
        }

        Target Job Description:
        ${jobDescription}
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
        aiResponse = aiResponse.replace(/```json/g, '').replace(/```/g, '').trim();
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
app.post('/api/generate-cover-letter', async (req, res) => {
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
        const coverLetterText = result.response.text();

        res.json({
            message: 'Cover letter generated successfully',
            data: coverLetterText.trim()
        });

    } catch (error) {
        console.error('Server/AI error:', error);
        res.status(500).json({ error: 'Failed to generate cover letter.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});