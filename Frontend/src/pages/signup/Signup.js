import React, { useState } from 'react'
import './Signup.scss';
import { Link } from 'react-router-dom';
import { axiosClient } from '../../utils/axiosClient';

export default function Signup() {
    const[name,setName] = useState();
    const[email,setEmail] = useState();
    const[password,setPassword]=useState();

    const handleSubmit =async(e)=>{
        e.preventDefault();
        try {
            const result = await axiosClient.post("/auth/signup",{
                name,
                email,
                password
            });
            console.log(result);
        } catch (error) {
            
        }
    }

    return (
        <>
        <div className="Signup">
            <div className="Signup-box">
                <h2 className='heading'>Signup</h2>
                <form action="" onSubmit={handleSubmit}>
                    <label htmlFor='email'>Name</label>
                    <input type="text" name="name" id="name" onChange={(e)=>setName(e.target.value)}/>
    
                    <label htmlFor='email'>Email</label>
                    <input type="text" name="email" id="email" onChange={(e)=>setEmail(e.target.value)}/>
    
                    <label htmlFor='password'>Password</label>
                    <input type="text" name="password" id="password" onChange={(e)=>setPassword(e.target.value)} />
    
                    <input type="submit" value="submit" />
                </form>
                <p className='subheading'>Already have an account?<Link to="/login" className='link'>Login</Link> </p>
            </div>
        </div> 
        </>
      )
}
