import express from 'express';
const router = express.Router();

import { getPackages } from "../controllers/packagesController.js";

router.post("/", getPackages);

export default router;
