import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import { axiosClient } from "../../utils/axiosClient";

// export const getMyInfo = createAsyncThunk("user/getMyInfo", async(_, thunkAPI)=>{
//     try {
//         thunkAPI.dispatch(setLoading(true));
//         const Response = await axiosClient.get('/user/getMyInfo');
//         return Response.result;
//     } catch (error) {
//         return Promise.reject(error);
//     }finally{
//         thunkAPI.dispatch(setLoading(false));
//     }
// })

export const getMyInfo = createAsyncThunk("user/getMyInfo", async()=>{
    try {
        const Response = await axiosClient.get('/user/getMyInfo');
        return Response.result;
    } catch (error) {
        return Promise.reject(error);
    }
})

export const updateMyProfile = createAsyncThunk("user/",async(body)=>{
    try {
        console.log('updateprofile api is about to called!');
        const Response = await axiosClient.put('/user/',body);
        console.log('updateprofile api called!',Response.result);
        return Response.result;
    } catch (error) {
        console.log("error message is : "+error.message);
        return Promise.reject(error);
    }
})

const appConfigSlice = createSlice({
    name:'appConfigSlice',
    initialState:{
        isLoading:false,
        toastData:{},
        myProfile:{}
    },
    reducers:{
        setLoading:(state,action)=>{
            state.isLoading = action.payload;
        },
        showToast:(state,action)=>{
            state.toastData = action.payload;
        }
      },
    extraReducers:(builder)=>{
            builder.addCase(getMyInfo.fulfilled,(state,action)=>{
                state.myProfile = action.payload.user;
            })
            .addCase(updateMyProfile.fulfilled,(state,action)=>{
                console.log('extra reducer is called!');
                state.myProfile = action.payload.user;
            })
    }
})

export default appConfigSlice.reducer;
export const {setLoading,showToast} = appConfigSlice.actions;

