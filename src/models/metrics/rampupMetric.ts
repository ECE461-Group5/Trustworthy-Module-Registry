/**
 * @file rampUpMetric.ts
 */

import { Scorecard } from '../scores/scorecard.js';
import { Metric } from './metric.js';
import logger from '../../logger.js';
import { Octokit } from '@octokit/rest';
import markdownlint from 'markdownlint';

import dotenv from 'dotenv';
dotenv.config();

/**
 * @class RampUpMetric
 *
 * Evaluates the ramp-up time by analyzing the README and documentation.
 * Also calculates the latency of API requests to GitHub.
 */
export class RampUpMetric extends Metric {

    private octokit: Octokit;

    constructor() {
        super();
        this.octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
        logger.debug(`${this.constructor.name} initialized with GitHub API.`);
    }

    public async evaluate(card: Scorecard): Promise<void> {
        
        try {
            // Measure start time
            const fetchStartTime = Date.now();

            // Fetch the README file from the repository
            logger.debug(`Fetching README for ${card.owner}/${card.repo}...`);
            const readmeData = await this.octokit.repos.getReadme({
                owner: card.owner,
                repo: card.repo,
            });

            // Measure end time
            const fetchEndTime = Date.now();
            card.rampUp_Latency = parseFloat(((fetchEndTime - fetchStartTime) / 1000).toFixed(3));
            logger.info(`Fetched README for ${card.owner}/${card.repo}, API Latency: ${card.rampUp_Latency} ms`);

            // Decode the README content
            const readmeContent = Buffer.from(readmeData.data.content, 'base64').toString('utf-8');
            logger.debug(`README content fetched and decoded for ${card.owner}/${card.repo}.`);

            // Analyze README content to compute score
            const readmeScore = this.analyzeReadme(readmeContent);
            card.rampUp = Number(readmeScore.toFixed(3));
            logger.info(`Ramp-up score for ${card.owner}/${card.repo} computed: ${readmeScore}`);

        } catch (error) {
            const err = error as Error;
            logger.error(`Error fetching README information for ${card.owner}/${card.repo}: ${err.message}`);
            card.rampUp = 0;
        }

    }

    private analyzeReadme(content: string): number {
        logger.debug(`Analyzing README content...`);
        let score = 0;

            // Define important sections with weighted scoring
        const sections = [
            { name: 'Installation', weight: 0.2 },
            { name: 'Usage', weight: 0.2 },
            { name: 'Contributing', weight: 0.1 },
            { name: 'Contributions', weight: 0.1 },
            { name: 'Getting Started', weight: 0.2 },
            { name: 'Documentation', weight: 0.1 },
            { name: 'License', weight: 0.1 },
            { name: 'Support', weight: 0.1 }
        ];

        // Analyze presence and quality of sections
        sections.forEach(section => {
            const regex = new RegExp(`#\\s*${section.name}`, 'i');
            if (regex.test(content)) {
                score += section.weight;
                logger.debug(`Section "${section.name}" found and scored.`);
            } else {
                logger.debug(`Section "${section.name}" not found.`);
            }
        });

        // Analyze the README for code examples
        score += this.evaluateCodeExamples(content);

        // Analyze the README for external links
        score += this.evaluateExternalLinks(content);

        // Lint the README for quality and markdown errors
        score += this.lintReadme(content);

        // Ensure the score is between 0 and 1
        const finalScore = Math.min(score, 1);
        logger.debug(`Final README score: ${finalScore}`);
        return finalScore;
    }

    private evaluateCodeExamples(content: string): number {
        const codeBlockCount = (content.match(/```/g) || []).length / 2; // Each code block has two ```
        let score = 0;
        if (codeBlockCount > 2) {
            score = 0.2;  // Sufficient examples present
        } else if (codeBlockCount > 0) {
            score = 0.1;  // Few examples
        }

        logger.debug(`Found ${codeBlockCount} code examples, score: ${score}`);

        return score;
    }

    private evaluateExternalLinks(content: string): number {
        const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
        const links = content.match(linkRegex);
        let score = 0;
        if (links && links.length > 5) {
            score = 0.1;  // Bonus score for providing multiple external resources
        }

        logger.debug(`Found ${links?.length || 0} external links, score: ${score}`);

        return score;
    }

    private lintReadme(content: string): number {
        const options = {
            strings: { content },
            config: {
                "default": true,
                "line-length": false, // Example: disable line-length rule
                // Add other rules or configurations as needed
            }
        };
        const lintResults = markdownlint.sync(options);
    
        const errors = lintResults[Object.keys(lintResults)[0]] || [];
        const errorCount = errors.length;
        let score = 0;
    
        if (errorCount === 0) {
            score = 0.2;  // No linting issues
        } else if (errorCount < 3) {
            score = 0.1;  // Few minor issues
        } else {
            score = 0;    // Significant linting issues
        }
    
        logger.debug(`Linted README with ${errorCount} issues, score: ${score}`);

        return score;
    }
    

}
