import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motionPackGroups, motionPacks } from "../data/motion-packs";
import type { Locale } from "../data/types";
import { MotionPackPreview } from "./MotionPackPreview";

type MotionPackGalleryProps = {
  locale: Locale;
  id?: string;
};

export function MotionPackGallery({ locale, id = "packs" }: MotionPackGalleryProps) {
  const [groupId, setGroupId] = useState("all");
  const labels = locale === "zh"
    ? {
        eyebrow: "Motion Pack Gallery",
        title: "16 个真实产品瞬间",
        copy: "完成、选择、内容变化和工作流反馈，都有完整状态与可复制实现。",
        all: "全部",
        open: "查看 Pack"
      }
    : {
        eyebrow: "Motion Pack Gallery",
        title: "16 real product moments",
        copy: "Completion, selection, content change, and workflow feedback—each with a complete state and copy-ready implementation.",
        all: "All",
        open: "Open pack"
      };
  const packs = useMemo(
    () => groupId === "all" ? motionPacks : motionPacks.filter((pack) => pack.groupId === groupId),
    [groupId]
  );

  return (
    <section className="motion-pack-gallery" id={id} aria-labelledby={`${id}-title`}>
      <div className="motion-pack-gallery-head">
        <div>
          <span className="motion-pack-kicker">{labels.eyebrow}</span>
          <h2 id={`${id}-title`}>{labels.title}</h2>
        </div>
        <p>{labels.copy}</p>
      </div>

      <div className="motion-pack-filters" role="tablist" aria-label={locale === "zh" ? "按场景筛选 Pack" : "Filter packs by scenario"}>
        <button
          type="button"
          role="tab"
          aria-selected={groupId === "all"}
          className={groupId === "all" ? "is-active" : undefined}
          onClick={() => setGroupId("all")}
        >
          {labels.all}
        </button>
        {motionPackGroups.map((group) => (
          <button
            type="button"
            role="tab"
            aria-selected={groupId === group.id}
            className={groupId === group.id ? "is-active" : undefined}
            key={group.id}
            onClick={() => setGroupId(group.id)}
          >
            {group.name[locale]}
          </button>
        ))}
      </div>

      <div className="motion-pack-grid" role="tabpanel">
        {packs.map((pack) => {
          const group = motionPackGroups.find((item) => item.id === pack.groupId);
          return (
            <article className="motion-pack-card" data-testid={`motion-pack-card-${pack.id}`} key={pack.id}>
              <div className="motion-pack-card-preview">
                <MotionPackPreview pack={pack} compact locale={locale} />
              </div>
              <div className="motion-pack-card-body">
                <div className="motion-pack-card-heading">
                  <div>
                    <span className="motion-pack-card-group">{group?.name[locale]}</span>
                    <h3>{pack.name[locale]}</h3>
                  </div>
                </div>
                <p>{pack.shortDescription[locale]}</p>
                <div className="motion-pack-card-footer">
                  <span className="motion-pack-card-meta">{pack.timing}</span>
                  <Link
                    className="motion-pack-card-link"
                    to="/$locale/packs/$packId/"
                    params={{ locale, packId: pack.id }}
                  >
                    {labels.open}
                    <ArrowRight aria-hidden="true" size={14} />
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
