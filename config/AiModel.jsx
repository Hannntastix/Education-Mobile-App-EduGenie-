// To run this code you need to install the following dependencies:
// npm install @google/genai mime
// npm install -D @types/node

import {
    GoogleGenAI,
} from '@google/genai';

async function main() {
    const ai = new GoogleGenAI({
        apiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY,
    });
    const config = {
        thinkingConfig: {
            thinkingBudget: 0,
        },
        responseMimeType: 'application/json',
    };
    const model = 'gemini-2.5-pro-preview-03-25';
    const contents = [
        {
            role: 'user',
            parts: [
                {
                    text: `Learn Python : :As your are coaching teacher
  - User want to learn about the topic
  - Generate 5-7 course title for study (Short)
  - Make sure it is related to description
  - Output will be ARRAY of String in JSON FORMAT only
  - Do not add any plain text in output`,
                },
            ],
        },
        {
            role: 'model',
            parts: [
                {
                    text: `The user wants to learn Python.
  I need to act as a coaching teacher and generate 5-7 short course titles related to learning Python.
  The output must be a JSON array of strings.
  No extra text should be included in the output.
  
  Plan:
  1. Brainstorm short, catchy, and relevant course titles for learning Python.
  2. Ensure titles cover beginner to potentially intermediate aspects, or focus on the learning journey.
  3. Aim for 5-7 titles.
  4. Format the titles as a JSON array of strings.
  
  Potential Titles:
  - Python Kickstart
  - Python Essentials
  - Learn Python Step-by-Step
  - Python for Beginners
  - Mastering Python Basics
  - Your Python Journey
  - Dive into Python
  
  Refining the list:
  - "Python Kickstart" - Good, short, implies starting.
  - "Python Essentials" - Good, covers the basics.
  - "Learn Python Step-by-Step" - Clear, good for beginners.
  - "Python for Absolute Beginners" - Very specific, good.
  - "Python Fundamentals" - Standard, clear.
  - "Your First Python Steps" - Encouraging, beginner-focused.
  - "Coding with Python: Start Here" - Action-oriented.
  
  Selecting 5-7:
  1. Python Kickstart
  2. Python Essentials for Beginners
  3. Learn Python Step-by-Step
  4. Python Fundamentals
  5. Your First Python Code
  6. Mastering Python Basics
  7. Dive Into Python Programming
  
  Let's go with 6 titles that are concise and cover the beginner aspect well.
  1. Python Kickstart
  2. Python Essentials
  3. Learn Python Step-by-Step
  4. Python for Beginners
  5. Mastering Python Basics
  6. Your Python Journey
  
  Format as JSON array:
  ["Python Kickstart", "Python Essentials", "Learn Python Step-by-Step", "Python for Beginners", "Mastering Python Basics", "Your Python Journey"]
  
  Looks good. It meets all requirements: coaching teacher persona (implied by providing titles), 6 titles (within 5-7 range), short titles, related to learning Python, JSON array format, no extra text.`,
                },
                {
                    text: `\`\`\`json
  [
    "Python Kickstart",
    "Python Essentials for Beginners",
    "Learn Python Step-by-Step",
    "Python Fundamentals",
    "Your First Python Code",
    "Mastering Python Basics",
    "Dive Into Python Programming"
  ]
  \`\`\``,
                },
            ],
        },
        {
            role: 'user',
            parts: [
                {
                    text: `INSERT_INPUT_HERE`,
                },
            ],
        },
    ];

    const response = await ai.models.generateContentStream({
        model,
        config,
        contents,
    });
    for await (const chunk of response) {
        console.log(chunk.text);
    }
}

main();
