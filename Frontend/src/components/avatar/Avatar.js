import React from 'react'
import userImg from '../../assets/user.jpg';
import './Avatar.scss';

export default function Avatar({src}) {
  return (
    <div className='Avatar hover-link'>
      <img src={src?src:userImg} alt="user avatar"/>
    </div>
  )
}
