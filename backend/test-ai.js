// backend/test-ai.js
require('dotenv').config();

async function checkModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
        console.error("❌ ERROR: API Key not found in .env file!");
        return;
    }

    console.log("Connecting to Google AI to fetch your available models...");

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();

        if (data.error) {
            console.error("❌ API Error:", data.error.message);
            return;
        }

        console.log("\n✅ SUCCESS! Here are the models you can use for generateContent:\n");
        
        // Filter and print only models that support text generation
        data.models.forEach(model => {
            if (model.supportedGenerationMethods.includes("generateContent")) {
                console.log(`👉 ${model.name.replace('models/', '')}`);
            }
        });

    } catch (error) {
        console.error("❌ Failed to fetch:", error.message);
    }
}

checkModels();