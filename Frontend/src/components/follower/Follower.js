import React, { useEffect, useState } from 'react'
import Avatar from '../avatar/Avatar'
import './Follower.scss';
import { useDispatch, useSelector } from 'react-redux';
import { followAndUnfollow } from '../../redux/slices/FeedSlice';
import { useNavigate } from 'react-router-dom';

export default function Follower({user}) {
  const dispatch = useDispatch();
  const feedData = useSelector(state=>state.feedDataReducer.feedData);
  const [isFollowing,setIsFollowing] = useState();
  const navigate = useNavigate();

  useEffect(()=>{
        setIsFollowing(feedData.followings.find(item=>item._id === user._id));
        console.log(user.name);
  },[feedData]);

  const handleClick = (e)=>{
    dispatch(followAndUnfollow({"userIdTofollow":user._id}));
  }
  return (
    <div className='Follower'>
        <div className="user-info" onClick={()=>navigate(`profile/${user._id}`)}>
          <Avatar src={user?.avatar?.url}/>
          <h4 className='name'>{user?.name}</h4>
        </div>
      <h5 className={isFollowing?"hover-link follow-link":"btn-primary"} onClick={handleClick}>{isFollowing?'Unfollow':'Follow'}</h5>
    </div>
  )
}