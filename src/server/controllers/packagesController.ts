/*
 * Author(s): Joe Dahms
 * Purpose: Handle incoming requests to the /packages endpoint
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

export const getPackages = (req: Request<unknown, unknown, Package[], Query>, res: Response): void => {
  const requestBody = req.body;
  //console.log(JSON.stringify(reqBody));
  const offset = req.query.offset;

  let validRequest: boolean = true;
  let validFormat: boolean = true;
  const maxPackages = 2;
  let validNumPackages: boolean = true;

  const numPackages = requestBody.length;

  // Check if request body format is valid
  if (Array.isArray(requestBody) && numPackages > 0) {
    for (let requestedPackage of requestBody) {
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

  // Send a response
  if (validRequest) {
    // INSERT DATABASE QUERY FUNCTION HERE
    for (let requestedPackage of requestBody) {
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
