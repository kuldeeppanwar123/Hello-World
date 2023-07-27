import express from "express";
import { loginController, logoutController, signupController } from "../controllers/AuthController.js";
import { refreshAccessTokenController } from "../controllers/AuthController.js";
const authRouter = express.Router();

authRouter.post('/signup' , signupController);
authRouter.post('/login' , loginController);
authRouter.post('/logout' , logoutController);
authRouter.get("/refresh", refreshAccessTokenController);

export default authRouter;

