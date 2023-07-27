import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import { axiosClient } from "../../utils/axiosClient";
import { setLoading } from "./AppConfigureSlice";

export const getUserProfile = createAsyncThunk("user/getUserProfile", async(body)=>{
    try {
        const Response = await axiosClient.post('/user/getUserProfile' , body);
        // console.log("user profile ",Response);
        return Response.result;
    } catch (error) {
        return Promise.reject(error);
    }
})

export const likeAndUnlikePost = createAsyncThunk("/post/likeAndUnlike", async(body)=>{
    try {
        const Response = await axiosClient.post("/post/like",body);
        // console.log("like and unlike reducer : ",Response.result.post);
        return Response.result.post;
    } catch (error) {
        return Promise.reject(error);
    }
} )


const postSlice = createSlice({
    name:'postSlice',
    initialState:{
        userProfile:{}
    },
    extraReducers:(builder)=>{
            builder.addCase(getUserProfile.fulfilled,(state,action)=>{
                state.userProfile = action.payload;
                // console.log("user profile in post slice : ",state.userProfile);
            })
            .addCase(likeAndUnlikePost.fulfilled,(state,action)=>{
                const post = action.payload;
                // console.log("post : ",post);
                const index = state.userProfile.posts.findIndex(item=>item._id === post._id);
                if(index !== -1){
                    state.userProfile.posts[index] = post;
                }
            })
    }
})

export default postSlice.reducer;

// 1.32