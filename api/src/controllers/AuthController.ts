import { Router } from 'express';

export const authRouter = Router();

authRouter.post('/signup', (req, res) => {
  // Handle user signup
  res.status(201).json({ message: 'User signed up successfully' });
});

authRouter.post('/login', (req, res) => {
  // Handle user login
  res.status(200).json({ message: 'User logged in successfully' });
});
