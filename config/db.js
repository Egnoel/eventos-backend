import Mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await Mongoose.connect(`${process.env.MONGO_URI}/mern`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit();
  }
};

export default connectDB;
