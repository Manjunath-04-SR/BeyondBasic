import type { Response, NextFunction } from "express";

export const restrictTo =
  (...roles: string[]) =>
  (req: any, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: insufficient permissions" });
    }
    next();
  };

// Alias for backwards compatibility
export const authorize = restrictTo;
