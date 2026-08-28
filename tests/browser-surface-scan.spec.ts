import { expect, test } from "@playwright/test";
import { spawnSync } from "node:child_process";
import path from "node:path";

const REPOSITORY_ROOT = process.cwd();
const SCANNER = path.join(REPOSITORY_ROOT, "scripts/check-browser-surface.mjs");
const FIXTURES = path.join(REPOSITORY_ROOT, "tests/fixtures/browser-surface");

function runScanner(artifactDirectory: string) {
  return spawnSync(process.execPath, [SCANNER, artifactDirectory], {
    cwd: REPOSITORY_ROOT,
    encoding: "utf8",
  });
}

test("fails when a build artifact would send the browser back to GraphQL", () => {
  const result = runScanner(path.join(FIXTURES, "graphql"));

  expect(result.status).toBe(1);
  expect(result.stderr).toContain("/v1/graphql");
  expect(result.stderr).toContain("x-operator-id");
  expect(result.stderr).toContain(
    "tests/fixtures/browser-surface/graphql/_next/static/chunks/storefront.js",
  );
});

test("passes when artifacts only reach the public storefront", () => {
  const result = runScanner(path.join(FIXTURES, "public"));

  expect(result.status).toBe(0);
  expect(result.stdout).toContain("[browser-surface-scan] PASS");
  expect(result.stderr).toBe("");
});

test("fails closed when the artifact directory is missing", () => {
  const result = runScanner(path.join(FIXTURES, "missing-artifacts"));

  expect(result.status).toBe(1);
  expect(result.stderr).toContain("cannot access artifact directory");
});
