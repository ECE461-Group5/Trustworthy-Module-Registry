/**
 * @filename - resetRoutes.ts
 * @author(s) - Joe Dahms, Logan Pelkey
 * @purpose - Set up the routes for the reset endpoint. See controllers
 * for request handling logic.
 */

import express from "express";
import { resetRegistry } from "../controllers/resetController.js";

const router = express.Router();

// Wrap async route handlers to handle errors properly
const asyncHandler = (fn: (...args: any[]) => Promise<void>) => (req: any, res: any, next: any) =>
  Promise.resolve(fn(req, res, next)).catch(next);

router.delete("/", asyncHandler(resetRegistry));

export default router;