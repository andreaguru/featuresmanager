const nextJest = require("next/jest");
const createJestConfig = nextJest({
    dir: "./",
});
const customJestConfig = {
    moduleDirectories: ["node_modules", "<rootDir>/"],
    testEnvironment: "jsdom",
    verbose: true,
    collectCoverage: false,
    moduleNameMapper: {
     "nanoid": "<rootDir>/node_modules/nanoid/index.browser.cjs"
   },
};

// we don't want to see logs while running tests, so we silent them like this.
process.env.LOG_LEVEL = "silent";

module.exports = createJestConfig(customJestConfig);