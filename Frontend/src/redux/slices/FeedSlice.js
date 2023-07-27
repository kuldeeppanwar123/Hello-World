import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import { axiosClient } from "../../utils/axiosClient";
import { likeAndUnlikePost } from "./PostSlice";

export const getFeedData = createAsyncThunk("user/getUserProfile", async()=>{
    try {
        const Response = await axiosClient.get('/user/getFeedData');
        // console.log("feed data ",Response);
        return Response.result;
    } catch (error) {
        return Promise.reject(error);
    }
})

export const followAndUnfollow = createAsyncThunk("/user/followAndUnfollow", async(body)=>{
    try {
        console.log('body : ',body);
        const Response = await axiosClient.post("/user/follow",body);
        return Response.result.user;
    } catch (error) {
        return Promise.reject(error);
    }
})


const feedSlice = createSlice({
    name:'feedSlice',
    initialState:{
        feedData:{}
    },
    extraReducers:(builder)=>{
            builder.addCase(getFeedData.fulfilled,(state,action)=>{
                // console.log("this is user profile ",state.userProfile);
                state.feedData = action.payload;
                console.log('feed data is : ',state.feedData);
            })
            .addCase(likeAndUnlikePost.fulfilled,(state,action)=>{
                const post = action.payload;
                // console.log("post : ",post);
                const index = state.feedData.posts.findIndex(item=>item._id === post._id);
                if(index !== -1){
                    state.feedData.posts[index] = post;
                }
            })
            .addCase(followAndUnfollow.fulfilled, (state, action)=>{
                const user = action.payload;
                const index = state?.feedData?.followings.findIndex((item)=>{return item._id === user._id});
                
                if(index!==-1){
                    console.log("user unfollowed");
                    state.feedData.followings.splice(index , 1);
                }
                else{
                    console.log('user followed');
                    state.feedData.followings.push(user._id);
                }
               
                // console.log("feedSlice : ",state.feedData);
            })
    }
})

export default feedSlice.reducer;