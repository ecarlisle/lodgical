import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const bundlePath = resolve("apps/web/.netlify/functions/api.zip");
const extractPath = mkdtempSync(join(tmpdir(), "lodgical-netlify-function-"));

try {
  execFileSync("unzip", ["-q", bundlePath, "-d", extractPath]);

  const { handler } = await import(pathToFileURL(join(extractPath, "api.js")));
  const response = await handler(
    {
      body: null,
      headers: {},
      httpMethod: "GET",
      isBase64Encoded: false,
      multiValueHeaders: {},
      multiValueQueryStringParameters: null,
      path: "/api/health",
      queryStringParameters: null,
      requestContext: {},
    },
    {},
  );

  if (response.statusCode !== 200) {
    throw new Error(
      `Expected packaged /api/health to return 200, received ${response.statusCode}`,
    );
  }

  const body = JSON.parse(response.body);
  if (body.status !== "ok") {
    throw new Error(`Unexpected health response: ${response.body}`);
  }

  console.log("Packaged Netlify API smoke test passed.");
} finally {
  rmSync(extractPath, { recursive: true, force: true });
}
