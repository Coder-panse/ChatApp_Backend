import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getMessage = async (req, res) => {
  try {
    const senderID = req.user._id;
    const recepientId = req.params.id;
    const message = await Message.find({
      $or: [
        { sender: senderID, recepient: recepientId },
        { sender: recepientId, recepient: senderID },
      ],
    });
    const formattedMessage = message.map((msg) => ({
      ...msg._doc,
      time: new Date(msg.timeStamp).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }));
    res.status(200).json({ msg: "success", formattedMessage });
  } catch (error) {
    console.log(error);
  }
};

export const updateLanguage = async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      language: req.body.Language,
    },
    {
      new: true,
    }
  );
  console.log(user);
};
