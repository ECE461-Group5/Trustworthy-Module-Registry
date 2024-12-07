/**
 * @filename - upload.ts
 * @author(s) - Joe Dahms, Jonah Salyers
 * @purpose - Handle uploading a package to the database. Currently using prisma.
 */

import { Package } from "../../../server/controllers/package.js";
import prisma from "../../prisma.js";

/*
 * Purpose: Upload a package to the database using prisma and return back the uploaded package
 * Input:
 * - The package to upload
 * Output: The uploaded package
 */




export const dbUploadPackage = async (_package: Package): Promise<Package> => {
  //calculate name and version of package
  let name = "noname";
  let version = "noversion";

  if (_package.data.URL) {
    const result = await getNameAndVersion(_package.data.URL);
    name = result.name;
    version = result.version;
  }

  // Add package to database
  const newPackage = await prisma.package.create({
    data: {
      name: name,
      version: version,
      content: _package.data.Content,
      url: _package.data.URL,
      debloat: _package.data.debloat,
      jsProgram: _package.data.JSProgram,
    },
  });
  // Create 8 digit ID
  const formattedId = newPackage.id ? newPackage.id.toString().padStart(8, "0") : null; // Handle undefined ID gracefully
  // Return new package
  const test: Package = {
    metadata: {
      Name: newPackage.name,
      Version: newPackage.version,
      ID: formattedId,
    },
    data: {
      Content: newPackage.content,
      URL: newPackage.url,
      debloat: newPackage.debloat,
      JSProgram: newPackage.jsProgram,
    },
  };
  return test;
};

export const getNameAndVersion = async (url: string): Promise<{ name: string; version: string }> => {
  try {
    if (url.includes("github.com")) {
      // Handle GitHub URLs
      const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
      if (!match) {
        throw new Error("Invalid GitHub URL");
      }
      const [_, owner, repo] = match;

      // Fetch repository metadata from GitHub API
      const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
      if (!repoResponse.ok) {
        throw new Error(`Failed to fetch GitHub repo metadata: ${repoResponse.statusText}`);
      }
      const repoData = await repoResponse.json();
      const name = repoData.name;

      // Fetch latest release for version
      let version = "unknown";
      try {
        const releaseResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases/latest`);
        if (releaseResponse.ok) {
          const releaseData = await releaseResponse.json();
          version = releaseData.tag_name || "unknown";
        }
      } catch (releaseError) {
        console.warn("No releases found for GitHub repo, defaulting to 'unknown' version.");
      }

      return { name, version };
    } else if (url.includes("npmjs.com")) {
      // Handle npm URLs
      const match = url.match(/npmjs\.com\/package\/([^/]+)/);
      if (!match) {
        throw new Error("Invalid npm URL");
      }
      const [_, packageName] = match;

      // Fetch package metadata from npm registry API
      const npmResponse = await fetch(`https://registry.npmjs.org/${packageName}`);
      if (!npmResponse.ok) {
        throw new Error(`Failed to fetch npm package metadata: ${npmResponse.statusText}`);
      }
      const npmData = await npmResponse.json();
      const name = npmData.name;
      const version = npmData["dist-tags"]?.latest || "unknown";

      return { name, version };
    } else {
      throw new Error("Unsupported URL format");
    }
  } catch (error) {
    console.error("Error fetching name and version:", error);
    return { name: "noname", version: "noversion" };
  }
};

