import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model.ts";

export const protect = async (req: any, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized" });
  }

  const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

  const user = await User.findById(decoded.id);

  if (!user || user.isDeleted || user.isBlocked) {
    return res.status(401).json({ message: "User invalid" });
  }

  req.user = user;
  next();
};
