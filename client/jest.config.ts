import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  verbose: true,
  globals: {
    "ts-jest": {
      babelConfig: true,
    },
  },
  preset: "ts-jest",
  testEnvironment: "jsdom",
  testPathIgnorePatterns: ["/node_modules/"],
  setupFilesAfterEnv: ["<rootDir>/setupTests.ts"],
  transform: {
    "^.+\\.ts?$": "ts-jest",
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  testMatch: ["**/__tests__/**/(*.)(ts|tsx)"],
};

export default config;
