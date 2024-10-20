// tests/metrics/maintainersMetric.test.ts

import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';
import { MaintainersMetric } from '../../src/models/metrics/maintainersMetric';
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

describe('MaintainersMetric', () => {
  let maintainersMetric: MaintainersMetric;
  let octokitMock: {
    issues: {
      listForRepo: Mock;
      listComments: Mock;
    };
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Create mock methods for issues.listForRepo and issues.listComments
    octokitMock = {
      issues: {
        listForRepo: vi.fn(),
        listComments: vi.fn(),
      },
    };

    // Mock the Octokit constructor to return our mock
    (Octokit as unknown as Mock).mockImplementation(() => octokitMock);

    // Instantiate MaintainersMetric (it will use the mocked Octokit)
    maintainersMetric = new MaintainersMetric();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should set responsiveMaintainer to 1 when average response time ≤ 72 hours', async () => {
    const card = new Scorecard('https://github.com/owner/repo');
    card.owner = 'owner';
    card.repo = 'repo';

    // Mock issues within the last 30 days
    octokitMock.issues.listForRepo.mockResolvedValueOnce({
      data: [
        {
          number: 1,
          created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        },
      ],
    });

    // Mock comments with maintainer response within 24 hours
    octokitMock.issues.listComments.mockResolvedValueOnce({
      data: [
        {
          created_at: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(), // 20 hours ago
          author_association: 'MEMBER',
          user: { login: 'maintainer' },
        },
      ],
    });

    await maintainersMetric.evaluate(card);

    expect(card.responsiveMaintainer).toBe(1);
    expect(logger.info).toHaveBeenCalledWith('Average response time is within 72 hours (3 days). Setting score to 1.');
  });

  it('should set responsiveMaintainer to 0.7 when average response time ≤ 168 hours', async () => {
    const card = new Scorecard('https://github.com/owner/repo');
    card.owner = 'owner';
    card.repo = 'repo';

    // Mock issues
    octokitMock.issues.listForRepo.mockResolvedValueOnce({
      data: [
        {
          number: 1,
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
        },
      ],
    });

    // Mock comments with maintainer response after 4 days
    octokitMock.issues.listComments.mockResolvedValueOnce({
      data: [
        {
          created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
          author_association: 'MEMBER',
          user: { login: 'maintainer' },
        },
      ],
    });

    await maintainersMetric.evaluate(card);

    expect(card.responsiveMaintainer).toBe(0.7);
    expect(logger.info).toHaveBeenCalledWith('Average response time is within 168 hours (7 days). Setting score to 0.7.');

  });

  it('should set responsiveMaintainer to 0.4 when average response time ≤ 336 hours', async () => {
    const card = new Scorecard('https://github.com/owner/repo');
    card.owner = 'owner';
    card.repo = 'repo';

    // Mock issues
    octokitMock.issues.listForRepo.mockResolvedValueOnce({
      data: [
        {
          number: 1,
          created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
        },
      ],
    });

    // Mock comments with maintainer response after 10 days
    octokitMock.issues.listComments.mockResolvedValueOnce({
      data: [
        {
          created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
          author_association: 'MEMBER',
          user: { login: 'maintainer' },
        },
      ],
    });

    await maintainersMetric.evaluate(card);

    expect(card.responsiveMaintainer).toBe(0.4);
    expect(logger.info).toHaveBeenCalledWith('Average response time is within 336 hours (14 days). Setting score to 0.4.');
  });

  it('should set responsiveMaintainer to 0 when average response time > 336 hours', async () => {
    const card = new Scorecard('https://github.com/owner/repo');
    card.owner = 'owner';
    card.repo = 'repo';

    // Mock issues
    octokitMock.issues.listForRepo.mockResolvedValueOnce({
      data: [
        {
          number: 1,
          created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days ago
        },
      ],
    });

    // Mock comments with maintainer response after 15 days
    octokitMock.issues.listComments.mockResolvedValueOnce({
      data: [
        {
          created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
          author_association: 'MEMBER',
        },
      ],
    });

    await maintainersMetric.evaluate(card);

    expect(card.responsiveMaintainer).toBe(0);
    expect(logger.info).toHaveBeenCalledWith('No responses found from maintainers. Setting responsiveMaintainer score to 0.');
  });

  it('should set responsiveMaintainer to 1 when no issues are found', async () => {
    const card = new Scorecard('https://github.com/owner/repo');
    card.owner = 'owner';
    card.repo = 'repo';

    // Mock no issues
    octokitMock.issues.listForRepo.mockResolvedValueOnce({
      data: [],
    });

    await maintainersMetric.evaluate(card);

    expect(card.responsiveMaintainer).toBe(1);
    expect(logger.info).toHaveBeenCalledWith('No open issues found. Setting responsiveMaintainer score to 1.');
  });

  it('should handle errors gracefully and set responsiveMaintainer to 0', async () => {
    const card = new Scorecard('https://github.com/owner/repo');
    card.owner = 'owner';
    card.repo = 'repo';

    // Mock an error when fetching issues
    octokitMock.issues.listForRepo.mockRejectedValueOnce(new Error('API Error'));

    await maintainersMetric.evaluate(card);

    expect(card.responsiveMaintainer).toBe(0);
    expect(logger.error).toHaveBeenCalledWith(
      `Error fetching responsiveness information for owner/repo:`,
      new Error('API Error')
    );
  });

  it('should handle issues with no maintainer responses', async () => {
    const card = new Scorecard('https://github.com/owner/repo');
    card.owner = 'owner';
    card.repo = 'repo';

    // Mock issues
    octokitMock.issues.listForRepo.mockResolvedValueOnce({
      data: [
        {
          number: 1,
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        },
      ],
    });

    // Mock comments with no valid maintainer responses
    octokitMock.issues.listComments.mockResolvedValueOnce({
      data: [
        {
          created_at: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(), // 20 hours ago
          author_association: 'NONE',
        },
      ],
    });

    await maintainersMetric.evaluate(card);

    expect(card.responsiveMaintainer).toBe(0);
    expect(logger.info).toHaveBeenCalledWith('No responses found from maintainers. Setting responsiveMaintainer score to 0.');
  });

  it('should calculate and set responsiveMaintainer_Latency', async () => {
    const card = new Scorecard('https://github.com/owner/repo');
    card.owner = 'owner';
    card.repo = 'repo';

    // Simulate API delay
    octokitMock.issues.listForRepo.mockImplementationOnce(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return {
        data: [
          {
            number: 1,
            created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          },
        ],
      };
    });

    // Mock comments with maintainer response
    octokitMock.issues.listComments.mockResolvedValueOnce({
      data: [
        {
          created_at: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(), // 20 hours ago
          author_association: 'MEMBER',
        },
      ],
    });

    const start = Date.now();
    await maintainersMetric.evaluate(card);
    const end = Date.now();

    const expectedLatency = parseFloat(((end - start) / 1000).toFixed(3));
    expect(card.responsiveMaintainer_Latency).toBeCloseTo(expectedLatency, 1);
  });
});
