import mongoose from "mongoose";

const postSchema = mongoose.Schema({
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'user',
        required: true
    },
    image:{
        publicId: String,
        url :String
    },
    caption:{
        type:String,
        required:true
    },
    likes:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'user'
        }
    ]
},{
    timestamps:true
})

const postModel = mongoose.model('post',postSchema);
export default postModel;