import Mongoose from "mongoose";

const messageSchema = Mongoose.Schema(
  {
    sender: { type: Mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, trim: true },
    event: { type: Mongoose.Schema.Types.ObjectId, ref: "Event" },
    messageDate: { type: "String", required: true },
    messageTime: { type: "String", required: true },
  },
  { timestamps: true }
);

const Message = Mongoose.model("Message", messageSchema);
export default Message;
