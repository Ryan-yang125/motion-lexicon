import { ArrowRight } from "./icons";
import { Link } from "@tanstack/react-router";
import { type KeyboardEvent, useMemo, useState } from "react";
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
        eyebrow: "产品瞬间",
        title: "28 个完整产品瞬间",
        copy: "完成、选择、内容变化和工作流反馈，都有完整状态与可复制实现。",
        all: "全部",
        open: "查看产品瞬间"
      }
    : {
        eyebrow: "Product moments",
        title: "28 complete product moments",
        copy: "Completion, selection, content change, and workflow feedback—each with a complete state and copy-ready implementation.",
        all: "All",
        open: "Open product moment"
      };
  const packs = useMemo(
    () => groupId === "all" ? motionPacks : motionPacks.filter((pack) => pack.groupId === groupId),
    [groupId]
  );
  const panelId = `${id}-panel`;
  const activeTabId = `${id}-tab-${groupId}`;
  const filterIds = ["all", ...motionPackGroups.map((group) => group.id)];

  function handleFilterKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const currentIndex = filterIds.indexOf(groupId);
    const nextIndex = event.key === "ArrowRight" || event.key === "ArrowDown"
      ? (currentIndex + 1) % filterIds.length
      : event.key === "ArrowLeft" || event.key === "ArrowUp"
        ? (currentIndex - 1 + filterIds.length) % filterIds.length
        : event.key === "Home"
          ? 0
          : event.key === "End"
            ? filterIds.length - 1
            : null;

    if (nextIndex === null) return;

    event.preventDefault();
    const nextId = filterIds[nextIndex];
    setGroupId(nextId);
    requestAnimationFrame(() => document.getElementById(`${id}-tab-${nextId}`)?.focus());
  }

  return (
    <section className="motion-pack-gallery" id={id} aria-labelledby={`${id}-title`}>
      <div className="motion-pack-gallery-head">
        <div>
          <span className="motion-pack-kicker">{labels.eyebrow}</span>
          <h2 id={`${id}-title`}>{labels.title}</h2>
        </div>
        <p>{labels.copy}</p>
      </div>

      <div
        className="motion-pack-filters"
        role="tablist"
        aria-label={locale === "zh" ? "按场景筛选 Pack" : "Filter packs by scenario"}
        onKeyDown={handleFilterKeyDown}
      >
        <button
          type="button"
          role="tab"
          id={`${id}-tab-all`}
          aria-selected={groupId === "all"}
          aria-controls={panelId}
          tabIndex={groupId === "all" ? 0 : -1}
          className={groupId === "all" ? "is-active" : undefined}
          onClick={() => setGroupId("all")}
        >
          {labels.all}
        </button>
        {motionPackGroups.map((group) => (
          <button
            type="button"
            role="tab"
            id={`${id}-tab-${group.id}`}
            aria-selected={groupId === group.id}
            aria-controls={panelId}
            tabIndex={groupId === group.id ? 0 : -1}
            className={groupId === group.id ? "is-active" : undefined}
            key={group.id}
            onClick={() => setGroupId(group.id)}
          >
            {group.name[locale]}
          </button>
        ))}
      </div>

      <div className="motion-pack-grid" id={panelId} role="tabpanel" aria-labelledby={activeTabId}>
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
