import { describe, expect, it } from "vitest";
import { canonicalMotionCatalog } from "../../src/data/motion-catalog";
import { registryComponents } from "../../src/data/component-registry";
import {
  motionBlueprintExample,
  motionBlueprintContract,
  motionDirectorModes,
  motionGrammar,
  motionGrammarDataPath
} from "../../src/data/motion-grammar";

describe("Motion Grammar", () => {
  it("keeps the two content collections complete and equally addressable", () => {
    expect(motionGrammar.collections.primitives.count).toBe(canonicalMotionCatalog.length);
    expect(motionGrammar.collections.components.count).toBe(registryComponents.length);
    expect(motionGrammar.collections.primitives.count).toBe(44);
    expect(motionGrammar.collections.components.count).toBe(28);
  });

  it("sets an Interior-informed interaction baseline", () => {
    expect(motionGrammar.material).toHaveProperty("bezel");
    expect(motionGrammar.material).toHaveProperty("panel");
    expect(motionGrammar.material).toHaveProperty("well");
    expect(motionGrammar.invariants.map((item) => item.en).join(" ")).toContain("reserves space");
    expect(motionGrammar.invariants.map((item) => item.en).join(" ")).toContain("interrupted");
    expect(motionGrammar.timing.arrive.curve).toBe("cubic-bezier(0.23, 1, 0.32, 1)");
    expect(motionGrammar.timing.leave.curve).toBe("cubic-bezier(0.4, 0, 1, 1)");
    expect(motionGrammar.timing.linear.curve).toBe("linear");
    expect(motionGrammar.timing.spring.rangeMs[1]).toBeLessThanOrEqual(360);
    expect(motionGrammar.implementation.preferredDelivery[0]).toBe("react");
  });

  it("exposes a stable five-mode director workflow", () => {
    expect(motionDirectorModes.map((mode) => mode.id)).toEqual([
      "recommend",
      "compose",
      "implement",
      "review",
      "contribute"
    ]);
    expect(motionGrammarDataPath).toBe("/data/v4/motion-grammar.json");
  });

  it("grounds the public blueprint in existing motion content", () => {
    const primitiveIds = new Set(canonicalMotionCatalog.map((entry) => entry.id));
    expect(motionBlueprintExample.stateGraph).toHaveLength(3);
    expect(motionBlueprintExample.beats.every((beat) => beat.durationMs >= 100 && beat.durationMs <= 300)).toBe(true);
    expect(motionBlueprintExample.beats.every((beat) => primitiveIds.has(beat.primitiveIds[0]))).toBe(true);
    expect(motionBlueprintExample.provenance.relatedPacks.length).toBeGreaterThan(0);
  });

  it("keeps the portable contract aligned with the display blueprint", () => {
    const primitiveIds = new Set(canonicalMotionCatalog.map((entry) => entry.id));
    expect(motionBlueprintContract.version).toBe("2.0");
    expect(motionBlueprintContract.actors.filter((actor) => actor.role === "primary")).toHaveLength(1);
    expect(motionBlueprintContract.actors.map((actor) => actor.kind)).toEqual(["trigger", "status", "record"]);
    expect(motionBlueprintContract.stateGraph.states.map((state) => state.id)).toContain(
      motionBlueprintContract.stateGraph.initial
    );
    expect(motionBlueprintContract.beats.every((beat) => primitiveIds.has(beat.primitive))).toBe(true);
    expect(motionBlueprintContract.beats.every((beat) => beat.easing in motionGrammar.timing)).toBe(true);
    expect(motionBlueprintContract.provenance.moments).toEqual(motionBlueprintExample.provenance.relatedPacks);
  });
});
