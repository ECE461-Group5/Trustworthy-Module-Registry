/**
 * @filename - packagesRoutes.ts
 * @author(s) - Joe Dahms
 * @purpose - Set up the routes for the packages endpoint. See controllers
 * for request handling logic.
 */

import express from "express";
import { getPackages } from "../controllers/packagesController.js";

const router = express.Router();
router.post("/", getPackages);

export default router;
