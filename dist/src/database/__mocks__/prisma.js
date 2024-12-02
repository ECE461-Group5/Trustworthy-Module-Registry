// libs/__mocks__/prisma.ts
import { beforeEach } from "vitest";
import { mockDeep, mockReset } from "vitest-mock-extended";
// 2
beforeEach(() => {
    mockReset(prisma);
});
// 3
const prisma = mockDeep();
export default prisma;
//# sourceMappingURL=prisma.js.map