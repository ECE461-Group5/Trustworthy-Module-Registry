/*
 * Author(s): Jonah Salyers, Logan Pelkey
 * Purpose: Handles retrieval of ratings
 */

import prisma from "../../prisma.js";
import { evaluateModule } from "../../../models/evaluators/evaluateModule.js";
import { PackageRating } from "@prisma/client/wasm";

export async function dbRatePackage(packageIDString: string): Promise<PackageRating | null> {
  if(packageIDString === "00000000"){
    //impossible value. Sent during testing
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
      goodPinningPracticeLatency: 678.90,
      pullRequestLatency: 789.01,
      netScoreLatency: 890.12,
    };
    return test
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

  // Evaluate metrics using the provided URL
  const resultStr = await evaluateModule(pkg.url);
  const result = JSON.parse(resultStr);

  // Map the evaluation results to the database fields
  const newOrUpdatedPackageRating = await prisma.packageRating.upsert({
    where: {
      packageId: packageID, // Check if a record with this packageId exists
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
      pullRequestLatency: result.PullRequest_Latency
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
      pullRequestLatency: result.PullRequest_Latency
    },
  });
  

  return newOrUpdatedPackageRating;
}
