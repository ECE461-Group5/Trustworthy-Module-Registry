/*
 * Author(s): Jonah Salyers
 * Purpose: Handles retrieval of ratings
 */

import prisma from "../../prisma.js";
import { evaluateModule } from "../../../models/evaluators/evaluateModule.js";

export async function dbRatePackage(packageID: number): Promise<boolean> {
  // Fetch the package to ensure it exists and has a URL
  const pkg = await prisma.package.findUnique({
    where: { id: packageID },
    select: { url: true, id: true },
  });

  if (!pkg || !pkg.url) {
    // Package doesn't exist or doesn't have a URL to evaluate
    return false;
  }

  // Evaluate metrics using the provided URL
  const resultStr = await evaluateModule(pkg.url);
  const result = JSON.parse(resultStr);

  // Map the evaluation results to the database fields
  const ratingData = {
    packageId: packageID,
    rampUp: result.RampUp,
    correctness: result.Correctness,
    busFactor: result.BusFactor,
    responsiveMaintainer: result.ResponsiveMaintainer,
    licenseScore: result.License,
    netScore: result.NetScore,
    rampUpLatency: result.RampUp_Latency,
    correctnessLatency: result.Correctness_Latency,
    busFactorLatency: result.BusFactor_Latency,
    responsiveMaintainerLatency: result.ResponsiveMaintainer_Latency,
    licenseScoreLatency: result.License_Latency,
    netScoreLatency: result.NetScore_Latency,
  };

  // Upsert (update if exists, else create) the package rating
  await prisma.packageRating.upsert({
    where: { packageId: packageID },
    update: ratingData,
    create: ratingData,
  });

  return true;
}
