var _a;
import { defineConfig } from "@playwright/test";
var port = Number((_a = process.env.ML_EVAL_PORT) !== null && _a !== void 0 ? _a : "4173");
export default defineConfig({
    testDir: "./tests",
    use: { baseURL: "http://127.0.0.1:".concat(port), channel: "chrome" },
    webServer: {
        command: "npm run preview -- --host 127.0.0.1 --port ".concat(port),
        port: port,
        reuseExistingServer: false,
    },
});
