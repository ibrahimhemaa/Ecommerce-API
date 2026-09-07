import Router from "express";
import { signup, login, verifyResetCode , forgetPassword , resetPassword } from '../Controller/auth.controller.js'
 import { signupValidator , loginValidator } from "../validators/user.validators.js";
 const router = Router();


router.post("/signup",  signupValidator , signup);



router.post("/login", loginValidator,  login);

router.post("/forgetPassword",forgetPassword);

router.post("/verifyPassword",verifyResetCode);

router.post("/resetPassword",resetPassword);

export default router;