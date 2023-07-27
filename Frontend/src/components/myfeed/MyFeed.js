import React, { useEffect } from 'react';
import './MyFeed.scss'
import Post from '../post/Post';
import Follower from '../follower/Follower';
import { useDispatch, useSelector } from 'react-redux';
import { getFeedData } from '../../redux/slices/FeedSlice';

export default function MyFeed() {
  const dispatch = useDispatch();
  const feedData = useSelector(state=>state.feedDataReducer.feedData)

  useEffect(()=>{
    dispatch(getFeedData());
    console.log('feed data : ',feedData);
  },[dispatch])

  
  return (
    <div className='Feed'>
        <div className="container">
            <div className="left-part">
              {feedData?.posts?.map(post=> <Post key={post._id} post={post}/>)}
            </div>
            <div className="right-part">
                <div className="following">
                    <h3 className='title'>You are following</h3>
                    {feedData?.followings?.map(user=> <Follower key={user._id} user={user}/>)}
                </div>
                <div className="suggestions">
                    <h3 className='title'>Suggests for you</h3>
                    {feedData?.suggestions?.map(user=> <Follower key={user._id} user={user}/>)}
                </div>
            </div>
        </div>       
    </div>
  )
}