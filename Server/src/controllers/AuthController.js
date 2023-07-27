import userModel from "../models/User.js";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";
import "dotenv/config.js";
import { error, success } from "../utils/responseWrapper.js";
import {StatusCodes}from "http-status-codes";

const ACCESS_SECRET_KEY = process.env.ACCESS_TOKEN_SECRET_KEY;
const REFRESH_SECRET_KEY = process.env.REFRESH_TOKEN_SECRET_KEY;


export async function signupController(req, res) {
  try {
    const { email, password,name } = req.body;
    if (!email || !password || !name) {
      return res.send(error(StatusCodes.BAD_REQUEST,"All fields are required!"));
    }

    const oldUser = await userModel.findOne({ email });
    if(oldUser) 
    return res.status(400).send(error(StatusCodes.BAD_REQUEST, "User already registered!"));

    const hashedPassword = await bcrypt.hash(password, 10);
    req.body["password"] = hashedPassword;
    const user = await userModel.create(req.body);

    const newuser = await userModel.findById(user._id);

    return res.send(success(201 , newuser));
  } catch (e) {
    return res.send(error(500, e.message));
  }
}

export async function loginController(req, res) {
  try {
    
    const { email, password } = req.body;
    if (!email || !password)
    return res.status(StatusCodes.BAD_REQUEST).send(error(StatusCodes.BAD_REQUEST,"all fields are required!"));
   
    const user = await userModel.findOne({ email }).select("+password");

    if (!user) 
    return res.status(StatusCodes.NOT_FOUND).send(error(StatusCodes.NOT_FOUND ,"user is not registered!"))

    const matched = await bcrypt.compare(password, user.password);
    if (!matched) return res.status(StatusCodes.NOT_FOUND).send(error(StatusCodes.NOT_FOUND , "incorrect password"));

    const accessToken = generateAccessToken({
      email: user.email,
      _id: user._id,
    });
    const refreshToken = generateRefreshToken({
      email: user.email,
      _id: user._id,
    });

    res.cookie('jwt',refreshToken);

    return res.send(success(StatusCodes.OK, accessToken));    

  } catch (e) {
    console.log(e);
    return res.send(error(StatusCodes.INTERNAL_SERVER_ERROR , e.message));
  }
}

export async function logoutController(req,res){
  try {
    res.clearCookie('jwt');
    return res.send(success(200,'user logged out'));
  } catch (e) {
    return res.send(error(500,e.message));
  }
}

export async function refreshAccessTokenController(req, res) {
  try {
     const mycookie = req.cookies;
     console.log('helllo');
    if(!mycookie.jwt){
       return res.send(error(StatusCodes.BAD_REQUEST , "cookies is required!"));
    }

    const refreshToken = mycookie.jwt;
    const decoded = Jwt.verify(refreshToken, REFRESH_SECRET_KEY);
    const { email, id } = decoded;
    const accessToken = generateAccessToken({ email, id });
    return res.send(success(200 , accessToken));
  } 
  catch (e){
    console.log(e.message);
    return res.send(error(404 , "invalid refresh token!"));
  }
}

const generateAccessToken = (data) => {
  try {
    const token = Jwt.sign(data, ACCESS_SECRET_KEY, {
      expiresIn: "1d",
    });
    return token;
  } catch (e) {
    console.log(e.message);
  }
}

const generateRefreshToken = (data) => {
  try {
    const token = Jwt.sign(data, REFRESH_SECRET_KEY, {
      expiresIn: "1d",
    });
    return token;
  } catch (e) {
    console.log(e);
  }
}