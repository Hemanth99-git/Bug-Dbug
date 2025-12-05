
import { GoogleGenAI, Type } from "@google/genai";
import type { BuggyCodeResponse } from '../types';

const API_KEY = process.env.API_KEY;

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

const model = 'gemini-2.5-flash';

export const generateBuggyCode = async (topic: string): Promise<BuggyCodeResponse> => {
    if (!ai) {
        throw new Error("API_KEY environment variable not set");
    }
    
    const prompt = `
        You are an expert programming instructor creating a learning exercise.
        Your task is to generate a code snippet based on the topic: "${topic}".
        The code snippet should be short, concise, and highly relevant to the topic.
        
        CRITICAL INSTRUCTIONS:
        1. Intentionally introduce one or two subtle but common bugs. The bug can be a syntax error, a logical error, an off-by-one error, or incorrect API usage. The bug should be educational.
        2. Provide the corrected, fully functional version of the code.
        3. Provide a clear, step-by-step explanation of what the bug was, why it was a bug, and how the fix works.
        4. Your entire response MUST be a single JSON object.
    `;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        buggyCode: {
                            type: Type.STRING,
                            description: "The code snippet with one or two intentional, educational bugs."
                        },
                        correctCode: {
                            type: Type.STRING,
                            description: "The corrected, fully functional version of the code."
                        },
                        explanation: {
                            type: Type.STRING,
                            description: "A clear explanation of the bug and the fix."
                        }
                    },
                    required: ["buggyCode", "correctCode", "explanation"]
                }
            }
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error generating buggy code:", error);
        throw new Error("Failed to get a valid response from the AI. It might be an issue with the API or the provided topic.");
    }
};

export const getHint = async (code: string, topic: string, hintCount: number): Promise<string> => {
    if (!ai) {
        throw new Error("API_KEY environment variable not set");
    }
    
    let hintInstruction: string;

    if (hintCount === 0) {
        hintInstruction = "Provide a general, high-level hint. Do not mention specific lines or variables. Nudge the student in the right direction conceptually.";
    } else if (hintCount === 1) {
        hintInstruction = "Provide a more specific hint. You can point to the general area or concept within the code where the bug might be, but don't give away the answer.";
    } else {
        hintInstruction = "Provide a very direct hint. You can reference the specific line or block of code that is problematic, but do not write the corrected code. Explain *why* that line is suspicious.";
    }

    const prompt = `
        You are a friendly and encouraging AI programming tutor.
        A student is working on a debugging challenge for the topic "${topic}".
        Here is their current code:
        \`\`\`
        ${code}
        \`\`\`
        
        They are stuck and have requested a hint. This is their ${hintCount + 1} request.
        
        Your task: ${hintInstruction}
        
        Keep your response concise, friendly, and encouraging. Address the student directly.
    `;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt
        });
        return response.text;
    } catch (error) {
        console.error("Error getting hint:", error);
        throw new Error("Failed to get a hint from the AI.");
    }
};
