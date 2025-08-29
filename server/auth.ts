import type { RequestHandler } from "express";
import { storage } from "./storage";

// Role-based authentication middleware
export const requireRole = (allowedRoles: string[]): RequestHandler => {
  return async (req: any, res, next) => {
    try {
      if (!req.isAuthenticated || !req.isAuthenticated()) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const userId = req.user?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ message: "Invalid authentication" });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      const userRole = user.role || "student";
      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({ 
          message: "Insufficient permissions", 
          required: allowedRoles,
          current: userRole 
        });
      }

      // Add user role to request for use in handlers
      req.userRole = userRole;
      req.userData = user;
      next();
    } catch (error) {
      console.error("Role authentication error:", error);
      res.status(500).json({ message: "Authentication error" });
    }
  };
};

// Convenience middleware for specific roles
export const requireAdmin = requireRole(["admin"]);
export const requireInstructor = requireRole(["instructor", "admin"]);
export const requireInstructorOrAdmin = requireRole(["instructor", "admin"]);