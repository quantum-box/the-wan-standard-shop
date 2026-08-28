// Fails the build when a shipped artifact would make the browser speak to Field
// anywhere but the public storefront.
//
// `/v1/graphql` and most of `/v1/storekit` are quarantined or Bearer-only, and
// an unauthenticated caller cannot name a tenant in a header — Field's tenant
// boundary refuses it. Every one of those reaching the browser again would be a
// silent regression to the 403s that emptied `/shop`, so they are checked here
// rather than discovered in production.
import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";

const FORBIDDEN = [
  {
    needle: "/v1/graphql",
    reason: "quarantined route — use /v1/public/storefront/{tenant_id}/…",
  },
  {
    needle: "/v1/storekit/",
    reason: "Bearer-only route — the shop holds no Field token",
  },
  {
    needle: "x-operator-id",
    reason: "header tenant selection is rejected on unauthenticated calls",
  },
  {
    needle: "x-platform-id",
    reason: "header tenant selection is rejected on unauthenticated calls",
  },
];

function displayPath(filePath) {
  return path.relative(process.cwd(), filePath).split(path.sep).join("/");
}

async function listRegularFiles(directory) {
  const files = [];

  async function visit(currentDirectory) {
    const entries = await readdir(currentDirectory, { withFileTypes: true });
    entries.sort((left, right) => left.name.localeCompare(right.name));
    for (const entry of entries) {
      const entryPath = path.join(currentDirectory, entry.name);
      if (entry.isDirectory()) await visit(entryPath);
      else if (entry.isFile()) files.push(entryPath);
    }
  }

  await visit(directory);
  return files;
}

const artifactDirectory = path.resolve(process.argv[2] ?? "out");

let directoryStat;
try {
  directoryStat = await stat(artifactDirectory);
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(
    `[browser-surface-scan] cannot access artifact directory ${displayPath(artifactDirectory)}: ${message}`,
  );
  process.exit(1);
}

if (!directoryStat.isDirectory()) {
  console.error(
    `[browser-surface-scan] artifact path ${displayPath(artifactDirectory)} is not a directory`,
  );
  process.exit(1);
}

const needles = FORBIDDEN.map((entry) => ({
  ...entry,
  bytes: Buffer.from(entry.needle, "utf8"),
}));
const artifactFiles = await listRegularFiles(artifactDirectory);
const matches = [];

for (const artifactFile of artifactFiles) {
  const contents = await readFile(artifactFile);
  for (const needle of needles) {
    if (contents.includes(needle.bytes)) {
      matches.push({ ...needle, file: displayPath(artifactFile) });
    }
  }
}

if (matches.length > 0) {
  console.error(
    `[browser-surface-scan] FAIL: found ${matches.length} non-public Field reference(s):`,
  );
  for (const match of matches) {
    console.error(`- ${match.needle}\t${match.file}\t(${match.reason})`);
  }
  process.exit(1);
}

console.log(
  `[browser-surface-scan] PASS: scanned ${artifactFiles.length} file(s) against ${needles.length} forbidden reference(s).`,
);
