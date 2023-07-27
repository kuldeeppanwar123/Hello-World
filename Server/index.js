import express from "express";
import 'dotenv/config'
import connectDB from "./src/config/dbConnect.js";
import authRouter from "./src/routers/AuthRouter.js";
import morgan from "morgan";
import postRouter from "./src/routers/PostRouter.js";
import cookieParser from "cookie-parser";
import cors from 'cors';
import userRouter from "./src/routers/UserRouter.js";
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
  });
  

//   var bodyParser = require('body-parser');
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
const app = express();
app.use(express.json({limit: '50mb'}));
app.use(morgan('common'));
app.use(cookieParser());
app.use(cors({
    credentials:true,
    origin:'http://localhost:3000'
}))
app.use('/auth',authRouter);
app.use('/post' , postRouter);
app.use('/user' , userRouter);

 
const port = process.env.PORT || 4100;
app.listen(port , ()=>{
    connectDB();
    console.log(`server is runnig at ${port}`);
})
