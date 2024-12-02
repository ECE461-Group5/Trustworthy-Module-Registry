/*
 * Author(s): Joe Dahms
 * Purpose: Handle incoming requests to the /packages endpoint
*/
export const getPackages = (req, res) => {
    const requestBody = req.body;
    //const offset = req.query.offset;
    let validRequest = true;
    let validFormat = true;
    const maxPackages = 2;
    let validNumPackages = true;
    const numPackages = requestBody.length;
    // Check if request body format is valid
    if (Array.isArray(requestBody) && numPackages > 0) {
        for (const requestedPackage of requestBody) {
            if (requestedPackage.Name === undefined || requestedPackage.Version === undefined) {
                validRequest = false;
                validFormat = false;
                break;
            }
        }
    }
    else {
        validRequest = false;
        validFormat = false;
    }
    if (numPackages > maxPackages) {
        validRequest = false;
        validNumPackages = false;
    }
    // Once request validity has been checked
    if (validRequest) {
        // INSERT DATABASE QUERY FUNCTION HERE
        // databaseFunction(JSON.stringify(requestBody, offset));
        // Dummy id until database function is implemented
        for (const requestedPackage of requestBody) {
            requestedPackage.ID = "dummyid";
        }
        res.json(requestBody);
    }
    else if (!validFormat) {
        res.status(400).send();
    }
    else if (!validNumPackages) {
        res.status(413).send();
    }
};
//# sourceMappingURL=packagesController.js.map