import express from "express";
import axios from "axios";
import { openai } from "../../index";

require("dotenv").config();

const router = express.Router();

router.post("/text", async (req, res) => {
  try {
    const { text, activeChatId } = req.body;
    const chatHistory = [];
    const messages = chatHistory.map(([role, content]) => ({
      role,
      content,
    }));
    messages.push({ role: "user", content: text });
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messages,
    });
    const completionText = response.data.choices[0].message.content;
    res.status(200).json({ text: response.data.choices[0].text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
