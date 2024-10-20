import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { LicenseMetric } from '../../src/models/metrics/licenseMetric';
import { Scorecard } from '../../src/models/scores/scorecard';
import fs from 'fs';
import path from 'path';
import git from 'isomorphic-git';
import http from 'isomorphic-git/http/node/index.cjs';
import logger from '../../src/logger';

vi.mock('fs');
vi.mock('isomorphic-git');
vi.mock('../../src/logger');

describe('LicenseMetric', () => {
  let licenseMetric: LicenseMetric;
  

  beforeEach(() => {
    licenseMetric = new LicenseMetric();

  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should set license to 1 if approved license is found in LICENSE file', async () => {
    const scorecard = new Scorecard('https://github.com/owner/repo');
    scorecard.owner = 'owner';
    scorecard.repo = 'repo';
    
    vi.spyOn(fs, 'existsSync').mockReturnValue(true);
    vi.spyOn(fs, 'readFileSync').mockReturnValue('MIT License');
    vi.spyOn(git, 'clone').mockResolvedValue(undefined);
    vi.spyOn(fs, 'rmSync').mockReturnValue(undefined);

    await licenseMetric.evaluate(scorecard);

    expect(scorecard.license).toBe(1);
    expect(logger.info).toHaveBeenCalledWith('Approved license found: MIT');
  });

  it('should set license to 0 if no LICENSE file is found', async () => {
    const scorecard = new Scorecard('https://github.com/owner/repo');
    scorecard.owner = 'owner';
    scorecard.repo = 'repo';
    
    vi.spyOn(fs, 'existsSync').mockReturnValue(false);
    vi.spyOn(git, 'clone').mockResolvedValue(undefined);
    vi.spyOn(fs, 'rmSync').mockReturnValue(undefined);

    await licenseMetric.evaluate(scorecard);

    expect(scorecard.license).toBe(0);
    expect(logger.warn).toHaveBeenCalledWith('No LICENSE file found in the repository.');
  });

  it('should set license to 1 if approved license is found in README file', async () => {
    const scorecard = new Scorecard('https://github.com/owner/repo');
    scorecard.owner = 'owner';
    scorecard.repo = 'repo';
    
    vi.spyOn(fs, 'existsSync').mockImplementation((filePath) => filePath.toString().includes('README.md'));
    vi.spyOn(fs, 'readFileSync').mockReturnValue('This project is licensed under the MIT License.');
    vi.spyOn(git, 'clone').mockResolvedValue(undefined);
    vi.spyOn(fs, 'rmSync').mockReturnValue(undefined);

    await licenseMetric.evaluate(scorecard);

    expect(scorecard.license).toBe(1);
    expect(logger.info).toHaveBeenCalledWith('Approved license found in README.');
  });

  it('should set license to 0 if no approved license is found in README file', async () => {
    const scorecard = new Scorecard('https://github.com/owner/repo');
    scorecard.owner = 'owner';
    scorecard.repo = 'repo';

    vi.spyOn(fs, 'existsSync').mockImplementation((filePath) => filePath.toString().includes('README.md'));
    vi.spyOn(fs, 'readFileSync').mockReturnValue('This project has no license.');
    vi.spyOn(git, 'clone').mockResolvedValue(undefined);
    vi.spyOn(fs, 'rmSync').mockReturnValue(undefined);

    await licenseMetric.evaluate(scorecard);

    expect(scorecard.license).toBe(0);
    expect(logger.warn).toHaveBeenCalledWith('No approved license found in README.');
  });

  it('should handle errors and set license to 0', async () => {
    const scorecard = new Scorecard('https://github.com/owner/repo');
    scorecard.owner = 'owner';
    scorecard.repo = 'repo';
    
    vi.spyOn(git, 'clone').mockRejectedValue(new Error('Clone error'));
    vi.spyOn(fs, 'rmSync').mockReturnValue(undefined);

    await licenseMetric.evaluate(scorecard);

    expect(scorecard.license).toBe(0);
    expect(scorecard.license_Latency).toBe(0);
    expect(logger.error).toHaveBeenCalledWith('Error fetching license information:', expect.any(Error));
  });
});