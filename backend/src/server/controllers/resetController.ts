/**
 * @filename - resetController.ts
 * @author(s) - Joe Dahms, Logan Pelkey
 * @purpose - Handle incoming requests to the /reset endpoint.
 */

import { Request, Response } from "express";
import { dbResetRegistry } from "../../database/controllers/reset.js";
import logger from "../../../logger.js";

/**
 * @function resetRegistry
 *
 * Reset the entire package registry. Remove all packages from the database.
 *
 * @param req - The request object coming in.
 * @param res - The response to send back.
 * @returns - void
 */
export const resetRegistry = async (req: Request, res: Response): Promise<void> => {
  try {
    const success = await dbResetRegistry();

    if (success) {
      res.status(200).send({ message: "Registry reset successfully." });
    } else {
      res.status(403).send({ error: "Failed to reset the registry." });
    }
  } catch (error) {
    logger.error("Error in resetRegistry controller:", error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};
