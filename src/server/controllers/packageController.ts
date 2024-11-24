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

  /*
  if (_package.metadata.ID != undefined) {
    const foundPackage = await prisma.package.findUnique({
      where: {
        id: _package.metadata.ID,
      },
    });

    if (foundPackage != null) {
      const returnVal: Package = {
        metadata: {
          Name: foundPackage.name,
          Version: foundPackage.version,
          ID: foundPackage.id,
        },
        data: {
          Content: foundPackage.content,
          URL: foundPackage.url,
          debloat: foundPackage.debloat,
          JSProgram: foundPackage.jsProgram,
        },
      };

      console.log(returnVal);
      return returnVal;
    }
  }
*/

  const test: Package = {
    metadata: {
      Name: null,
      Version: null,
      ID: newPackage.id,
    },
    data: {
      Content: null,
      URL: null,
      debloat: null,
      JSProgram: null,
    },
  };
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
  console.log(existingPackage);

  const newPackage = await prisma.package.create({
    data: {
      Name: "test",
      Version: "test",
      ID: "test",
      Content: "test",
      URL: "test",
      debloat: "test",
      JSProgram: "test",
    }, 
  });
  
  // Calculate metrics using evaluateModule function
  if (newPackage.URL != "") {
    const evaluationResult = await evaluateModule(newPackage.URL);
    const metrics = JSON.parse(evaluationResult);

    // Save metrics to the database
    await prisma.packageRating.create({
      data: {
        packageId: newPackage.id,
        rampUp: metrics.RampUp,
        correctness: metrics.Correctness,
        busFactor: metrics.BusFactor,
        responsiveMaintainer: metrics.ResponsiveMaintainer,
        licenseScore: metrics.License,
        netScore: metrics.NetScore,
        // Include latency metrics if available
        rampUpLatency: metrics.RampUp_Latency,
        correctnessLatency: metrics.Correctness_Latency,
        busFactorLatency: metrics.BusFactor_Latency,
        responsiveMaintainerLatency: metrics.ResponsiveMaintainer_Latency,
        licenseScoreLatency: metrics.License_Latency,
        netScoreLatency: metrics.NetScore_Latency,
      },
    });
  }

  const
*/
};

export const uploadPackage = async (
  request: Request<unknown, unknown, PackageData, unknown>,
  response: Response,
): Promise<void | Response> => {
  //  try {
  const { body } = request;
  console.log(body);
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
  /*
  if (checkPackageData(body) === false) {
    return response.status(400).json({ error: "Invalid package data." });
  }
  */
  const returnPackage: Package = await dbUploadPackage(_package);

  return response.status(400).json({ error: "Invalid package data." });
  /*

    // Check if the package already exists
    const existingPackage = await prisma.package.findFirst({
      where: {
        name: metadata.Name,
        version: metadata.Version,
      },
    });

    if (existingPackage) {
      return response.status(409).json({ error: "Package already exists." });
    }
    */

  /*
    // Save package to the database
    const newPackage = await prisma.package.create({
      data: {
        name: metadata.Name,
        version: metadata.Version,
        content: data.Content ? Buffer.from(data.Content, "base64") : null,
        url: data.URL,
        debloat: data.debloat || false,
        jsProgram: data.JSProgram,
      },
    });
    */

  /*
    // Calculate metrics using evaluateModule function
    if (newPackage.url) {
      const evaluationResult = await evaluateModule(newPackage.url);
      const metrics = JSON.parse(evaluationResult);

      // Save metrics to the database
      await prisma.packageRating.create({
        data: {
          packageId: newPackage.id,
          rampUp: metrics.RampUp,
          correctness: metrics.Correctness,
          busFactor: metrics.BusFactor,
          responsiveMaintainer: metrics.ResponsiveMaintainer,
          licenseScore: metrics.License,
          netScore: metrics.NetScore,
          // Include latency metrics if available
          rampUpLatency: metrics.RampUp_Latency,
          correctnessLatency: metrics.Correctness_Latency,
          busFactorLatency: metrics.BusFactor_Latency,
          responsiveMaintainerLatency: metrics.ResponsiveMaintainer_Latency,
          licenseScoreLatency: metrics.License_Latency,
          netScoreLatency: metrics.NetScore_Latency,
        },
      });
    }
    */

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
