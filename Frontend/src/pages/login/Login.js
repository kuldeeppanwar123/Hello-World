import React, { useState } from 'react';
import './Login.scss';
import { Link, useNavigate } from 'react-router-dom';
import {axiosClient} from '../../utils/axiosClient';
import { KEY_ACCESS_TOKEN, setItem } from '../../utils/localStorageManager';

export default function Login() {
    const [email,setEmail] = useState();
    const [password , setPassword] = useState();
    const navigate = useNavigate();

     const  handleSubmit = async(e)=>{
        try {
            e.preventDefault();
            const response = await axiosClient.post('/auth/login/',{
            email,
            password
        })
        //    console.log('login : ',response);
            setItem(response.result);
            navigate('/');

        } catch (error) {
            console.log(error);
        }
    }


  return (
    <>
    <div className="Login">
        <div className="login-box">
            <h2 className='heading'>Login</h2>
            <form action="" onSubmit={handleSubmit}>
                <label htmlFor='email'>Email</label>
                <input type="text" name="email" id="email" onChange={(e)=>setEmail(e.target.value)}/>

                <label htmlFor='password'>Password</label>
                <input type="password" name="password" id="password" onChange={(e)=>setPassword(e.target.value)}/>

                <input type="submit" value="submit" />
            </form>
            <p className='subheading'>Don't have an account?<Link to="/signup" className='link'>Signup</Link> </p>
        </div>
    </div>
      
    </>
  )
}
