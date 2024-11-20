/*
 * Author(s): Joe Dahms
 * Purpose: Handle incoming requests to the /reset endpoint
*/

import { Request, Response } from "express";

export const resetRegistry = (req: Request, res: Response): void => {
  // INSERT DATABASE RESET FUNCTION HERE
  res.status(200).send();
};
