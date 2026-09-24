import OpenAI from "openai";

const client = new OpenAI({
    apiKey: process.env.XKIRO_API_KEY,
    baseURL: "https://api.xkiro.com/v1",

    // xKiro merekomendasikan timeout di atas batas
    // blocking request 95 detik.
    timeout: 120_000,

    // Retry beberapa error sementara.
    maxRetries: 2,
});

const MODEL = "qwen/qwen3.8-omni-flash:free";

const CONFIG = {
    temperature: 0.3,
    max_tokens: 8192,
};

export async function generateChatCompletion(messages) {
    const startTime = Date.now();

    try {
        const response = await client.chat.completions.create({
            model: MODEL,
            messages,
            temperature: CONFIG.temperature,
            max_tokens: CONFIG.max_tokens,
        });

        const endTime = Date.now();
        const responseTime = endTime - startTime;

        const text =
            response.choices?.[0]?.message?.content || "";

        return {
            response: text,

            model: response.model || MODEL,

            usage: {
                inputTokens:
                    response.usage?.prompt_tokens ?? 0,

                outputTokens:
                    response.usage?.completion_tokens ?? 0,

                totalTokens:
                    response.usage?.total_tokens ?? 0,

                responseTime,
            },
        };
    } catch (error) {
        console.error("XKIRO API ERROR:");

        console.error("Status:", error?.status);
        console.error("Message:", error?.message);

        throw error;
    }
}