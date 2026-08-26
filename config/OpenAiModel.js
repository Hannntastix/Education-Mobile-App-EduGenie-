import OpenAI from "openai";

const client = new OpenAI({
    apiKey: process.env.EXPO_PUBLIC_XKIRO_API_KEY,
    baseURL: "https://api.xkiro.com/v1",
});

const MODEL = "deepseek/deepseek-v4-pro";

const CONFIG = {
    temperature: 0.3,
    max_tokens: 8192,
};

function createChatModel(initialHistory = []) {

    let history = [...initialHistory];

    return {

        async sendMessage(message) {

            history.push({
                role: "user",
                content: message,
            });

            const startTime = Date.now();

            const response = await client.chat.completions.create({
                model: MODEL,
                messages: history,
                temperature: CONFIG.temperature,
                max_tokens: CONFIG.max_tokens,
            });

            const endTime = Date.now();

            const responseTime = endTime - startTime;

            const text = response.choices?.[0]?.message?.content || "";

            history.push({
                role: "assistant",
                content: text,
            });

            console.log("========== OPENAI / XKIRO USAGE ==========");
            console.log("Model:", MODEL);
            console.log("Input Tokens:", response.usage?.prompt_tokens ?? 0);
            console.log("Output Tokens:", response.usage?.completion_tokens ?? 0);
            console.log("Total Tokens:", response.usage?.total_tokens ?? 0);
            console.log("Response Time:", responseTime, "ms");
            console.log("==========================================");

            return {
                response: {
                    text: () => text,
                },

                usage: {
                    inputTokens: response.usage?.prompt_tokens ?? 0,
                    outputTokens: response.usage?.completion_tokens ?? 0,
                    totalTokens: response.usage?.total_tokens ?? 0,
                    responseTime: responseTime,
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