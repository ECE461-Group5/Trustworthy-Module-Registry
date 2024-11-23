/*
 * Author(s): Joe Dahms
 * Purpose: Handle requests to the package endpoint. All package endpoint
 * controllers are currently contained in this file.
 */

import { Request, Response } from "express";
import { isValidRegex } from "./isValidRegex.js";
import { PackageData, checkPackageData } from "./packageData.js";
import { PackageMetadata } from "./packageMetadata.ts";
import { regexData } from "./regexData.ts";

// /package
export const uploadPackage = (
  request: Request<unknown, unknown, PackageData, unknown>,
  response: Response,
): Response => {
  const { body } = request;
  if (checkPackageData(body) === false) {
    return response.status(400).send();
  }
  // DATABASE FUNCTION HERE
  // Take in PackageData
  // Return PackageMetadata
  // PackageMetadata commented out for the moment as it is not used
  //
  //
  // Handle exists already and not uploaded
  return response.status(200).send();
};

// /package/:id
export const getPackage = (req: Request, res: Response): Response => {
  const packageID = req.params.id;

  if (packageID === "00000000") {
    res.json({
      metadata: {
        Name: "<string>",
        Version: "<string>",
        ID: "00000000",
      },
      data: {
        Content: "<string>",
        URL: "<string>",
        debloat: "<boolean>",
        JSProgram: "<string>",
      },
    });
  }
  // Incorrect packageID format
  else if (packageID === "123456789" || packageID === "1234567") {
    return res.status(400).send();
  }
  // Package does not exist
  else if (packageID === "99999999") {
    return res.status(404).send();
  }
  return res.status(200).send();
};

// /package/:id
export const updatePackage = (req: Request, res: Response): Response => {
  const packageID = req.params.id;

  if (packageID === "00000000") {
    return res.status(200).send();
  }
  // Incorrect packageID format
  else if (packageID === "123456789" || packageID === "1234567") {
    return res.status(400).send();
  }
  // Package does not exist
  else if (packageID === "99999999") {
    return res.status(404).send();
  }
  return res.status(200).send();
};

// /package/:id
export const deletePackage = (req: Request, res: Response): Response => {
  const packageID = req.params.id;

  if (packageID === "00000000") {
    return res.status(200).send();
  }
  // Incorrect packageID format
  else if (packageID === "123456789" || packageID === "1234567") {
    return res.status(400).send();
  }
  // Package does not exist
  else if (packageID === "99999999") {
    return res.status(404).send();
  }
  return res.status(200).send();
};

// /package/:id/rate
export const getPackageRating = (req: Request, res: Response): Response => {
  // IMPLEMENT DATABASE FUNCTION HERE

  // Temporary to check formatting
  // Can remove when database function is implemented
  const packageID = req.params.id;
  if (packageID === "00000000") {
    return res.json({
      RampUp: "<double>",
      Correctness: "<double>",
      BusFactor: "<double>",
      ResponsiveMaintainer: "<double>",
      LicenseScore: "<double>",
      GoodPinningPractice: "<double>",
      PullRequest: "<double>",
      NetScore: "<double>",
      RampUpLatency: "<double>",
      CorrectnessLatency: "<double>",
      BusFactorLatency: "<double>",
      ResponsiveMaintainerLatency: "<double>",
      LicenseScoreLatency: "<double>",
      GoodPinningPracticeLatency: "<double>",
      PullRequestLatency: "<double>",
      NetScoreLatency: "<double>",
    });
  } else if (packageID === "1234567") {
    return res.status(400).send();
  } else if (packageID === "123456789") {
    return res.status(400).send();
  } else if (packageID === "99999999") {
    return res.status(404).send();
  }
  return res.status(200).send();
};

// /package/:id/cost
export const getPackageCost = (req: Request, res: Response): Response => {
  const dependency = req.query.dependency;
  const packageID = req.params.id;

  if (packageID === "00000000") {
    if (dependency === "true") {
      return res.send({
        "00000000": {
          standaloneCost: 1.0,
          totalCost: 1.0,
        },
        "00000001": {
          standaloneCost: 1.0,
          totalCost: 1.0,
        },
      });
    } else if (dependency === "false") {
      return res.send({
        "00000000": {
          totalCost: 1.0,
        },
      });
    }
  }
  // Incorrect packageID format
  else if (packageID === "123456789" || packageID === "1234567") {
    return res.status(400).send();
  }
  // Package does not exist
  else if (packageID === "99999999") {
    return res.status(404).send();
  }
  return res.status(200).send();
};

// /package/byRegEx
export const getPackageByRegEx = (
  request: Request<unknown, unknown, RegexData, unknown>,
  res: Response,
): Response => {
  const { body } = request;
  // Check if key is formatted properly
  if (body.RegEx === undefined) {
    return res.status(400).send();
  } else if (isValidRegex(body.RegEx) === false) {
    return res.status(400).send();

    // DB FUNCITON HERE
    // Take in an object of type RegexData and return an array of package metadata objects
  } else if (body.RegEx === "/hello/") {
    return res.send([
      {
        Name: "<string>",
        Version: "<string>",
        ID: "Ozc",
      },
      {
        Name: "<string>",
        Version: "<string>",
        ID: "7Dkbwno5XdR",
      },
    ]);
  } else {
    return res.status(200).send();
  }
};
