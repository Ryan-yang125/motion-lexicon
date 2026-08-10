import { registrySources } from "./generated-sources";

export function getRegistrySource(id: string) {
  return registrySources[id] ?? "";
}
