import mongoose from "mongoose";


const connectMongoDB =async () => {
 try{
    await mongoose.connect(process.env.NEXT_PUBLIC_MONGO_URL as string);
    console.log("connected to MongoDb");
 }
 catch(error)
 {
    console.log(error);

 }
  
};

export default connectMongoDB;
