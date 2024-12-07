/**
 * @filename - resetController.ts
 * @author(s) - Joe Dahms
 * @purpose - Handle incoming requests to the /reset endpoint.
 */

import { Request, Response } from "express";

/**
 * @function getPackages
 *
 * Reset the entire package registry. Remove all packages from the database.
 *
 * @param req- The request object coming in.
 * @param res- The response to send back.
 * @returns - void
 */
export const resetRegistry = (req: Request, res: Response): void => {
  // INSERT DATABASE RESET FUNCTION HERE
  res.status(200).send();
};
