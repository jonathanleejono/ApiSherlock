import { PROD_ENV } from "constants/envVars";
import mongoose from "mongoose";

const connectMongoose = async (url: string) => {
  try {
    if (!PROD_ENV) {
      console.log("Connecting to MongoDB with url --------> ", url);
    }
    await mongoose.connect(url);
  } catch (error) {
    console.log("Error connecting to MongoDB/Mongoose: ", error);
    return error;
  }
};

export default connectMongoose;
