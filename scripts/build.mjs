import { cp, mkdir, rm } from "node:fs/promises";
await rm("dist", { recursive: true, force: true });
await mkdir("dist", { recursive: true });
for (const item of ["index.html", "src", "assets"])
  await cp(item, `dist/${item}`, { recursive: true });
await import("node:fs/promises").then((fs) =>
  fs.writeFile("dist/.nojekyll", ""),
);
console.log("Static app built to dist/ (no runtime dependencies).");
