import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { getMotionPackFoundationLinks, type MotionPackFoundationLink } from "../data/motion-packs";
import type { Locale } from "../data/types";

type RankedPack = {
  pack: MotionPackFoundationLink["pack"];
  links: MotionPackFoundationLink[];
};

function rankPacks(foundationIds: readonly string[]): RankedPack[] {
  const packLinks = new Map<string, RankedPack>();

  for (const foundationId of foundationIds) {
    for (const link of getMotionPackFoundationLinks(foundationId)) {
      const current = packLinks.get(link.pack.id);
      if (current) {
        current.links.push(link);
      } else {
        packLinks.set(link.pack.id, { pack: link.pack, links: [link] });
      }
    }
  }

  return Array.from(packLinks.values())
    .sort((left, right) => right.links.length - left.links.length || left.pack.id.localeCompare(right.pack.id))
    .slice(0, 3);
}

export function FinderPackBridge({
  locale,
  foundationIds
}: {
  locale: Locale;
  foundationIds: readonly string[];
}) {
  const packs = rankPacks(foundationIds);
  const labels = locale === "zh"
    ? {
        eyebrow: "产品瞬间",
        title: "适合的产品瞬间",
        copy: "把当前动效方向放进完整交互里继续看。",
        open: "查看产品瞬间",
        all: "浏览全部产品瞬间"
      }
    : {
        eyebrow: "Product moments",
        title: "Suitable product moments",
        copy: "Take the current motion direction into a complete interaction.",
        open: "Open product moment",
        all: "Browse all product moments"
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
        {packs.map(({ pack, links }) => (
          <Link
            key={pack.id}
            to="/$locale/packs/$packId/"
            params={{ locale, packId: pack.id }}
          >
            <span>
              <small>{links.map(({ foundation }) => foundation.roleLabel[locale]).join(" · ")}</small>
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
