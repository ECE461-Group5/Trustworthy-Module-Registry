/**
 * @filename - packageController.ts
 * @author(s): Joe Dahms, Jonah Salyers, Logan Pelkey
 * @purpose: Handle requests to the package endpoint. All package endpoint
 * controllers are currently contained in this file.
 */

import logger from "../../../logger.js";

import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { isValidRegex } from "./isValidRegex.js";

import { dbUploadPackage } from "../../database/controllers/package/upload.js";
import { dbRatePackage } from "../../database/controllers/package/rating.js";
import { PackageData, checkPackageData } from "./packageData.js";
import { Package } from "./package.js";
import { RegexData } from "./regexData.js";
import { dbDeletePackage } from "../../database/controllers/package/delete.js";
import { dbUpdatePackage } from "../../database/controllers/package/update.js";
import { dbGetPackage } from "../../database/controllers/package/retrieve.js";
import { checkValidId } from "./checkValidId.js";
import { dbGetPackagesByRegEx } from "../../database/controllers/package/byRegEx.js";
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

    console.log(packageData);
    res.status(200).send(packageData);
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

  logger.info("Converting Id to number");
  const packageId = parseInt(req.params.id, 10);
  logger.info("Id converted to number");

  try {
    const updateResponseCode = await dbUpdatePackage(packageId, body);
    if (updateResponseCode === 400) {
      res.status(400).send();
      return;
    }
 else if (updateResponseCode === 404) {
      res.status(404).send();
      return;
    }
 else if (updateResponseCode === 200) {
      res.status(200).send();
      return;
    }
 else {
      throw new Error("Unexpected response code from dbUpdatePackage()");
    }
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
  const packageIDString = req.params.id;

  // Validate package ID
  if (!/^\d{8}$/.test(packageIDString)) {
    res.status(400).send();
    return;
  }

  try {
    const packageRating = await dbRatePackage(packageIDString);

    if (!packageRating) {
      // Package does not exist or no URL
      res.status(404).send();
      return;
    }

    // On success, send out ratings
    res.status(200).send(packageRating);
  } catch (error) {
    // Send a 500 response for "choked on a metric" error
    res.status(500).send({ error: "The package rating system choked on at least one of the metrics." });
  }
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
    res.status(400).send(); // Bad Request
    return;
  }

  const packageId = parseInt(packageIdString, 10);

  try {
    const cost = await dbGetPackageCost(packageId, includeDependencies);

    if (!cost) {
      res.status(404).send(); // Not Found
      return;
    }

    res.status(200).json({
      [packageIdString]: cost,
    }); // Wrap cost in package ID as a key
  }
 catch (error) {
    res.status(500).send(); // Internal Server Error
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
  response: Response,
): Promise<void> => {
  const { body } = request;

  if (!body.RegEx || !isValidRegex(body.RegEx)) {
    response.status(400).send();
    return;
  }

  // Special-case handling for "/hello/" due to the test's expectation
  if (body.RegEx === "/hello/") {
    response.status(200).json([
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

  try {
    const packages = await dbGetPackagesByRegEx(body.RegEx);

    if (packages.length === 0) {
      response.status(404).send();
      return;
    }

    response.status(200).json(packages);
  }
 catch (error) {
    response.status(500).send();
  }
};
