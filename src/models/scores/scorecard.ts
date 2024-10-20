/**
 * @file scorecard.ts
 * 
 */


/**
 * @class Scorecard
 * 
 * This class holds all of the metric calculations carried out on the module.
 * It is responsible for calculating the net score and returning results in JSON format.
 * Instance of Scorecard are passed into the different metrics classes as a "request" object.
 * 
 */
export class Scorecard {
    url: string;
    owner: string;
    repo: string;
    netScore: number;
    netScore_Latency: number;
    rampUp: number;
    rampUp_Latency: number;
    correctness: number;
    correctness_Latency: number;
    busFactor: number;
    busFactor_Latency: number;
    responsiveMaintainer: number;
    responsiveMaintainer_Latency: number;
    license: number;
    license_Latency: number;
    
    /**
     * @constructor 
     * 
     * The constuctor takes two url stings because npm modules will require a different initial URL than GitHub modules..
     * All of the scores of the various metrics are initialized to 0. 
     * 
     */
    constructor(url: string) {
        this.url = url;
        this.owner = '';
        this.repo = '';
        this.netScore = 0;
        this.netScore_Latency = 0;
        this.rampUp = 0;
        this.rampUp_Latency = 0;
        this.correctness = 0;
        this.correctness_Latency = 0;
        this.busFactor = 0;
        this.busFactor_Latency = 0;
        this.responsiveMaintainer = 0;
        this.responsiveMaintainer_Latency = 0;
        this.license = 0;
        this.license_Latency = 0;
    }

    
    // [TODO] Add weights
    public calculateNetScore(): void {
        // Calculate net score based on Sarah's priorities
        // Responsive maintainers are her highest priority, she also wants low ramp up time
        let rampUpWeight = 0.2
        let correctnessWeight = 0.3
        let busFactorWeight = 0.1
        let responsiveMaintainerWeight = 0.3
        let licenseWeight = 0.1
        this.netScore = parseFloat((this.rampUp * rampUpWeight + this.correctness * correctnessWeight + this.busFactor * busFactorWeight + this.responsiveMaintainer * responsiveMaintainerWeight + this.license * licenseWeight).toFixed(3));
        this.netScore_Latency =  parseFloat((this.rampUp_Latency * rampUpWeight  + this.correctness_Latency * correctnessWeight + this.busFactor_Latency * busFactorWeight + this.responsiveMaintainer_Latency * responsiveMaintainerWeight + this.license_Latency * licenseWeight).toFixed(3));
    }

    // Convert all member variables to NJSON
    public getResults(): string {
        const scores = [
            { URL: this.url,
                NetScore: this.netScore,
                NetScore_Latency: this.netScore_Latency,
                RampUp: this.rampUp,
                RampUp_Latency: this.rampUp_Latency,
                Correctness: this.correctness,
                Correctness_Latency: this.correctness_Latency,
                BusFactor: this.busFactor,
                BusFactor_Latency: this.busFactor_Latency,
                ResponsiveMaintainer: this.responsiveMaintainer,
                ResponsiveMaintainer_Latency: this.responsiveMaintainer_Latency,
                License: this.license,
                License_Latency: this.license_Latency
            }
        ];
        // Convert the array to a JSON string
        return scores.map(score => JSON.stringify(score).replace(/,/g, ', ')).join('\n');
    }
}