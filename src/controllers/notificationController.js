import * as services from "../services";
import Notification from "../modelsChat/notification.model";
import { getReceiverSocketId, io } from "../socket/socket";

export const getAllNotifications = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { idChat } = req.user;
    const filteredNotifications = await Notification.find({
      receiverId: idChat,
    })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: filteredNotifications ? true : false,
      message: filteredNotifications ? "Successfully" : "Something went wrong!",
      data: filteredNotifications ? filteredNotifications : null,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateNotification = async (req, res) => {
  try {
    const { idChat } = req.user;
    const result = await Notification.updateMany(
      { receiverId: idChat },
      { is_read: true }
    );
    res.status(200).json({
      success: result ? true : false,
      message: result ? "Successfully" : "Something went wrong!",
    });
  } catch (error) {
    console.log(error);
  }
};

export const createNotification = async (receiverId, booking_id, content) => {
  try {
    // const { content, booking_id } = req.body;
    // const { id: receiverId } = req.params;

    const newNotification = new Notification({
      receiverId,
      booking_id,
      content,
    });

    await newNotification.save();

    // SOCKET IO FUNCTIONALITY WILL GO HERE
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      // io.to(<socket_id>).emit() used to send events to specific client
      io.to(receiverSocketId).emit("newNotification", newNotification);
    }
  } catch (error) {
    console.log(error);
  }
};
