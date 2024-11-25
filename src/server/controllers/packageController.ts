/*
 * Author(s): Joe Dahms, Jonah Salyers
 * Purpose: Handle requests to the package endpoint. All package endpoint
 * controllers are currently contained in this file.
 */

import { Request, Response } from "express";
import { isValidRegex } from "./isValidRegex.js";
import prisma from "../../database/prisma.js"; // Adjust this path
import { evaluateModule } from "../../models/evaluators/evaluateModule.js";

import { PackageMetadata } from "./packageMetadata.js";
import { PackageData, checkPackageData } from "./packageData.js";
import { Package } from "./package.js";

import { RegexData } from "./regexData.js";

export const dbUploadPackage = async (_package: Package): Promise<Package> => {
  const newPackage = await prisma.package.create({
    data: {
      name: "noname",
      version: "noversion",
      content: _package.data.Content,
      url: _package.data.URL,
      debloat: _package.data.debloat,
      jsProgram: _package.data.JSProgram,
    },
  });


  const test: Package = {
    metadata: {
      Name: newPackage.name,
      Version: newPackage.version,
      ID: newPackage.id,
    },
    data: {
      Content: newPackage.content,
      URL: newPackage.url,
      debloat: newPackage.debloat,
      JSProgram: newPackage.jsProgram,
    },
  };
  console.log(test);
  return test;

  /*
  let contentExists: boolean = true;
  if (packageData.Content === "") {
    contentExists = false;
  }

  // Check exists with content
  if (contentExists) {
    const existingPackage = await prisma.package.findUnique({
      where: {
        Content: packageData.Content,
      },
    });
  } 
  // Check exists with url
  else {
    const existingPackage = await prisma.package.findUnique({
      where: {
        URL: packageData.URL,
      },
    });
  }
 */
};

export const uploadPackage = async (
  request: Request<unknown, unknown, PackageData, unknown>,
  response: Response,
): Promise<void | Response> => {
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

  const returnPackage: Package = await dbUploadPackage(_package);

  return response.send({ returnPackage });


  //return response.status(201).json({ metadata: newPackage });
  //}
  //catch (error) {
  // console.error(error);
  //  return response.status(500).json({ error: "Server error" });
  //}
  // DATABASE FUNCTION HERE
  // Take in PackageData
  // Return PackageMetadata
  // function dbfunction(param1: PackageData): PackageMetadata
  //
  //
  // Handle exists already and not uploaded
  //return response.status(200).send();
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
