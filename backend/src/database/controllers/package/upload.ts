/**
 * @filename - upload.ts
 * @author(s) - Joe Dahms, Jonah Salyers, Logan Pelkey
 * @purpose - Handle uploading a package to the database. Currently using prisma.
 */

import { Package } from "../../../server/controllers/package.js";
import prisma from "../../prisma.js";
import { debloatContent } from "./debloat.js";
import zlib from "zlib";
import * as tar from "tar";
import path from "path";
import { URL } from "url";
import fs from "fs/promises";
import os from "os";

/**
 * Check if the Buffer is a gzipped tarball by checking gzip signature
 */
function isGzippedTarball(buffer: Buffer): boolean {
  // GZIP magic numbers: 0x1f, 0x8b
  return buffer.length > 2 && buffer[0] === 0x1f && buffer[1] === 0x8b;
}

/**
 * Extracts a .tgz buffer to a temporary directory, returns the path to that directory.
 * You can then read a desired file from it.
 */
async function extractTarball(tgzBuffer: Buffer): Promise<string> {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "pkg-"));
  // Decompress and extract tarball into tempDir
  await new Promise<void>((resolve, reject) => {
    const gunzip = zlib.createGunzip();
    const extract = tar.x({ cwd: tempDir });
    gunzip.on('error', reject);
    extract.on('error', reject);
    extract.on('end', () => resolve());

    gunzip.pipe(extract);
    gunzip.end(tgzBuffer);
  });
  return tempDir;
}

/**
 * @function fetchPackageContent
 *
 * Fetch content from a URL and return it as a Buffer.
 */
async function fetchPackageContent(url: string): Promise<Buffer | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.warn(`Failed to fetch content from URL: ${url}, Status: ${response.status}`);
      return null;
    }
    const arrayBuf = await response.arrayBuffer();
    return Buffer.from(new Uint8Array(arrayBuf));
  } catch (error) {
    console.error("Error fetching package content:", error);
    return null;
  }
}

/**
 * Attempt to find a .js file within the extracted tarball directory to represent the main content.
 * In a real scenario, you might look for a package.json "main" field or default to index.js.
 */
async function findJSFileInDir(dir: string): Promise<string | null> {
  const files = await fs.readdir(dir, { withFileTypes: true });
  for (const f of files) {
    if (f.isFile() && f.name.endsWith(".js")) {
      const jsContent = await fs.readFile(path.join(dir, f.name), "utf-8");
      return jsContent;
    } else if (f.isDirectory()) {
      const nested = await findJSFileInDir(path.join(dir, f.name));
      if (nested) return nested;
    }
  }
  return null;
}

export const dbUploadPackage = async (_package: Package): Promise<Package> => {
  let name = "noname";
  let version = "noversion";
  let content = _package.data.Content;

  if (_package.data.URL) {
    const result = await getNameAndVersion(_package.data.URL);
    name = result.name;
    version = result.version;

    // Fetch and populate content if not provided
    if (!content) {
      const fetchedContent = await fetchPackageContent(_package.data.URL);
      if (fetchedContent) {
        if (isGzippedTarball(fetchedContent)) {
          // Extract tarball
          const tempDir = await extractTarball(fetchedContent);
          // Try to find a .js file
          const jsFileContent = await findJSFileInDir(tempDir);
          if (jsFileContent) {
            content = jsFileContent;
          } else {
            // If no JS found, fallback to binary tarball content as is
            // or return error or empty content
            content = fetchedContent.toString("utf-8");
          }
        } else {
          // Not a tarball, treat it as text
          content = fetchedContent.toString("utf-8");
        }
      }
    }
  }

  // If debloat is requested and we have some JS content
  if (_package.data.debloat && content && typeof content === "string") {
    console.info("Applying debloat to package content...");
    try {
      content = await debloatContent(content);
    } catch (error) {
      console.error("Error during debloating:", error);
    }
  }

  const packageContent = Buffer.isBuffer(content) ? content : Buffer.from(content || "", "utf-8");

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

  const formattedId = newPackage.id?.toString().padStart(8, "0") || null;

  const returnedPackage: Package = {
    metadata: {
      Name: newPackage.name,
      Version: newPackage.version,
      ID: formattedId,
    },
    data: {
      Content: newPackage.content?.toString() || "",
      URL: newPackage.url,
      debloat: newPackage.debloat,
      JSProgram: newPackage.jsProgram,
    },
  };
  return returnedPackage;
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
    const parsedUrl = new URL(url);
    const host = parsedUrl.host;
    const pathname = parsedUrl.pathname || "";

    const allowedHosts = [
      'github.com',
      'www.npmjs.com',
      'npmjs.com',
      'registry.npmjs.org'
    ];

    if (!allowedHosts.includes(host)) {
      throw new Error("Unsupported URL host");
    }

    if (host === 'github.com') {
      // Handle GitHub URLs
      const match = pathname.match(/^\/([^/]+)\/([^/]+)/);
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
      } catch {
        console.warn(
          "No releases found for GitHub repo, defaulting to 'unknown' version.",
        );
      }

      return { name, version };
    } 
    else if (host === 'www.npmjs.com' && pathname.startsWith("/package/")) {
      // Handle npmjs.com package page URLs like https://www.npmjs.com/package/browserify
      const packageName = pathname.replace("/package/", "");
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
    }
    else if ((host === 'npmjs.com' && pathname.startsWith("/package/")) ||
             (host === 'npmjs.com' && pathname.includes("/package/"))) {
      // Handle npmjs.com/package/ URLs (if you had them separate)
      const packageName = pathname.replace("/package/", "");
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
    }
    else if (host === 'registry.npmjs.org' && url.endsWith(".tgz")) {
      // Handle .tgz tarball URLs from registry.npmjs.org
      // Extract package name from the url. Usually these have the format:
      // https://registry.npmjs.org/<package>/-/<package>-<version>.tgz
      const segments = pathname.split("/");
      // segments: ['', '<package>', '-', '<package>-<version>.tgz']
      // Extract the package name and version from the filename
      const filename = segments.pop() || "";
      const pkgName = segments[1]; // second element is package name
      const npmResponse = await fetch(`https://registry.npmjs.org/${pkgName}`);
      if (!npmResponse.ok) {
        throw new Error(
          `Failed to fetch npm package metadata: ${npmResponse.statusText}`,
        );
      }
      const npmData = await npmResponse.json();
      const name = npmData.name;
      const version = npmData["dist-tags"]?.latest || "unknown";
      return { name, version };
    }
    else {
      throw new Error("Unsupported URL format");
    }
  } catch (error) {
    console.error("Error fetching name and version:", error);
    return { name: "noname", version: "noversion" };
  }
};