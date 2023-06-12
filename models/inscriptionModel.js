import Mongoose from "mongoose";

const inscriptionSchema = Mongoose.Schema(
  {
    participant: { type: Mongoose.Schema.Types.ObjectId, ref: "User" },
    event: { type: Mongoose.Schema.Types.ObjectId, ref: "Event" },
  },
  { timestamps: true }
);

const Inscription = Mongoose.model("Inscription", inscriptionSchema);
export default Inscription;
