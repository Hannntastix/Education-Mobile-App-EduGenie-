import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
});

const MODEL = 'gpt-4.1-nano';

const CONFIG = {
    temperature: 0.3,
};

function createChatModel(initialHistory = []) {
    let history = [...initialHistory];

    return {
        async sendMessage(message) {

            history.push({
                role: 'user',
                content: message,
            });

            const response = await openai.responses.create({
                model: MODEL,
                temperature: CONFIG.temperature,
                input: history,
            });

            const text = response.output_text;

            history.push({
                role: 'assistant',
                content: text,
            });

            return {
                response: {
                    text: () => text,
                },

                usage: {
                    inputTokens: response.usage?.input_tokens ?? 0,
                    outputTokens: response.usage?.output_tokens ?? 0,
                    totalTokens: response.usage?.total_tokens ?? 0,
                },
            };
        },
    };
}


// GENERATE TOPICS

export const GenerateTopicsOpenAIModel =
    createChatModel();


// GENERATE COURSE

export const GenerateCourseOpenAIModel =
    createChatModel();