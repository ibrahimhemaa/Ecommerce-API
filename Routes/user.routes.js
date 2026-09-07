import Router from "express";
import {
  createUser,
  deleteUser,
  getUsers,
  getUserByID,
  updateUser,
  uploadUserImages,
  resizeUserImage,
  changePassword,
  updateDataLoggedUser,
} from "../Controller/user.controller.js";

import {
  createUserValidator,
  updateUserValidator,
  getUserByIDValidator,
  deleteUserValidator,
  changeUserValidator,
  updateLoggedUserDataValidator,
} from "../validators/user.validators.js";

import {
  getLoggedUser,
  updatePasswordLoggedUser,
  deleteUserData
} from "../Controller/user.controller.js";
import { allowedTo } from "../middleware/roles.middleware.js";
import { auth } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/getMe", auth, getLoggedUser, getUserByID);



router.put(
  "/updateUserPassword",
  auth,
  getLoggedUser,
  changeUserValidator,
  updatePasswordLoggedUser,
);

router.put(
  "/updateUserData",
  auth,
  updateLoggedUserDataValidator,
  updateDataLoggedUser,
);


router.delete("/deleteUser", auth, deleteUserData);


router.put("/changePassword/:id", auth, allowedTo("admin"), changeUserValidator, changePassword);


router
  .route("/")
  .post(auth, allowedTo("admin"), uploadUserImages, resizeUserImage, createUserValidator, createUser)
  .get(auth, allowedTo("admin"), getUsers);

router
  .route("/:id")
  .get(auth, allowedTo("admin"), getUserByIDValidator, getUserByID)
  .put(auth, allowedTo("admin"), uploadUserImages, resizeUserImage, updateUserValidator, updateUser)
  .delete(auth, allowedTo("admin"), deleteUserValidator, deleteUser);

export default router;