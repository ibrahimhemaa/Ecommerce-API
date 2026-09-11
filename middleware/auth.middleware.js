 import userModel from "../models/user.model.js";
import { AppError } from "../utils/errorhandler.js";
import jwt from "jsonwebtoken";
export const auth = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token)
  return next(new AppError(401, 'You Don"t have access go register first !'));
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
 
  if (!decoded) return next(new AppError(402, "invalid Token"));
  const user = await userModel.findById(decoded.userID);
  if (!user) return next(new AppError(401, "user not Found "));
  if(user.changePasswordAt)
  {
     const currentUser = parseInt(user.changePasswordAt.getTime() / 1000 , 10) ; 
      if(currentUser > decoded.iat)
        return next(new AppError(401 ,'User Changed Password go Login Again !'))
  }

  if(!user.isActive) 
    {
      return next(new AppError(401 , `Go Register First ! `))
    }
  req.userid= decoded.userID;
  req.role = decoded.role
  next();
};
