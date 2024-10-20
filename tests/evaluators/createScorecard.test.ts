// tests/helpers/createScorecard.test.ts

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createScorecard } from '../../src/models/evaluators/createScorecard';
import { Scorecard } from '../../src/models/scores/scorecard';

// Mock the logger
vi.mock('../../logger.js', () => ({
  default: {
    info: vi.fn(),
    debug: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock the global fetch function
vi.stubGlobal('fetch', vi.fn());

// Type assertion for fetch
import type { Mock } from 'vitest';
const fetchMock = fetch as Mock;

describe('createScorecard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a Scorecard for a GitHub URL', async () => {
    const url = 'https://github.com/owner/repo';
    const scorecard = await createScorecard(url);

    expect(scorecard).toBeInstanceOf(Scorecard);
    expect(scorecard.owner).toBe('owner');
    expect(scorecard.repo).toBe('repo');
  });

  it('should create a Scorecard for an npm URL', async () => {
    const url = 'https://www.npmjs.com/package/example-package';

    // Mock the fetch response for the npm API call
    fetchMock.mockResolvedValueOnce({
      json: async () => ({
        repository: {
          url: 'https://github.com/owner/repo',
        },
      }),
    } as Response);

    const scorecard = await createScorecard(url);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(scorecard).toBeInstanceOf(Scorecard);
    expect(scorecard.owner).toBe('owner');
    expect(scorecard.repo).toBe('repo');
  });

  it('should throw an error for an invalid URL', async () => {
    const url = 'https://invalidurl.com/package/example-package';

    await expect(createScorecard(url)).rejects.toThrow('Invalid URL');
  });

  it('should handle npm URL with repository URL ending with .git', async () => {
    const url = 'https://www.npmjs.com/package/example-package';

    fetchMock.mockResolvedValueOnce({
      json: async () => ({
        repository: {
          url: 'https://github.com/owner/repo.git',
        },
      }),
    } as Response);

    const scorecard = await createScorecard(url);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(scorecard).toBeInstanceOf(Scorecard);
    expect(scorecard.owner).toBe('owner');
    expect(scorecard.repo).toBe('repo'); // '.git' should be removed
  });

  it('should handle npm URL when repository URL is not provided', async () => {
    const url = 'https://www.npmjs.com/package/example-package';

    fetchMock.mockResolvedValueOnce({
      json: async () => ({
        // No repository field
      }),
    } as Response);

    await expect(createScorecard(url)).rejects.toThrow('Repository URL not found in npm package data');
  });
});
