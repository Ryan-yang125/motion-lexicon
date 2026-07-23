import { resolve } from "node:path";
import { catalog, exportRecipe, getSchema, search, show } from "./core.js";
import {
  formatCatalogMarkdown,
  formatCatalogText,
  formatRecipeMarkdown,
  formatRecipeText,
  formatSearchMarkdown,
  formatSearchText,
  json
} from "./format.js";
import { writeRecipeFiles } from "./files.js";
import {
  MotionLexiconError,
  version,
  type CliLocale,
  type DiscoveryFormat,
  type ExportFormat,
  type SchemaName
} from "./types.js";

export type CliIo = {
  stdout: (value: string) => void;
  stderr: (value: string) => void;
  cwd: () => string;
};

const help = `Motion Lexicon ${version}

Usage:
  motion-lexicon catalog [options]
  motion-lexicon search <query> [options]
  motion-lexicon show <id-or-alias> [options]
  motion-lexicon export <id-or-alias> [options]
  motion-lexicon schema [recipe|catalog|search|export]

Common options:
  --locale <zh|en>                Output language (default: en)
  --format <format>               Output format
  --category <id>                 Filter by category
  --surface <type>                component, playground, or guide
  -h, --help                      Show help
  -v, --version                   Show version

Recipe options:
  -p, --param <key=value>         Set a validated recipe parameter; repeatable

Export formats:
  prompt, html, css, js, bundle, json, files
  --out <directory>               Files destination
  --force                         Replace generated files in a non-empty destination

Examples:
  motion-lexicon search "弹簧"
  motion-lexicon show pop-in --locale zh --format json
  motion-lexicon export slide-in -p duration=260 --format bundle
  motion-lexicon export ripple --format files --out ./ripple-demo
`;

type Parsed = {
  positionals: string[];
  options: Map<string, string[]>;
  flags: Set<string>;
};

const optionAliases: Record<string, string> = {
  "-p": "--param",
  "-h": "--help",
  "-v": "--version"
};

const valuedOptions = new Set([
  "--locale",
  "--format",
  "--category",
  "--surface",
  "--limit",
  "--param",
  "--out"
]);

const flagOptions = new Set(["--help", "--version", "--force"]);

function parseArgs(argv: string[]): Parsed {
  const result: Parsed = { positionals: [], options: new Map(), flags: new Set() };
  for (let index = 0; index < argv.length; index += 1) {
    let token = argv[index];
    token = optionAliases[token] ?? token;
    if (token === "--") {
      result.positionals.push(...argv.slice(index + 1));
      break;
    }
    if (!token.startsWith("-")) {
      result.positionals.push(token);
      continue;
    }
    const equal = token.indexOf("=");
    const name = equal > 0 ? token.slice(0, equal) : token;
    const inlineValue = equal > 0 ? token.slice(equal + 1) : undefined;
    if (flagOptions.has(name)) {
      if (inlineValue !== undefined) throw new MotionLexiconError(`${name} does not take a value.`);
      result.flags.add(name);
      continue;
    }
    if (!valuedOptions.has(name)) throw new MotionLexiconError(`Unknown option: ${name}.`);
    const value = inlineValue ?? argv[index + 1];
    if (value === undefined || (!inlineValue && value.startsWith("--"))) {
      throw new MotionLexiconError(`Missing value for ${name}.`);
    }
    if (inlineValue === undefined) index += 1;
    const current = result.options.get(name) ?? [];
    current.push(value);
    result.options.set(name, current);
  }
  return result;
}

function option(parsed: Parsed, name: string) {
  const values = parsed.options.get(name);
  if (!values) return undefined;
  if (values.length > 1) throw new MotionLexiconError(`${name} can only be used once.`);
  return values[0];
}

function rejectOptions(parsed: Parsed, allowed: string[], flags: string[] = ["--help", "--version"]) {
  for (const name of parsed.options.keys()) {
    if (!allowed.includes(name)) throw new MotionLexiconError(`${name} is unavailable for this command.`);
  }
  for (const name of parsed.flags) {
    if (!flags.includes(name)) throw new MotionLexiconError(`${name} is unavailable for this command.`);
  }
}

function locale(parsed: Parsed): CliLocale | undefined {
  return option(parsed, "--locale") as CliLocale | undefined;
}

function discoveryFormat(parsed: Parsed): DiscoveryFormat {
  const format = option(parsed, "--format") ?? "text";
  if (format !== "text" && format !== "json" && format !== "md") {
    throw new MotionLexiconError("Discovery format must be text, json, or md.");
  }
  return format;
}

function params(parsed: Parsed) {
  const result: Record<string, string> = {};
  for (const pair of parsed.options.get("--param") ?? []) {
    const separator = pair.indexOf("=");
    if (separator < 1) throw new MotionLexiconError(`Invalid parameter: ${pair}. Use key=value.`);
    const key = pair.slice(0, separator).trim();
    const value = pair.slice(separator + 1).trim();
    if (!key || !value) throw new MotionLexiconError(`Invalid parameter: ${pair}. Use key=value.`);
    if (Object.hasOwn(result, key)) throw new MotionLexiconError(`Parameter ${key} was provided more than once.`);
    result[key] = value;
  }
  return result;
}

function onePositional(parsed: Parsed, label: string) {
  if (parsed.positionals.length !== 1) {
    throw new MotionLexiconError(`${label} requires exactly one value.`);
  }
  return parsed.positionals[0];
}

function write(io: CliIo, output: string) {
  io.stdout(output ? `${output.replace(/\n$/, "")}\n` : "");
}

async function runCatalog(parsed: Parsed, io: CliIo) {
  rejectOptions(parsed, ["--locale", "--format", "--category", "--surface"]);
  if (parsed.positionals.length) throw new MotionLexiconError("catalog does not take positional values.");
  const format = discoveryFormat(parsed);
  const document = catalog({
    locale: locale(parsed),
    category: option(parsed, "--category"),
    surface: option(parsed, "--surface") as "component" | "playground" | "guide" | undefined
  });
  write(io, format === "json" ? json(document) : format === "md" ? formatCatalogMarkdown(document) : formatCatalogText(document));
}

async function runSearch(parsed: Parsed, io: CliIo) {
  rejectOptions(parsed, ["--locale", "--format", "--category", "--surface", "--limit"]);
  if (!parsed.positionals.length) throw new MotionLexiconError("search requires a query.");
  const format = discoveryFormat(parsed);
  const rawLimit = option(parsed, "--limit");
  if (rawLimit !== undefined && !/^\d+$/.test(rawLimit)) {
    throw new MotionLexiconError("Search limit must be an integer from 1 to 100.");
  }
  const document = search(parsed.positionals.join(" "), {
    locale: locale(parsed),
    category: option(parsed, "--category"),
    surface: option(parsed, "--surface") as "component" | "playground" | "guide" | undefined,
    limit: rawLimit === undefined ? undefined : Number(rawLimit)
  });
  write(io, format === "json" ? json(document) : format === "md" ? formatSearchMarkdown(document) : formatSearchText(document));
}

async function runShow(parsed: Parsed, io: CliIo) {
  rejectOptions(parsed, ["--locale", "--format", "--param"]);
  const id = onePositional(parsed, "show");
  const format = discoveryFormat(parsed);
  const document = show(id, { locale: locale(parsed), params: params(parsed) });
  write(io, format === "json" ? json(document) : format === "md" ? formatRecipeMarkdown(document) : formatRecipeText(document));
}

async function runExport(parsed: Parsed, io: CliIo) {
  rejectOptions(parsed, ["--locale", "--format", "--param", "--out"], ["--help", "--version", "--force"]);
  const id = onePositional(parsed, "export");
  const format = (option(parsed, "--format") ?? "bundle") as ExportFormat;
  if (!["prompt", "html", "css", "js", "bundle", "json", "files"].includes(format)) {
    throw new MotionLexiconError("Export format must be prompt, html, css, js, bundle, json, or files.");
  }
  const document = exportRecipe(id, { locale: locale(parsed), params: params(parsed) });
  if (format === "files") {
    const output = option(parsed, "--out") ?? resolve(io.cwd(), `motion-lexicon-${document.id}`);
    const result = await writeRecipeFiles(document, output, { force: parsed.flags.has("--force") });
    write(io, json(result));
    return;
  }
  if (option(parsed, "--out")) throw new MotionLexiconError("--out requires --format files.");
  if (parsed.flags.has("--force")) throw new MotionLexiconError("--force requires --format files.");
  write(io, format === "json" ? json(document) : document[format]);
}

async function runSchema(parsed: Parsed, io: CliIo) {
  rejectOptions(parsed, []);
  if (parsed.positionals.length > 1) throw new MotionLexiconError("schema accepts one schema name.");
  const name = (parsed.positionals[0] ?? "recipe") as SchemaName;
  if (!["recipe", "catalog", "search", "export"].includes(name)) {
    throw new MotionLexiconError(`Unknown schema: ${name}.`);
  }
  write(io, json(getSchema(name)));
}

export async function runCli(argv: string[], io: CliIo): Promise<number> {
  try {
    const [command, ...rest] = argv;
    if (!command || command === "--help" || command === "-h" || rest.includes("--help") || rest.includes("-h")) {
      write(io, help);
      return 0;
    }
    if (command === "--version" || command === "-v") {
      write(io, version);
      return 0;
    }
    const parsed = parseArgs(rest);
    if (parsed.flags.has("--version")) {
      write(io, version);
      return 0;
    }
    if (command === "catalog") await runCatalog(parsed, io);
    else if (command === "search") await runSearch(parsed, io);
    else if (command === "show") await runShow(parsed, io);
    else if (command === "export") await runExport(parsed, io);
    else if (command === "schema") await runSchema(parsed, io);
    else throw new MotionLexiconError(`Unknown command: ${command}.`);
    return 0;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    io.stderr(`Error: ${message}\n`);
    return error instanceof MotionLexiconError ? 2 : 1;
  }
}

export function getHelp() {
  return help;
}
