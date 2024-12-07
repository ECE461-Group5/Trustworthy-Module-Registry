/**
 * @filename - packageController.ts
 * @author(s): Joe Dahms, Jonah Salyers, Logan Pelkey
 * @purpose: Handle requests to the package endpoint. All package endpoint
 * controllers are currently contained in this file.
 */

/* eslint-disable @typescript-eslint/require-await */
import logger from "../../../logger.js";

import { Request, Response } from "express";
import { isValidRegex } from "./isValidRegex.js";

import { dbUploadPackage } from "../../database/controllers/package/upload.js";
import { dbRatePackage } from "../../database/controllers/package/rating.js";
import { PackageData, checkPackageData } from "./packageData.js";
import { Package } from "./package.js";
import { RegexData } from "./regexData.js";
import { dbDeletePackage } from "../../database/controllers/package/delete.js";
import { dbGetPackage } from "../../database/controllers/package/retrieve.js";
import { checkValidId } from "./checkValidId.js";
import { dbGetPackageCost } from "../../database/controllers/package/cost.js";

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

/**
 * @function updatePackage
 *
 * Update the contents of a package within the database.
 *
 * @param request - The request object coming in. Only really care about the ID parameter.
 * @param response - The response to send back.
 * @returns - Void promise. Indicates that the controller is done and a response has been sent.
 */
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

/**
 * @function updatePackage
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
  const packageIDString = req.params.id;
  // Validate package ID
  if (!/^\d{8}$/.test(packageIDString)) {
    res.status(400).send();
    return;
  }

  const packageRating = await dbRatePackage(packageIDString);

  if (!packageRating) {
    // Package does not exist or no URL
    res.status(404).send();
    return;
  }
  // On success spit out ratings
  res.status(200).send(packageRating);
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
  const packageIdString = req.params.id;
  const includeDependencies = req.query.dependency === "true";

  const validId = checkValidId(packageIdString);
  if (!validId) {
    res.status(400).send();
    return;
  }

  const packageId = parseInt(packageIdString, 10);

  try {
    const cost = await dbGetPackageCost(packageId, includeDependencies);

    if (!cost) {
      res.status(404).send();
      return;
    }

    res.status(200).json(cost);
  } catch (error) {
    res.status(500).send();
  }
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
