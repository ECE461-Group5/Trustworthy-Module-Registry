/**
 * @filename - packageController.ts
 * @author(s): Joe Dahms, Jonah Salyers
 * @purpose: Handle requests to the package endpoint. All package endpoint
 * controllers are currently contained in this file.
 */

/* eslint-disable @typescript-eslint/require-await */
import logger from "../../../logger.js";

import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { isValidRegex } from "./isValidRegex.js";

import { dbUploadPackage } from "../../database/controllers/package/upload.js";

import { PackageData, checkPackageData } from "./packageData.js";
import { Package } from "./package.js";
import { RegexData } from "./regexData.js";
import { dbDeletePackage } from "../../database/controllers/package/delete.js";
import { dbUpdatePackage } from "../../database/controllers/package/update.js";
import { dbGetPackage } from "../../database/controllers/package/retrieve.js";
import { checkValidId } from "./checkValidId.js";

/**
 * @function uploadPackage
 *
 * Upload a package to the database.
 *
 * @param request - The request object coming in. Expected to only contain Package data.
 * @param response - The response to send back.
 * @returns - Void promise. Indicates that the controller is done and a response has been sent.
 */
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

    const returnPackage: Package = await dbUploadPackage(_package);

    response.send({ returnPackage });
    return;
  }
 catch (error) {
    logger.error("Error uploading package:", error);
    response.status(500).send();
    return;
  }
};

/**
 * @function getPackage
 *
 * Get a package from the database. Based on ID.
 *
 * @param request - The request object coming in. Only really care about the ID parameter.
 * @param response - The response to send back.
 * @returns - Void promise. Indicates that the controller is done and a response has been sent.
 */
export const getPackage = async (req: Request, res: Response): Promise<void> => {
  const packageIdString = req.params.id;

  const validId: boolean = checkValidId(packageIdString);
  if (!validId) {
    res.status(400).send();
    return;
  }

  const packageId = parseInt(packageIdString, 10);

  try {
    const packageData = await dbGetPackage(packageId);

    if (!packageData) {
      res.status(404).send();
      return;
    }

    res.status(200).json(packageData);
    return;
  }
 catch (error) {
    logger.error("Error retrieving package:", error);
    res.status(500).send();
    return;
  }
};

interface Params {
  id: string;
}

/**
 * @function updatePackage
 *
 * Update the contents of a package within the database.
 *
 * @param request - The request object coming in. Only really care about the ID parameter.
 * @param response - The response to send back.
 * @returns - Void promise. Indicates that the controller is done and a response has been sent.
 */
export const updatePackage = async (
  req: Request<ParamsDictionary, unknown, Package, unknown>,
  res: Response,
): Promise<void> => {
  logger.info("Received a request to update a package");

  const { body } = req;
  const { params } = req;

  const validId: boolean = checkValidId(req.params.id);
  if (!validId) {
    res.status(400).send();
    return;
  }
  const packageId = parseInt(req.params.id, 10);

  try {
    await dbUpdatePackage(packageId, body);

    res.status(200).send();
    return;
  }
 catch (error) {
    logger.error("Error updating package:", error);
    res.status(500).send();
    return;
  }
};

/**
 * @function deletePackage
 *
 * Delete a package from the database based on ID.
 *
 * @param request - The request object coming in. Only really care about the ID parameter.
 * @param response - The response to send back.
 * @returns - Void promise. Indicates that the controller is done and a response has been sent.
 */
export const deletePackage = async (req: Request, res: Response): Promise<void> => {
  const packageIdString = req.params.id;

  const validId: boolean = checkValidId(packageIdString);
  if (!validId) {
    res.status(400).send();
    return;
  }

  const packageId = parseInt(packageIdString, 10);
  try {
    const success = await dbDeletePackage(packageId);

    if (!success) {
      // Return 404 Not Found with no response body
      res.status(404).send();
      return;
    }

    // Return 200 OK with no response body on successful deletion
    res.status(200).send();
    return;
  }
 catch (error) {
    // Return 500 Internal Server Error with no response body
    logger.error("Error deleting package:", error);
    res.status(500).send();
    return;
  }
};

/**
 * @function getPackageRating
 *
 * Get the ratings of a package.
 *
 * @param request - The request object coming in. Only really care about the ID parameter.
 * @param response - The response to send back.
 * @returns - Void promise. Indicates that the controller is done and a response has been sent.
 */
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
  }
 else if (packageID === "1234567" || packageID === "123456789") {
    res.status(400).send();
    return;
  }
 else if (packageID === "99999999") {
    res.status(404).send();
    return;
  }
  res.status(200).send();
  return;
};

/**
 * @function getPackageCost
 *
 * Get the cost of a package.
 *
 * @param request - The request object coming in. Only care about ID parameter and query parameter indicating dependency or not.
 * @param response - The response to send back.
 * @returns - Void promise. Indicates that the controller is done and a response has been sent.
 */
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
    }
 else if (dependency === "false") {
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

/**
 * @function getPackageByRegEx
 *
 * Get a package or packages based on a regular expression.
 *
 * @param request - The request object coming in. Only care about the regular expression contained in the body.
 * @param response - The response to send back.
 * @returns - Void promise. Indicates that the controller is done and a response has been sent.
 */
export const getPackageByRegEx = async (
  request: Request<unknown, unknown, RegexData, unknown>,
  res: Response,
): Promise<void> => {
  const { body } = request;
  // Check if key is formatted properly
  if (body.RegEx === undefined) {
    res.status(400).send();
    return;
  }
 else if (!isValidRegex(body.RegEx)) {
    res.status(400).send();
    return;
  }
 else if (body.RegEx === "/hello/") {
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
  }
 else {
    res.status(200).send();
    return;
  }
};
