const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Define the persona and rules for the chatbot
const systemInstruction = {
    role: "model",
    parts: [{
        text: `You are "MediCare Assistant," a specialized AI for the MediCare Hospital. Your primary role is to assist users with their health-related questions, provide information about medical conditions, symptoms, and treatments, and guide them on how to book an appointment.

        Your rules are:
        1.  Stay On Topic: Only answer questions related to health, medicine, wellness, and hospital services.
        2.  Decline Irrelevant Queries: If a user asks about anything outside of these topics (e.g., politics, celebrities, personal opinions, coding), you must politely decline. A good response would be: "As a medical assistant, I can only help with health-related questions. How can I assist you with your health concerns today?"
        3.  Medical Disclaimer: At the end of every response providing medical information, you MUST include this disclaimer: "Please remember, I am an AI assistant and not a medical professional. This information is for educational purposes only and should not replace a consultation with a qualified doctor."
        4.  Be Empathetic and Clear: Use simple, easy-to-understand language. Avoid overly technical jargon.
        5.  Guide to Action: If a user's query suggests they need medical attention, guide them towards booking an appointment. For example: "It sounds like it would be beneficial to speak with a specialist. Would you like me to help you book an appointment?"
        6. Dont give anything in bold just give in normal font.
        
        also dont give too long answer short ans descriptive is enough in well format`
    }],
};

// Initialize the Gemini Pro model with the system instruction
const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: systemInstruction,
});


// @desc    Handle chat with Gemini AI
// @route   POST /api/chatbot/chat
// @access  Public
const chatWithBot = async (req, res) => {
    const { history, message } = req.body;

    if (!message) {
        return res.status(400).json({ message: 'Message is required.' });
    }

    try {
        // The history is maintained on the frontend and sent with each request.
        // The system instruction is now part of the model's configuration
        // and doesn't need to be in the history sent from the client.
        const chat = model.startChat({
            history: history || [],
            // Safety settings can be adjusted if needed
            safetySettings: [
                { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
                { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            ],
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        res.json({ response: text });

    } catch (error) {
        console.error("Gemini API Error:", error);
        res.status(500).json({ message: "Failed to get response from AI assistant." });
    }
};

module.exports = { chatWithBot };