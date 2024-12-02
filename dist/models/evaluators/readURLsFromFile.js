/**
 * @function readURLsFromFile
 *
 * Reads URLs from a file and passes them to evaluateModule function
 *
 * @param {string} filePath : Path to the file containing URLs
 */
import logger from "../../logger.js";
import * as fs from "fs";
import { evaluateModule } from "./evaluateModule.js";
export function readURLsFromFile(filePath) {
    logger.info(`Reading URLs from file: ${filePath}`);
    fs.readFile(filePath, "utf8", async (err, data) => {
        if (err) {
            logger.error(`Error reading file: ${err.message}`);
            return;
        }
        if (data === null) {
            logger.error("Error: File data is null.");
            return;
        }
        const urls = data.split("\n").filter(url => url.trim() !== "");
        logger.info(`Found ${urls.length} URL(s) in the file.`);
        for (const url of urls) {
            try {
                const result = await evaluateModule(url);
                logger.flush();
                logger.info(`Results for ${url}: ${result}`);
                console.log(result);
            }
            catch (error) {
                logger.error(`Error evaluating module at ${url}: ${error}`);
            }
        }
    });
}
//# sourceMappingURL=readURLsFromFile.js.map