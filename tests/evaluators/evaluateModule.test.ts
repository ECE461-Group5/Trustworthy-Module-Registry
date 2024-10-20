// tests/helpers/evaluateModule.test.ts

import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';
import { evaluateModule } from '../../src/models/evaluators/evaluateModule';
import { Scorecard } from '../../src/models/scores/scorecard';
import { Metric } from '../../src/models/metrics/metric';

// Mock the logger
vi.mock('../../logger.js', () => ({
  default: {
    info: vi.fn(),
    debug: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock createScorecard
vi.mock('../../src/models/evaluators/createScorecard.js', () => ({
  createScorecard: vi.fn(),
}));

// Mock the Metric subclasses
vi.mock('../../src/metrics/busfactorMetric.js');
vi.mock('../../src/metrics/correctnessMetric.js');
vi.mock('../../src/metrics/licenseMetric.js');
vi.mock('../../src/metrics/maintainersMetric.js');
vi.mock('../../src/metrics/rampupMetric.js');

// Import the mocks
import { createScorecard } from '../../src/models/evaluators/createScorecard';
import { BusFactorMetric } from '../../src/models/metrics/busfactorMetric';
import { CorrectnessMetric } from '../../src/models/metrics/correctnessMetric';
import { LicenseMetric } from '../../src/models/metrics/licenseMetric';
import { MaintainersMetric } from '../../src/models/metrics/maintainersMetric';
import { RampUpMetric } from '../../src/models/metrics/rampupMetric';

describe('evaluateModule', () => {
  const mockEvaluate = vi.fn();

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();

    // Mock createScorecard to return a dummy Scorecard
    (createScorecard as Mock).mockResolvedValue(
      new Scorecard('https://github.com/owner/repo')
    );

    // Mock the evaluate methods of each metric
    BusFactorMetric.prototype.evaluate = mockEvaluate;
    CorrectnessMetric.prototype.evaluate = mockEvaluate;
    LicenseMetric.prototype.evaluate = mockEvaluate;
    MaintainersMetric.prototype.evaluate = mockEvaluate;
    RampUpMetric.prototype.evaluate = mockEvaluate;

    // Optionally, set up mock implementations for evaluate
    mockEvaluate.mockImplementation(async (scorecard: Scorecard) => {
      // Simulate setting a metric score
      scorecard.busFactor = 0.8;
      scorecard.correctness = 0.9;
      scorecard.license = 1.0;
      scorecard.responsiveMaintainer = 0.7;
      scorecard.rampUp = 0.6;
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should evaluate all metrics and return results', async () => {
    const url = 'https://github.com/owner/repo';

    const results = await evaluateModule(url);

    // Ensure createScorecard was called with the correct URL
    expect(createScorecard).toHaveBeenCalledWith(url);

    // Ensure each metric's evaluate method was called
    expect(mockEvaluate).toHaveBeenCalledTimes(5);

    // Parse the results
    const parsedResults = JSON.parse(results);

    // Check that the results contain expected properties
    expect(parsedResults).toHaveProperty('URL', url);
    expect(parsedResults).toHaveProperty('NetScore');
    expect(parsedResults).toHaveProperty('BusFactor', 0.8);
    expect(parsedResults).toHaveProperty('Correctness', 0.9);
    expect(parsedResults).toHaveProperty('License', 1.0);
    expect(parsedResults).toHaveProperty('ResponsiveMaintainer', 0.7);
    expect(parsedResults).toHaveProperty('RampUp', 0.6);
  });

  it('should handle errors from createScorecard', async () => {
    const url = 'invalid-url';

    // Mock createScorecard to throw an error
    (createScorecard as Mock).mockRejectedValue(new Error('Invalid URL'));

    await expect(evaluateModule(url)).rejects.toThrow('Invalid URL');

    // Ensure metrics were not evaluated
    expect(mockEvaluate).not.toHaveBeenCalled();
  });
});
