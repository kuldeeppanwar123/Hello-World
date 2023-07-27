import jwt from "jsonwebtoken";
import "dotenv/config";
import { error, success } from "../utils/responseWrapper.js";
import { StatusCodes } from "http-status-codes";
import userModel from "../models/User.js";

const SECRET_KEY = process.env.ACCESS_TOKEN_SECRET_KEY;

export async function checkUser(req, res, next) {
  try {
    if (!req.headers?.authorization?.startsWith("Bearer")) {
      res
        .status(401)
        .send(
          error(StatusCodes.NOT_FOUND, "authorization header is required!")
        );
    }

    const accessToken = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(accessToken, SECRET_KEY);
    req._id = decoded._id;
    const user = await userModel.findById(req._id);
    if(!user){
      return res.send(error(404,"user not found"));
    }
    next();
  } 
  catch (e) {
    console.log(e);
    return res.send(error(StatusCodes.UNAUTHORIZED, e.message));
  }
}
