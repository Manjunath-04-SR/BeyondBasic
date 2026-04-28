import express from "express";
import { chatWithBot } from "../controllers/chatbot.controller.ts";

const router = express.Router();

// POST /api/chatbot/chat  — body: { message: string, history?: { role, text }[] }
router.post("/chat", chatWithBot);

export default router;
