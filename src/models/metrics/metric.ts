/** 
 * @file metric.ts
 * 
 */

import { Scorecard } from "../scores/scorecard.js";
/**
 * @abstract
 * @class Metric
 * 
 * This is the abstract parent class for all metrics.
 * It contains the evaluate() method that will be implemented in the child classes.
 * This allows us to leverate polymorphism, and it follows the Command design pattern.
 * 
 */
export abstract class Metric {
    public abstract evaluate(card: Scorecard): void;
}