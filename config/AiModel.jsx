import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY,
});

const MODEL = 'gemini-2.5-flash';

const CONFIG = {
  responseMimeType: 'application/json',
  temperature: 0.3,
};

function createChatModel(initialHistory = []) {
  let history = [...initialHistory];

  return {
    async sendMessage(message) {
      history.push({
        role: 'user',
        parts: [{ text: message }],
      });

      const response = await ai.models.generateContent({
        model: MODEL,
        config: CONFIG,
        contents: history,
      });

      const text = response.text;

      history.push({
        role: 'model',
        parts: [{ text }],
      });

      // console.log("========== GEMINI USAGE ==========");
      // console.log("Input Tokens:", response.usageMetadata?.promptTokenCount);
      // console.log("Output Tokens:", response.usageMetadata?.candidatesTokenCount);
      // console.log("Total Tokens:", response.usageMetadata?.totalTokenCount);
      // console.log("==================================");

      return {
        response: {
          text: () => text,
        },
        usage: {
          inputTokens: response.usageMetadata?.promptTokenCount ?? 0,
          outputTokens: response.usageMetadata?.candidatesTokenCount ?? 0,
          totalTokens: response.usageMetadata?.totalTokenCount ?? 0,
        },
      };
    },
  };
}

// GENERATE TOPICS

export const GenerateTopicsAIModel =
  createChatModel();

// GENERATE COURSE

export const GenerateCourseAIModel =
  createChatModel();

