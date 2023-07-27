import express from "express";
import { createPostController,  deletePostController,  likeAndUnlikePost, updatePostController } from "../controllers/PostController.js";
import { checkUser } from "../Middleware/middlewares.js";

const postRouter = express.Router();
postRouter.post('/', checkUser, createPostController);
postRouter.post('/like', checkUser, likeAndUnlikePost);
postRouter.put('/', checkUser, updatePostController);
postRouter.delete('/', checkUser, deletePostController);

export default postRouter;
