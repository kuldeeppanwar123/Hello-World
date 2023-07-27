import mongoose from "mongoose";

// const mongoURL = 'mongodb+srv://kuldeeppanwar460:kbzBM7hhB0N9YPn2@cluster0.qatbjay.mongodb.net/?retryWrites=true&w=majority';
const mongoURL = 'mongodb://127.0.0.1:27017/SocialMedia';
export default async function connectDB(){
try {
    // const connect =  await mongoose.connect(mongoURL,{
    //     useUnifiedTopology:true,
    //     useNewUrlParser:true
    // });
    const connect =  await mongoose.connect(mongoURL);
    console.log('DB connected! '+connect.connection.host);
} catch (error) {
    console.log(error);
    process.exit(1);
}
}