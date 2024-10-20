// tests/metrics/busFactorMetric.test.ts

import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';
import { BusFactorMetric } from '../../src/models/metrics/busfactorMetric';
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

describe('BusFactorMetric', () => {
  let busFactorMetric: BusFactorMetric;
  let octokitMock: {
    repos: {
      listContributors: Mock;
    };
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Create mock methods for repos.listContributors
    octokitMock = {
      repos: {
        listContributors: vi.fn(),
      },
    };

    // Mock the Octokit constructor to return our mock
    (Octokit as unknown as Mock).mockImplementation(() => octokitMock);

    // Instantiate BusFactorMetric (it will use the mocked Octokit)
    busFactorMetric = new BusFactorMetric();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should set bus factor to 0 when top contributor has ≥ 80% contributions', async () => {
    const card = new Scorecard('https://github.com/owner/repo');
    card.owner = 'owner';
    card.repo = 'repo';

    // Mock contributors data
    octokitMock.repos.listContributors.mockResolvedValueOnce({
      data: [
        { contributions: 80 },
        { contributions: 10 },
        { contributions: 5 },
        { contributions: 5 },
      ],
    });

    await busFactorMetric.evaluate(card);

    expect(card.busFactor).toBe(0);
    expect(logger.info).toHaveBeenCalledWith('Bus factor set to 0 (top contributor >= 80%)');
  });

  it('should set bus factor to 0.2 when top contributor has ≥ 60% contributions', async () => {
    const card = new Scorecard('https://github.com/owner/repo');
    card.owner = 'owner';
    card.repo = 'repo';

    octokitMock.repos.listContributors.mockResolvedValueOnce({
      data: [
        { contributions: 60 },
        { contributions: 20 },
        { contributions: 10 },
        { contributions: 10 },
      ],
    });

    await busFactorMetric.evaluate(card);

    expect(card.busFactor).toBe(0.2);
    expect(logger.info).toHaveBeenCalledWith('Bus factor set to 0.2 (top contributor >= 60%)');
  });

  it('should set bus factor to 0.5 when top contributor has ≥ 40% contributions', async () => {
    const card = new Scorecard('https://github.com/owner/repo');
    card.owner = 'owner';
    card.repo = 'repo';

    octokitMock.repos.listContributors.mockResolvedValueOnce({
      data: [
        { contributions: 50 },
        { contributions: 30 },
        { contributions: 10 },
        { contributions: 10 },
      ],
    });

    await busFactorMetric.evaluate(card);

    expect(card.busFactor).toBe(0.5);
    expect(logger.info).toHaveBeenCalledWith('Bus factor set to 0.5 (top contributor >= 40%)');
  });

  it('should set bus factor to 1 when top contributor has < 40% contributions', async () => {
    const card = new Scorecard('https://github.com/owner/repo');
    card.owner = 'owner';
    card.repo = 'repo';

    octokitMock.repos.listContributors.mockResolvedValueOnce({
      data: [
        { contributions: 30 },
        { contributions: 30 },
        { contributions: 20 },
        { contributions: 20 },
      ],
    });

    await busFactorMetric.evaluate(card);

    expect(card.busFactor).toBe(1);
    expect(logger.info).toHaveBeenCalledWith('Bus factor set to 1 (top contributor < 40%)');
  });

  it('should handle no contributors and set bus factor to 0', async () => {
    const card = new Scorecard('https://github.com/owner/repo');
    card.owner = 'owner';
    card.repo = 'repo';

    octokitMock.repos.listContributors.mockResolvedValueOnce({
      data: [],
    });

    await busFactorMetric.evaluate(card);

    expect(card.busFactor).toBe(0);
    expect(logger.info).toHaveBeenCalledWith('No contributors found, setting bus factor to 0.');
  });

  it('should handle errors from GitHub API and set bus factor to 0', async () => {
    const card = new Scorecard('https://github.com/owner/repo');
    card.owner = 'owner';
    card.repo = 'repo';

    octokitMock.repos.listContributors.mockRejectedValueOnce(new Error('API Error'));

    await busFactorMetric.evaluate(card);

    expect(card.busFactor).toBe(0);
    expect(logger.error).toHaveBeenCalledWith('Error fetching contributors information:', new Error('API Error'));
  });

  it('should calculate and set busFactor_Latency', async () => {
    const card = new Scorecard('https://github.com/owner/repo');
    card.owner = 'owner';
    card.repo = 'repo';

    octokitMock.repos.listContributors.mockImplementationOnce(async () => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 100));
      return {
        data: [
          { contributions: 30 },
          { contributions: 30 },
          { contributions: 20 },
          { contributions: 20 },
        ],
      };
    });

    const start = Date.now();
    await busFactorMetric.evaluate(card);
    const end = Date.now();

    expect(card.busFactor_Latency).toBeCloseTo((end - start) / 1000, 1);
  });
});
