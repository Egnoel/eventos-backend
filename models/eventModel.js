import Mongoose from "mongoose";

const eventSchema = Mongoose.Schema(
  {
    title: { type: "String", required: true },
    creator: { type: Mongoose.Schema.Types.ObjectId, ref: "User" },
    eventDate: { type: "String", required: true },
    eventTime: { type: "String", required: true },
    description: { type: "String", required: true },
    category: { type: "String", required: true },

    eventpic: {
      type: "String",
      required: true,
    },
    registrations: [{ type: Mongoose.Schema.Types.ObjectId, ref: "User" }],
    isTransmission: { type: "Boolean", default: false },
    favourites: [{ type: Mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestaps: true }
);

const Event = Mongoose.model("Event", eventSchema);

export default Event;
