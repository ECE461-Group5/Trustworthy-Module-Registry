/**
 * @file urlServices.ts
 *
 */
import { evaluateModule } from "../../models/evaluators/evaluateModule.js";
/**
 * @class URLServices
 *
 * This class will be used to start the scoring process for the module.
 * It will call the evaluateModule() function.
 *
 */
class URLServices {
    static async beginScoringModule(url) {
        // Call the evaluateModule function and pass the URL
        const result = await evaluateModule(url);
        // [TESTING] Print the results to the console
        console.log(result);
        return result;
    }
}
export default URLServices;
//# sourceMappingURL=urlServices.js.map