import postModel from "../models/Post.js";
import userModel from "../models/User.js";
import { mapPostOutput } from "../utils/Utils.js";
import { error, success } from "../utils/responseWrapper.js";
import { v2 as cloudinary } from 'cloudinary'

export async function followAndUnfollowUser(req,res){
    try {
        const {userIdTofollow} = req.body;
        const curUserId = req._id;

        if(userIdTofollow===curUserId){
            console.log('user cant follow himself');
            return res.send(error(409 , 'user can not follow himself'));
        }

        const userTofollow =await userModel.findById(userIdTofollow);
        const currUser = await userModel.findById(curUserId);
        // res.json(currUser);


        if(!userTofollow){
            console.log('user to follow not found');
            return res.send(error(404 , "user to follow not found!"));
        }
        console.log("curr user starts :");
        console.log(currUser.email);
        console.log("curr user ends :");

        // if currUser already follows usertofollow
        if(currUser.followings.includes(userIdTofollow)){
            const followingIndex = currUser.followings.indexOf(userIdTofollow);
            currUser.followings.splice(followingIndex ,1);
            
            const followersIndex = userTofollow.followers.indexOf(curUserId);
            userTofollow.followers.splice(followersIndex,1);
        }
        // if currUser do not already follow usertofollow
        else{
            currUser.followings.push(userIdTofollow);
            userTofollow.followers.push(curUserId);
        }
        await userTofollow.save();
        await currUser.save();
    
        return res.send(success(200,{user:userTofollow}));

    } catch (e) {
        console.log(e);
        return res.send(error(500,e.message));
    }
}

export async function getFeedData(req,res){
   try {
    const currUserId = req._id;
    const currUser = await userModel.findById(currUserId).populate('followings');
    // console.log(currUser);
    const fullPosts = await postModel.find({
        'owner':{'$in':currUser.followings}
    }).populate('owner');
    const posts = fullPosts.map(item=>mapPostOutput(item , req._id)).reverse();
    const followingIds = currUser.followings.map(item=>item._id);
    followingIds.push(req._id);
    // console.log('following ids:');
    // console.log(followingIds);
    const suggestions = await userModel.find({_id:{'$nin':followingIds}});    //this returns persons which are not followed by user.
    return res.send(success(200 , {...currUser._doc, suggestions,posts}));

   } catch (e) {
    return res.send(error(500,e.message));
   }
}


export async function getMyPosts(req,res){
    try {
        const currUserId = req._id;
        const posts = await postModel.find({'owner':currUserId}).populate('likes');
        if(posts.length<1){
            return res.send(error(404,"No post available yet"));
        }
        return res.send(success(200,posts));
    } 
    catch (e) {
        return res.send(error(500,e.message));
    }

}


export async function deleteMyProfile(req,res){
    try {
        console.log("hyyyy");
        const currUserId = req._id;
    const currUser = await userModel.findById(currUserId);

    // delete all posts
    await postModel.deleteMany({'owner':currUserId});

    //delete user from follower's followings list.
    currUser.followers.forEach(async followerId=>{
       const follower =  await userModel.findById(followerId);
       const index = follower.followings.indexOf(currUserId);
       follower.followings.splice(index,1);
       await follower.save();
    })
    
    //delete user from following's follower list.
    currUser.followings.forEach(async followingId=>{
        const following = await userModel.findById(followingId);
        const index = following.followers.indexOf(currUserId);
        following.followers.splice(index,1);
        await following.save();
    })

    // delete user from all likes.
    const allPosts = await postModel.find();
    allPosts.forEach(async post=>{
        const index = post.likes.indexOf(currUserId);
        post.likes.splice(index,1);
        await post.save();
    })


    // delete user
    // await currUser.remove();
    await userModel.findByIdAndRemove(currUserId);

    // clear cookie
    res.clearCookie('jwt');
    return res.send(success(200 , "Profile deleted successfully"));


    }
     catch (e) {
        return res.send(error(500,e.message));
    }
    


}

// take userId from req.body and return all posts of that user.
export async function getUserPosts(req,res){
    try {
        const {userId} = req.body;

        if(!userId){
           return res.send(error(400, "userId is required"));
        }
        const posts = await postModel.find({'owner':userId}).populate('likes');
        if(posts.length<1){
            return res.send(error(404,"No post available yet"));
        }
        return res.send(success(200,posts));
    } catch (e) {
        return res.send(error(500,e.message));
    }
}

export async function getMyInfo(req,res){
    try {
        const userId = req._id;
        const user = await userModel.findById(userId);
        return res.send(success(200,{user}));
    } catch (e) {
        return res.send(error(500,e.message));
    }
}


export async function updateUserProfile(req,res){
try {
        const {name,bio,userImg} = req.body;
    const user = await userModel.findById(req._id);
    if(name){
        user.name = name;
    }
    if(bio){
        user.bio = bio;
    }
    if(userImg){
        console.log("about to upload image");
        const cloudImg = await cloudinary.uploader.upload(userImg,{
            folder:'/profileImg'
        })
          
        user.avatar = {
            url: cloudImg.secure_url,
            publicId: cloudImg.public_id
        }
    }
    await user.save();
    return res.send(success(200,{user}));

 } catch (e) {
   return res.send(error(500,e.message));
    }
}

export async function getUserProfile(req,res){
    try {
        const userId = req.body.userId;
        const user = await userModel.findById(userId).populate({
            path:"posts",
            populate:{
                path:'owner'
            }
        });

        const fullPosts = user.posts;
        const posts = fullPosts.map(item=>mapPostOutput(item , req._id)).reverse();
        return res.send(success(200,{...user._doc,posts}));
    } catch (e) {
        return res.send(error(500,e.message));
    }
}
