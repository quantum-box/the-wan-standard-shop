import { expect, test } from "@playwright/test";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import path from "node:path";

const RETIRED_ORIGIN = "bakuure.api.n1.tachy.one";
const REPOSITORY_ROOT = process.cwd();
const TEST_DIRECTORY = path.join(REPOSITORY_ROOT, "tests");
const SCANNER = path.join(
  REPOSITORY_ROOT,
  "scripts/check-retired-origins.mjs",
);
const REGISTRY = path.join(
  REPOSITORY_ROOT,
  "config/retired-origins.txt",
);
const FIXTURES = path.join(TEST_DIRECTORY, "fixtures/build-artifacts");

function runScanner(artifactDirectory: string, registryFile = REGISTRY) {
  return spawnSync(process.execPath, [SCANNER, artifactDirectory, registryFile], {
    cwd: REPOSITORY_ROOT,
    encoding: "utf8",
  });
}

function activeRegistryEntries(contents: string) {
  return contents
    .split(/\r?\n/u)
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith("#"));
}

test("fails when a build artifact contains a retired origin", () => {
  const result = runScanner(path.join(FIXTURES, "retired"));

  expect(result.status).toBe(1);
  expect(result.stderr).toContain(RETIRED_ORIGIN);
  expect(result.stderr).toContain(
    "tests/fixtures/build-artifacts/retired/_next/static/chunks/storefront.js",
  );
});

test("passes when build artifacts contain only the canonical origin", () => {
  const result = runScanner(path.join(FIXTURES, "canonical"));

  expect(result.status).toBe(0);
  expect(result.stdout).toContain("[retired-origin-scan] PASS");
  expect(result.stderr).toBe("");
});

test("fails closed when the registry has no active entries", async () => {
  const temporaryDirectory = await mkdtemp(
    path.join(tmpdir(), "tws-retired-origin-registry-"),
  );
  const emptyRegistry = path.join(temporaryDirectory, "retired-origins.txt");

  try {
    await writeFile(emptyRegistry, "\n# No active entries\n", "utf8");
    const result = runScanner(
      path.join(FIXTURES, "canonical"),
      emptyRegistry,
    );

    expect(result.status).toBe(1);
    expect(result.stderr).toContain("has no active retired origins");
  } finally {
    await rm(temporaryDirectory, { recursive: true, force: true });
  }
});

test("keeps the initial retired origin as a registry ratchet", async () => {
  const entries = activeRegistryEntries(await readFile(REGISTRY, "utf8"));

  expect(entries).toContain(RETIRED_ORIGIN);
});

test("fails closed when the registry or artifact directory is missing", () => {
  const missingRegistry = runScanner(
    path.join(FIXTURES, "canonical"),
    path.join(FIXTURES, "missing-registry.txt"),
  );
  expect(missingRegistry.status).toBe(1);
  expect(missingRegistry.stderr).toContain("cannot read registry");

  const missingArtifacts = runScanner(path.join(FIXTURES, "missing-artifacts"));
  expect(missingArtifacts.status).toBe(1);
  expect(missingArtifacts.stderr).toContain("cannot access artifact directory");
});
