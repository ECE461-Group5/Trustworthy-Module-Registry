/**
 * @filename - packagesController.ts
 * @author(s) - Joe Dahms
 * @purpose - Handle incoming requests to the /packages endpoint.
 */

import { Request, Response } from "express";

interface Package {
  Name: string;
  Version: string;
  ID: string;
}

interface Query {
  offset?: string;
}

/**
 * @function getPackages
 *
 * Get multiple packages from the database.
 *
 * @param req- The request object coming in. Expected to only contain an array of packages.
 * @param res- The response to send back.
 * @returns - void
 */
export const getPackages = (
  req: Request<unknown, unknown, Array<Package>, Query>,
  res: Response,
): void => {
  const requestBody = req.body;
  //const offset = req.query.offset;

  let validRequest: boolean = true;
  let validFormat: boolean = true;
  const maxPackages = 2;
  let validNumPackages: boolean = true;

  const numPackages = requestBody.length;

  // Check if request body format is valid
  if (Array.isArray(requestBody) && numPackages > 0) {
    for (const requestedPackage of requestBody) {
      if (requestedPackage.Name === undefined || requestedPackage.Version === undefined) {
        validRequest = false;
        validFormat = false;
        break;
      }
    }
  }
 else {
    validRequest = false;
    validFormat = false;
  }

  if (numPackages > maxPackages) {
    validRequest = false;
    validNumPackages = false;
  }

  // Once request validity has been checked
  if (validRequest) {
    // INSERT DATABASE QUERY FUNCTION HERE
    // databaseFunction(JSON.stringify(requestBody, offset));

    // Dummy id until database function is implemented
    for (const requestedPackage of requestBody) {
      requestedPackage.ID = "dummyid";
    }
    res.json(requestBody);
  }
 else if (!validFormat) {
    res.status(400).send();
  }
 else if (!validNumPackages) {
    res.status(413).send();
  }
};
