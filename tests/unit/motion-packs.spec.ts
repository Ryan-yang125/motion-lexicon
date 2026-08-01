import { describe, expect, it } from "vitest";
import { canonicalMotionCatalog } from "../../src/data/motion-catalog";
import {
  getMotionPackFoundationLinks,
  getMotionPackFoundations,
  getMotionPacksForFoundation,
  motionPackGroups,
  motionPacks
} from "../../src/data/motion-packs";

describe("Motion Pack V1.2 data", () => {
  it("ships twenty-eight uniquely identified, grouped real product moments", () => {
    expect(motionPacks).toHaveLength(28);
    expect(new Set(motionPacks.map((pack) => pack.id)).size).toBe(28);
    expect(motionPackGroups).toHaveLength(4);

    for (const pack of motionPacks) {
      expect(pack.kind).toBe(pack.id);
      expect(motionPackGroups.some((group) => group.id === pack.groupId)).toBe(true);
      expect(pack.name.zh).not.toHaveLength(0);
      expect(pack.name.en).not.toHaveLength(0);
      expect(pack.prompt.zh).not.toHaveLength(0);
      expect(pack.prompt.en).not.toHaveLength(0);
    }
  });

  it("keeps every portable output complete, parsable, and reduced-motion aware", () => {
    for (const pack of motionPacks) {
      expect(pack.source.html, pack.id).toContain("data-motion-pack");
      expect(pack.source.css, pack.id).toContain("prefers-reduced-motion");
      expect(pack.source.css, pack.id).toContain("animation-duration: 1ms");
      expect(pack.source.js.trim(), pack.id).not.toHaveLength(0);
      expect(() => new Function(pack.source.js), pack.id).not.toThrow();
    }
  });

  it("connects every pack to valid canonical foundations with localized roles and notes", () => {
    const canonicalIds = new Set(canonicalMotionCatalog.map((motion) => motion.id));

    for (const pack of motionPacks) {
      const foundations = getMotionPackFoundations(pack);
      expect(foundations.length, pack.id).toBeGreaterThanOrEqual(3);
      expect(new Set(foundations.map((foundation) => foundation.foundationId)).size, pack.id).toBe(
        foundations.length
      );

      for (const foundation of foundations) {
        expect(canonicalIds.has(foundation.foundationId), `${pack.id}:${foundation.foundationId}`).toBe(true);
        expect(foundation.roleLabel.zh, `${pack.id}:${foundation.foundationId}`).not.toHaveLength(0);
        expect(foundation.roleLabel.en, `${pack.id}:${foundation.foundationId}`).not.toHaveLength(0);
        expect(foundation.note.zh, `${pack.id}:${foundation.foundationId}`).not.toHaveLength(0);
        expect(foundation.note.en, `${pack.id}:${foundation.foundationId}`).not.toHaveLength(0);
      }
    }
  });

  it("supports Pack-to-foundation and foundation-to-Pack lookup from the same relationship data", () => {
    const saveFoundations = getMotionPackFoundations("save-confirmation");
    expect(saveFoundations.map((foundation) => foundation.foundationId)).toContain("press-tap-feedback");

    const pressLinks = getMotionPackFoundationLinks("press-tap-feedback");
    expect(pressLinks.some(({ pack }) => pack.id === "save-confirmation")).toBe(true);
    expect(
      getMotionPacksForFoundation("press-tap-feedback").map((pack) => pack.id)
    ).toContain("save-confirmation");

    expect(getMotionPackFoundations("missing-pack")).toEqual([]);
    expect(getMotionPackFoundationLinks("missing-foundation")).toEqual([]);
    expect(getMotionPacksForFoundation("missing-foundation")).toEqual([]);
  });

  it("keeps the complete seven-Pack groups balanced", () => {
    expect(motionPacks.find((pack) => pack.id === "inline-validation")?.groupId).toBe("feedback");
    expect(motionPacks.find((pack) => pack.id === "upload-complete")?.groupId).toBe("feedback");
    expect(motionPacks.find((pack) => pack.id === "sync-recovery")?.groupId).toBe("feedback");
    expect(motionPacks.find((pack) => pack.id === "delete-confirmation")?.groupId).toBe("feedback");
    expect(motionPacks.find((pack) => pack.id === "assignee-picker")?.groupId).toBe("choice");
    expect(motionPacks.find((pack) => pack.id === "permission-change")?.groupId).toBe("choice");
    expect(motionPacks.find((pack) => pack.id === "search-suggestions")?.groupId).toBe("choice");
    expect(motionPacks.find((pack) => pack.id === "kanban-move")?.groupId).toBe("change");
    expect(motionPacks.find((pack) => pack.id === "cart-update")?.groupId).toBe("change");
    expect(motionPacks.find((pack) => pack.id === "comment-reply")?.groupId).toBe("change");
    expect(motionPacks.find((pack) => pack.id === "notification-triage")?.groupId).toBe("workflow");
    expect(motionPacks.find((pack) => pack.id === "approval-request")?.groupId).toBe("workflow");
    expect(motionPacks.find((pack) => pack.id === "checkout-payment")?.groupId).toBe("workflow");
    expect(motionPacks.find((pack) => pack.id === "scheduled-publish")?.groupId).toBe("workflow");

    for (const group of motionPackGroups) {
      expect(motionPacks.filter((pack) => pack.groupId === group.id), group.id).toHaveLength(7);
    }
  });
});
