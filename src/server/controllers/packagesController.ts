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

export const getPackages = (req: Request<{},{}, Package[], Query>, res: Response): void => {
  const requestBody = req.body;
  //console.log(JSON.stringify(reqBody));
  const offset = req.query.offset;

  // Check if request body is valid
  var validBody: boolean = true;
  // Array of packages and non zero length
  if (Array.isArray(requestBody) && requestBody.length > 0) {
    for (var requestedPackage of requestBody) {
      if (requestedPackage.Name === undefined || requestedPackage.Version === undefined) {
        validBody = false;
        break;
      }
    }
  }
  else {
    validBody = false;
  }

  // Send a response
  if (validBody) {
    // INSERT DATABASE QUERY FUNCTION HERE

    for (var requestedPackage of requestBody) {
      requestedPackage.ID = "dummyid";
    }
    res.json(requestBody);
  }
  else {
    res.status(400).send();
  }
};
