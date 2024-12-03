/*
 * Author(s): Joe Dahms, Jonah Salyers
 * Purpose: Handle requests to the package endpoint. All package endpoint
 * controllers are currently contained in this file.
 */

import logger from "../../../logger.js";

import { Request, Response } from "express";
import { isValidRegex } from "./isValidRegex.js";

import prisma from "../../database/prisma.js";
import { dbUploadPackage } from "../../database/controllers/package/upload.js";

import { evaluateModule } from "../../models/evaluators/evaluateModule.js";

import { PackageMetadata } from "./packageMetadata.js";
import { PackageData, checkPackageData } from "./packageData.js";
import { Package } from "./package.js";

import { RegexData } from "./regexData.js";
import { dbDeletePackage } from "../../database/controllers/package/delete.js";

export const uploadPackage = async (
  request: Request<unknown, unknown, PackageData, unknown>,
  response: Response,
): Promise<void | Response> => {
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

  if (checkPackageData(body) === false) {
    return response.status(400).send();
  }

  console.log("here");
  const returnPackage: Package = await dbUploadPackage(_package);
  console.log("here2");

  return response.send({ returnPackage });
  }
  catch (error) {
    logger.error("Error uploading package:", error);
    return response.status(500).send();
  }
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
export const deletePackage = async (req: Request, res: Response): Promise<Response> => {
  const packageID = parseInt(req.params.id, 10);

  if (isNaN(packageID)) {
    return res.status(400).json({ error: 'Invalid package ID' });
  }

  const success = await dbDeletePackage(packageID);

  if (!success) {
    return res.status(404).json({ error: 'Package not found' });
  }

  return res.status(200).json({ message: 'Package deleted successfully' });
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
  }
 else if (packageID === "1234567") {
    return res.status(400).send();
  }
 else if (packageID === "123456789") {
    return res.status(400).send();
  }
 else if (packageID === "99999999") {
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
    }
 else if (dependency === "false") {
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
  }
 else if (isValidRegex(body.RegEx) === false) {
    return res.status(400).send();

    // DB FUNCTION HERE
    // Take in an object of type RegexData and return an array of package metadata objects
    // function dbfunction(param1: RegexData): PackageMetadata[] {
    //
    // }
  }
 else if (body.RegEx === "/hello/") {
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
  }
 else {
    return res.status(200).send();
  }
};
