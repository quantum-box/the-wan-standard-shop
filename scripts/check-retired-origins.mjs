import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { performance } from "node:perf_hooks";

const DEFAULT_ARTIFACT_DIRECTORY = "out";
const DEFAULT_REGISTRY_FILE = "config/retired-origins.txt";

function displayPath(filePath) {
  return path.relative(process.cwd(), filePath).split(path.sep).join("/");
}

function errorMessage(error) {
  return error instanceof Error ? error.message : String(error);
}

async function loadRetiredOrigins(registryFile) {
  let contents;

  try {
    contents = await readFile(registryFile, "utf8");
  } catch (error) {
    throw new Error(
      `cannot read registry ${displayPath(registryFile)}: ${errorMessage(error)}`,
    );
  }

  const origins = contents
    .split(/\r?\n/u)
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith("#"));

  if (origins.length === 0) {
    throw new Error(
      `registry ${displayPath(registryFile)} has no active retired origins`,
    );
  }

  return [...new Set(origins)];
}

async function listRegularFiles(directory) {
  let directoryStat;

  try {
    directoryStat = await stat(directory);
  } catch (error) {
    throw new Error(
      `cannot access artifact directory ${displayPath(directory)}: ${errorMessage(error)}`,
    );
  }

  if (!directoryStat.isDirectory()) {
    throw new Error(
      `artifact path ${displayPath(directory)} is not a directory`,
    );
  }

  const files = [];

  async function visit(currentDirectory) {
    const entries = await readdir(currentDirectory, { withFileTypes: true });
    entries.sort((left, right) => left.name.localeCompare(right.name));

    for (const entry of entries) {
      const entryPath = path.join(currentDirectory, entry.name);
      if (entry.isDirectory()) {
        await visit(entryPath);
      } else if (entry.isFile()) {
        files.push(entryPath);
      }
    }
  }

  await visit(directory);
  return files;
}

async function main() {
  const startedAt = performance.now();
  const [artifactDirectoryArgument, registryFileArgument] = process.argv.slice(2);
  const artifactDirectory = path.resolve(
    artifactDirectoryArgument ?? DEFAULT_ARTIFACT_DIRECTORY,
  );
  const registryFile = path.resolve(
    registryFileArgument ?? DEFAULT_REGISTRY_FILE,
  );

  const retiredOrigins = await loadRetiredOrigins(registryFile);
  const needles = retiredOrigins.map((origin) => ({
    origin,
    bytes: Buffer.from(origin, "utf8"),
  }));
  const artifactFiles = await listRegularFiles(artifactDirectory);
  const matches = [];

  for (const artifactFile of artifactFiles) {
    const contents = await readFile(artifactFile);
    for (const needle of needles) {
      if (contents.includes(needle.bytes)) {
        matches.push({
          origin: needle.origin,
          file: displayPath(artifactFile),
        });
      }
    }
  }

  const elapsedMilliseconds = (performance.now() - startedAt).toFixed(1);

  if (matches.length > 0) {
    console.error(
      `[retired-origin-scan] FAIL: found ${matches.length} retired-origin reference(s):`,
    );
    for (const match of matches) {
      console.error(`- ${match.origin}\t${match.file}`);
    }
    console.error(
      `[retired-origin-scan] Scanned ${artifactFiles.length} file(s) in ${elapsedMilliseconds} ms.`,
    );
    process.exitCode = 1;
    return;
  }

  console.log(
    `[retired-origin-scan] PASS: scanned ${artifactFiles.length} file(s) against ${retiredOrigins.length} retired origin(s) in ${elapsedMilliseconds} ms.`,
  );
}

main().catch((error) => {
  console.error(`[retired-origin-scan] ERROR: ${errorMessage(error)}`);
  process.exitCode = 1;
});
