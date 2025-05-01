

// import { GoogleGenAI } from '@google/genai';

// const ai = new GoogleGenAI({
//     apiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY,
// });

// const config = {
//     responseMimeType: 'text/plain',
// };

// const model = 'gemini-2.5-pro-preview-03-25';

// const contents = [
//     {
//         role: 'user',
//         parts: [
//             {
//                 text: `Learn Python : :As your are coaching teacher

// - User want to learn about the topic
// - Generate 5-7 course title for study (Short)
// - Make sure it is related to description
// - Output will be ARRAY of String in JSON FORMAT only
// - Do not add any plain text in output`,
//             },
//         ],
//     },
// ];

// async function main() {
//     const response = await ai.models.generateContentStream({
//         model,
//         config,
//         contents,
//     });

//     for await (const chunk of response) {
//         console.log(chunk.text);
//     }
// }

// main();

import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} from "@google/generative-ai";



const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
};

export const GenerateTopicsAIModel = model.startChat({
    generationConfig,
    history: [
        {
            role: 'user',
            parts: [
                { text: "Learn Python : :As your are coaching teacher - User want to learn about the topic - Generate 5-7 course title for study (Short) - Make sure it is related to description - Output will be ARRAY of String in JSON FORMAT only - Do not add any plain text in output" }
            ],
        },
        {
            role: "model",
            parts: [
                {
                    text: `\`\`\`json
            {
              "course_titles": [
                "Python Basics: A Gentle Intro",
                "Python Fundamentals: Data & Control",
                "Python Programming: Functions & Modules",
                "Object-Oriented Python: Classes",
                "Python Data Handling: Files & APIs",
                "Intermediate Python: Libraries",
                "Python Projects: Build Your First App"
              ]
            }
            \`\`\``
                }
            ],
        },
    ],
});

export const GenerateCourseAIModel = model.startChat({
    generationConfig,
    history: [
        
    ],
});