const BACKEND_URL = "http://localhost:3000";

function createChatModel(initialHistory = []) {
    let history = [...initialHistory];

    return {
        async sendMessage(message) {
            history.push({
                role: "user",
                content: message,
            });

            const response = await fetch(
                `${BACKEND_URL}/api/ai/chat`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        messages: history,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(
                    data?.message || "Failed to generate AI response"
                );
            }

            const text = data.response;

            history.push({
                role: "assistant",
                content: text,
            });

            return {
                response: {
                    text: () => text,
                },

                usage: data.usage,
            };
        },
    };
}

export const GenerateTopicsOpenAI = createChatModel();

export const GenerateCourseOpenAI = createChatModel();