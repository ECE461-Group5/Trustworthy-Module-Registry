/**
 * @filename - upload.ts
 * @author(s) - Joe Dahms, Jonah Salyers, Logan Pelkey
 * @purpose - Handle uploading a package to the database. Currently using prisma.
 */

import { Package } from "../../../server/controllers/package.js";
import prisma from "../../prisma.js";

/**
 * @function fetchPackageContent
 *
 * Fetch content from a URL and return it as a Buffer.
 *
 * @param url - The URL to fetch content from.
 * @returns - The content as a Buffer, or null if fetching fails.
 */
async function fetchPackageContent(url: string): Promise<Buffer | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.warn(
        `Failed to fetch content from URL: ${url}, Status: ${response.status}`,
      );
      return null;
    }
    const contentBuffer = Buffer.from(await response.arrayBuffer());
    return contentBuffer;
  } catch (error) {
    console.error("Error fetching package content:", error);
    return null;
  }
}

/**
 * @function dbUploadPackage
 *
 * Upload a package to the database and return the uploaded package.
 *
 * @param _package - The package to upload
 * @returns - The uploaded package
 */
export const dbUploadPackage = async (_package: Package): Promise<Package> => {
  // Calculate name and version of the package
  let name = "noname";
  let version = "noversion";
  let content = _package.data.Content;

  if (_package.data.URL) {
    const result = await getNameAndVersion(_package.data.URL);
    name = result.name;
    version = result.version;

    // Fetch and populate content if not provided
    if (!content) {
      content = await fetchPackageContent(_package.data.URL);
    }
  }

  if (_package.data.Content === null) {
    return _package;
  }
  const packageContent = Buffer.from(_package.data.Content);

  // Add package to database
  const newPackage = await prisma.package.create({
    data: {
      name: name,
      version: version,
      content: packageContent,
      url: _package.data.URL,
      debloat: _package.data.debloat,
      jsProgram: _package.data.JSProgram,
    },
  });

  if (newPackage.content === null) {
    return _package;
  }
  newPackage.content.toString();

  const formattedId = newPackage.id?.toString().padStart(8, "0") || null; // Handle undefined ID gracefully

  // Return new package
  const test: Package = {
    metadata: {
      Name: newPackage.name,
      Version: newPackage.version,
      ID: formattedId,
    },
    data: {
      Content: newPackage.content.toString(),
      URL: newPackage.url,
      debloat: newPackage.debloat,
      JSProgram: newPackage.jsProgram,
    },
  };
  return test;
};

/**
 * @function getNameAndVersion
 *
 * Get the name and version of a package from its url
 *
 * @param url - URL of the package to get the name and version of
 * @returns - Promise containing the name and version of the package
 */
export const getNameAndVersion = async (
  url: string,
): Promise<{ name: string; version: string }> => {
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
        throw new Error(
          `Failed to fetch GitHub repo metadata: ${repoResponse.statusText}`,
        );
      }
      const repoData = await repoResponse.json();
      const name = repoData.name;

      // Fetch latest release for version
      let version = "unknown";
      try {
        const releaseResponse = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/releases/latest`,
        );
        if (releaseResponse.ok) {
          const releaseData = await releaseResponse.json();
          version = releaseData.tag_name || "unknown";
        }
      } catch (releaseError) {
        console.warn(
          "No releases found for GitHub repo, defaulting to 'unknown' version.",
        );
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
        throw new Error(
          `Failed to fetch npm package metadata: ${npmResponse.statusText}`,
        );
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
