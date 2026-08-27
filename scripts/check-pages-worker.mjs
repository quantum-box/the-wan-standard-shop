import { readFile } from "node:fs/promises";

const workerPath = process.argv[2];

if (!workerPath) {
  console.error("[pages-worker-scan] missing worker path");
  process.exit(1);
}

let source;
try {
  source = await readFile(workerPath, "utf8");
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[pages-worker-scan] cannot read ${workerPath}: ${message}`);
  process.exit(1);
}

const nodeImport = source.match(/\bfrom\s*["']node:[^"']+["']/u)?.[0];
if (nodeImport) {
  console.error(`[pages-worker-scan] Node builtin import found: ${nodeImport}`);
  process.exit(1);
}

if (!source.includes("/api/storefront/products")) {
  console.error("[pages-worker-scan] storefront products route is missing");
  process.exit(1);
}

console.log(`[pages-worker-scan] PASS: ${workerPath}`);
