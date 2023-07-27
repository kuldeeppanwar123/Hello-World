import { StatusCodes } from "http-status-codes";
import { error, success } from "../utils/responseWrapper.js";
import userModel from "../models/User.js";
import postModel from "../models/Post.js";
import { v2 as cloudinary } from 'cloudinary';
import { mapPostOutput } from "../utils/Utils.js";

export async function createPostController(req,res){
   try {
      const {caption,postImg} = req.body;

      if(!caption || !postImg){
         return res.send(error(400,"caption and image is required"));
      }

     
      const cloudImg = await cloudinary.uploader.upload(postImg,{
         folder:"/PostImgs"
        })

      const image ={
       url:cloudImg.secure_url,
       publicId: cloudImg.public_id
       }

      const owner = req._id;
      const user = await userModel.findById(req._id);
      console.log(caption , " ",owner);
      const post = await postModel.create({
         owner,
         caption,
         image
      });

      user.posts.push(post._id);
      await user.save();

      console.log("success : "+success(201,user));
      return res.send(success(201,user));
   } catch (e) {
      console.log(e);
      return res.send(error(404,e.message))
   }
}

export async function likeAndUnlikePost (req,res){
   try {
      console.log("like unlike is called!");
      const {postId} = req.body;
   const currUserId = req._id;

   const post = await postModel.findById(postId).populate('owner');
   if(!post){
      return res.send(error(404,"post not found!"));
   }

   if(post.likes.includes(currUserId)){
      const index = post.likes.indexOf(currUserId);
      post.likes.splice(index ,1);
   }
   else{
      post.likes.push(currUserId);
   }

   await post.save();
   return res.send(success(200,{post: mapPostOutput(post,req._id)}));

   } 
   catch (e) {
      return res.send(error(500,e.message));
   }
   
}

export async function updatePostController(req,res){
   try {
      const {postId,caption} = req.body;
      const currUserId = req._id;

      const post = await postModel.findById(postId);

      if(!post){
         return res.send(error(404,'post not found'));
      }

      if(post.owner.toString()!==currUserId){
         return res.send(error(403 , "only owners can update their posts"));
      }
 
      if(caption){
         post.caption = caption;
      }
      await post.save();

      return res.send(success(200, 'post updated successfully'));
      
   } catch (e) {
      return res.send(500,e.message);
   }
}

export async function deletePostController(req,res){
   try {
      const {postId} = req.body;
      const currUserId = req._id;

      const post = await postModel.findById(postId);
      const currUser = await userModel.findById(currUserId);

      if(!post){
         return res.send(error(404,'post not found'));
      }

      if(post.owner.toString()!==currUserId){
         return res.send(error(403 , "only owners can delete their posts"));
      }

      const index = currUser.posts.indexOf(postId);
      currUser.posts.splice(index , 1);
      await currUser.save();
      await postModel.findByIdAndDelete(postId);

      return res.send(success(200,"post deleted successfully"));

   } catch (e) {
      return res.send(error(500,e.message));
   }
}
3.13