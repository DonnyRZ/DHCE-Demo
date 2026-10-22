const base = new URL(process.env.BASE_URL);
if (base.protocol !== "https:")
  throw new Error("Public verification requires HTTPS.");
const expected = process.env.EXPECTED_REVISION;
if (!expected) throw new Error("EXPECTED_REVISION is required.");
let lastError;
for (let attempt = 0; attempt < 6; attempt++) {
  try {
    const endpoint = new URL("build.json", base);
    endpoint.searchParams.set("revision", expected);
    const response = await fetch(endpoint, {
      signal: AbortSignal.timeout(15000),
      cache: "no-store",
    });
    if (!response.ok) throw new Error(`Build metadata HTTP ${response.status}`);
    const metadata = await response.json();
    if (metadata.revision !== expected)
      throw new Error("Pages CDN still serves a previous revision.");
    const index = await fetch(base, {
      signal: AbortSignal.timeout(15000),
      cache: "no-store",
    });
    if (!index.ok || !(await index.text()).includes("./src/app.js"))
      throw new Error("App entry point is unavailable.");
    console.log(`Public HTTPS verified: ${base.href} · revision ${expected}`);
    process.exit(0);
  } catch (error) {
    lastError = error;
    console.log(
      `Waiting for published revision (${attempt + 1}/6): ${error.message}`,
    );
    if (attempt < 5) await new Promise((resolve) => setTimeout(resolve, 10000));
  }
}
throw lastError;
