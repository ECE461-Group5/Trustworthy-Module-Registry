import express from 'express';
const router = express.Router();

import { 
  uploadPackage,
  getPackage,
  updatePackage,
  deletePackage,
  getPackageRating,
  getPackageCost,
} from "../controllers/packageController.js";

router.post("/", uploadPackage);

router.get("/:id", getPackage);
router.put("/:id", updatePackage);
router.delete("/:id", deletePackage);

router.get("/:id/rate", getPackageRating);

router.get("/:id/cost", getPackageCost);

export default router;
