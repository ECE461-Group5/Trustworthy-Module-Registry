/*
 * Author(s): Joe Dahms
 * Purpose: Set up the routes for the package endpoint. See controllers
 * for request handling logic.
 */
import express from "express";
const router = express.Router();
import { uploadPackage, getPackage, updatePackage, deletePackage, getPackageRating, getPackageCost, getPackageByRegEx, } from "../controllers/packageController.js";
const asyncHandler = (fn) => (req, res, next) => {
    void (async () => {
        try {
            await fn(req, res, next);
        }
        catch (error) {
            next(error);
        }
    })();
};
router.post("/", asyncHandler(uploadPackage));
router.get("/:id", getPackage);
router.put("/:id", updatePackage);
router.delete("/:id", deletePackage);
router.get("/:id/rate", getPackageRating);
router.get("/:id/cost", getPackageCost);
router.post("/byRegEx", getPackageByRegEx);
export default router;
//# sourceMappingURL=packageRoutes.js.map