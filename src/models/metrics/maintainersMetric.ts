/**
 * @file maintainersMetric.ts
 */

import { Scorecard } from '../scores/scorecard.js';
import { Metric } from './metric.js';
import logger from '../../logger.js';
import { Octokit } from '@octokit/rest';

import dotenv from 'dotenv';
dotenv.config();

/**
 * @class MaintainersMetric
 *
 * Evaluates maintainers' responsiveness by analyzing issue and PR response times.
 */
export class MaintainersMetric extends Metric {

    private octokit: Octokit;

    /**
     * Constructor for the MaintainersMetric class.
     * Initializes the Octokit instance with the GitHub token from environment variables.
     */
    constructor() {
        super();
        this.octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
    }

    /**
     * Evaluates the responsiveness of maintainers by analyzing issue and PR response times.
     * @param card - The Scorecard instance to store the evaluation results.
     */
    public async evaluate(card: Scorecard): Promise<void> {
        try {
            // Calculate the date one month ago from today
            logger.info(`Evaluating maintainer responsiveness for ${card.owner}/${card.repo}`);

            const sinceDate = new Date();
            sinceDate.setMonth(sinceDate.getMonth() - 1);

            // Measure start time for fetching issues
            const fetchStartTime = Date.now();
            logger.debug(`Fetching issues from the last 30 days (since: ${sinceDate.toISOString()})`);

            const issuesData = await this.octokit.issues.listForRepo({
                owner: card.owner,
                repo: card.repo,
                since: sinceDate.toISOString(),
                state: 'all',
                per_page: 100,
            });

            // Measure end time for fetching issues
            const fetchEndTime = Date.now();

            // Calculate latency in seconds and round to three decimal places
            card.responsiveMaintainer_Latency = parseFloat(((fetchEndTime - fetchStartTime) / 1000).toFixed(3));
            

            const issues = issuesData.data;
            logger.debug(`Fetched ${issues.length} open issues for evaluation`);

            if (issues.length === 0) {
                logger.info('No open issues found. Setting responsiveMaintainer score to 1.');
                card.responsiveMaintainer = 1;
                return;
            }

            let totalResponseTime = 0;
            let responseCount = 0;

            for (const issue of issues) {
                const responseTime = await this.getFirstResponseTime(card, issue);
                if (responseTime !== null) {
                    totalResponseTime += responseTime;
                    responseCount++;
                    logger.debug(`Issue #${issue.number} - Response time: ${responseTime} hours`);
                } else {
                    logger.debug(`Issue #${issue.number} - No valid maintainer response found`);
                }
            }

            if (responseCount === 0) {
                logger.info('No responses found from maintainers. Setting responsiveMaintainer score to 0.');
                card.responsiveMaintainer = 0;
                return;
            }

            const averageResponseTime = totalResponseTime / responseCount;
            logger.debug(`Average response time: ${averageResponseTime} hours`);

            // Scoring logic based on average response time
            let responseScore = 1;
            if (averageResponseTime <= 72) {  // Less than or equal to 3 days
                responseScore = 1;
                logger.info('Average response time is within 72 hours (3 days). Setting score to 1.');
            } else if (averageResponseTime <= 168) { // Less than or equal to 7 days
                responseScore = 0.7;
                logger.info('Average response time is within 168 hours (7 days). Setting score to 0.7.');
            } else if (averageResponseTime <= 336) { // Less than or equal to 14 days
                responseScore = 0.4;
                logger.info('Average response time is within 336 hours (14 days). Setting score to 0.4.');
            } else {  // More than 14 days
                responseScore = 0;
                logger.info('Average response time exceeds 336 hours (14 days). Setting score to 0.');
            }


            card.responsiveMaintainer = responseScore;

        } catch (error) {
            logger.error(`Error fetching responsiveness information for ${card.owner}/${card.repo}:`, error);
            card.responsiveMaintainer = 0;
            card.responsiveMaintainer_Latency = 0;
        }
    }

  
    private async getFirstResponseTime(card: Scorecard, issue: any): Promise<number | null> {
        try {
            logger.debug(`Fetching comments for issue #${issue.number}`);
            
            const commentsData = await this.octokit.issues.listComments({
                owner: card.owner,
                repo: card.repo,
                issue_number: issue.number,
            });

            const comments = commentsData.data;

            for (const comment of comments) {
                const validAssociations = ['COLLABORATOR', 'MEMBER', 'OWNER', 'CONTRIBUTOR'];
                if (comment.user && validAssociations.includes(comment.author_association)) {
                    const issueCreatedAt = new Date(issue.created_at);
                    const commentCreatedAt = new Date(comment.created_at);
                    const responseTime = (commentCreatedAt.getTime() - issueCreatedAt.getTime()) / (1000 * 60 * 60);
                    return responseTime;
                }
            }

            logger.debug(`No collaborator response found for issue #${issue.number}`);
            return null;
        } catch (error) {
            logger.error(`Error fetching comments or checking collaborator status for issue #${issue.number}:`, error);
            return null;
        }
    }
}