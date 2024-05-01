import Conversation from "../modelsChat/conversation.model";
import Message from "../modelsChat/message.model";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = (senderId, receiverId, message) =>
  new Promise(async (resolve, reject) => {
    try {
      let conversation = await Conversation.findOne({
        participants: { $all: [senderId, receiverId] },
      });

      if (!conversation) {
        conversation = await Conversation.create({
          participants: [senderId, receiverId],
        });
      }
      const newMessage = new Message({
        senderId,
        receiverId,
        message,
      });

      if (newMessage) {
        conversation.messages.push(newMessage._id);
      }

      // await conversation.save();
      // await newMessage.save();

      await Promise.all([conversation.save(), newMessage.save()]);

      // SOCKET IO FUNCTIONALITY WILL GO HERE
      const receiverSocketId = getReceiverSocketId(receiverId);
      if (receiverSocketId) {
        // io.to(<socket_id>).emit() used to send events to specific client
        io.to(receiverSocketId).emit("newMessage", newMessage);
      }

      resolve({
        success: newMessage ? true : false,
        data: newMessage ? newMessage : null,
      });
    } catch (error) {
      reject(error);
    }
  });

export const getMessages = (senderId, userToChatId) =>
  new Promise(async (resolve, reject) => {
    try {
      const conversation = await Conversation.findOne({
        participants: { $all: [senderId, userToChatId] },
      }).populate("messages"); // NOT REFERENCE BUT ACTUAL MESSAGES

      if (!conversation) {
        resolve({
          success: true,
          data: [],
        });
      }

      const messages = conversation.messages;

      resolve({
        success: messages ? true : false,
        data: messages ? messages : null,
      });
    } catch (error) {
      reject(error);
    }
  });
