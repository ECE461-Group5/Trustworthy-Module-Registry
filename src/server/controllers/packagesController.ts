/*
 * Author(s): Joe Dahms
 * Purpose: Handle incoming requests to the /packages endpoint
*/

import { Request, Response } from "express";

interface MyObj {
  Name: string
  Version: string
}

interface que {
  offset?: string;
}

export const getPackages = (req: Request<{},{}, MyObj[], que>, res: Response): void => {

  const reqBody = req.body;
  const offset = req.query.offset;

  //console.log(JSON.stringify(reqBody));

  var validBody: boolean = true;

  // Array of packages and non zero length
  if (Array.isArray(reqBody) && reqBody.length > 0) {
    for (var obj of reqBody) {
      if (obj.Name === undefined || obj.Version === undefined) {
        res.status(400).send();
        validBody = false;
        break;
      }
      console.log(`Name = ${obj.Name}, Version = ${obj.Version}`);
    }
    if (validBody) {
      res.json({ test: reqBody, offset: offset });
    }
  }
  else {
    res.status(400).send();
  }
};
