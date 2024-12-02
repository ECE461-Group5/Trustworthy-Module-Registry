/*
 * Author(s): Joe Dahms
 * Purpose: Set up the routes for the reset endpoint. See controllers
 * for request handling logic.
 */
import express from "express";
import { resetRegistry } from "../controllers/resetController.js";
const router = express.Router();
router.delete("/", resetRegistry);
export default router;
//# sourceMappingURL=resetRoutes.js.map