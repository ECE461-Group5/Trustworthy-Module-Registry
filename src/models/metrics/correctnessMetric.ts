/**
 * @file correctnessMetric.ts
 */

import { Scorecard } from '../scores/scorecard.js';
import { Metric } from './metric.js';
import logger from '../../logger.js';
import { Octokit } from '@octokit/rest';

import dotenv from 'dotenv';
dotenv.config();

/**
 * @class CorrectnessMetric
 *
 * Evaluates the correctness of the repository by checking for test suites and analyzing bug reports.
 * Also calculates the latency of API requests to GitHub.
 */
export class CorrectnessMetric extends Metric {

    private octokit: Octokit;

    constructor() {
        super();
        logger.debug('Initializing Octokit with GitHub token for CorrectnessMetric...');
        this.octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
        logger.info('Octokit initialized successfully for CorrectnessMetric.');
    }

    public async evaluate(card: Scorecard): Promise<void> {
        try {
            logger.info(`Starting correctness evaluation for repo: ${card.owner}/${card.repo}`);
            let correctnessScore = 0;

            // Check for test suite in package.json
            logger.debug('Checking for test suites in package.json...');
            const hasTests = await this.checkForTests(card);
            correctnessScore += hasTests ? 0.5 : 0;
            logger.info(`Test suite found: ${hasTests}`);

            // Analyze bug reports
            logger.debug('Analyzing bug reports...');
            const bugScore = await this.analyzeBugs(card);
            correctnessScore += bugScore;
            logger.info(`Bug analysis score: ${bugScore}`);

            // Ensure score is between 0 and 1
            card.correctness = Math.min(correctnessScore, 1);
            logger.info(`Final correctness score for ${card.owner}/${card.repo}: ${card.correctness}`);

        } catch (error) {
            logger.error('Error evaluating correctness metric:', error);
            card.correctness = 0;
        }
    }

    private async checkForTests(card: Scorecard): Promise<boolean> {
        try {
            // Measure start time
            const fetchStartTime = Date.now();
            logger.debug('Fetching package.json from the repository...');

            // Fetch package.json content
            const packageJsonData = await this.octokit.repos.getContent({
                owner: card.owner,
                repo: card.repo,
                path: 'package.json',
            });

            // Measure end time
            const fetchEndTime = Date.now();
            card.correctness_Latency = parseFloat(((fetchEndTime - fetchStartTime) / 1000).toFixed(3));
            logger.info(`checkForTests API Latency: ${card.correctness_Latency} ms`);

            const packageJsonContent = Buffer.from((packageJsonData.data as any).content, 'base64').toString('utf-8');
            const packageJson = JSON.parse(packageJsonContent);

            const hasTestScript = !!(packageJson.scripts && packageJson.scripts.test);
            logger.debug(`Test script presence in package.json: ${hasTestScript}`);
            return hasTestScript;
            
        } catch (error: any) {
            if (error.status === 404) {
                logger.warn('package.json not found in the repository.');
                return false; // Return false if package.json is not found
            } else {
                logger.error('Error checking for tests:', error);
                return false; // Return false for other errors as well
            }
        }
    }

    private async analyzeBugs(card: Scorecard): Promise<number> {
        try {
            // Measure start time
            const fetchStartTime = Date.now();
            logger.debug('Fetching bug reports (issues with "bug" label) from the repository...');

            // Fetch issues data from GitHub
            const issuesData = await this.octokit.issues.listForRepo({
                owner: card.owner,
                repo: card.repo,
                labels: 'bug',
                state: 'all',
                per_page: 100,
            });


            // Measure end time
            const fetchEndTime = Date.now();
            card.correctness_Latency = parseFloat(((fetchEndTime - fetchStartTime) / 1000).toFixed(3));
            logger.info(`analyzeBugs API Latency: ${card.correctness_Latency} ms`);

            const issues = issuesData.data;
            logger.debug(`Fetched ${issues.length} issues with "bug" label from the repository.`);
            logger.debug(issues);
            const openBugs = issues.filter(issue => issue.state === 'open').length;
            const closedBugs = issues.filter(issue => issue.state === 'closed').length;
            logger.debug(`Number of open bugs: ${openBugs}, Number of closed bugs: ${closedBugs}`);

            const totalBugs = openBugs + closedBugs;
            if (totalBugs === 0) {
                logger.info('No bugs found, assigning neutral correctness score.');
                return 0.5; // Neutral score if no bugs reported
            }

            const openBugRatio = openBugs / totalBugs;
            let bugScore = 0;
            if (openBugRatio >= 0.5) {
                bugScore = 0; // Low score if many bugs are open
            } else if (openBugRatio >= 0.3) {
                bugScore = 0.1;
            } else if (openBugRatio >= 0.1) {
                bugScore = 0.3;
            } else {
                bugScore = 0.5;
            }
            logger.info(`Calculated bug score: ${bugScore} (Open bug ratio: ${openBugRatio})`);
            return bugScore;

        } catch (error) {
            logger.error('Error analyzing bugs:', error);
            return 0; // Low score if unable to fetch issues
        }
    }
}
