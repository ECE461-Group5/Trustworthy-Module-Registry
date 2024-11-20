import { Request, Response } from "express";
import { isValidRegex } from "isValidRegex.ts";

// /package
export const uploadPackage = /*async*/ (req: Request, res: Response): void => {
  res.json({ message: "NOT IMPLEMENTED: upload package" });
};

// /package/:id
export const getPackage = /*async*/ (req: Request, res: Response): void => {
  const packageID = req.params.id;

  if (packageID === "00000000") {
    res.json(
      {
        "metadata": {
          "Name": "<string>",
          "Version": "<string>",
          "ID": "00000000",
        },
        "data": {
          "Content": "<string>",
          "URL": "<string>",
          "debloat": "<boolean>",
          "JSProgram": "<string>",
        },
      },
    );
  }
  // Incorrect packageID format
  else if (packageID === "123456789" || packageID === "1234567") {
    res.status(400).send();
  }
  // Package does not exist
  else if (packageID === "99999999") {
    res.status(404).send();
  }
};

// /package/:id
export const updatePackage = /*async*/ (req: Request, res: Response): void => {
  res.json({ message: "NOT IMPLEMENTED: update package" });
};

// /package/:id
export const deletePackage = /*async*/ (req: Request, res: Response): void => {
  res.json({ message: "NOT IMPLEMENTED: delete package" });
};

// /package/:id/rate
export const getPackageRating = (req: Request, res: Response): void => {
  // IMPLEMENT DATABASE FUNCTION HERE

  // Temporary to check formatting
  // Can remove when database function is implemented
  const packageID = req.params.id;
  if (packageID === "00000000") {
    res.json(
      { "RampUp": "<double>",
        "Correctness": "<double>",
        "BusFactor": "<double>",
        "ResponsiveMaintainer": "<double>",
        "LicenseScore": "<double>",
        "GoodPinningPractice": "<double>",
        "PullRequest": "<double>",
        "NetScore": "<double>",
        "RampUpLatency": "<double>",
        "CorrectnessLatency": "<double>",
        "BusFactorLatency": "<double>",
        "ResponsiveMaintainerLatency": "<double>",
        "LicenseScoreLatency": "<double>",
        "GoodPinningPracticeLatency": "<double>",
        "PullRequestLatency": "<double>",
        "NetScoreLatency": "<double>",
      },
    );
  } 
  else if (packageID === "1234567") {
    res.status(400).send();
  }
  else if (packageID === "123456789") {
    res.status(400).send();
  }
  else if (packageID === "99999999") {
    res.status(404).send();
  }
};

// /package/:id/cost
export const getPackageCost = /*async*/ (req: Request, res: Response): void => {
  const dependency = req.query.dependency;
  const packageID = req.params.id;

  if (packageID === "00000000") {
    if (dependency === "true") {
      res.send({
        "00000000": {
          "standaloneCost": 1.0,
          "totalCost": 1.0,
        },
        "00000001": {
          "standaloneCost": 1.0,
          "totalCost": 1.0,
        },
      });
    }
    else if (dependency === "false") {
      res.send({
        "00000000": {
          "totalCost": 1.0,
        },
      });
    }
  }
  // Incorrect packageID format
  else if (packageID === "123456789" || packageID === "1234567") {
    res.status(400).send();
  }
  // Package does not exist
  else if (packageID === "99999999") {
    res.status(404).send();
  }
};

// /package/byRegEx
export const getPackageByRegEx = /*async*/ (req: Request, res: Response): Response<any, Record<string, any>> => {
  // Check if key is formatted properly
  if (req.body.RegEx === undefined) {
    return res.status(400).send();
  }
  else if (isValidRegex(req.body.RegEx) === false) {
    return res.status(400).send();
  }
  else if (req.body.RegEx === "/hello/") {
    return res.send(
      [
        {
          "Name": "<string>",
          "Version": "<string>",
          "ID": "Ozc",
        },
        {
          "Name": "<string>",
          "Version": "<string>",
          "ID": "7Dkbwno5XdR",
        },
      ],
    );
  }

  else {
    return res.status(200).send();
  }
};

