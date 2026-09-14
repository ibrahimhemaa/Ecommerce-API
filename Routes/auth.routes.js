import Router from "express";
import { signup, login, verifyResetCode , forgetPassword , resetPassword } from '../Controller/auth.controller.js'
 import { signupValidator , loginValidator } from "../validators/user.validators.js";
 const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication and password reset
 */

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       201:
 *         description: User created, returns token
 */

router.post("/signup",  signupValidator , signup);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Login successful, returns token
 */

router.post("/login", loginValidator,  login);

/**
 * @swagger
 * /auth/forgetPassword:
 *   post:
 *     summary: Send a password reset code by email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *     responses:
 *       200:
 *         description: Reset code sent
 */

router.post("/forgetPassword",forgetPassword);

/**
 * @swagger
 * /auth/verifyPassword:
 *   post:
 *     summary: Verify the reset code
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               resetCode: { type: string }
 *     responses:
 *       200:
 *         description: Code verified
 */

router.post("/verifyPassword",verifyResetCode);

/**
 * @swagger
 * /auth/resetPassword:
 *   post:
 *     summary: Set a new password after verification
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Password reset
 */

router.post("/resetPassword",resetPassword);

export default router;