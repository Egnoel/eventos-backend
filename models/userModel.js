import Mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = Mongoose.Schema(
  {
    firstName: { type: 'String', required: true },
    lastName: { type: 'String', required: true },
    email: { type: 'String', unique: true, required: true },
    password: { type: 'String', required: true },
    pic: {
      type: 'String',
      required: true,
      default:
        'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg',
    },
    favorites: [{ type: Mongoose.Schema.Types.ObjectId, ref: 'Event' }],
  },
  { timestaps: true }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function (next) {
  if (!this.isModified) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = Mongoose.model('User', userSchema);

export default User;
