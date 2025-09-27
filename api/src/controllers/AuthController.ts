import { Router } from "express";
import { AuthServiceImpl } from "../services/index.js";

const authService = new AuthServiceImpl();

export const authRouter = Router();

authRouter.post("/signup/:email", async (req, res) => {
  const email = req.params.email;
  const { name } = req.body;

  const user = await authService.signup({ email, name });

  res
    .status(201)
    .json({
      token: user.token,
      email: user.email,
      displayName: user.displayName,
    });
});

authRouter.post("/login/:email", async (req, res) => {
  const email = req.params.email;

  const user = await authService.login({ email, name: "" });

  res
    .status(200)
    .json({
      token: user.token,
      email: user.email,
      displayName: user.displayName,
    });
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
 *                 token:
 *                   type: string
 *                 email:
 *                   type: string
 *                 displayName:
 *                   type: string
 *             example:
 *               token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
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
 *                 token:
 *                   type: string
 *                 email:
 *                   type: string
 *                 displayName:
 *                   type: string
 *             example:
 *               token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
 *               email: "john.doe@example.com"
 *               displayName: "John Doe"
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
