import express from "express";
import { generateChatCompletion } from "../services/openAIServices.js";

const router = express.Router();

router.post("/chat", async (req, res) => {
    try {
        const { messages } = req.body;

        // Validasi request
        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({
                success: false,
                message: "messages must be an array",
            });
        }

        console.log("========== AI REQUEST ==========");
        console.log("Number of messages:", messages.length);

        const result = await generateChatCompletion(messages);

        console.log("========== AI RESPONSE ==========");
        console.log("Model:", "openai/gpt-5.4-mini");
        console.log("Input Tokens:", result.usage.inputTokens);
        console.log("Output Tokens:", result.usage.outputTokens);
        console.log("Total Tokens:", result.usage.totalTokens);
        console.log("Response Time:", result.usage.responseTime, "ms");
        console.log("=================================");

        return res.json({
            success: true,
            response: result.response,
            usage: result.usage,
        });
    } catch (error) {
        console.error("AI ROUTE ERROR:", error);

        return res.status(500).json({
            success: false,
            message:
                error?.message || "Failed to generate AI response",
        });
    }
});

export default router;