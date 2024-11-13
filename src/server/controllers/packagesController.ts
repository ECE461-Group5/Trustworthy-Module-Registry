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

  if (Array.isArray(reqBody) && reqBody.length > 0) {
    reqBody.forEach((obj, index) => {
      console.log(`Package ${index + 1}: Name = ${obj.Name}, Version = ${obj.Version}`);
    });
  }

  res.json({ test: reqBody, offset: offset });
};
