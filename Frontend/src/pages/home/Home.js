import React, { useEffect } from 'react'
import Navbar from '../../components/navbar/Navbar' 
import { Outlet } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { getMyInfo } from '../../redux/slices/AppConfigureSlice';

export default function Home() {
    const dispatch = useDispatch();
    useEffect(()=>{
      dispatch(getMyInfo());
    },[])
  return (
    <>
      <Navbar/>
      <div className="outlet" style={{marginTop:"60px"}}>
        <Outlet/>
      </div>

    </>
  )
}


// 2.28