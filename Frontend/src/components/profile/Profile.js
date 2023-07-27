import React, { useEffect, useState } from 'react';
import Post from '../post/Post';
import './Profile.scss';
import { useNavigate, useParams } from 'react-router-dom';
import CreatePost from '../createPost/CreatePost';
import { useDispatch, useSelector } from 'react-redux';
import { getUserProfile } from '../../redux/slices/PostSlice';
import { followAndUnfollow } from '../../redux/slices/FeedSlice';

export default function Profile() {
  const[isMyProfile,setIsMyProfile] = useState(false);
  const navigate = useNavigate();
  const params = useParams();
  const userProfile = useSelector(state=>state.postReducer.userProfile);
  const feedData  = useSelector((state)=>{return state.feedDataReducer.feedData});
  const myProfile = useSelector((state)=>{return state.appconfigReducer.myProfile});
  const dispatch = useDispatch();
  const [isFollowing , setIsFollowing] = useState(false);

  useEffect(()=>{
    dispatch(getUserProfile({
      userId: params.userId
    }));
    console.log('use effect is called');
    console.log('feedData: ',feedData);
    console.log("userProfile :",userProfile);
    console.log("myProfile : ",myProfile);
    setIsMyProfile(myProfile?._id === params.userId);
    setIsFollowing(feedData?.followings?.find(item=>item._id === params.userId));
  },[myProfile,params.userId]);
  
  function handleFollowUnfollowClick(){
    dispatch(followAndUnfollow({"userIdTofollow":params.userId}));
    // console.log('clicked : ',feedData);
  }
  return (
    <div className='Profile'>
      <div className="container">
        <div className="left-part">
          {isMyProfile&&<CreatePost/>}
          {userProfile?.posts?.map(post=><Post key={post._id} post={post}/>)}
        </div>  
        <div className="right-part">
          <div className="profile-card">
            <img src={userProfile?.avatar?.url} alt="" className='user-img'/>
            <p className='bio'>{userProfile?.bio}</p>
            <h3 className='user-name'>{userProfile?.name}</h3>
            <div className="follower-info">
              <h4>{`${userProfile?.followers?.length} Followers`}</h4>
              <h4>{`${userProfile?.followings?.length} Following`}</h4>
            </div>
            {!isMyProfile&& <h5 style={{marginTop:"10px"}} className={isFollowing?"hover-link follow-link":"btn-primary"} onClick={handleFollowUnfollowClick}>{isFollowing?'Unfollow':'Follow'}</h5>}
            {isMyProfile&& <button className='update-profile btn-secondary' onClick={()=>{navigate("/updateProfile")}}>Update Profile</button>}
          </div>
        </div>
      </div>      
    </div>
  )
}


// 1.5