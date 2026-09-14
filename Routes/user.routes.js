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

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

/**
 * @swagger
 * /users/getMe:
 *   get:
 *     summary: Get the logged-in user's own profile
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Profile retrieved
 */

router.get("/getMe", auth, getLoggedUser, getUserByID);

/**
 * @swagger
 * /users/updateUserPassword:
 *   put:
 *     summary: Change the logged-in user's password
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201:
 *         description: Password changed
 */

router.put(
  "/updateUserPassword",
  auth,
  getLoggedUser,
  changeUserValidator,
  updatePasswordLoggedUser,
);

/**
 * @swagger
 * /users/updateUserData:
 *   put:
 *     summary: Update the logged-in user's data
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201:
 *         description: Data updated
 */

router.put(
  "/updateUserData",
  auth,
  updateLoggedUserDataValidator,
  updateDataLoggedUser,
);

/**
 * @swagger
 * /users/deleteUser:
 *   delete:
 *     summary: Soft-delete the logged-in user (deactivate)
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201:
 *         description: Account deactivated
 */

router.delete("/deleteUser", auth, deleteUserData);

/**
 * @swagger
 * /users/changePassword/{id}:
 *   put:
 *     summary: Change a user's password (admin)
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       201:
 *         description: Password changed
 */

router.put("/changePassword/:id", auth, allowedTo("admin"), changeUserValidator, changePassword);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a user (admin)
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               phone: { type: string }
 *               password: { type: string }
 *               confirmPassword: { type: string }
 *               imgProfile: { type: string, format: binary }
 *               role: { type: string, enum: [user, admin] }
 *     responses:
 *       201:
 *         description: User created
 *   get:
 *     summary: Get all users (admin)
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Users retrieved
 */

router
  .route("/")
  .post(auth, allowedTo("admin"), uploadUserImages, resizeUserImage, createUserValidator, createUser)
  .get(auth, allowedTo("admin"), getUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID (admin)
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: User retrieved
 *   put:
 *     summary: Update a user (admin)
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       201:
 *         description: User updated
 *   delete:
 *     summary: Delete a user (admin, soft delete)
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       201:
 *         description: User deleted
 */

router
  .route("/:id")
  .get(auth, allowedTo("admin"), getUserByIDValidator, getUserByID)
  .put(auth, allowedTo("admin"), uploadUserImages, resizeUserImage, updateUserValidator, updateUser)
  .delete(auth, allowedTo("admin"), deleteUserValidator, deleteUser);

export default router;