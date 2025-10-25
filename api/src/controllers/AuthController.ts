import { Router } from "express";
import {
  FirebaseAuthRepositoryImpl,
  FirebaseUserRepositoryImpl,
} from "../repositories/index.js";
import { AuthServiceImpl } from "../services/index.js";
import { validateTokenPresence, verifyToken } from "../utils/auth.js";

const userRepository = new FirebaseUserRepositoryImpl();
const authRepository = new FirebaseAuthRepositoryImpl();
const authService = new AuthServiceImpl(userRepository, authRepository);

export const authRouter = Router();

authRouter.post("/signup/:email", async (req, res) => {
  const email = req.params.email;
  const { name, password } = req.body;

  const user = await authService.signup({ email, name, password });

  res.status(201).json({
    accessToken: user.accessToken,
    refreshToken: user.refreshToken,
    email: user.email,
    displayName: user.displayName,
  });
});

authRouter.post("/login/:email", async (req, res) => {
  const email = req.params.email;
  const { name, password } = req.body;

  const user = await authService.login({ email, name, password });

  res.status(200).json({
    accessToken: user.accessToken,
    refreshToken: user.refreshToken,
    email: user.email,
    displayName: user.displayName,
  });
});

authRouter.post("/verify", validateTokenPresence, async (req, res) => {
  const token: string = req.headers.authorization?.split(" ")[1]!!;

  const result = await authService.verifyToken(token);

  res.status(200).json(result);
});

authRouter.post("/refresh", validateTokenPresence, async (req, res) => {
  const { refreshToken } = req.body;

  const result = await authService.refreshAccessToken({ refreshToken });

  res.status(200).json(result);
});

authRouter.post("/logout", validateTokenPresence, async (req, res) => {
  const token: string = req.headers.authorization?.split(" ")[1]!!;
  const decoded = verifyToken(token) as { email: string };

  await authService.logout(decoded.email);

  res.status(200).json({ message: "Logged out successfully" });
});

/**
 * @swagger
 * /api/auth/signup/{email}:
 *   post:
 *     summary: Sign up a new user
 *     description: Creates a new user account and returns a token.
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: The email of the user to sign up
 *         example:
 *           nuevo@mail.com
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *           example:
 *             name: "John Doe"
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: JWT access token (expires in 15 minutes)
 *                 refreshToken:
 *                   type: string
 *                   description: JWT refresh token (expires in 7 days)
 *                 email:
 *                   type: string
 *                 displayName:
 *                   type: string
 *             example:
 *               accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImpvaG4uZG9lQGV4YW1wbGUuY29tIiwidHlwZSI6ImFjY2VzcyJ9"
 *               refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImpvaG4uZG9lQGV4YW1wbGUuY29tIiwidHlwZSI6InJlZnJlc2gifQ"
 *               email: "john.doe@example.com"
 *               displayName: "John Doe"
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 *
 * /api/auth/login/{email}:
 *   post:
 *     summary: Log in a user
 *     description: Authenticates a user and returns a token.
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: The email of the user to log in
 *     responses:
 *       200:
 *         description: User authenticated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: JWT access token (expires in 15 minutes)
 *                 refreshToken:
 *                   type: string
 *                   description: JWT refresh token (expires in 7 days)
 *                 email:
 *                   type: string
 *                 displayName:
 *                   type: string
 *             example:
 *               accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImpvaG4uZG9lQGV4YW1wbGUuY29tIiwidHlwZSI6ImFjY2VzcyJ9"
 *               refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImpvaG4uZG9lQGV4YW1wbGUuY29tIiwidHlwZSI6InJlZnJlc2gifQ"
 *               email: "john.doe@example.com"
 *               displayName: "John Doe"
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 *
 * /api/auth/verify:
 *   post:
 *     summary: Verify if an access token is valid
 *     description: Validates an access token and returns user information if valid.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token verification result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 valid:
 *                   type: boolean
 *                   description: Whether the token is valid
 *                 email:
 *                   type: string
 *                   description: User email (only if valid)
 *                 displayName:
 *                   type: string
 *                   description: User display name (only if valid)
 *             examples:
 *               valid:
 *                 value:
 *                   valid: true
 *                   email: "john.doe@example.com"
 *                   displayName: "John Doe"
 *               invalid:
 *                 value:
 *                   valid: false
 *       401:
 *         description: No token provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 valid:
 *                   type: boolean
 *                 message:
 *                   type: string
 *             example:
 *               valid: false
 *               message: "No token provided"
 *
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     description: Generates a new access token using a valid refresh token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: The refresh token received during login/signup
 *             required:
 *               - refreshToken
 *           example:
 *             refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImpvaG4uZG9lQGV4YW1wbGUuY29tIiwidHlwZSI6InJlZnJlc2gifQ"
 *     responses:
 *       200:
 *         description: New access token generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: New JWT access token (expires in 15 minutes)
 *             example:
 *               accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImpvaG4uZG9lQGV4YW1wbGUuY29tIiwidHlwZSI6ImFjY2VzcyJ9"
 *       401:
 *         description: Invalid or missing refresh token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "No refresh token provided"
 *       500:
 *         description: Internal server error
 *
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     description: Invalidates the user's refresh token, forcing them to login again.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: "Logged out successfully"
 *       401:
 *         description: Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             examples:
 *               noToken:
 *                 value:
 *                   message: "No token provided"
 *               invalidToken:
 *                 value:
 *                   message: "Invalid or expired token"
 */
