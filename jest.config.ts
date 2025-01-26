/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from "jest";

const config: Config = {
    rootDir: ".",
    clearMocks: true,
    collectCoverage: true,
    collectCoverageFrom: ["**/*.ts"],
    coverageDirectory: "./coverage",
    coverageProvider: "v8",
    moduleFileExtensions: ["js", "ts", "json"],
    testEnvironment: "node",
    testRegex: [".*\\.spec\\.ts$"],
    moduleNameMapper: {
        "^@storage/(.+)$": "<rootDir>/src/storage/$1",
        "^@loader/(.+)$": "<rootDir>/src/loader/$1",
        "^@test/(.+)$": "<rootDir>/test/$1",
    },
    transform: {
        "^.+\\.(t|j)s$": "@swc/jest",
    },
};

// eslint-disable-next-line import/no-default-export
export default config;
