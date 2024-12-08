/*
 * @file - goodPinningPracticeMetric.ts
 * @author(s) - Logan Pelkey
 * @purpose - Handle the retrieval of necessary data and calculation of the metric.
 */

import { Scorecard } from "../scores/scorecard.js";
import { Metric } from "./metric.js";
import logger from "../../../logger.js";
import { Octokit } from "@octokit/rest";

/**
 * @class PinnedDependenciesMetric
 *
 * Evaluates the fraction of dependencies pinned to at least a specific major+minor version
 * by fetching package data from a GitHub repository.
 */
export class GoodPinningPracticeMetric extends Metric {
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

  public async evaluate(card: Scorecard): Promise<void> {
    try {
      logger.info("Starting pinned dependencies evaluation...");
      // Measure start time
      const fetchStartTime = Date.now();
      logger.debug("Start time recorded.");

      // Fetch package.json file from the repository
      const packageJson = await this.fetchPackageJson(card.owner, card.repo);

      // Measure end time
      const fetchEndTime = Date.now();
      logger.debug("End time recorded.");

      // Calculate latency in milliseconds
      card.goodPinningPractice_Latency = parseFloat(
        ((fetchEndTime - fetchStartTime) / 1000).toFixed(3),
      );

      //Handle calculating the metric based on dependencies.

      if (!packageJson) {
        logger.warn("No package.json found, setting pinned dependencies score to 0.");
        card.goodPinningPractice = 0;
        return;
      }

      const dependencies: Record<string, string> = packageJson.dependencies || {};
      const totalDependencies = Object.keys(dependencies).length;

      if (totalDependencies === 0) {
        logger.info("No dependencies found, setting pinned dependencies score to 1.0.");
        card.goodPinningPractice = 1.0;
        return;
      }

      logger.debug(`Total dependencies: ${totalDependencies}`);

      const pinnedDependenciesCount = Object.values(dependencies).filter(
        (version: string) => this.isPinned(version),
      ).length;

      logger.debug(`Pinned dependencies: ${pinnedDependenciesCount}`);

      const rawScore = pinnedDependenciesCount / totalDependencies;
      const score = Math.round(rawScore * 10) / 10; //value is rounded to nearest tenths place
      card.goodPinningPractice = score;

      logger.info(`Pinned dependencies score calculated: ${score}`);
    } catch (error) {
      logger.error("Error evaluating pinned dependencies:", error);
      card.goodPinningPractice = 0;
    }
  }

  /**
   * Fetches the package.json file content from the repository.
   * @param owner The owner of the repository.
   * @param repo The repository name.
   * @returns Parsed JSON object or null if not found.
   */
  private async fetchPackageJson(owner: string, repo: string): Promise<any | null> {
    try {
      logger.debug(`Fetching package.json from repo: ${owner}/${repo}`);
      const response = await this.octokit.repos.getContent({
        owner,
        repo,
        path: "package.json",
      });

      if (response.data && "content" in response.data) {
        const packageContent = Buffer.from(response.data.content, "base64").toString();
        return JSON.parse(packageContent);
      }

      return null;
    } catch (error) {
      logger.error("Error fetching package.json:", error);
      return null;
    }
  }

  /**
   * Checks if a version is pinned to at least a major+minor version.
   * @param version The version string to check.
   * @returns True if pinned, false otherwise.
   */
  private isPinned(version: string): boolean {
    // Match versions that are pinned to major.minor, allowing exact patch or flexible patch
    const pinnedRegex = /^~?\d+\.\d+(\.\d+|\.x|\.\*)?$/;
    return pinnedRegex.test(version);
  }
}
