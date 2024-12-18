/**
 * @filename - cost.ts
 * @author(s) - Jonah Salyers, Logan Pelkey, Joe Dahms
 * @purpose - Calculates and Returns various package costs
 */

import prisma from "../../prisma.js";
import { Octokit } from "@octokit/rest";
import { getNpmRepoURL } from "../../../models/evaluators/createScorecard.js";
import { get } from "https"; // Import the built-in HTTPS module

export interface PackageCost {
  standaloneCost: number; // Cost in MB
  totalCost: number; // Cost in MB
}

/**
 * @function dbGetPackageCost
 *
 * Get package cost in MB, including dependencies if specified.
 *
 * @param packageId - ID of the package to get the cost of
 * @param includeDependencies - Whether or not to include dependencies of the package in
 * the cost calculation
 * @returns - A promise containing either the cost of the package or null. Cost of the
 * package means the calculation was successful. null indicates some error.
 */
export const dbGetPackageCost = async (
  packageId: number,
  includeDependencies: boolean,
): Promise<PackageCost | null> => {
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

  // Fetch package details
  const packageData = await prisma.package.findUnique({
    where: { id: packageId },
    select: { content: true, id: true, url: true },
  });

  if (!packageData || !packageData.content) {
    return null;
  }

  // Calculate standalone cost (size of the package content in MB)
  const standaloneCost = Buffer.byteLength(packageData.content) / (1024 * 1024); // Convert bytes to MB

  if (!includeDependencies) {
    return { standaloneCost: standaloneCost, totalCost: standaloneCost };
  }

  // Fetch dependencies
  let dependencies = null;
  let url = packageData.url ?? "defaultURL";
  if (packageData.url !== null && packageData.url.includes("npmjs.com")) {
    url = await getNpmRepoURL(url);
  }
  const owner = url.split("/")[3].trim() ?? "defaultOwnerName";
  const repo =
    url
      .split("/")[4]
      ?.trim()
      ?.replace(/\.git$/, "") ?? "defaultRepoName";

  const response = await octokit.repos.getContent({
    owner,
    repo,
    path: "package.json",
  });

  if (response.data && "content" in response.data) {
    const packageContent = Buffer.from(response.data.content, "base64").toString();
    dependencies = JSON.parse(packageContent).dependencies;
  }
 else {
    dependencies = null;
  }

  if (!dependencies || typeof dependencies !== "object") {
    console.warn("No valid dependencies found.");
    dependencies = {};
  }

  // Fetch dependency content and calculate the size using https
  const fetchDependencySize = async (
    dependencyName: string,
    version: string,
  ): Promise<number> => {
    const registryUrl = `https://registry.npmjs.org/${dependencyName}`;

    return new Promise<number>((resolve, reject) => {
      get(registryUrl, (res) => {
        if (res.statusCode !== 200) {
          console.error(`Failed to fetch ${dependencyName}: ${res.statusCode}`);
          resolve(0);
          return;
        }

        let data = "";
        res.on("data", (chunk) => data += chunk);
        res.on("end", () => {
          try {
            const json = JSON.parse(data);
            const versionData = json.versions[version];
            const tarballUrl = versionData.dist.tarball;

            // Fetch tarball size
            get(tarballUrl, (tarballRes) => {
              const size = parseInt(tarballRes.headers["content-length"] ?? "0", 10);
              resolve(size / (1024 * 1024)); // Convert bytes to MB
            }).on("error", () => resolve(0));
          }
 catch (err) {
            console.error(`Error parsing ${dependencyName}:`, err);
            resolve(0);
          }
        });
      }).on("error", () => resolve(0));
    });
  };

  // Calculate the total cost of dependencies
  let dependencyCost = 0;
  if (dependencies) {
    for (const [depName, depVersion] of Object.entries(dependencies)) {
      // Convert depVersion to a string and validate
      if (typeof depVersion === "string") {
        const version = depVersion.replace(/^[^0-9]*/, ""); // Strip non-numeric prefix
        dependencyCost += await fetchDependencySize(depName, version);
      }
 else {
        console.warn(`Invalid version format for ${depName}:`, depVersion);
      }
    }
  }

  const totalCost = standaloneCost + dependencyCost;

  return { standaloneCost, totalCost };
};
