/*
 * Author(s): Joe Dahms
 * Purpose: Handle uploading a package to the database. Currently using prisma.
 */
import prisma from "../../prisma.js";
/*
 * Purpose: Upload a package to the database using prisma and return back the uploaded package
 * Input:
 * - The package to upload
 * Output: The uploaded package
 */
export const dbUploadPackage = async (_package) => {
    // Add package to database
    const newPackage = await prisma.package.create({
        data: {
            name: "noname",
            version: "noversion",
            content: _package.data.Content,
            url: _package.data.URL,
            debloat: _package.data.debloat,
            jsProgram: _package.data.JSProgram,
        },
    });
    // Return new package
    const test = {
        metadata: {
            Name: newPackage.name,
            Version: newPackage.version,
            ID: newPackage.id,
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
//# sourceMappingURL=upload.js.map