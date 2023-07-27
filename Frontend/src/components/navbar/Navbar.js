// import React, { useRef, useState } from 'react'
import './Navbar.scss';
import Avatar from '../avatar/Avatar';
import { useNavigate } from 'react-router-dom';
import { AiOutlineLogout } from 'react-icons/ai';
// import LoadingBar from 'react-top-loading-bar'
import { useDispatch, useSelector } from 'react-redux';
import { axiosClient } from '../../utils/axiosClient';
import { KEY_ACCESS_TOKEN, removeItem } from '../../utils/localStorageManager';

export default function Navbar() {
    // const [loading,setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const myProfile = useSelector(state=>state.appconfigReducer.myProfile);
  
   async function handleLogOutClicked(){
        try {
            await axiosClient.post('/auth/logout');
            removeItem(KEY_ACCESS_TOKEN);
            navigate('/login');
        } catch (error) {
            console.log(error.message);
        }
        
        
    }
    
  return (
    <div className='Navbar'>
        <div className='container'>
            <h2 className='banner hover-link' onClick={()=>{navigate("/")}}>Social Media</h2>
            <div className='right-side'>
                <div className='profile hover-link' onClick={()=>{navigate(`/profile/${myProfile._id}`)}}>
                    <Avatar src={myProfile?.avatar?.url}/>
                </div>
                <div className="logout hover-link" onClick={handleLogOutClicked}>
                    <AiOutlineLogout/>
                </div>
            </div>
        </div>
    </div>
  )
}
