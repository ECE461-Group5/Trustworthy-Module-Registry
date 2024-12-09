/**
 * @filename - update.ts
 * @author(s) - Joe Dahms, Jonah Salyers
 * @purpose - Update a package in the database. Updates content, url, debloat, and jsprogram.
 */

import logger from "../../../../logger.js";
import prisma from "../../prisma.js";
import { Package, nullPackageData } from "../../../server/controllers/package.js";
import { debloatContent } from "./debloat.js";
import zlib from "zlib";
import * as tar from "tar";
import path from "path";
import fs from "fs/promises";
import os from "os";

/**
 * Check if Buffer is gzipped tarball
 */
function isGzippedTarball(buffer: Buffer): boolean {
  return buffer.length > 2 && buffer[0] === 0x1f && buffer[1] === 0x8b;
}

async function extractTarball(tgzBuffer: Buffer): Promise<string> {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "pkg-"));
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

export const dbUpdatePackage = async (
  packageId: number,
  updatedPackage: Package,
): Promise<number> => {
  if (updatedPackage.metadata.ID != null && nullPackageData(updatedPackage) === false) {
    logger.info("Prisma update...");

    // If content is fetched from a URL similarly as in upload, you'd fetch here:
    // For simplicity, assume updatedPackage.data.Content is already set.
    let { Content } = updatedPackage.data;

    if (!Content) {
      return 400;
    }

    if (typeof Content !== "string") {
      // If Content is binary-like or from URL, handle accordingly
      // For simplicity, assume we always get a string here in the update scenario
    }

    const rawBuffer = Buffer.from(Content, "utf-8");
    if (isGzippedTarball(rawBuffer)) {
      const tempDir = await extractTarball(rawBuffer);
      const jsFileContent = await findJSFileInDir(tempDir);
      if (jsFileContent) {
        Content = jsFileContent;
      } else {
        Content = rawBuffer.toString("utf-8");
      }
    }

    if (updatedPackage.data.debloat && Content) {
      logger.info("Applying debloat to updated package content...");
      try {
        Content = await debloatContent(Content);
      } catch (error) {
        logger.error("Error during debloating:", error);
        return 500;
      }
    }

    const packageData = await prisma.package.findUnique({
      where: { id: packageId },
    });
    if (!packageData) {
      logger.info("Package does not exist");
      return 404;
    }

    await prisma.package.update({
      where: { id: packageId },
      data: {
        content: Buffer.from(Content, "utf-8"),
        url: updatedPackage.data.URL,
        debloat: updatedPackage.data.debloat,
        jsProgram: updatedPackage.data.JSProgram,
      },
    });
    logger.info("Prisma update successful");

    return 200;
  } else {
    return 400;
  }
};