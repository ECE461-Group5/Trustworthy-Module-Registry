/**
 * @filename - resetRoutes.ts
 * @author(s) - Joe Dahms, Logan Pelkey
 * @purpose - Set up the routes for the reset endpoint. See controllers
 * for request handling logic.
 */

import express, { Request, Response, NextFunction } from "express";
import { resetRegistry } from "../controllers/resetController.js";

const router = express.Router();

// Wrap async route handlers to handle errors properly
const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
): ((req: Request, res: Response, next: NextFunction) => void) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

router.delete("/", asyncHandler(resetRegistry));

export default router;