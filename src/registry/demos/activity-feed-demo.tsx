"use client";

import { useState } from "react";
import { ActivityFeed, type ActivityItem } from "@/registry/components/activity-feed";

const initial: ActivityItem[] = [
  { id: "a", title: "Mira approved the motion pass", description: "Checkout · reduced motion included", time: "2m", group: "Today", unread: true, tone: "success" },
  { id: "b", title: "Preview deployed", description: "atlas-edge.pages.dev", time: "18m", group: "Today", tone: "neutral" },
  { id: "c", title: "Contrast check needs attention", description: "One muted label is below AA", time: "1h", group: "Today", tone: "warning" },
];

export function ActivityFeedDemo() {
  const [items, setItems] = useState(initial);
  const [count, setCount] = useState(1);

  return (
    <div className="mx-auto h-[250px] w-full max-w-[420px] overflow-y-auto pr-1">
      <div className="sticky top-0 z-10 mb-1 flex justify-end bg-[var(--sub)] pb-2">
        <button
          type="button"
          onClick={() => {
            setItems((current) => [{ id: `new-${count}`, title: `New review note ${count}`, description: "Motion timing updated", time: "now", group: "Today", unread: true, tone: "neutral" }, ...current]);
            setCount((value) => value + 1);
          }}
          className="mat-cap press h-11 rounded-[9px] px-3.5 text-[12.5px] font-medium text-ink"
        >
          Add activity
        </button>
      </div>
      <ActivityFeed items={items} />
    </div>
  );
}
