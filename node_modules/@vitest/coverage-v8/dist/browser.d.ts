import { V8CoverageProvider } from './provider.js';
import 'istanbul-lib-coverage';
import 'vitest/coverage';
import 'vitest/node';
import 'vitest';

declare const _default: {
    startCoverage(): Promise<void>;
    takeCoverage(): Promise<{
        result: any[];
    }>;
    stopCoverage(): Promise<void>;
    getProvider(): Promise<V8CoverageProvider>;
};

export { _default as default };
