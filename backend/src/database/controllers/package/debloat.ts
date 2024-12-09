/**
 * @filename - debloat.ts
 * @author(s) - Jonah Salyers
 * @purpose - Debloat any incoming packages
 */

import { minify } from "terser";

/**
 * Debloat the given content by applying minification.
 * Currently works only for JavaScript content.
 *
 * @param content - The content to debloat (e.g., JavaScript code).
 * @returns - The debloated (minified) content.
 */
export const debloatContent = async (content: string): Promise<string> => {
  try {
    const result = await minify(content);
    if (result.code) {
      return result.code;
    }
    throw new Error("Minification failed: no code output.");
  } catch (error) {
    console.error("Debloating failed:", error);
    throw error;
  }
};
