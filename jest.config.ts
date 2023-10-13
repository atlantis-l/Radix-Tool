import type { JestConfigWithTsJest } from "ts-jest";

const jestConfig: JestConfigWithTsJest = {
  preset: "ts-jest",
  testTimeout: 10000,
  testMatch: [
    // "**/test/manifest-convert.test.ts",
    // "**/test/free-xrd-from-faucet.test.ts",
    // "**/test/radix-wallet-generator.test.ts",
    // "**/test/xrd-transfer.test.ts",
    "**/test/*.test.ts",
  ],
};

export default jestConfig;
