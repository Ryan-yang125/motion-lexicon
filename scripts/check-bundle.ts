import { readdirSync, statSync } from "node:fs";
import path from "node:path";
import { gzipSync } from "node:zlib";
import { readFileSync } from "node:fs";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

const assetsDir = path.join("dist", "assets");
const assetFiles = readdirSync(assetsDir);
const jsFiles = assetFiles.filter((file) => file.endsWith(".js"));
const cssFiles = assetFiles.filter((file) => file.endsWith(".css"));
assert(jsFiles.length > 0, "No JS bundle found in dist/assets");
assert(cssFiles.length > 0, "No CSS bundle found in dist/assets");
assert(!assetFiles.some((file) => file.endsWith(".map")), "Production source maps must not be published");
assert(jsFiles.some((file) => file.startsWith("vendor-")), "Stable vendor bundle is missing");

const maxChunkRawBytes = 650 * 1024;
const maxChunkGzipBytes = 160 * 1024;
// V4 ships twenty-eight live registry components, forty-four primitives, and
// eight lazy-loaded scenario guides. Motion and editorial content retain
// independent chunk ceilings.
const maxMotionVendorGzipBytes = 52 * 1024;
const maxScenarioGuideArticlesGzipBytes = 70 * 1024;
const maxTotalJsGzipBytes = 520 * 1024;
const maxTotalCssGzipBytes = 48 * 1024;
let totalJsGzipBytes = 0;

for (const file of jsFiles) {
  const fullPath = path.join(assetsDir, file);
  const rawSize = statSync(fullPath).size;
  const gzipSize = gzipSync(readFileSync(fullPath)).length;
  totalJsGzipBytes += gzipSize;
  assert(rawSize <= maxChunkRawBytes, `${file} raw size ${rawSize} exceeds ${maxChunkRawBytes}`);
  assert(gzipSize <= maxChunkGzipBytes, `${file} gzip size ${gzipSize} exceeds ${maxChunkGzipBytes}`);
}

const componentsChunk = jsFiles.find((file) => file.startsWith("components.lazy-"));
assert(componentsChunk, "Components route chunk is missing");
assert(
  gzipSync(readFileSync(path.join(assetsDir, componentsChunk))).length <= 12 * 1024,
  "Components route shell exceeds 12 KiB gzip"
);

const componentDetailChunk = jsFiles.find((file) => file.startsWith("component.lazy-"));
assert(componentDetailChunk, "Component detail route chunk is missing");
assert(
  gzipSync(readFileSync(path.join(assetsDir, componentDetailChunk))).length <= 72 * 1024,
  "Component detail source bundle exceeds 72 KiB gzip"
);

const motionVendorChunk = jsFiles.find((file) => file.startsWith("motion-vendor-"));
assert(motionVendorChunk, "Interior Motion vendor chunk is missing");
assert(
  gzipSync(readFileSync(path.join(assetsDir, motionVendorChunk))).length <= maxMotionVendorGzipBytes,
  `Motion vendor chunk exceeds ${Math.round(maxMotionVendorGzipBytes / 1024)} KiB gzip`
);

const scenarioGuideArticlesChunk = jsFiles.find((file) => file.startsWith("seo-guide.lazy-"));
assert(scenarioGuideArticlesChunk, "Scenario guide route chunk is missing");
assert(
  gzipSync(readFileSync(path.join(assetsDir, scenarioGuideArticlesChunk))).length <= maxScenarioGuideArticlesGzipBytes,
  `Scenario guide article chunk exceeds ${Math.round(maxScenarioGuideArticlesGzipBytes / 1024)} KiB gzip`
);

const totalCssGzipBytes = cssFiles.reduce((total, file) => {
  return total + gzipSync(readFileSync(path.join(assetsDir, file))).length;
}, 0);

assert(
  totalJsGzipBytes <= maxTotalJsGzipBytes,
  `Total JS gzip size ${totalJsGzipBytes} exceeds ${maxTotalJsGzipBytes}`
);
assert(
  totalCssGzipBytes <= maxTotalCssGzipBytes,
  `Total CSS gzip size ${totalCssGzipBytes} exceeds ${maxTotalCssGzipBytes}`
);

console.log(
  `Bundle check passed: ${jsFiles.length} JS chunks (${Math.round(totalJsGzipBytes / 1024)} KiB gzip), ` +
    `${cssFiles.length} CSS files (${Math.round(totalCssGzipBytes / 1024)} KiB gzip), no source maps.`
);
