import { g as globalApis } from './constants.fzPh7AOq.js';
import { V as VitestIndex } from './index.iyKRMe3s.js';
import '@vitest/runner';
import './benchmark.C8CRJYG4.js';
import '@vitest/runner/utils';
import '@vitest/utils';
import './index.CxRxs566.js';
import 'pathe';
import './utils.Ck2hJTRs.js';
import './env.CmHVDJnw.js';
import 'std-env';
import './run-once.Sxe67Wng.js';
import './vi.D6IHiKAI.js';
import 'chai';
import './_commonjsHelpers.BFTU3MAI.js';
import '@vitest/expect';
import '@vitest/snapshot';
import '@vitest/utils/error';
import './tasks.BZnCS9aT.js';
import '@vitest/utils/source-map';
import './base.BlXpj3e_.js';
import './date.W2xKR2qe.js';
import '@vitest/spy';

function registerApiGlobally() {
  globalApis.forEach((api) => {
    globalThis[api] = VitestIndex[api];
  });
}

export { registerApiGlobally };
