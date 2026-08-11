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
// Component previews load independently. Their optional animation engines keep
// dedicated ceilings so a Three.js scene never becomes part of the base shell.
const maxMotionVendorGzipBytes = 52 * 1024;
const maxGsapVendorGzipBytes = 45 * 1024;
const maxThreeVendorGzipBytes = 200 * 1024;
const maxBaseEntryGzipBytes = 84 * 1024;
const maxHomePageGzipBytes = 4 * 1024;
const maxScenarioGuideShellGzipBytes = 8 * 1024;
const maxScenarioGuideArticleGzipBytes = 14 * 1024;
const maxTotalJsGzipBytes = 920 * 1024;
const maxTotalCssGzipBytes = 56 * 1024;
let totalJsGzipBytes = 0;

for (const file of jsFiles) {
  const fullPath = path.join(assetsDir, file);
  const rawSize = statSync(fullPath).size;
  const gzipSize = gzipSync(readFileSync(fullPath)).length;
  totalJsGzipBytes += gzipSize;
  if (!file.startsWith("three-vendor-")) {
    assert(rawSize <= maxChunkRawBytes, `${file} raw size ${rawSize} exceeds ${maxChunkRawBytes}`);
    assert(gzipSize <= maxChunkGzipBytes, `${file} gzip size ${gzipSize} exceeds ${maxChunkGzipBytes}`);
  }
}

assert(!jsFiles.some((file) => file.startsWith("source-")), "Registry sources must load from individual /r/*.json files");

const componentsChunk = jsFiles.find((file) => file.startsWith("components.lazy-"));
assert(componentsChunk, "Components route chunk is missing");
assert(
  gzipSync(readFileSync(path.join(assetsDir, componentsChunk))).length <= 12 * 1024,
  "Components route shell exceeds 12 KiB gzip"
);

const componentDetailChunk = jsFiles.find((file) => file.startsWith("component.lazy-"));
assert(componentDetailChunk, "Component detail route chunk is missing");
assert(
  gzipSync(readFileSync(path.join(assetsDir, componentDetailChunk))).length <= 20 * 1024,
  "Component detail shell exceeds 20 KiB gzip"
);

const motionVendorChunk = jsFiles.find((file) => file.startsWith("motion-vendor-"));
assert(motionVendorChunk, "Interior Motion vendor chunk is missing");
assert(
  gzipSync(readFileSync(path.join(assetsDir, motionVendorChunk))).length <= maxMotionVendorGzipBytes,
  `Motion vendor chunk exceeds ${Math.round(maxMotionVendorGzipBytes / 1024)} KiB gzip`
);

const gsapVendorChunk = jsFiles.find((file) => file.startsWith("gsap-vendor-"));
if (gsapVendorChunk) {
  assert(
    gzipSync(readFileSync(path.join(assetsDir, gsapVendorChunk))).length <= maxGsapVendorGzipBytes,
    `GSAP vendor chunk exceeds ${Math.round(maxGsapVendorGzipBytes / 1024)} KiB gzip`
  );
}

const threeVendorChunk = jsFiles.find((file) => file.startsWith("three-vendor-"));
if (threeVendorChunk) {
  assert(
    gzipSync(readFileSync(path.join(assetsDir, threeVendorChunk))).length <= maxThreeVendorGzipBytes,
    `Three vendor chunk exceeds ${Math.round(maxThreeVendorGzipBytes / 1024)} KiB gzip`
  );
}

const scenarioGuideArticlesChunk = jsFiles.find((file) => file.startsWith("seo-guide.lazy-"));
assert(scenarioGuideArticlesChunk, "Scenario guide route chunk is missing");
assert(
  gzipSync(readFileSync(path.join(assetsDir, scenarioGuideArticlesChunk))).length <= maxScenarioGuideShellGzipBytes,
  `Scenario guide route shell exceeds ${Math.round(maxScenarioGuideShellGzipBytes / 1024)} KiB gzip`
);

const baseEntryChunk = jsFiles.find((file) => file.startsWith("index-"));
assert(baseEntryChunk, "Base entry chunk is missing");
assert(
  gzipSync(readFileSync(path.join(assetsDir, baseEntryChunk))).length <= maxBaseEntryGzipBytes,
  `Base entry exceeds ${Math.round(maxBaseEntryGzipBytes / 1024)} KiB gzip`
);
const prerenderedHome = readFileSync(path.join("dist", "zh", "index.html"), "utf8");
assert(
  !prerenderedHome.includes('rel="modulepreload" crossorigin href="/assets/motion-vendor-'),
  "Motion vendor must stay out of the base shell preload graph"
);

const homePageChunk = jsFiles.find((file) => file.startsWith("HomePage-"));
assert(homePageChunk, "Lazy HomePage chunk is missing");
assert(
  gzipSync(readFileSync(path.join(assetsDir, homePageChunk))).length <= maxHomePageGzipBytes,
  `HomePage route exceeds ${Math.round(maxHomePageGzipBytes / 1024)} KiB gzip`
);

const scenarioGuideArticleIds = [
  "save-submit-publish-feedback",
  "card-list-filter-continuity",
  "css-motion-jank",
  "spring-or-ease-out",
  "reduced-motion",
  "form-validation-delete-permission",
  "from-brief-to-spec",
  "component-or-primitive"
];
for (const articleId of scenarioGuideArticleIds) {
  const articleChunk = jsFiles.find((file) => file.startsWith(`${articleId}-`));
  assert(articleChunk, `Scenario guide article chunk is missing: ${articleId}`);
  assert(
    gzipSync(readFileSync(path.join(assetsDir, articleChunk))).length <= maxScenarioGuideArticleGzipBytes,
    `${articleId} exceeds ${Math.round(maxScenarioGuideArticleGzipBytes / 1024)} KiB gzip`
  );
}

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
