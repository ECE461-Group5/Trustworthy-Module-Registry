/*
 * @file - scorecard.ts
 * @author(s) - Logan Pelkey
 * @purpose - This class holds all of the metric calculations carried out on the module.
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
  goodPinningPractice: number;
  goodPinningPractice_Latency: number;
  pullRequest: number;
  pullRequest_Latency: number;

  /**
   * @constructor
   *
   * The constuctor takes two url stings because npm modules will require a different initial URL than GitHub modules..
   * All of the scores of the various metrics are initialized to 0.
   *
   */
  constructor(url: string) {
    this.url = url;
    this.owner = "";
    this.repo = "";
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
    this.goodPinningPractice = 0;
    this.goodPinningPractice_Latency = 0;
    this.pullRequest = 0;
    this.pullRequest_Latency = 0;
  }

  public calculateNetScore(): void {
    // Calculate net score based on Sarah's priorities
    const rampUpWeight = 0.13;
    const correctnessWeight = 0.22;
    const busFactorWeight = 0.09;
    const responsiveMaintainerWeight = 0.22;
    const licenseWeight = 0.09;
    const pinningPracticeWeight = 0.13;
    const pullRequestReviewWeight = 0.12;

    this.netScore = parseFloat(
      (
        this.rampUp * rampUpWeight +
        this.correctness * correctnessWeight +
        this.busFactor * busFactorWeight +
        this.responsiveMaintainer * responsiveMaintainerWeight +
        this.license * licenseWeight +
        this.goodPinningPractice * pinningPracticeWeight +
        this.pullRequest * pullRequestReviewWeight
      ).toFixed(3),
    );
    this.netScore_Latency = parseFloat(
      (
        this.rampUp_Latency * rampUpWeight +
        this.correctness_Latency * correctnessWeight +
        this.busFactor_Latency * busFactorWeight +
        this.responsiveMaintainer_Latency * responsiveMaintainerWeight +
        this.license_Latency * licenseWeight +
        this.goodPinningPractice_Latency * pinningPracticeWeight +
        this.pullRequest_Latency * pullRequestReviewWeight
      ).toFixed(3),
    );
  }

  // Convert all member variables to NJSON
  public getResults(): string {
    const scores = [
      {
        URL: this.url,
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
        License_Latency: this.license_Latency,
        GoodPinningPractice: this.goodPinningPractice,
        GoodPinningPractice_Latency: this.goodPinningPractice_Latency,
        PullRequest: this.pullRequest,
        PullRequest_Latency: this.pullRequest_Latency,
      },
    ];
    // Convert the array to a JSON string
    return scores.map((score) => JSON.stringify(score).replace(/,/g, ", ")).join("\n");
  }
}
