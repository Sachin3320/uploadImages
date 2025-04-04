import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);
    console.log("database connected sucessfully")
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default connectDB;
