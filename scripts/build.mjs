import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
await rm("dist", { recursive: true, force: true });
await mkdir("dist", { recursive: true });
for (const item of ["index.html", "src", "assets"])
  await cp(item, `dist/${item}`, { recursive: true });
await import("node:fs/promises").then((fs) =>
  fs.writeFile("dist/.nojekyll", ""),
);
let revision = process.env.GITHUB_SHA;
if (!revision) {
  try {
    revision = execFileSync("git", ["rev-parse", "HEAD"], {
      encoding: "utf8",
    }).trim();
  } catch {
    revision = "local";
  }
}
await writeFile(
  "dist/build.json",
  JSON.stringify({ revision, builtAt: new Date().toISOString() }),
);
console.log("Static app built to dist/ (no runtime dependencies).");
