import express from 'express';
const router = express.Router();

import { resetRegistry } from "../controllers/resetController.js";

router.delete("/", resetRegistry);

export default router;
