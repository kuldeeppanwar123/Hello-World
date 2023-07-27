import React, { useState } from 'react';
import './CreatePost.scss';
import Avatar from '../avatar/Avatar';
import { BsCardImage } from 'react-icons/bs';
import { axiosClient } from '../../utils/axiosClient';
import { useDispatch, useSelector } from 'react-redux';
import { getUserProfile } from '../../redux/slices/PostSlice';
import { useParams } from 'react-router-dom';
import { updateMyProfile } from '../../redux/slices/AppConfigureSlice';


export default function CreatePost() {
  const myProfile = useSelector((state)=>{return state.appconfigReducer.myProfile})
  const params = useParams();
  const [postImg,setPostImg] = useState('');
  const [caption , setCaption] = useState('');
  const dispatch = useDispatch();
  
  const handleImageChange = (e)=>{
    const file = e.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload=()=>{
      if(fileReader.readyState===fileReader.DONE){
        setPostImg(fileReader.result);
      }
    }
  }

  const handlePostSubmit = async()=>{
   try {
        const result = await axiosClient.post("/post",{
        caption,
        postImg
    });
    console.log('Post Done',result);
    dispatch(getUserProfile({userId: params.userId}));
   } catch (error) {
    console.log(error);
   }finally{
    setCaption('');
    setPostImg('');
   }
  }
  return (
    <div className='CreatePost'>
      <div className="left-part">
        <Avatar src={myProfile?.avatar?.url} />
      </div>
      <div className="right-part">
        <input value={caption} type="text" className='captionInput' placeholder="What's going on you life!" onChange={(e)=>{setCaption(e.target.value)}}/>
        {postImg&&
        <div className="img-container">
          <img className='post-img' src={postImg} alt="postImage" />
        </div>
        }

        <div className="bottom-part">
          <div className="input-post-img">
          <label htmlFor="inputImg" className="labelImg">
             <BsCardImage/>
            </label>
            <input type="file" name="" id="inputImg" className="inputImg" accept="image/*" onChange={handleImageChange}/>
          </div>
          <button className='post-btn btn-primary' onClick={handlePostSubmit}>Post</button>
        </div>
      </div>
    </div>
  )
}
// 1.24