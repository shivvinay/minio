import mongoose from "mongoose";

const  MOONGODB_URI = process.env.MONGODB_URI! ;

export async function connectDB() {
    if(!MOONGODB_URI) {
        throw new Error("MongoDB URI is not defined in environment variables");
    };

    await mongoose.connect(MOONGODB_URI);
    console.log("Connected to MongoDB");    

}