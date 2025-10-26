import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { StringValue } from "ms";
import { Constants, UnauthorizedException } from "./index.js";

export const withAuth = (req: Request, res: Response, next: Function) => {
  const [bearer, token] = req.headers.authorization?.split(" ") || [];

  if (!token || bearer !== "Bearer") {
    return next(new UnauthorizedException("No token provided"));
  }

  jwt.verify(token, Constants.JWT_SECRET, (err, decoded) => {
    if (err) throw new UnauthorizedException("Failed to authenticate token");
    res.locals.context = decoded;
    next();
  });
};

export const validateTokenPresence = (req: Request, res: Response, next: Function) => {
  const [bearer, token] = req.headers.authorization?.split(" ") || [];

  if (!token || bearer !== "Bearer") {
    return next(new UnauthorizedException("No token provided"));
  }
  
  next();
};

export const generateToken = (
  payload: Record<string, string | boolean | number>,
  expiration: StringValue,
): string => {
  return jwt.sign(payload, Constants.JWT_SECRET, { expiresIn: expiration });
};

export const verifyToken = (
  token: string,
): Record<string, string | boolean | number> => {
  try {
    return jwt.verify(token, Constants.JWT_SECRET) as Record<
      string,
      string | boolean | number
    >;
  } catch (error: any) {
    throw new UnauthorizedException("Invalid token");
  }
};
