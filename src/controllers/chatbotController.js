import mongoose from "mongoose";
import Conversation from "../modelsChat/conversation.model";
import Message from "../modelsChat/message.model";
import { getReceiverSocketId, io } from "../socket/socket.js";
import { CohereClient } from "cohere-ai";

const cohere = new CohereClient({
  token: "rwLLPYCuCq8mWwPftjSiOlPgxsu6ADLTsGZOJGPO", // This is your trial API key
});

export const chat = async (req, res) => {
  try {
    const { message } = req.body;
    const sender1Id = req.user.idChat;
    const chatbotId = new mongoose.Types.ObjectId("60f3b3b3b3b3b3b3b3b3b3b3");

    let conversation = await Conversation.findOne({
      participants: { $all: [sender1Id, chatbotId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [sender1Id, chatbotId],
      });
    }

    const newMessage = new Message({
      senderId: sender1Id,
      receiverId: chatbotId,
      message,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    await Promise.all([conversation.save(), newMessage.save()]);

    if (!message.toLowerCase().includes("dog")) {
      return res.status(200).json({
        response: "I'm sorry, I can only provide information about dogs.",
      });
    }

    const stream = await cohere.chatStream({
      model: "command-r-plus",
      message,
      temperature: 0.1,
      maxTokens: 100,
      chatHistory: [
        {
          role: "system",
          message: "You are a vet with 20 years of experience.",
        },
      ],
      promptTruncation: "AUTO",
      connectors: [{ id: "web-search" }],
    });

    let responseText = "";
    for await (const chat of stream) {
      if (chat.eventType === "text-generation") {
        responseText += chat.text;
      }
    }
    responseText = responseText.replace(/\n/g, "");

    const newResponse = new Message({
      senderId: chatbotId,
      receiverId: sender1Id,
      message: responseText,
    });
    console.log(newResponse);

    if (newResponse) {
      conversation.messages.push(newResponse._id);
    }

    await Promise.all([conversation.save(), newResponse.save()]);

    // SOCKET IO FUNCTIONALITY WILL GO HERE
    const receiverSocketId = getReceiverSocketId(sender1Id);
    if (receiverSocketId) {
      // io.to(<socket_id>).emit() used to send events to specific client
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }
    res.status(200).json(newResponse);
  } catch (error) {
    console.log(error);
  }
};

export const getChat = async (req, res) => {
  try {
    const chatbotId = new mongoose.Types.ObjectId("60f3b3b3b3b3b3b3b3b3b3b3");
    const senderId = req.user.idChat;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, chatbotId] },
    }).populate("messages"); // NOT REFERENCE BUT ACTUAL MESSAGES

    if (!conversation) return res.status(200).json([]);

    const messages = conversation.messages;
    res.status(200).json(messages);
  } catch (error) {
    console.log(error);
  }
};
