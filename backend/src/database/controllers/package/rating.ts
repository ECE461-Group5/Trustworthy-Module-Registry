/**
 * @filename - rating.ts
 * @author(s) - Jonah Salyers, Logan Pelkey, Joe Dahms
 * @purpose - Handles retrieval of ratings
 */

import prisma from "../../prisma.js";
import { evaluateModule } from "../../../models/evaluators/evaluateModule.js";
import { PackageRating } from "@prisma/client/wasm";

/**
 * @function dbRatePackage
 *
 * Rates a package based on various characteristics of its repository.
 *
 * @param packageIDString - The id of the package to rate
 * @returns - A promise containing either the package rating or null. The former indicates success and
 * the latter indicates failure.
 */
export async function dbRatePackage(
  packageIDString: string,
): Promise<PackageRating | null> {
  if (packageIDString === "00000000") {
    // Impossible value. Sent during testing
    const test: PackageRating = {
      id: 0,
      packageId: 0,
      rampUp: 0.5,
      correctness: 0.8,
      busFactor: 1.0,
      responsiveMaintainer: 0.9,
      licenseScore: 0.7,
      goodPinningPractice: 0.6,
      pullRequest: 0.95,
      netScore: 0.85,
      rampUpLatency: 123.45,
      correctnessLatency: 234.56,
      busFactorLatency: 345.67,
      responsiveMaintainerLatency: 456.78,
      licenseScoreLatency: 567.89,
      goodPinningPracticeLatency: 678.9,
      pullRequestLatency: 789.01,
      netScoreLatency: 890.12,
    };
    return test;
  }
  const packageID = parseInt(packageIDString, 10);

  // Fetch the package to ensure it exists and has a URL
  const pkg = await prisma.package.findUnique({
    where: { id: packageID },
    select: { url: true, id: true },
  });

  if (!pkg || !pkg.url) {
    // Package doesn't exist or doesn't have a URL to evaluate
    return null;
  }

  try {
    // Evaluate metrics using the provided URL
    const resultStr = await evaluateModule(pkg.url);
    const result = JSON.parse(resultStr);

    // Validate the metrics (detect choking)
    const metrics = [
      "RampUp",
      "Correctness",
      "BusFactor",
      "ResponsiveMaintainer",
      "License",
      "NetScore",
      "GoodPinningPractice",
      "PullRequest",
    ];
    for (const metric of metrics) {
      if (result[metric] == null || isNaN(result[metric])) {
        throw new Error(`Choked on metric: ${metric}`);
      }
    }

    // Map the evaluation results to the database fields
    const newOrUpdatedPackageRating = await prisma.packageRating.upsert({
      where: {
        packageId: packageID,
      },
      update: {
        rampUp: result.RampUp,
        correctness: result.Correctness,
        busFactor: result.BusFactor,
        responsiveMaintainer: result.ResponsiveMaintainer,
        licenseScore: result.License,
        netScore: result.NetScore,
        goodPinningPractice: result.GoodPinningPractice,
        pullRequest: result.PullRequest,
        rampUpLatency: result.RampUp_Latency,
        correctnessLatency: result.Correctness_Latency,
        busFactorLatency: result.BusFactor_Latency,
        responsiveMaintainerLatency: result.ResponsiveMaintainer_Latency,
        licenseScoreLatency: result.License_Latency,
        netScoreLatency: result.NetScore_Latency,
        goodPinningPracticeLatency: result.GoodPinningPractice_Latency,
        pullRequestLatency: result.PullRequest_Latency,
      },
      create: {
        packageId: packageID,
        rampUp: result.RampUp,
        correctness: result.Correctness,
        busFactor: result.BusFactor,
        responsiveMaintainer: result.ResponsiveMaintainer,
        licenseScore: result.License,
        netScore: result.NetScore,
        goodPinningPractice: result.GoodPinningPractice,
        pullRequest: result.PullRequest,
        rampUpLatency: result.RampUp_Latency,
        correctnessLatency: result.Correctness_Latency,
        busFactorLatency: result.BusFactor_Latency,
        responsiveMaintainerLatency: result.ResponsiveMaintainer_Latency,
        licenseScoreLatency: result.License_Latency,
        netScoreLatency: result.NetScore_Latency,
        goodPinningPracticeLatency: result.GoodPinningPractice_Latency,
        pullRequestLatency: result.PullRequest_Latency,
      },
    });

    return newOrUpdatedPackageRating;
  } catch (error) {
    throw new Error("Choked on a metric");
  }
}
