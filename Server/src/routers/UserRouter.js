import express from "express";
import { deleteMyProfile, followAndUnfollowUser, getFeedData, getMyInfo, getMyPosts, getUserPosts, getUserProfile, updateUserProfile } from "../controllers/UserController.js";
import { checkUser } from "../Middleware/middlewares.js";

const userRouter = express.Router();

userRouter.post('/follow',checkUser ,followAndUnfollowUser);
userRouter.get('/getFeedData',checkUser ,getFeedData);
userRouter.get('/getMyPosts',checkUser ,getMyPosts);
userRouter.get('/getUserPosts',checkUser ,getUserPosts);
userRouter.delete('/',checkUser ,deleteMyProfile);
userRouter.get("/getMyInfo",checkUser, getMyInfo);
userRouter.put("/", checkUser, updateUserProfile);
userRouter.post('/getUserProfile', checkUser,getUserProfile);
export default userRouter;