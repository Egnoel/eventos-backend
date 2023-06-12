import asyncHandler from "express-async-handler";
import Message from "../models/messageModel.js";
import User from "../models/userModel.js";
import Event from "../models/eventModel.js";

//@description     Get all Messages
//@route           GET /api/Message/:chatId
//@access          Protected
export const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ event: req.params.eventID }).populate(
      "sender",
      "firstName pic email"
    );
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     Create New Message
//@route           POST /api/Message/
//@access          Protected
export const sendMessage = asyncHandler(async (req, res) => {
  const { content, messageDate, messageTime } = req.body;
  if (!req.user) return res.status(400).send("user not found");

  const events = await Event.findById(req.params.eventID);

  if (!events) return res.status(400).send("event not found");
  if (!content || !messageDate || !messageTime) {
    return res.status(400).send("Invalid data passed into request");
  }
  const user = req.user;

  try {
    var message = await Message.create({
      sender: user,
      content: content,
      event: events,
      messageDate: messageDate,
      messageTime: messageTime,
    });
    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
