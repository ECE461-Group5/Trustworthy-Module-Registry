/**
 * @file evaluateModule.ts
 * 
 * This is the main driving file for evaluating a module.
 * 
 */


import logger from '../../logger.js';

import { Scorecard } from '../scores/scorecard.js';
import { createScorecard } from './createScorecard.js';

import { Metric } from '../metrics/metric.js';
import { BusFactorMetric } from '../metrics/busfactorMetric.js';
import { CorrectnessMetric } from '../metrics/correctnessMetric.js';
import { LicenseMetric } from '../metrics/licenseMetric.js';
import { MaintainersMetric } from '../metrics/maintainersMetric.js';
import { RampUpMetric } from '../metrics/rampupMetric.js';


/**
 * @constant {Metric[]} metrics : Array of metrics to be evaluated
 * 
 * All objects that derive from the the Metric abstract parent class are added to this array.
 * We're utilizing polymorphism. The evaluate() method is implemented in each child class. 
 * So if we iterate through the array and call evaluate() on each object, we'll get the results of each metric.
 * 
 */ 
const metrics: Metric[] = []
// Add Metric objects to the array
metrics.push(new BusFactorMetric());
metrics.push(new CorrectnessMetric());
metrics.push(new LicenseMetric());
metrics.push(new MaintainersMetric());
metrics.push(new RampUpMetric());


/**
 * @function evaluateModule
 * 
 * This is the main driving function for evaluating modules.
 * It creates a Scorecard object for the module and then passes it to each object in the array for evaluation.
 * The results are then returned in NDJSON format, and will be passed to the front end.
 * 
 * @param {string} url : URL of the module
 * @returns {Promise<string>} : NDJSON string of the results
 * 
 */
export async function evaluateModule(url: string): Promise<string> {
    
    logger.info(`Evaluating module at URL: ${url}`);
    
    // Call the createScorecard function
    const scorecard: Scorecard = await createScorecard(url);

    // Run all metric evaluations in parallel
    await Promise.all(metrics.map(metric => metric.evaluate(scorecard)));

    scorecard.calculateNetScore();
    
    return scorecard.getResults();
}
