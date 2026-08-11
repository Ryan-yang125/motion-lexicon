import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      "dist",
      "**/dist/**",
      "node_modules",
      "coverage",
      "playwright-report",
      ".wrangler",
      "skills/motion-lexicon/evals/evidence/**",
      "skills/motion-lexicon/scripts/validate-motion-blueprint.mjs"
    ]
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      // Hydration intentionally synchronizes persisted browser state after the
      // server-compatible first render.
      "react-hooks/set-state-in-effect": "off",
      "react-refresh/only-export-components": "off"
    }
  },
  {
    files: ["scripts/**/*.ts", "*.config.ts"],
    languageOptions: {
      globals: globals.node
    }
  },
  {
    // Interior is vendored source. Keep its event-ref and manual memoization
    // patterns aligned with upstream while the app remains on React 18.
    files: ["src/components/interior/**/*.tsx", "src/registry/components/**/*.tsx", "src/registry/demos/**/*.tsx"],
    rules: {
      "react-hooks/refs": "off",
      "react-hooks/immutability": "off",
      "react-hooks/preserve-manual-memoization": "off",
      "no-useless-assignment": "off"
    }
  }
);
