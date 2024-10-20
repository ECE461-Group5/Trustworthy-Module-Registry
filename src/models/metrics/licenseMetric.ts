/**
 * @file licenseMetric.ts
 * 
 */

import { Scorecard } from '../scores/scorecard.js';
import { Metric } from './metric.js';
import logger from '../../logger.js';

import fs from 'fs';
import path from 'path';
import git from 'isomorphic-git';
import http from 'isomorphic-git/http/node/index.cjs';
import dotenv from 'dotenv';
dotenv.config();

/**
 * @class LicenseMetric
 * 
 * This class will evaluate the license metric of the module.
 * The repository will be cloned using isomorphic-git and
 * the license information will be extracted from the local files.
 * 
 */
export class LicenseMetric extends Metric {

    // Approved licenses
    private approvedLicensesIdentifiers: string[] = ['MIT', 'LGPL', 'Apache-1.0', 'Apache-1.1'];
    private approvedLicensesNames: string[] = ['MIT', 'GNU Lesser General Public License', 'Apache License 1.0', 'Apache License 1.1'];
    
    // Clone directory
    private cloneDir: string = path.join(process.cwd(), 'temp-repo');

    // Evaluate the license metric
    public async evaluate(card: Scorecard): Promise<void> {
        try {
            let totalLatency = 0;
            const repoUrl = `https://github.com/${card.owner}/${card.repo}.git`;

            logger.info(`Starting license evaluation for repository ${card.owner}/${card.repo}`);
            logger.debug('Cloning repository locally using isomorphic-git...');

            // Measure latency for cloning the repository
            const startClone = Date.now();

            // Clone the repository
            await git.clone({
                fs,
                http,
                dir: this.cloneDir,
                url: repoUrl,
                singleBranch: true,
                depth: 1,
            });

            const endClone = Date.now();
            const cloneLatency = endClone - startClone;
            totalLatency += cloneLatency;

            logger.debug(`Repository cloned. Latency: ${cloneLatency} ms`);
            logger.debug('Checking for LICENSE file...');

            // Check if LICENSE file exists
            const licenseFilePath = path.join(this.cloneDir, 'LICENSE');
            if (fs.existsSync(licenseFilePath)) {
                const licenseContent = fs.readFileSync(licenseFilePath, 'utf-8');
                const licenseIdentifier = this.extractLicenseIdentifier(licenseContent);

                if (licenseIdentifier && this.approvedLicensesIdentifiers.includes(licenseIdentifier)) {
                    card.license = 1;
                    logger.info(`Approved license found: ${licenseIdentifier}`);
                } else {
                    card.license = 0;
                    logger.warn(`Unapproved license: ${licenseIdentifier}`);
                }
            } else {
                card.license = 0;
                logger.warn('No LICENSE file found in the repository.');
            }

            // Check the README if the license is not set in the LICENSE file
            if (card.license === 0) {
                logger.debug('Checking README file for license information...');
                
                // Measure latency for checking README
                const startReadmeCheck = Date.now();

                const readmeFilePath = path.join(this.cloneDir, 'README.md');
                if (fs.existsSync(readmeFilePath)) {
                    const readmeContent = fs.readFileSync(readmeFilePath, 'utf-8');
                    if (this.checkLicenseInReadme(readmeContent)) {
                        card.license = 1;
                        logger.info('Approved license found in README.');
                    } else {
                        logger.warn('No approved license found in README.');
                    }
                } else {
                    logger.warn('No README file found in the repository.');
                }

                const endReadmeCheck = Date.now();
                const readmeCheckLatency = endReadmeCheck - startReadmeCheck;
                totalLatency += readmeCheckLatency;

                logger.debug(`README file checked. Latency: ${readmeCheckLatency} ms`);
            }

            // Set the total latency for license evaluation
            card.license_Latency = parseFloat(((totalLatency) / 1000).toFixed(3));
            logger.info(`License evaluation completed. Total latency: ${totalLatency} ms`);

            // Clean up by removing the cloned directory
            fs.rmSync(this.cloneDir, { recursive: true, force: true });

        } catch (error) {
            card.license = 0;
            card.license_Latency = 0; // Set latency to 0 in case of error
            logger.error('Error fetching license information:', error);
            
        }
    }

    // Extract the license identifier from the LICENSE file content
    private extractLicenseIdentifier(content: string): string | null {
        for (const license of this.approvedLicensesNames) {
            if (content.includes(license)) {
                return this.approvedLicensesIdentifiers[this.approvedLicensesNames.indexOf(license)];
            }
        }
        return null;
    }

    // Check if the approved license is in the README
    private checkLicenseInReadme(content: string): boolean {
        logger.debug('Checking for approved license in README content...');
        const found = this.approvedLicensesNames.some(keyword => content.includes(keyword));
        if (found) {
            logger.debug('Approved license found in README content.');
        } else {
            logger.debug('No approved license found in README content.');
        }
        return found;
    }
}
