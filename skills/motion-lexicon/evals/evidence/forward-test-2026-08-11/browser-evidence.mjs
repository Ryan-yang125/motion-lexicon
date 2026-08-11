import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { pathToFileURL } from "node:url";

const [workdir, route, portText, outputPath, testOutputPath] = process.argv.slice(2);
const port = Number(portText);
if (!workdir || !route || !Number.isInteger(port) || !outputPath || !testOutputPath) {
  throw new Error("usage: browser-evidence <workdir> <route> <port> <output> <test-output>");
}

const playwrightModule = pathToFileURL(path.join(workdir, "node_modules", "playwright", "index.mjs")).href;
const { chromium } = await import(playwrightModule);
const server = spawn("npm", ["run", "preview", "--", "--host", "127.0.0.1", "--port", String(port)], {
  cwd: workdir,
  env: { ...process.env, NO_COLOR: "1", FORCE_COLOR: "0" },
  stdio: ["ignore", "pipe", "pipe"],
});
let serverStdout = "";
let serverStderr = "";
server.stdout.on("data", (chunk) => { serverStdout += chunk; });
server.stderr.on("data", (chunk) => { serverStderr += chunk; });

const url = `http://127.0.0.1:${port}${route}`;
for (let attempt = 0; attempt < 100; attempt += 1) {
  try {
    const response = await fetch(url);
    if (response.ok) break;
  } catch {}
  await new Promise((resolve) => setTimeout(resolve, 100));
  if (attempt === 99) throw new Error(`preview did not become ready: ${serverStdout}\n${serverStderr}`);
}

const consoleErrors = [];
const pageErrors = [];
const requestFailures = [];
const hydrationErrors = [];
const attachRuntime = (page) => {
  page.on("console", (message) => {
    if (message.type() !== "error") return;
    const text = message.text();
    consoleErrors.push(text);
    if (/hydrat/i.test(text)) hydrationErrors.push(text);
  });
  page.on("pageerror", (error) => {
    pageErrors.push(error.message);
    if (/hydrat/i.test(error.message)) hydrationErrors.push(error.message);
  });
  page.on("requestfailed", (request) => requestFailures.push(`${request.method()} ${request.url()} ${request.failure()?.errorText ?? "failed"}`));
  page.on("response", (response) => {
    if (response.status() >= 400) requestFailures.push(`${response.status()} ${response.request().method()} ${response.url()}`);
  });
};
let browser;
try {
  browser = await chromium.launch({ channel: "chrome" });
  const viewports = [];
  for (const width of [320, 390, 768, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    attachRuntime(page);
    await page.goto(url, { waitUntil: "networkidle" });
    const audit = await page.locator('button,a,input,select,textarea,[role="button"],[role="radio"],[tabindex]:not([tabindex="-1"])').evaluateAll((allNodes) => {
      const visible = allNodes.filter((node) => {
        const style = getComputedStyle(node);
        const rect = node.getBoundingClientRect();
        return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
      });
      const nodes = visible.map((node, index) => {
        const rect = node.getBoundingClientRect();
        const aria = node.getAttribute("aria-label");
        return {
          selector: node.id ? `#${CSS.escape(node.id)}` : aria ? `${node.tagName.toLowerCase()}[aria-label=${JSON.stringify(aria)}]` : `${node.tagName.toLowerCase()}:nth-interactive(${index + 1})`,
          label: aria || node.textContent?.trim().replace(/\s+/g, " ").slice(0, 100) || node.getAttribute("name") || node.tagName.toLowerCase(),
          width: Math.round(rect.width * 1000) / 1000,
          height: Math.round(rect.height * 1000) / 1000,
        };
      });
      return {
        documentWidth: document.documentElement.scrollWidth,
        nodes,
        minimumTargetWidth: Math.min(...nodes.map((node) => node.width)),
        minimumTargetHeight: Math.min(...nodes.map((node) => node.height)),
      };
    });
    if (audit.nodes.length === 0) throw new Error(`no interactive nodes at ${width}`);
    await page.locator('button,a,input,select,textarea,[role="button"],[role="radio"],[tabindex]:not([tabindex="-1"])').filter({ visible: true }).first().focus();
    viewports.push({
      width,
      documentWidth: audit.documentWidth,
      interactiveNodeCount: audit.nodes.length,
      minimumTargetWidth: audit.minimumTargetWidth,
      minimumTargetHeight: audit.minimumTargetHeight,
      nodes: audit.nodes,
      offenders: audit.nodes.filter((node) => node.width < 44 || node.height < 44),
      interactions: [`loaded ${route} and focused ${audit.nodes[0].label}`],
    });
    await page.close();
  }

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  attachRuntime(page);
  await page.goto(url, { waitUntil: "networkidle" });
  const lightResult = await page.evaluate(() => ({ colorScheme: getComputedStyle(document.documentElement).colorScheme, darkClass: document.documentElement.classList.contains("dark") }));
  const themeControl = page.getByRole("button", { name: /theme|dark|主题|切换.*色|颜色/i }).first();
  let darkActivation = "added the host dark class after loading the rendered page";
  if (await themeControl.count()) {
    await themeControl.click();
    darkActivation = `clicked ${await themeControl.getAttribute("aria-label") ?? "theme control"}`;
  } else {
    await page.evaluate(() => document.documentElement.classList.add("dark"));
  }
  const darkResult = await page.evaluate(() => ({ colorScheme: getComputedStyle(document.documentElement).colorScheme, darkClass: document.documentElement.classList.contains("dark") }));
  await page.evaluate(() => { document.documentElement.classList.remove("dark"); document.body.focus(); });
  await page.keyboard.press("Tab");
  const focusEntry = await page.evaluate(() => document.activeElement?.getAttribute("aria-label") || document.activeElement?.textContent?.trim().replace(/\s+/g, " ").slice(0, 100) || document.activeElement?.getAttribute("name") || document.activeElement?.tagName.toLowerCase());
  await page.keyboard.press("Tab");
  const focusNext = await page.evaluate(() => document.activeElement?.getAttribute("aria-label") || document.activeElement?.textContent?.trim().replace(/\s+/g, " ").slice(0, 100) || document.activeElement?.getAttribute("name") || document.activeElement?.tagName.toLowerCase());
  await page.keyboard.press("Shift+Tab");
  const focusReturn = await page.evaluate(() => document.activeElement?.getAttribute("aria-label") || document.activeElement?.textContent?.trim().replace(/\s+/g, " ").slice(0, 100) || document.activeElement?.getAttribute("name") || document.activeElement?.tagName.toLowerCase());
  await page.close();

  const reducedContext = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 390, height: 844 } });
  const reducedPage = await reducedContext.newPage();
  attachRuntime(reducedPage);
  await reducedPage.goto(url, { waitUntil: "networkidle" });
  const reducedResult = await reducedPage.evaluate(() => ({
    matches: matchMedia("(prefers-reduced-motion: reduce)").matches,
    transitionDuration: getComputedStyle(document.querySelector("button, a, input, select, textarea") ?? document.body).transitionDuration,
  }));
  await reducedContext.close();
  await browser.close();
  browser = null;

  const testEvidence = JSON.parse(fs.readFileSync(testOutputPath, "utf8"));
  const output = {
    automationCommand: `npm run test:browser; node /private/tmp/ml-v420-browser-evidence.mjs ${workdir} ${route} ${port}`,
    exitCode: testEvidence.exitCode,
    testCommand: "npm run test:browser",
    testExitCode: testEvidence.exitCode,
    testStdout: testEvidence.stdout,
    testStderr: testEvidence.stderr,
    viewports,
    themes: {
      light: { observed: true, activation: "loaded the rendered route with the host default", result: JSON.stringify(lightResult) },
      dark: { observed: true, activation: darkActivation, result: JSON.stringify(darkResult) },
    },
    keyboard: { observed: true, path: "Tab, Tab, Shift+Tab", focusEntry, focusReturn, result: `second focus: ${focusNext}; Shift+Tab returned to ${focusReturn}` },
    reducedMotion: { observed: true, preference: "reduce", result: JSON.stringify(reducedResult) },
    primaryState: testEvidence.primaryState,
    runtime: {
      consoleErrors: consoleErrors.length,
      pageErrors: pageErrors.length,
      requestFailures: requestFailures.length,
      hydrationErrors: hydrationErrors.length,
    },
    runtimeDetails: { consoleErrors, pageErrors, requestFailures, hydrationErrors },
    preview: { stdout: serverStdout, stderr: serverStderr },
  };
  fs.writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`);
} finally {
  if (browser) await browser.close().catch(() => {});
  server.kill("SIGTERM");
}
