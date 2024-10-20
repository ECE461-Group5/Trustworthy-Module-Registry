/**
 * @file busFactorMetric.ts
 */

import { Scorecard } from '../scores/scorecard.js';
import { Metric } from './metric.js';
import logger from '../../logger.js';
import { Octokit } from '@octokit/rest';

import dotenv from 'dotenv';
dotenv.config();

/**
 * @class BusFactorMetric
 *
 * Evaluates the bus factor of the repository by analyzing the distribution of contributions among contributors.
 * Also calculates and logs the latency of the GitHub API request.
 */
export class BusFactorMetric extends Metric {

    private octokit!: Octokit;

    constructor() {
        super();
        try {
            logger.debug('Initializing Octokit with GitHub token...');
            this.octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
            logger.info('Octokit initialized successfully.');
        } catch (error) {
            logger.error('Error initializing Octokit:', error);
        }
    }

    public async evaluate(card: Scorecard & { BusFactor_Latency?: number }): Promise<void> {
        try {
            logger.info('Starting bus factor evaluation...');
            // Measure start time
            const fetchStartTime = Date.now();
            logger.debug('Start time recorded.');

            // Fetch contributors data from GitHub API
            logger.debug(`Fetching contributors for repo: ${card.owner}/${card.repo}`);
            const contributorsData = await this.octokit.repos.listContributors({
                owner: card.owner,
                repo: card.repo,
                per_page: 100,
            });

            // Measure end time
            const fetchEndTime = Date.now();
            logger.debug('End time recorded.');

            // Calculate latency in milliseconds
            card.busFactor_Latency = parseFloat(((fetchEndTime - fetchStartTime) / 1000).toFixed(3));
            

            const contributors = contributorsData.data;

            if (contributors.length === 0) {
                logger.info('No contributors found, setting bus factor to 0.');
                card.busFactor = 0;
                return;
            }

            logger.debug(`Total number of contributors: ${contributors.length}`);

            const totalContributions = contributors.reduce((sum, contributor) => sum + contributor.contributions, 0);
            logger.debug(`Total contributions: ${totalContributions}`);

            const topContributions = contributors[0].contributions;
            const topContributorPercentage = topContributions / totalContributions;
            logger.debug(`Top contributor percentage: ${topContributorPercentage}`);

            // Scoring logic based on top contributor's percentage
            if (topContributorPercentage >= 0.8) {
                card.busFactor = 0;
                logger.info('Bus factor set to 0 (top contributor >= 80%)');
            } else if (topContributorPercentage >= 0.6) {
                card.busFactor = 0.2;
                logger.info('Bus factor set to 0.2 (top contributor >= 60%)');
            } else if (topContributorPercentage >= 0.4) {
                card.busFactor = 0.5;
                logger.info('Bus factor set to 0.5 (top contributor >= 40%)');
            } else {
                card.busFactor = 1;
                logger.info('Bus factor set to 1 (top contributor < 40%)');
            }

        } catch (error) {
            logger.error('Error fetching contributors information:', error);
            card.busFactor = 0;
        }
    }
}
