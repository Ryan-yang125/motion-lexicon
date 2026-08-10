"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const MOVE = { type: "spring", stiffness: 420, damping: 32, mass: 0.6 } as const;
const INSTANT = { duration: 0 } as const;
const linkRefKey = (sectionId: string, linkId: string) => `${sectionId}\u0000${linkId}`;

export type MegaMenuLink = { id: string; label: string; description?: string; onSelect: () => void };
export type MegaMenuSection = { id: string; label: string; links: readonly MegaMenuLink[]; preview?: ReactNode };

export type MegaMenuProps = {
  sections: readonly MegaMenuSection[];
  label: string;
  className?: string;
};

export function MegaMenu({ sections, label, className = "" }: MegaMenuProps) {
  const [active, setActive] = useState<string | null>(null);
  const [focusedLinkId, setFocusedLinkId] = useState<string | null>(null);
  const [focusCommit, setFocusCommit] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const buttons = useRef(new Map<string, HTMLButtonElement>());
  const linkButtons = useRef(new Map<string, HTMLButtonElement>());
  const closeTimer = useRef<number | null>(null);
  const lastActiveIndex = useRef(0);
  const lastFocusedLinkIndex = useRef(0);
  const focusedOwner = useRef<string | null>(null);
  const focusInPanel = useRef(false);
  const pendingPanelFocus = useRef<{ sectionId: string; linkId: string } | null>(null);
  const uid = useId();
  const reduced = useReducedMotion() === true;
  const index = sections.findIndex((item) => item.id === active);
  const current = index >= 0 ? sections[index] : null;
  const matchedFocusedLinkIndex = current && focusedLinkId !== null
    ? current.links.findIndex((link) => link.id === focusedLinkId)
    : -1;
  const focusedLinkIndex = matchedFocusedLinkIndex >= 0
    ? matchedFocusedLinkIndex
    : current && current.links.length > 0
      ? Math.min(lastFocusedLinkIndex.current, current.links.length - 1)
      : -1;
  const effectiveFocusedLinkId = current?.links[focusedLinkIndex]?.id ?? null;
  const currentId = current?.id ?? null;
  const currentLinkCount = current?.links.length ?? 0;
  const currentLinkOrder = current?.links.map((link) => link.id).join("\u0000") ?? "";
  const panelCurrent = current && current.links.length > 0 ? current : null;

  const cancelClose = () => {
    if (closeTimer.current === null) return;
    window.clearTimeout(closeTimer.current);
    closeTimer.current = null;
  };
  const close = () => {
    cancelClose();
    pendingPanelFocus.current = null;
    setActive(null);
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => {
      closeTimer.current = null;
      pendingPanelFocus.current = null;
      setActive(null);
    }, 120);
  };
  const openSection = (id: string, moveFocusToPanel = false) => {
    const nextIndex = sections.findIndex((section) => section.id === id);
    if (nextIndex < 0) return;
    const section = sections[nextIndex];
    if (section.links.length === 0) return;
    cancelClose();
    lastActiveIndex.current = nextIndex;
    lastFocusedLinkIndex.current = 0;
    pendingPanelFocus.current = moveFocusToPanel
      ? { sectionId: section.id, linkId: section.links[0].id }
      : null;
    if (moveFocusToPanel) setFocusCommit((value) => value + 1);
    setFocusedLinkId(section.links[0].id);
    setActive(id);
  };
  const choose = (at: number, direction: -1 | 1) => {
    const count = sections.length;
    if (count < 2) return;
    for (let distance = 1; distance < count; distance += 1) {
      const index = (at + direction * distance + count) % count;
      const section = sections[index];
      if (!section || section.links.length === 0) continue;
      openSection(section.id);
      buttons.current.get(section.id)?.focus({ preventScroll: true });
      return;
    }
  };

  const focusMenuItem = (next: number) => {
    const count = current?.links.length ?? 0;
    if (count === 0) return;
    const normalized = (next + count) % count;
    const link = current?.links[normalized];
    if (!link) return;
    lastFocusedLinkIndex.current = normalized;
    setFocusedLinkId(link.id);
    if (current) {
      linkButtons.current.get(linkRefKey(current.id, link.id))?.focus({ preventScroll: true });
    }
  };

  useEffect(() => () => {
    if (closeTimer.current !== null) window.clearTimeout(closeTimer.current);
  }, []);

  useEffect(() => {
    if (active !== null && index >= 0) lastActiveIndex.current = index;
  }, [active, index]);

  useEffect(() => {
    if (active === null || index >= 0) return;
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    const shouldRestoreFocus = focusedOwner.current === active;
    const fallbackIndex = Math.min(lastActiveIndex.current, sections.length - 1);
    pendingPanelFocus.current = null;
    setFocusedLinkId(null);
    setActive(null);
    if (shouldRestoreFocus && fallbackIndex >= 0) {
      const fallback = sections[fallbackIndex];
      if (fallback) buttons.current.get(fallback.id)?.focus({ preventScroll: true });
    }
  }, [active, index, sections, sections.length]);

  useEffect(() => {
    if (currentId === null) return;
    if (currentLinkCount === 0) {
      const shouldRestoreFocus = focusedOwner.current === currentId;
      pendingPanelFocus.current = null;
      focusInPanel.current = false;
      setFocusedLinkId(null);
      setActive(null);
      if (shouldRestoreFocus) {
        buttons.current.get(currentId)?.focus({ preventScroll: true });
      }
      return;
    }
    if (effectiveFocusedLinkId === null || focusedLinkIndex < 0) return;
    lastFocusedLinkIndex.current = focusedLinkIndex;
    if (focusedLinkId !== effectiveFocusedLinkId) {
      setFocusedLinkId(effectiveFocusedLinkId);
    }
    if (focusInPanel.current) {
      linkButtons.current.get(linkRefKey(currentId, effectiveFocusedLinkId))?.focus({ preventScroll: true });
    }
  }, [currentId, currentLinkCount, currentLinkOrder, effectiveFocusedLinkId, focusedLinkId, focusedLinkIndex]);

  useEffect(() => {
    const pending = pendingPanelFocus.current;
    if (!pending || pending.sectionId !== currentId) return;
    const target = linkButtons.current.get(linkRefKey(pending.sectionId, pending.linkId));
    if (!target) return;
    pendingPanelFocus.current = null;
    target.focus({ preventScroll: true });
  }, [currentId, currentLinkOrder, focusCommit]);

  const keyDown = (event: React.KeyboardEvent, at: number) => {
    const section = sections[at];
    if (!section || section.links.length === 0) return;
    if (event.key === "ArrowRight") { event.preventDefault(); choose(at, 1); }
    else if (event.key === "ArrowLeft") { event.preventDefault(); choose(at, -1); }
    else if (event.key === "ArrowDown") {
      event.preventDefault();
      openSection(section.id, true);
    } else if (event.key === "Escape") {
      event.preventDefault();
      close();
      buttons.current.get(section.id)?.focus({ preventScroll: true });
    }
  };

  const menuKeyDown = (event: React.KeyboardEvent, at: number) => {
    if (event.key === "ArrowDown") { event.preventDefault(); focusMenuItem(at + 1); }
    else if (event.key === "ArrowUp") { event.preventDefault(); focusMenuItem(at - 1); }
    else if (event.key === "Home") { event.preventDefault(); focusMenuItem(0); }
    else if (event.key === "End") { event.preventDefault(); focusMenuItem((current?.links.length ?? 1) - 1); }
    else if (event.key === "Escape") {
      event.preventDefault();
      const sectionId = current?.id;
      close();
      if (sectionId) buttons.current.get(sectionId)?.focus({ preventScroll: true });
    }
  };

  return (
    <div
      ref={root}
      className={`relative w-full max-w-[620px] ${className}`}
      onPointerEnter={(event) => { if (event.pointerType !== "touch") cancelClose(); }}
      onPointerLeave={(event) => { if (event.pointerType !== "touch") scheduleClose(); }}
      onBlur={(event) => {
        if (event.currentTarget.contains(event.relatedTarget)) return;
        focusedOwner.current = null;
        focusInPanel.current = false;
        close();
      }}
    >
      <nav aria-label={label} className="flex min-h-12 items-center gap-1 rounded-[13px] border border-stone-200 bg-white p-1 shadow-[0_12px_30px_-24px_rgba(28,25,23,.68)] dark:border-white/15 dark:bg-[#22221F]">
        {sections.map((section, at) => {
          const isOpen = section.id === panelCurrent?.id;
          const unavailable = section.links.length === 0;
          return (
            <button
              key={section.id}
              ref={(node) => {
                if (node) buttons.current.set(section.id, node);
                else buttons.current.delete(section.id);
              }}
              type="button"
              aria-expanded={isOpen}
              aria-controls={isOpen ? `${uid}-panel` : undefined}
              aria-disabled={unavailable}
              onPointerDown={(event) => { if (unavailable) event.preventDefault(); }}
              onPointerEnter={(event) => {
                if (!unavailable && event.pointerType !== "touch") openSection(section.id);
              }}
              onClick={() => {
                if (unavailable) return;
                if (isOpen) close();
                else openSection(section.id);
              }}
              onFocus={() => {
                if (unavailable) return;
                focusedOwner.current = section.id;
                focusInPanel.current = false;
              }}
              onKeyDown={(event) => keyDown(event, at)}
              className={`relative min-h-11 flex-1 rounded-[9px] px-3 text-[12px] font-medium outline-none transition-colors duration-150 focus-visible:shadow-[0_0_0_2px_rgba(69,104,255,.22)] aria-disabled:cursor-not-allowed aria-disabled:opacity-50 ${isOpen ? "text-stone-900 dark:text-white" : "text-stone-500 hover:text-stone-800 dark:hover:text-stone-200"}`}
            >
              {isOpen ? <motion.span layoutId={`${uid}-active`} transition={reduced ? INSTANT : MOVE} className="absolute inset-0 rounded-[9px] bg-stone-100 shadow-[inset_0_0_0_1px_rgba(41,41,41,.05)] dark:bg-white/[.08]" /> : null}
              <span className="relative">{section.label}</span>
            </button>
          );
        })}
      </nav>

      <AnimatePresence>
        {panelCurrent ? (
          <motion.div
            id={`${uid}-panel`}
            key={panelCurrent.id}
            initial={reduced ? { opacity: 1 } : { opacity: 0, transform: "translate3d(0,-6px,0) scale(.985)" }}
            animate={{ opacity: 1, transform: "translate3d(0,0,0) scale(1)" }}
            exit={{ opacity: 0, transform: reduced ? "none" : "translate3d(0,-4px,0) scale(.99)" }}
            transition={reduced ? INSTANT : { duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
            onPointerEnter={(event) => { if (event.pointerType !== "touch") cancelClose(); }}
            className="absolute inset-x-0 top-[calc(100%+7px)] z-30 grid min-h-[190px] grid-cols-[minmax(0,1fr)_minmax(150px,.72fr)] overflow-hidden rounded-[16px] border border-stone-200 bg-white shadow-[0_28px_58px_-30px_rgba(28,25,23,.72)] dark:border-white/15 dark:bg-[#1F1F1C]"
          >
            <div role="menu" aria-label={panelCurrent.label} className="grid content-start gap-1 p-2.5">
              {panelCurrent.links.map((link, at) => (
                <button
                  key={link.id}
                  ref={(node) => {
                    const key = linkRefKey(panelCurrent.id, link.id);
                    if (node) linkButtons.current.set(key, node);
                    else linkButtons.current.delete(key);
                  }}
                  data-menu-link
                  type="button"
                  role="menuitem"
                  tabIndex={link.id === effectiveFocusedLinkId ? 0 : -1}
                  onClick={() => { link.onSelect(); close(); }}
                  onFocus={() => {
                    focusedOwner.current = panelCurrent.id;
                    focusInPanel.current = true;
                    lastFocusedLinkIndex.current = at;
                    setFocusedLinkId(link.id);
                  }}
                  onKeyDown={(event) => menuKeyDown(event, at)}
                  className="group min-h-11 rounded-[10px] px-3 py-2 text-left outline-none transition-colors duration-150 hover:bg-stone-100 focus-visible:bg-stone-100 focus-visible:shadow-[inset_0_0_0_2px_rgba(69,104,255,.25)] dark:hover:bg-white/[.07] dark:focus-visible:bg-white/[.07]"
                >
                  <strong className="block text-[12px] font-medium text-stone-800 dark:text-stone-100">{link.label}</strong>
                  {link.description ? <span className="mt-0.5 block text-[10px] text-stone-400">{link.description}</span> : null}
                </button>
              ))}
            </div>
            <div className="grid place-items-center bg-[#DDD7CD] p-3 dark:bg-[#292825]">{panelCurrent.preview}</div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
