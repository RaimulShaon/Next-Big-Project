import { GoogleGenerativeAI } from '@google/generative-ai'

// const genAI = new GoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY });
export async function POST(request:Request) {
    try {
        // const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt =  "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";
    const generationConfig = {
        maxOutputTokens: 1000, // Maximum number of tokens in the output
        temperature: 0.1,     // Controls randomness (lower = more deterministic)
      };
    // const result = await model.generateContent(prompt, generationConfig);
    // console.log(result.response.text());
    
    
    } catch (error) {
        return Response.json(
            { message: 'Message not found or already deleted', success: false },
            { status: 404 }
          );
    }
}
