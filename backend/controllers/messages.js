import Message from "../models/Message.js";

/* SEND MESSAGE */
export const sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, content } = req.body;

    const newMessage = new Message({
      senderId,
      receiverId,
      content,
    });

    await newMessage.save();

    res.status(201).json(newMessage);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

/* GET MESSAGES */
export const getMessages = async (req, res) => {
  try {
    const { userId1, userId2 } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: userId1, receiverId: userId2 },
        { senderId: userId2, receiverId: userId1 },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* DELETE MESSAGES BETWEEN TWO USERS */
export const deleteMessages = async (req, res) => {
  try {
    const { userId1, userId2 } = req.params;

    await Message.deleteMany({
      $or: [
        { senderId: userId1, receiverId: userId2 },
        { senderId: userId2, receiverId: userId1 },
      ],
    });

    res.status(200).json({ message: "Conversation deleted" });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// Add to your messages controller
export const getNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const messages = await Message.find({ receiverId: userId, isRead: false })
      .populate("senderId", "firstName lastName")
      .sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};


// Add to your message saving logic
const saveMessage = async (req, res) => {
  try {
    const { senderId, receiverId, content } = req.body;
    const newMessage = new Message({
      senderId,
      receiverId,
      content,
      isRead: false, // Mark message as unread
    });
    const savedMessage = await newMessage.save();
    res.status(201).json(savedMessage);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


