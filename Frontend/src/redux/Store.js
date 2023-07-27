import { configureStore } from '@reduxjs/toolkit'
import appconfigReducer from './slices/AppConfigureSlice'
import postReducer from './slices/PostSlice'
import feedDataReducer from './slices/FeedSlice'
export default configureStore({
    reducer:{
        appconfigReducer,
        postReducer,
        feedDataReducer
    }
})