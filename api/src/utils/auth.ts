import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Constants, UnauthorizedException } from "./index.js";

export const withAuth = (req: Request, res: Response, next: Function) => {
  const [ bearer, token ] = req.headers.authorization?.split(' ') || [];

  if (!token || bearer !== 'Bearer') {
    return next(new UnauthorizedException('No token provided'));
  }

  jwt.verify(token, Constants.JWT_SECRET, (err, decoded) => {
    if (err) throw new UnauthorizedException('Failed to authenticate token');
    res.locals.context = decoded;
    next();
  });
}
