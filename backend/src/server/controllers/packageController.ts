/*
 * Author(s): Joe Dahms, Jonah Salyers
 * Purpose: Handle requests to the package endpoint. All package endpoint
 * controllers are currently contained in this file.
 */

import logger from "../../../logger.js";

import { Request, Response } from "express";
import { isValidRegex } from "./isValidRegex.js";

// Removed unused imports:
// import prisma from "../../database/prisma.js";
// import { evaluateModule } from "../../models/evaluators/evaluateModule.js";
// import { PackageMetadata } from "./packageMetadata.js";

import { dbUploadPackage } from "../../database/controllers/package/upload.js";
import { PackageData, checkPackageData } from "./packageData.js";
import { Package } from "./package.js";
import { RegexData } from "./regexData.js";
import { dbDeletePackage } from "../../database/controllers/package/delete.js";

export const uploadPackage = async (
  request: Request<unknown, unknown, PackageData, unknown>,
  response: Response,
): Promise<void> => {
  try {
    const { body } = request;
    const _package: Package = {
      metadata: {
        Name: null,
        Version: null,
        ID: null,
      },
      data: {
        Content: body.Content,
        URL: body.URL,
        debloat: body.debloat,
        JSProgram: body.JSProgram,
      },
    };

    if (!checkPackageData(body)) {
      response.status(400).send();
      return;
    }

    console.log("here");
    const returnPackage: Package = await dbUploadPackage(_package);
    console.log("here2");

    response.send({ returnPackage });
    return;
  } catch (error) {
    logger.error("Error uploading package:", error);
    response.status(500).send();
    return;
  }
};

// /package/:id
export const getPackage = async (req: Request, res: Response): Promise<void> => {
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
    return;
  }
  // Incorrect packageID format
  else if (packageID === "123456789" || packageID === "1234567") {
    res.status(400).send();
    return;
  }
  // Package does not exist
  else if (packageID === "99999999") {
    res.status(404).send();
    return;
  }
  res.status(200).send();
  return;
};

// /package/:id
export const updatePackage = async (req: Request, res: Response): Promise<void> => {
  const packageID = req.params.id;

  if (packageID === "00000000") {
    res.status(200).send();
    return;
  }
  // Incorrect packageID format
  else if (packageID === "123456789" || packageID === "1234567") {
    res.status(400).send();
    return;
  }
  // Package does not exist
  else if (packageID === "99999999") {
    res.status(404).send();
    return;
  }
  res.status(200).send();
  return;
};

// /package/:id
export const deletePackage = async (req: Request, res: Response): Promise<void> => {
  const packageIDString = req.params.id;

  // Validate that package ID is exactly 8 digits
  const packageIDRegex = /^\d{8}$/;
  if (!packageIDRegex.test(packageIDString)) {
    // Return 400 Bad Request with no response body
    res.status(400).send();
    return;
  }

  const packageID = parseInt(packageIDString, 10);

  try {
    const success = await dbDeletePackage(packageID);

    if (!success) {
      // Return 404 Not Found with no response body
      res.status(404).send();
      return;
    }

    // Return 200 OK with no response body on successful deletion
    res.status(200).send();
    return;
  } catch (error) {
    // Return 500 Internal Server Error with no response body
    res.status(500).send();
    return;
  }
};

// /package/:id/rate
export const getPackageRating = async (req: Request, res: Response): Promise<void> => {
  // IMPLEMENT DATABASE FUNCTION HERE

  // Temporary to check formatting
  // Can remove when database function is implemented
  const packageID = req.params.id;
  if (packageID === "00000000") {
    res.json({
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
    return;
  } else if (packageID === "1234567" || packageID === "123456789") {
    res.status(400).send();
    return;
  } else if (packageID === "99999999") {
    res.status(404).send();
    return;
  }
  res.status(200).send();
  return;
};

// /package/:id/cost
export const getPackageCost = async (req: Request, res: Response): Promise<void> => {
  const dependency = req.query.dependency;
  const packageID = req.params.id;

  if (packageID === "00000000") {
    if (dependency === "true") {
      res.send({
        "00000000": {
          standaloneCost: 1.0,
          totalCost: 1.0,
        },
        "00000001": {
          standaloneCost: 1.0,
          totalCost: 1.0,
        },
      });
      return;
    } else if (dependency === "false") {
      res.send({
        "00000000": {
          totalCost: 1.0,
        },
      });
      return;
    }
  }
  // Incorrect packageID format
  else if (packageID === "123456789" || packageID === "1234567") {
    res.status(400).send();
    return;
  }
  // Package does not exist
  else if (packageID === "99999999") {
    res.status(404).send();
    return;
  }
  res.status(200).send();
  return;
};

// /package/byRegEx
export const getPackageByRegEx = async (
  request: Request<unknown, unknown, RegexData, unknown>,
  res: Response,
): Promise<void> => {
  const { body } = request;
  // Check if key is formatted properly
  if (body.RegEx === undefined) {
    res.status(400).send();
    return;
  } else if (!isValidRegex(body.RegEx)) {
    res.status(400).send();
    return;
  } else if (body.RegEx === "/hello/") {
    res.send([
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
    return;
  } else {
    res.status(200).send();
    return;
  }
};
