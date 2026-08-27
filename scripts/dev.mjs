import { spawn } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import { createServer, request as requestHttp } from "node:http";
import { tmpdir } from "node:os";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import next from "next";

const HOSTNAME = "127.0.0.1";
const PUBLIC_PORT = Number.parseInt(process.env.PORT ?? "3000", 10);
const FUNCTIONS_PORT = PUBLIC_PORT + 1;
const AGGREGATE_PATH = "/api/storefront/products";
const WRANGLER_VERSION = "4.100.0";

if (
  !Number.isInteger(PUBLIC_PORT) ||
  PUBLIC_PORT < 1 ||
  PUBLIC_PORT >= 65535
) {
  throw new Error(`Invalid PORT: ${process.env.PORT ?? "3000"}`);
}

const functionAssets = await mkdtemp(path.join(tmpdir(), "tws-pages-dev-"));
const npxCommand = process.platform === "win32" ? "npx.cmd" : "npx";
let shuttingDown = false;
let wrangler;
let handleNext;

const server = createServer((request, response) => {
  const pathname = new URL(request.url ?? "/", "http://localhost").pathname;
  if (pathname === AGGREGATE_PATH) {
    proxyToFunctions(request, response);
    return;
  }

  void handleNext(request, response).catch((error) => {
    console.error("Next.js development request failed", error);
    if (!response.headersSent) {
      response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Development server error");
    } else {
      response.destroy(error instanceof Error ? error : undefined);
    }
  });
});

const app = next({
  dev: true,
  dir: process.cwd(),
  hostname: HOSTNAME,
  port: PUBLIC_PORT,
  httpServer: server,
});

function proxyToFunctions(request, response) {
  const upstream = requestHttp(
    {
      hostname: HOSTNAME,
      port: FUNCTIONS_PORT,
      path: request.url,
      method: request.method,
      headers: { ...request.headers, host: `${HOSTNAME}:${FUNCTIONS_PORT}` },
    },
    (upstreamResponse) => {
      response.writeHead(
        upstreamResponse.statusCode ?? 502,
        upstreamResponse.statusMessage,
        upstreamResponse.headers
      );
      upstreamResponse.pipe(response);
    }
  );

  upstream.on("error", (error) => {
    console.error("Pages Functions development proxy failed", error);
    if (!response.headersSent) {
      response.writeHead(502, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ error: "Pages Functions unavailable" }));
    } else {
      response.destroy(error);
    }
  });
  request.pipe(upstream);
}

async function portIsOpen(port) {
  return new Promise((resolve) => {
    const probe = requestHttp(
      { hostname: HOSTNAME, port, path: "/__tws_ready", method: "HEAD" },
      (response) => {
        response.resume();
        resolve(true);
      }
    );
    probe.setTimeout(250, () => {
      probe.destroy();
      resolve(false);
    });
    probe.on("error", () => resolve(false));
    probe.end();
  });
}

async function waitForFunctions() {
  for (let attempt = 0; attempt < 120; attempt += 1) {
    if (wrangler.exitCode !== null) {
      throw new Error(`Wrangler exited before startup (${wrangler.exitCode})`);
    }
    if (await portIsOpen(FUNCTIONS_PORT)) return;
    await delay(250);
  }
  throw new Error("Timed out waiting for Wrangler Pages Functions");
}

async function shutdown(exitCode = 0) {
  if (shuttingDown) return;
  shuttingDown = true;
  if (wrangler?.exitCode === null) wrangler.kill("SIGTERM");
  server.closeAllConnections?.();
  server.close();
  await Promise.race([app.close(), delay(2_000)]);
  await rm(functionAssets, { recursive: true, force: true });
  process.exit(exitCode);
}

process.once("SIGINT", () => void shutdown());
process.once("SIGTERM", () => void shutdown());

try {
  await app.prepare();
  handleNext = app.getRequestHandler();
  wrangler = spawn(
    npxCommand,
    [
      "--yes",
      `wrangler@${WRANGLER_VERSION}`,
      "pages",
      "dev",
      functionAssets,
      "--port",
      String(FUNCTIONS_PORT),
      "--compatibility-date",
      "2024-12-30",
      "--log-level",
      "warn",
      "--show-interactive-dev-session=false",
    ],
    { cwd: process.cwd(), stdio: "inherit" }
  );
  await waitForFunctions();

  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(PUBLIC_PORT, HOSTNAME, resolve);
  });
  console.log(`> Local: http://localhost:${PUBLIC_PORT}`);

  wrangler.once("exit", (code, signal) => {
    if (shuttingDown) return;
    console.error(
      `Wrangler Pages Functions exited unexpectedly (${code ?? signal})`
    );
    void shutdown(1);
  });
} catch (error) {
  console.error("Failed to start development server", error);
  await shutdown(1);
}
