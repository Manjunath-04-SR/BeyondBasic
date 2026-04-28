import jwt from "jsonwebtoken";
import User from "../models/user.model.ts";

export const optionalAuth = async (req: any, _res: any, next: any) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "secret");
      req.user = await User.findById(decoded.id);
    }
  } catch {}
  next();
};
