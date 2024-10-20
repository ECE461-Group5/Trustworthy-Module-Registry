// tests/metrics/correctnessMetric.test.ts

import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';
import { CorrectnessMetric } from '../../src/models/metrics/correctnessMetric';
import { Scorecard } from '../../src/models/scores/scorecard';

// Mock the logger
vi.mock('../../src/logger.js', () => ({
  default: {
    info: vi.fn(),
    debug: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock dotenv
vi.mock('dotenv', () => {
  return {
    default: {
      config: vi.fn(),
    },
  };
});

// Mock the Octokit module
vi.mock('@octokit/rest', () => {
  const Octokit = vi.fn();
  return { Octokit };
});

// Import the mocked modules
import logger from '../../src/logger.js';
import { Octokit } from '@octokit/rest';

describe('CorrectnessMetric', () => {
  let correctnessMetric: CorrectnessMetric;
  /**
   * Mock object for Octokit API interactions.
   * 
   * @property {Object} repos - Mock for repository-related API calls.
   * @property {Mock} repos.getContent - Mock function for getting repository content.
   * @property {Object} issues - Mock for issue-related API calls.
   * @property {Mock} issues.listForRepo - Mock function for listing issues in a repository.
   */
  let octokitMock: {
    repos: {
      getContent: Mock;
    };
    issues: {
      listForRepo: Mock;
    };
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Create mock methods for repos.getContent and issues.listForRepo
    octokitMock = {
      repos: {
        getContent: vi.fn(),
      },
      issues: {
        listForRepo: vi.fn(),
      },
    };

    // Mock the Octokit constructor to return our mock
    (Octokit as unknown as Mock).mockImplementation(() => octokitMock);

    // Instantiate CorrectnessMetric (it will use the mocked Octokit)
    correctnessMetric = new CorrectnessMetric();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should set correctness score to 0.6 when tests are present and bug score is high', async () => {
    const card = new Scorecard('https://github.com/owner/repo');
    card.owner = 'owner';
    card.repo = 'repo';

    // Mock package.json with test script
    octokitMock.repos.getContent.mockResolvedValueOnce({
      data: {
        content: Buffer.from(
          JSON.stringify({
            scripts: {
              test: 'jest',
            },
          })
        ).toString('base64'),
      },
    });

    // Mock issues with few open bugs
    octokitMock.issues.listForRepo.mockResolvedValueOnce({
      data: [
        { state: 'closed', labels: [{ name: 'bug' }] },
        { state: 'closed', labels: [{ name: 'bug' }] },
        { state: 'open', labels: [{ name: 'bug' }] },
      ],
    });

    await correctnessMetric.evaluate(card);

    expect(card.correctness).toBe(0.6);
    expect(logger.info).toHaveBeenCalledWith('Test suite found: true');
    expect(logger.info).toHaveBeenCalledWith('Calculated bug score: 0.1 (Open bug ratio: 0.3333333333333333)');
    expect(logger.info).toHaveBeenCalledWith('Final correctness score for owner/repo: 0.6');

  });

  it('should set correctness score to 0.5 when tests are absent and bug score is neutral', async () => {
    const card = new Scorecard('https://github.com/owner/repo');
    card.owner = 'owner';
    card.repo = 'repo';

    // Mock package.json without test script
    octokitMock.repos.getContent.mockResolvedValueOnce({
      data: {
        content: Buffer.from(
          JSON.stringify({
            scripts: {
              start: 'node index.js',
            },
          })
        ).toString('base64'),
      },
    });

    // Mock no bug issues
    octokitMock.issues.listForRepo.mockResolvedValueOnce({
      data: [],
    });

    await correctnessMetric.evaluate(card);

    expect(card.correctness).toBe(0.5);
    expect(logger.info).toHaveBeenCalledWith('Test suite found: false');
    expect(logger.info).toHaveBeenCalledWith('No bugs found, assigning neutral correctness score.');
    expect(logger.info).toHaveBeenCalledWith('Final correctness score for owner/repo: 0.5');
  });

  it('should handle missing package.json and set correctness score based on bugs', async () => {
    const card = new Scorecard('https://github.com/owner/repo');
    card.owner = 'owner';
    card.repo = 'repo';

    // Mock package.json not found
    const error = new Error('Not Found');
    (error as any).status = 404;
    octokitMock.repos.getContent.mockRejectedValueOnce(error);

    // Mock issues with many open bugs
    octokitMock.issues.listForRepo.mockResolvedValueOnce({
      data: [
        { state: 'open', labels: [{ name: 'bug' }] },
        { state: 'open', labels: [{ name: 'bug' }] },
        { state: 'open', labels: [{ name: 'bug' }] },
      ],
    });

    await correctnessMetric.evaluate(card);

    expect(card.correctness).toBe(0);
    expect(logger.warn).toHaveBeenCalledWith('package.json not found in the repository.');
    expect(logger.info).toHaveBeenCalledWith('Test suite found: false');
    expect(logger.info).toHaveBeenCalledWith('Calculated bug score: 0 (Open bug ratio: 1)');
    expect(logger.info).toHaveBeenCalledWith('Final correctness score for owner/repo: 0');
  });

  it('should handle errors during test check and assign default score', async () => {
    const card = new Scorecard('https://github.com/owner/repo');
    card.owner = 'owner';
    card.repo = 'repo';

    // Mock unexpected error when fetching package.json
    octokitMock.repos.getContent.mockRejectedValueOnce(new Error('API Error'));

    // Mock issues with few open bugs
    octokitMock.issues.listForRepo.mockResolvedValueOnce({
      data: [
        { state: 'closed', labels: [{ name: 'bug' }] },
        { state: 'closed', labels: [{ name: 'bug' }] },
      ],
    });

    await correctnessMetric.evaluate(card);

    expect(card.correctness).toBe(0.5); // Only bug score counted
    expect(logger.error).toHaveBeenCalledWith('Error checking for tests:', new Error('API Error'));
    expect(logger.info).toHaveBeenCalledWith('Test suite found: false');
    expect(logger.info).toHaveBeenCalledWith('Calculated bug score: 0.5 (Open bug ratio: 0)');
    expect(logger.info).toHaveBeenCalledWith('Final correctness score for owner/repo: 0.5');
  });

  it('should handle errors during bug analysis and assign default score', async () => {
    const card = new Scorecard('https://github.com/owner/repo');
    card.owner = 'owner';
    card.repo = 'repo';

    // Mock package.json with test script
    octokitMock.repos.getContent.mockResolvedValueOnce({
      data: {
        content: Buffer.from(
          JSON.stringify({
            scripts: {
              test: 'jest',
            },
          })
        ).toString('base64'),
      },
    });

    // Mock error when fetching issues
    octokitMock.issues.listForRepo.mockRejectedValueOnce(new Error('API Error'));

    await correctnessMetric.evaluate(card);

    expect(card.correctness).toBe(0.5); // Only test score counted
    expect(logger.info).toHaveBeenCalledWith('Test suite found: true');
    expect(logger.error).toHaveBeenCalledWith('Error analyzing bugs:', new Error('API Error'));
    expect(logger.info).toHaveBeenCalledWith('Final correctness score for owner/repo: 0.5');
  });

  it('should handle total correctness score exceeding 1 by capping it at 1', async () => {
    const card = new Scorecard('https://github.com/owner/repo');
    card.owner = 'owner';
    card.repo = 'repo';

    // Mock package.json with test script
    octokitMock.repos.getContent.mockResolvedValueOnce({
      data: {
        content: Buffer.from(
          JSON.stringify({
            scripts: {
              test: 'jest',
            },
          })
        ).toString('base64'),
      },
    });

    // Mock issues leading to high bug score
    octokitMock.issues.listForRepo.mockResolvedValueOnce({
      data: [
        // Assuming the bug score logic would exceed 1 without capping
        { state: 'closed', labels: [{ name: 'bug' }] },
        { state: 'closed', labels: [{ name: 'bug' }] },
        { state: 'closed', labels: [{ name: 'bug' }] },
      ],
    });

    await correctnessMetric.evaluate(card);

    expect(card.correctness).toBe(1); // Capped at 1
    expect(logger.info).toHaveBeenCalledWith('Final correctness score for owner/repo: 1');
  });
});
