/*
 * @file - pullRequestReviewMetric.ts
 * @author(s) - Logan Pelkey
 * @purpose - Handle the retrieval of necessary data and calculation of the metric.
 */

import { Scorecard } from "../scores/scorecard.js";
import { Metric } from "./metric.js";
import logger from "../../../logger.js";
import { Octokit } from "@octokit/rest";

/**
 * @class PullRequestReviewMetric
 *
 * Evaluates the fraction of project code introduced through pull requests with a code review.
 */
export class PullRequestReviewMetric extends Metric {
  private octokit!: Octokit;

  constructor() {
    super();
    try {
      logger.debug("Initializing Octokit with GitHub token...");
      this.octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
      logger.info("Octokit initialized successfully.");
    } catch (error) {
      logger.error("Error initializing Octokit:", error);
    }
  }

  public async evaluate(card: Scorecard & { pullRequestReview_Score?: number; pullRequestReview_Latency?: number }): Promise<void> {
    try {
      logger.info("Starting pull request review evaluation...");
      
      const owner = card.owner;
      const repo = card.repo;
      
      let totalLinesOfCode = 0;
      let reviewedLinesOfCode = 0;

      // Measure start time
      const fetchStartTime = Date.now();
      logger.debug("Start time recorded.");
      
      // Fetch all pull requests for the repository
      const pulls = await this.octokit.pulls.list({
        owner,
        repo,
        state: "closed", // Only closed PRs
        per_page: 100, // Adjust pagination if needed
      });

      for (const pull of pulls.data) {
        if (!pull.merged_at) continue; // Skip PRs that weren't merged

        // Get the lines of code added/changed in this PR
        const diff = await this.octokit.pulls.get({
          owner,
          repo,
          pull_number: pull.number,
        });

        const linesChanged = diff.data.additions + diff.data.deletions;
        totalLinesOfCode += linesChanged;
        // Check if the pull request has reviews
        const reviews = await this.octokit.pulls.listReviews({
          owner,
          repo,
          pull_number: pull.number,
        });

        if (reviews.data.length > 0) {
          reviewedLinesOfCode += linesChanged; // Count lines if the PR had reviews
        }
      }
      
      // Measure end time
      const fetchEndTime = Date.now();
      logger.debug("End time recorded.");

      // Calculate the fraction of reviewed code
      const score = totalLinesOfCode > 0 ? reviewedLinesOfCode / totalLinesOfCode : 1.0;
      console.log(score)
      card.pullRequest = Math.round(score * 10) / 10; //round to the tenths place

      // Calculate latency
      card.pullRequest_Latency = parseFloat(((fetchEndTime - fetchStartTime) / 1000).toFixed(3));

      logger.info(`Pull request review score calculated: ${card.pullRequest}`);
      logger.info(`Latency for pull request review evaluation: ${card.pullRequest_Latency}s`);
    } catch (error) {
      logger.error("Error evaluating pull request reviews:", error);
      card.pullRequest = 0;
      card.pullRequest_Latency = 0;
    }
  }
}
