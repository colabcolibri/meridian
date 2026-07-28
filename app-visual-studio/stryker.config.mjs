/** @type {import('@stryker-mutator/api').PartialStrykerOptions>} */
export default {
  packageManager: "pnpm",
  testRunner: "command",
  commandRunner: {
    command: "pnpm compile && node --import tsx --test test/resolve-meridian-projects.test.ts test/graph-runtime.test.ts",
  },
  mutate: [
    "src/resolve-meridian-projects.ts",
    "src/graph-runtime/render.ts",
  ],
  thresholds: { high: 80, low: 60, break: 50 },
  reporters: ["clear-text", "progress"],
  coverageAnalysis: "off",
};
