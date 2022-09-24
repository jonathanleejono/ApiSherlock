import mongoose from "mongoose";

const closeMongoose = async () => {
  //all of this is to prevent memory leaks
  await Promise.all(mongoose.connections.map((con) => con.close()));
  await mongoose.disconnect();

  //set timeout for connections to close properly to prevent memory leaks
  await new Promise((res) => setTimeout(res, 1000));
};

export default closeMongoose;
