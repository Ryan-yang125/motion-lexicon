import { registrySources } from "./generated-sources";

export function getRegistrySource(id: string) {
  return registrySources[id] ?? "";
}

export function getPrimitiveRegistrySource(id: string) {
  return registrySources[`primitive-${id}`] ?? "";
}
