import Mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = Mongoose.Schema(
  {
    firstName: { type: "String", required: true },
    lastName: { type: "String", required: true },
    email: { type: "String", unique: true, required: true },
    password: { type: "String", required: true },
    pic: {
      type: "String",
      required: true,
      default:
        "https://res.cloudinary.com/dameucg7x/image/upload/v1676284449/329938388_1121969545144233_555012502169889047_n_llqpjc.jpg",
    },
    favorites: [{ type: Mongoose.Schema.Types.ObjectId, ref: "Event" }],
    createdEvents: [{ type: Mongoose.Schema.Types.ObjectId, ref: "Event" }],
    signedEvents: [{ type: Mongoose.Schema.Types.ObjectId, ref: "Event" }],
  },
  { timestaps: true }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = bcrypt.hash(this.password, salt);
});

const User = Mongoose.model("User", userSchema);

export default User;
