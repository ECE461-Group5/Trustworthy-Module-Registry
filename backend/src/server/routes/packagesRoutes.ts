/**
 * @filename - packagesRoutes.ts
 * @author(s) - Joe Dahms, Logan Pelkey
 * @purpose - Set up the routes for the packages endpoint. See controllers for request handling logic.
 */

import express, { Request, Response, NextFunction, Router } from "express";
import { getPackages } from "../controllers/packagesController.js";

const router: Router = express.Router();

// Async handler to catch errors and forward them to the Express error handler
const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
): ((req: Request, res: Response, next: NextFunction) => void) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch(next);
  };
};

router.post("/", asyncHandler(getPackages));

export default router;
