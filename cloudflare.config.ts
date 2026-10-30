import { bindings, defineConfig } from "cf/config";

export default defineConfig({
	worker: {
		name: "motionboard",
		compatibilityDate: "2026-10-23",
		compatibilityFlags: ["nodejs_compat"],
		entrypoint: "@tanstack/react-start/server-entry",
		observability: { enabled: true },
		domains: ["motionboard.app"],
		env: {
			// Tables are created by the SQL files in migrations/.
			DB: bindings.d1({ name: "motionboard", id: "56d585f2-3a5b-4698-93f3-91e7abdce70c" }),
		},
	},
});
