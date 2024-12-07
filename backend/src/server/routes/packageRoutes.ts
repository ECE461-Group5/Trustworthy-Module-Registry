/**
 * @filename - packageRoutes.ts
 * @author(s) - Joe Dahms, Jonah Salyers
 * @purpose - Set up the routes for the package endpoint. See controllers
 * for request handling logic.
 */

import express, { Request, Response, NextFunction, RequestHandler } from "express";
const router = express.Router();

import {
  uploadPackage,
  getPackage,
  updatePackage,
  deletePackage,
  getPackageRating,
  getPackageCost,
  getPackageByRegEx,
} from "../controllers/packageController.js";

// Define a type for async request handlers
type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void>;

const asyncHandler = (fn: AsyncRequestHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

router.post("/", asyncHandler(uploadPackage));
router.get("/:id", asyncHandler(getPackage));
router.put("/:id", asyncHandler(updatePackage));
router.delete("/:id", asyncHandler(deletePackage));
router.get("/:id/rate", asyncHandler(getPackageRating));
router.get("/:id/cost", asyncHandler(getPackageCost));
router.post("/byRegEx", asyncHandler(getPackageByRegEx));
export default router;
