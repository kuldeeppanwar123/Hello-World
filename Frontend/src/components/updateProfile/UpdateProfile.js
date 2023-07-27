import React, { useEffect, useState } from "react";
import "./UpdateProfile.scss";
import { useDispatch, useSelector } from "react-redux";
import { updateMyProfile } from "../../redux/slices/AppConfigureSlice";
import dummyUser from '../../assets/user.jpg'

export default function UpdateProfile() {
  const myProfile = useSelector(state=>state.appconfigReducer.myProfile);
  const [name,setName] = useState('');
  const[bio , setBio] = useState('');
  const[userImg, setUserImg] = useState('');
  const dispatch = useDispatch();

  useEffect(()=>{
    setName(myProfile?.name || '');
    setBio(myProfile?.bio || '');
    setUserImg(myProfile?.avatar?.url || '')
  },[myProfile])


  function handleImageChange(e){
        // console.log(e);
        const file = e.target.files[0];
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload=()=>{
          if(fileReader.readyState===fileReader.DONE){
            setUserImg(fileReader.result);
            console.log('image is set');
            console.log(fileReader.result);
          }
        }
  }

  function handleSubmit(e){
    e.preventDefault();
    dispatch(updateMyProfile({name,bio,userImg}));
  }

  return (
    <div className="UpdateProfile">
      <div className="container">
        <div className="left-part">
          {/* <img src={userImg} alt="" className="user-img" /> */}
          <div className="input-user-img">
            <label htmlFor="inputImg" className="labelImg">
              <img src={userImg?userImg:myProfile} alt={name}  />
            </label>
            <input type="file" name="" id="inputImg" className="inputImg" accept="image/*" onChange={handleImageChange}/>
          </div>
        </div>
        <div className="right-part">
            <form action="" onSubmit={handleSubmit}>
              <input value={name} type="text" placeholder="Enter Your Name" onChange={(e)=>{setName(e.target.value)}} />
              <input value={bio} type="text" placeholder="Enter Your Bio"  onChange={(e)=>{setBio(e.target.value)}}/>
              <input type="submit" value="Submit" className="btn-primary"/>
           </form>
          <button className="delete-account btn-primary">Delete Account</button>
        </div>
      </div>
    </div>
  );
}
