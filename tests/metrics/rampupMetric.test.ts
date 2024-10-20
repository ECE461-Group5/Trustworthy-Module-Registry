// tests/metrics/correctnessMetric.test.ts

import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';
import { RampUpMetric } from '../../src/models/metrics/rampupMetric';
import { Scorecard } from '../../src/models/scores/scorecard';

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


import { Octokit } from '@octokit/rest';
import { CorrectnessMetric } from '../../src/models/metrics/correctnessMetric';
import exp from 'constants';

describe('RampUpMetric', () => {
  let rampUpMetric: RampUpMetric;

  let octokitMock: {
    repos: {
      getReadme: Mock;
    };
  }

  beforeEach(() => {
    vi.clearAllMocks();

    // Create mock methods for repos.getReadme
    octokitMock = {
      repos: {
        getReadme: vi.fn(),
      }
    };

    (Octokit as unknown as Mock).mockImplementation(() => octokitMock);

    rampUpMetric = new RampUpMetric();

  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize correctly', () => {
    expect(rampUpMetric).toBeDefined();
  });

  it('should return a score of 0 if the repository has no README', async () => {
    octokitMock.repos.getReadme.mockResolvedValue({ data: { content: '' } });

    const card = new Scorecard('https://github.com/owner/repo');
    card.owner = 'owner';
    card.repo = 'repo';

    octokitMock.repos.getReadme.mockResolvedValueOnce({
      data: {
      },
    });

    await rampUpMetric.evaluate(card);

    expect(card.rampUp).toBe(0);
  
  });

  it('should set ramp up score to 1 if README contains all important sections', async () => {
    octokitMock.repos.getReadme.mockResolvedValue({ data: { content: '' } });

    const card = new Scorecard('https://github.com/owner/repo');
    card.owner = 'owner';
    card.repo = 'repo';

    octokitMock.repos.getReadme.mockResolvedValueOnce({
      data: {
        content: Buffer.from(`
          ## License
          ## Support
          ## Getting Started
          ## Installation
          ## Usage
          ## Contributing
          ## License
          ## Contributing
        `).toString('base64'),
      },
    });

    await rampUpMetric.evaluate(card);

    expect(card.rampUp).toBe(1);

  });

  it('should set ramp up score to 0.2 if README contains more than two code blocks', async () => {
    octokitMock.repos.getReadme.mockResolvedValue({ data: { content: '' } });

    const card = new Scorecard('https://github.com/owner/repo');
    card.owner = 'owner';
    card.repo = 'repo';

    octokitMock.repos.getReadme.mockResolvedValueOnce({
      data: {
        content: Buffer.from(`
          \`\`\`js
          const x = 1;
          \`\`\`
          \`\`\`js
          const y = 2;
          \`\`\`
        `).toString('base64'),
      },
    });

    await rampUpMetric.evaluate(card);

    expect(card.rampUp).toBe(0.2);

  });

  it('should set ramp up score to 0.1 if README contains few linting errors', async () => {
    octokitMock.repos.getReadme.mockResolvedValue({ data: { content: '' } });

    const card = new Scorecard('https://github.com/owner/repo');
    card.owner = 'owner';
    card.repo = 'repo';

    octokitMock.repos.getReadme.mockResolvedValueOnce({
      data: {
        content: Buffer.from(`
          # Hello

          ## You're a piece of work
          
        `).toString('base64'),
      },
    });

    await rampUpMetric.evaluate(card);

    expect(card.rampUp).toBe(0.1);

  });

  it('should set ramp up score to 0.1 if README contains more than 5 links', async () => {
    octokitMock.repos.getReadme.mockResolvedValue({ data: { content: '' } });

    const card = new Scorecard('https://github.com/owner/repo');
    card.owner = 'owner';
    card.repo = 'repo';

    octokitMock.repos.getReadme.mockResolvedValueOnce({
      data: {
        content: `
          # Project Title
          This is a sample README with some linting issues and links.
          To install this project, follow these steps:
          ## Links
          [link1](http://example.com)
          [link2](http://example.com)
          [link3](http://example.com)
          [link4](http://example.com)
          [link5](http://example.com)
          [link6](http://example.com)

          <!-- Linting issues -->
          <img src="image.png">
          <a href="http://example.com">Example</a>
          <a href="http://example.com">Example</a>
          <script>alert('test');</script>
        `,
      },
    });

    await rampUpMetric.evaluate(card);

    expect(card.rampUp).toBe(0.1);
  });

});