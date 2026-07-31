import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { motionPacks } from "../data/motion-packs";
import type { Locale } from "../data/types";

const packIdsByFinderGroup: Record<string, readonly string[]> = {
  "entrance-feel": ["card-selection", "save-confirmation", "publish-release"],
  "state-continuity": ["workspace-switch", "template-choice", "details-disclosure"],
  "sequence-timing": ["layer-insertion", "progress-steps", "notification-triage"]
};

export function FinderPackBridge({ locale, finderGroupId }: { locale: Locale; finderGroupId: string }) {
  const ids = packIdsByFinderGroup[finderGroupId] ?? ["save-confirmation", "workspace-switch", "layer-insertion"];
  const packs = ids
    .map((id) => motionPacks.find((pack) => pack.id === id))
    .filter((pack): pack is (typeof motionPacks)[number] => Boolean(pack));
  const labels = locale === "zh"
    ? {
        eyebrow: "Motion Packs",
        title: "Finder 帮你选，Pack 帮你落地。",
        copy: "把这个方向放进完整的产品交互里继续看。",
        open: "查看 Pack",
        all: "浏览全部 16 个 Pack"
      }
    : {
        eyebrow: "Motion Packs",
        title: "Finder helps you choose. Packs help you ship.",
        copy: "Take this direction into a complete product interaction.",
        open: "Open pack",
        all: "Explore all 16 packs"
      };

  if (!packs.length) return null;

  return (
    <section className="finder-pack-bridge" aria-labelledby="finder-pack-bridge-title">
      <div className="finder-pack-bridge-heading">
        <div>
          <span className="motion-pack-kicker">{labels.eyebrow}</span>
          <h2 id="finder-pack-bridge-title">{labels.title}</h2>
        </div>
        <p>{labels.copy}</p>
      </div>
      <div className="finder-pack-bridge-list">
        {packs.map((pack) => (
          <Link
            key={pack.id}
            to="/$locale/packs/$packId/"
            params={{ locale, packId: pack.id }}
          >
            <span>
              <strong>{pack.name[locale]}</strong>
              <small>{pack.shortDescription[locale]}</small>
            </span>
            <span className="finder-pack-bridge-open">
              {labels.open}
              <ArrowRight aria-hidden="true" size={14} />
            </span>
          </Link>
        ))}
      </div>
      <Link className="finder-pack-bridge-all" to="/$locale/packs/" params={{ locale }}>
        {labels.all}
        <ArrowRight aria-hidden="true" size={14} />
      </Link>
    </section>
  );
}
