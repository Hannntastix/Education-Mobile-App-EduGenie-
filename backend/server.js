import "dotenv/config";
import express from "express";
import cors from "cors";
import aiRoutes from "./routes/aiRoutes.js";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use("/api/ai", aiRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "EduGenie Backend is running",
    });
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`EduGenie Backend running on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});